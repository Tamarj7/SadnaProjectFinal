using Microsoft.EntityFrameworkCore;
using SadnaProject.Data;
using Microsoft.AspNetCore.Identity;
using SadnaProject.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SadnaProject.Controllers;
using Microsoft.AspNetCore.SpaServices;




var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddLogging(loggingBuilder =>
{
    loggingBuilder.AddConsole(); // Add console logging
    loggingBuilder.AddDebug();   // Add debug output logging
});

// Configure the database connection
builder.Services.AddDbContext<MyDbContext>(options =>
{
    options.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=SadnaProject;Integrated Security=True;Connect Timeout=30;Encrypt=False;Trust Server Certificate=False;Application Intent=ReadWrite;Multi Subnet Failover=False");
});

// Configure Identity settings
builder.Services.Configure<IdentityOptions>(options =>
{
    // Disable password policy
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
});

// Add Identity
builder.Services.AddIdentity<UserModel, IdentityRole>()
    .AddEntityFrameworkStores<MyDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddLogging(loggingBuilder =>
{
    loggingBuilder.AddConsole(); // Add console logging
    loggingBuilder.AddDebug();   // Add debug output logging
});

// Create roles if they don't exist
using (var scope = builder.Services.BuildServiceProvider().CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    if (!roleManager.RoleExistsAsync("user").Result)
    {
        var role = new IdentityRole("user");
        roleManager.CreateAsync(role).Wait();
    }
    if (!roleManager.RoleExistsAsync("admin").Result)
    {
        var role = new IdentityRole("admin");
        roleManager.CreateAsync(role).Wait();
    }
}

// Register JwtUtils
builder.Services.AddScoped<JwtUtils>();

// Register HttpClient
builder.Services.AddScoped<HttpClient>();

// Configure JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SomeSecretKeyBecauseImJustTooLazy")),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                // Injected logger instance for the controller or service where you want to log
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<UsersDBController>>();
                logger.LogInformation("Token validated successfully.");
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                // Injected logger instance for the controller or service where you want to log
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<UsersDBController>>();
                logger.LogError(context.Exception, "Authentication failed.");

                var tokenValue = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");

                if (!string.IsNullOrEmpty(tokenValue))
                {
                    // Log the token content
                    logger.LogInformation($"JWT Token Content: {tokenValue}");
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();




var app = builder.Build();


app.UseCors(options =>
        options.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()

);

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";

    spa.UseProxyToSpaDevelopmentServer("http://localhost:44471"); 

});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // Configure error handling for production
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseAuthentication(); // Use JWT authentication middleware
app.UseAuthorization();

// Middleware for logging authorized and unauthorized requests
app.UseMiddleware<LogAuthorizedRequestsMiddleware>();
app.UseMiddleware<LogUnauthorizedRequestsMiddleware>();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");


app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
