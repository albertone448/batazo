namespace Batazo.Api.Contracts.Pings;

public sealed record PingResponse(int Id, string Message, DateTimeOffset CreatedAt);
