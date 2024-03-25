using Microsoft.AspNetCore.SpaServices;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors(options =>
        options.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()   
    
);

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // Configure error handling for production
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}



app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

// MapFallbackToFile will serve the index.html file from the wwwroot folder
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapFallbackToFile("index.html");
});

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";
    // Make sure this matches your SPA's development server port
    spa.UseProxyToSpaDevelopmentServer("http://localhost:44471");
});

app.Run();
