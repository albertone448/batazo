using Batazo.Domain.Users;

namespace Batazo.Domain.Tests.Users;

public class UsernameRulesTests
{
    [Theory]
    [InlineData("abc")]
    [InlineData("Alberto_448")]
    [InlineData("_guion_bajo_")]
    [InlineData("A2345678901234567890")]
    public void IsValid_ReturnsTrue_ForAllowedUsernames(string username)
    {
        Assert.True(UsernameRules.IsValid(username));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("ab")]
    [InlineData("A23456789012345678901")]
    [InlineData("con espacio")]
    [InlineData("guion-medio")]
    [InlineData("ñandú")]
    [InlineData("correo@batazo")]
    public void IsValid_ReturnsFalse_ForDisallowedUsernames(string? username)
    {
        Assert.False(UsernameRules.IsValid(username));
    }
}
