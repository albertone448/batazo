using Batazo.Api.Contracts.Pings;
using Batazo.Domain.Diagnostics;
using Batazo.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Batazo.Api.Controllers;

[ApiController]
[Route("api/pings")]
public sealed class PingsController(BatazoDbContext dbContext, TimeProvider timeProvider) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<PingResponse>> Create(
        CreatePingRequest request,
        CancellationToken cancellationToken)
    {
        var ping = new PingRecord(request.Message, timeProvider.GetUtcNow());

        dbContext.PingRecords.Add(ping);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = ping.Id }, ToResponse(ping));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PingResponse>> GetById(int id, CancellationToken cancellationToken)
    {
        var ping = await dbContext.PingRecords
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (ping is null)
        {
            return NotFound();
        }

        return ToResponse(ping);
    }

    private static PingResponse ToResponse(PingRecord ping) =>
        new(ping.Id, ping.Message, ping.CreatedAt);
}
