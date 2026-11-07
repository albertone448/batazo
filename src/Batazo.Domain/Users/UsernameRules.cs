namespace Batazo.Domain.Users;

public static class UsernameRules
{
    public const int MinLength = 3;

    public const int MaxLength = 20;

    public const string AllowedCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";

    public static bool IsValid(string? username)
    {
        return username is not null
            && username.Length is >= MinLength and <= MaxLength
            && username.All(IsAllowedCharacter);
    }

    private static bool IsAllowedCharacter(char character)
    {
        return char.IsAsciiLetterOrDigit(character) || character == '_';
    }
}
