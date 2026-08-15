using Microsoft.EntityFrameworkCore;
using BackendApi.Data;


var options = new WebApplicationOptions
{
    Args = args,
    // Указываем, что wwwroot будет находится в подпапке "assets" проекта,
    // относительно папки, в которой находится .csproj
    WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "assets")
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

// Определяем Endpoint, по которому React-приложение сможет получить графический файл.
// Фактически, файлы находятся в папке "assets", но получать картинку можно используя
// путь /api/files. Пример верстки:
//      <img src="/api/files/04-bc63-7a6a714d188d.png" />
app.MapGet("/api/files/{fileName}", async (string fileName, HttpContext httpContext) =>
{
    var webRootPath = httpContext.RequestServices.GetRequiredService<IWebHostEnvironment>().WebRootPath;
    var imagePath = Path.Combine(webRootPath, fileName);

    if (!File.Exists(imagePath))
    {
        return Results.NotFound("Image file not found.");
    }
    
    var fileExtension = Path.GetExtension(fileName).ToLower();
    var contentType = GetContentType(fileExtension);

    // Используем FileStreamResult для потоковой передачи файла
    return Results.File(imagePath, contentType, Path.GetExtension(imagePath));
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

app.Run();
