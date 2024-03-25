using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

//this middleware is used for logging- mainly for Errors and debugginf purposes

// Middleware for logging authorized requests
public class LogAuthorizedRequestsMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<LogAuthorizedRequestsMiddleware> _logger;

    // Constructor for LogAuthorizedRequestsMiddleware that takes RequestDelegate and ILogger as input
    public LogAuthorizedRequestsMiddleware(RequestDelegate next, ILogger<LogAuthorizedRequestsMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }



    public async Task InvokeAsync(HttpContext context)
    {
        // Log the authorized request if the user is authenticated
        if (context.User.Identity.IsAuthenticated)
        {
            _logger.LogInformation($"Authorized request received: {context.Request.Method} {context.Request.Path}");
        }

        await _next(context);
    }
}

// Middleware for logging unauthorized requests
public class LogUnauthorizedRequestsMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<LogUnauthorizedRequestsMiddleware> _logger;

    // Constructor for LogUnauthorizedRequestsMiddleware that takes RequestDelegate and ILogger as input
    public LogUnauthorizedRequestsMiddleware(RequestDelegate next, ILogger<LogUnauthorizedRequestsMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    // Method to invoke the middleware
    public async Task InvokeAsync(HttpContext context)
    {

        await _next(context); // Call the next middleware in the pipeline

        // Log the unauthorized request if the response status code is 401 Unauthorized
        if (context.Response.StatusCode == StatusCodes.Status401Unauthorized)
        {
            _logger.LogWarning($"Unauthorized request received: {context.Request.Method} {context.Request.Path}");
        }
    }
}

