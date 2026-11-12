using Batazo.Api.Contracts.Auth;
using Batazo.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Batazo.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Username,
            Email = request.Email,
        };

        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(FieldFor(error.Code), error.Description);
            }

            return ValidationProblem(ModelState);
        }

        await signInManager.SignInAsync(user, isPersistent: true);

        return NoContent();
    }

    // Identity reports errors by code, not by field. Unknown codes go under the
    // empty key, which the form shows as a general error.
    private static string FieldFor(string errorCode) => errorCode switch
    {
        nameof(IdentityErrorDescriber.DuplicateUserName)
            or nameof(IdentityErrorDescriber.InvalidUserName)
            or UsernameValidator.ErrorCode => "username",

        nameof(IdentityErrorDescriber.DuplicateEmail)
            or nameof(IdentityErrorDescriber.InvalidEmail) => "email",

        nameof(IdentityErrorDescriber.PasswordTooShort)
            or nameof(IdentityErrorDescriber.PasswordRequiresNonAlphanumeric)
            or nameof(IdentityErrorDescriber.PasswordRequiresDigit)
            or nameof(IdentityErrorDescriber.PasswordRequiresLower)
            or nameof(IdentityErrorDescriber.PasswordRequiresUpper)
            or nameof(IdentityErrorDescriber.PasswordRequiresUniqueChars) => "password",

        _ => string.Empty,
    };
}
