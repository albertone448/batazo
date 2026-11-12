using System.ComponentModel.DataAnnotations;

namespace Batazo.Api.Contracts.Auth;

public sealed record RegisterRequest
{
    [Required(ErrorMessage = "El correo es obligatorio.")]
    [EmailAddress(ErrorMessage = "El correo no tiene un formato válido.")]
    [MaxLength(256, ErrorMessage = "El correo no puede tener más de {1} caracteres.")]
    public string Email { get; init; } = string.Empty;

    [Required(ErrorMessage = "El nombre de usuario es obligatorio.")]
    public string Username { get; init; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria.")]
    [MaxLength(128, ErrorMessage = "La contraseña no puede tener más de {1} caracteres.")]
    public string Password { get; init; } = string.Empty;

    [Required(ErrorMessage = "Confirma la contraseña.")]
    [Compare(nameof(Password), ErrorMessage = "Las contraseñas no coinciden.")]
    public string ConfirmPassword { get; init; } = string.Empty;
}
