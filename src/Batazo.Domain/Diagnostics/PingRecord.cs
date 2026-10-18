namespace Batazo.Domain.Diagnostics;

public class PingRecord
{
    public int Id { get; private set; }

    public string Message { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public PingRecord(string message, DateTimeOffset createdAt)
    {
        Message = message;
        CreatedAt = createdAt;
    }
}
