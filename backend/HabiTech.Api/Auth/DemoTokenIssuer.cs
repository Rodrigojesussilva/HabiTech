using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace HabiTech.Api.Auth;

public sealed class DemoTokenIssuer(
    SymmetricSecurityKey signingKey,
    string issuer,
    string audience)
{
    private static readonly TimeSpan TokenLifetime = TimeSpan.FromHours(8);

    public LoginResponse CreateToken(string email)
    {
        var expiresAt = DateTime.UtcNow.Add(TokenLifetime);
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer,
            audience,
            [
                new Claim(ClaimTypes.NameIdentifier, email),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            ],
            expires: expiresAt,
            signingCredentials: credentials);

        return new LoginResponse(
            email,
            new JwtSecurityTokenHandler().WriteToken(token),
            "Bearer",
            expiresAt);
    }
}
