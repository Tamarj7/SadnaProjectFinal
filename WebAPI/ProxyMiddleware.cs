using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace ProxyM
{
    public class ProxyMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly HttpClient _httpClient;
        private readonly string _baseUri;

        public ProxyMiddleware(RequestDelegate next, HttpClient httpClient, string baseUri)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _baseUri = baseUri ?? throw new ArgumentNullException(nameof(baseUri));
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var request = context.Request;

            // Create a new URI by combining the base URI with the request path
            var targetUri = new Uri(new Uri(_baseUri), request.Path);

            // Create a new HTTP request message
            var requestMessage = new HttpRequestMessage(new HttpMethod(request.Method), targetUri);

            // Copy headers from the original request to the new request message
            foreach (var header in request.Headers)
            {
                requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
            }

            // Send the request to the target URI using the HttpClient
            using var responseMessage = await _httpClient.SendAsync(requestMessage, HttpCompletionOption.ResponseHeadersRead, context.RequestAborted);

            // Copy the response status code and headers back to the HTTP response
            context.Response.StatusCode = (int)responseMessage.StatusCode;
            foreach (var header in responseMessage.Headers)
            {
                context.Response.Headers[header.Key] = header.Value.ToArray();
            }

            // Copy the response content to the HTTP response body
            await responseMessage.Content.CopyToAsync(context.Response.Body);
        }
    }

    public static class ProxyMiddlewareExtensions
    {
        public static IApplicationBuilder UseProxyMiddleware(this IApplicationBuilder builder, string baseUri)
        {
            if (builder == null)
            {
                throw new ArgumentNullException(nameof(builder));
            }

            var httpClient = new HttpClient();

            return builder.UseMiddleware<ProxyMiddleware>(httpClient, baseUri);
        }
    }
}
