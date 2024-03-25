using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// Define the JwtUtils class for JWT token generation and handling
public class JwtUtils
{
    private readonly IConfiguration _configuration; // Configuration instance for retrieving app settings

    // Constructor for JwtUtils that takes IConfiguration as input
    public JwtUtils(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // Method to generate a JWT token for the provided user details
    public string GenerateJwtToken(string userId, string username, string role)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["JwtConfig:Secret"]);  // Retrieve the JWT secret key from the configuratio

        // Define the token descriptor with relevant claims and token configurations
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId), // Add the user's ID as a claim
                new Claim(ClaimTypes.Name, username), // Add the username as a claim
                new Claim(ClaimTypes.Role, role), // Add the user's role as a claim
            }),
            Expires = DateTime.UtcNow.AddHours(6), // Token expiration time
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
        };

        // Create the JWT token based on the provided token descriptor
        var token = tokenHandler.CreateToken(tokenDescriptor);
        
        // Return the generated JWT token
        return tokenHandler.WriteToken(token);
    }
}