using System.ComponentModel.DataAnnotations;

namespace Batazo.Api.Contracts.Pings;

public sealed record CreatePingRequest
{
    [Required(ErrorMessage = "El mensaje es obligatorio.")]
    [MaxLength(200, ErrorMessage = "El mensaje no puede tener más de {1} caracteres.")]
    public string Message { get; init; } = string.Empty;
}
