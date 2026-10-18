using Batazo.Domain.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace Batazo.Infrastructure.Persistence;

public class BatazoDbContext(DbContextOptions<BatazoDbContext> options) : DbContext(options)
{
    public DbSet<PingRecord> PingRecords => Set<PingRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BatazoDbContext).Assembly);
    }
}
