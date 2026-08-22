using BackendApi.Data;
using Microsoft.EntityFrameworkCore;


// Поскольку данный проект является API, то у него нет по умолчанию папки wwwroot.
// Однако папка wwwroot нужна для двух задач:
// - в production в этой папке будет находится React-приложение
// - на том же уровне, что и wwwroot расположена папка с картинками (assets)
var options = new WebApplicationOptions
{
    Args = args,
    WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")
};

var builder = WebApplication.CreateBuilder(options);

builder.Services
    .AddDbContext<AppDbContext>(options =>
        options.UseSqlite("DataSource=product_documents.db"))   // Sqlite
    .AddEndpointsApiExplorer()                                  // Swagger
    .AddSwaggerGen();

var app = builder.Build();

// Swagger запускается только в Debug-режиме
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // Автоматически переводим протокол с http на https

app.UseDefaultFiles();  // Раздаём React-приложение как статические файлы из папки wwwroot
app.UseStaticFiles();

// Определяем Endpoint, по которому React-приложение сможет получить графический файл.
// Фактически, файлы находятся в папке "assets", но получать картинку можно используя
// путь /api/files.
//
// Причина, по которой не применяется загрузка файлов из публичной папки wwwroot,
// состоит в том, что доступ к отдельным документам (картинки - это только первый шаг)
// должен осуществляться с учётом прав пользователя
//
// Пример верстки:
//      <img src="/api/files/04-bc63-7a6a714d188d.png" />
app.MapGet("/api/files/{fileName}", (string fileName, HttpContext httpContext, IWebHostEnvironment environment) =>
{
    var assetsPath = Path.GetFullPath(Path.Combine(environment.ContentRootPath, "assets"));
    var imagePath = Path.Combine(assetsPath, fileName);

    if (!File.Exists(imagePath))
        return Results.NotFound();

    var fileInfo = new FileInfo(imagePath);
    var contentType = GetContentType(fileInfo.Extension);
    var lastModified = fileInfo.LastWriteTimeUtc;

    // ETAG необходимо передать браузеру, чтобы при повторной попытке он прислал заголовок "If-None-Match",
    // используя который сервер может принять решение о том, что картинка не нуждается в загрузке и
    // ответить кодом "304 Not Modified"
    var etag = new Microsoft.Net.Http.Headers.EntityTagHeaderValue($"\"{fileInfo.Length}-{lastModified.Ticks}\"");

    // "no-cache" означает "кэшировать, но перед использованием обязательно проверить у сервера
    // через If-None-Match".
    httpContext.Response.Headers.CacheControl = "no-cache"; // Либо: "public, max-age=0, must-revalidate";

    return Results.File(
        imagePath,
        contentType: contentType,
        lastModified: lastModified,
        entityTag: etag,
        enableRangeProcessing: true
    );
});

static string GetContentType(string extension)
{
    return extension switch
    {
        ".png" => "image/png",
        ".jpg" => "image/jpeg",
        ".jpeg" => "image/jpeg",
        ".gif" => "image/gif",
        _ => "application/octet-stream"
    };
}

app.MapGet("/api/products/{id}/documents", async (AppDbContext db, int id) =>
{
    var documentsDto = await db.Documents
        .Where(d => d.ProductId == id)
        .Select(d => new {
            d.Id,
            d.Name,
        })
        .ToListAsync();

    if (documentsDto == null || documentsDto.Count == 0)
        return Results.Ok(new List<object>());

    return Results.Ok(documentsDto);
});

app.MapGet("/api/products/{id}/devices", async (AppDbContext db, int id) =>
{
    var devicesDto = await db.Devices
        .Where(d => d.ProductId == id)
        .Select(d => new {
            id = d.Id,
            name = d.DeviceName,
            image = d.ImageName
        })
        .ToListAsync();

    if (devicesDto == null || devicesDto.Count == 0)
        return Results.Ok(new List<object>());

    return Results.Ok(devicesDto);
});

// Инициализация и заполнение базы данных при её создании
using (var scopeScope = app.Services.CreateScope())
{
    var services = scopeScope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<AppDbContext>();
        await dbContext.Database.MigrateAsync(); // Применяем миграции и создаём схему базы данных
    }
    catch (Exception ex)
    {
        var logger = services.GetService<Microsoft.Extensions.Logging.ILogger<Program>>();
        logger?.LogError(ex, "An error occurred while seeding the database.");
    }
}

// Добавляем fallback для React Router
app.MapFallbackToFile("index.html");

app.Run();
