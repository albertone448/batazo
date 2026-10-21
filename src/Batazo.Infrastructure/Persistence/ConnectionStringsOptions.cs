using System.ComponentModel.DataAnnotations;

namespace Batazo.Infrastructure.Persistence;

public sealed class ConnectionStringsOptions
{
    public const string SectionName = "ConnectionStrings";

    [Required(ErrorMessage = "Connection string 'Batazo' is not configured.")]
    public string Batazo { get; init; } = string.Empty;
}
