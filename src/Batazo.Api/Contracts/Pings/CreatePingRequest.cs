using System.ComponentModel.DataAnnotations;

namespace Batazo.Api.Contracts.Pings;

public sealed record CreatePingRequest(
    [Required, MaxLength(200)] string Message);
