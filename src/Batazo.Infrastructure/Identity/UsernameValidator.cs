using Batazo.Domain.Users;
using Microsoft.AspNetCore.Identity;

namespace Batazo.Infrastructure.Identity;

// Identity no tiene opciones para la longitud del nombre de usuario; la regla
// vive en el dominio y este validador la aplica al crear o editar un usuario.
internal sealed class UsernameValidator : IUserValidator<ApplicationUser>
{
    public const string ErrorCode = "InvalidUserNameFormat";

    public Task<IdentityResult> ValidateAsync(UserManager<ApplicationUser> manager, ApplicationUser user)
    {
        if (UsernameRules.IsValid(user.UserName))
        {
            return Task.FromResult(IdentityResult.Success);
        }

        var error = new IdentityError
        {
            Code = ErrorCode,
            Description = $"El nombre de usuario debe tener entre {UsernameRules.MinLength} y {UsernameRules.MaxLength} caracteres, solo letras sin tilde, números o guion bajo.",
        };

        return Task.FromResult(IdentityResult.Failed(error));
    }
}
