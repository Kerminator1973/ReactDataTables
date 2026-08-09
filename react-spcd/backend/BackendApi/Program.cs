using Microsoft.EntityFrameworkCore;
using BackendApi.Data;
//using Microsoft.Extensions.DependencyInjection; // для AddSwaggerGen

// Build the application and configure services
var builder = WebApplication.CreateBuilder(args);
// ... (rest of the file)

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("DataSource=product_documents.db")); 

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Build the application
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection(); // Added best practice middleware

// --- Product Endpoints ---

// GET all products
app.MapGet("/api/products", async (AppDbContext db) => 
{
    return await db.Products.ToListAsync();
}).WithName("GetAllProducts");

// GET product by Id with associated documents
app.MapGet("/api/products/{id}", async (AppDbContext db, int id) => 
{
    var product = await db.Products.Include(p => p.Documents).FirstOrDefaultAsync(p => p.Id == id);
    if (product == null) return Results.NotFound("Product not found.");
    return Results.Ok(product); // Corrected Ok usage
}).WithName("GetProductById");

// POST a new product
app.MapPost("/api/products", async (AppDbContext db, Product product) => 
{
    db.Products.Add(product);
    await db.SaveChangesAsync();
    var createdProduct = await db.Products.FindAsync(product.Id);
    return Results.Created($"/api/products/{createdProduct!.Id}", createdProduct); // Using Results.Created with the correct URI format
}).WithName("CreateProduct");

// --- Document Endpoints ---

// POST a document linked to a product (This is the key endpoint)
app.MapPost("/api/products/{productId}/documents", async (AppDbContext db, int productId, Document newDocument) => 
{
    var product = await db.Products.FindAsync(productId);
    if (product == null) return Results.NotFound("Product not found.");

    newDocument.ProductId = productId;
    db.Documents.Add(newDocument);
    await db.SaveChangesAsync();
    var updatedProduct = await db.Products.Include(p => p.Documents).FirstOrDefaultAsync(p => p.Id == productId);
    return Results.Created($"/api/products/{productId}", updatedProduct); // Corrected CreateAtAction usage (using Results.Created)
}).WithName("CreateDocument");

// Initialize and Seed the database when the application starts
using (var scopeScope = app.Services.CreateScope())
{
    var services = scopeScope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<AppDbContext>();
        await dbContext.Database.MigrateAsync(); // Apply migrations and create schema
    }
    catch (Exception ex)
    {
        // Correctly injecting ILogger<T> 
        var logger = services.GetService<Microsoft.Extensions.Logging.ILogger<Program>>();
        logger?.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();
