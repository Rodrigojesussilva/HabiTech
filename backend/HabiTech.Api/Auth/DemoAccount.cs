namespace HabiTech.Api.Auth;

public sealed class DemoAccount
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public sealed record LoginRequest(string Email, string Password);

public sealed record LoginResponse(
    string Email,
    string AccessToken,
    string TokenType,
    DateTimeOffset ExpiresAtUtc);
