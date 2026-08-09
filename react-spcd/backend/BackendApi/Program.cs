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

app.MapGet("/api/products", async (AppDbContext db) => 
{
    return await db.Products.ToListAsync();
}).WithName("GetAllProducts");

app.MapGet("/api/products/{id}", async (AppDbContext db, int id) => 
{
    var product = await db.Products.Include(p => p.Documents).FirstOrDefaultAsync(p => p.Id == id);
    if (product == null) return Results.NotFound("Product not found.");
    return Results.Ok(product);
}).WithName("GetProductById");

app.MapPost("/api/products", async (AppDbContext db, Product product) => 
{
    db.Products.Add(product);
    await db.SaveChangesAsync();

    var createdProduct = await db.Products.FindAsync(product.Id);
    return Results.Created($"/api/products/{createdProduct!.Id}", createdProduct);
}).WithName("CreateProduct");

// --- Определяем Endpoints для добавления документов к продукту ---

// POST - документ всегда привязан к продукту. Добавить документ можно только через продукт
app.MapPost("/api/products/{productId}/documents", async (AppDbContext db, int productId, Document newDocument) => 
{
    var product = await db.Products.FindAsync(productId);
    if (product == null) return Results.NotFound("Product not found.");

    newDocument.ProductId = productId;
    db.Documents.Add(newDocument);
    await db.SaveChangesAsync();

    var updatedProduct = await db.Products.Include(p => p.Documents).FirstOrDefaultAsync(p => p.Id == productId);
    return Results.Created($"/api/products/{productId}", updatedProduct);
}).WithName("CreateDocument");

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
