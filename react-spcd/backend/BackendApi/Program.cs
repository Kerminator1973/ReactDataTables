using Microsoft.EntityFrameworkCore;
using BackendApi.Data;

var builder = WebApplication.CreateBuilder(args);

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

// --- Определяем Endpoints для Products ---

app.MapGet("/api/products/{id}", async (AppDbContext db, int id) =>
{
    // Проектируем Product и его документы в анонимный тип или DTO
    var productDto = await db.Products
        .Where(p => p.Id == id)
        .Select(p => new {
            p.Id,
            p.Name, // Только нужное поле
            Documents = p.Documents.Select(d => new { d.Id, d.Name }) // Проецируем только нужные поля в документах
        })
        .ToListAsync();

    if (productDto == null || productDto.Count == 0) return Results.NotFound("Product not found.");

    // Возвращаем первый элемент и передаем его как DTO
    return Results.Ok(productDto[0]);
});

// Инициализация и заполнения базы данных при её создании
using (var scopeScope = app.Services.CreateScope())
{
    var services = scopeScope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<AppDbContext>();
        await dbContext.Database.MigrateAsync(); // Применяем миграции и сохдаём схему базы данных
    }
    catch (Exception ex)
    {
        // TODO: очень странный код - нужно с ним разобраться
        // Correctly injecting ILogger<T> 
        var logger = services.GetService<Microsoft.Extensions.Logging.ILogger<Program>>();
        logger?.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();
