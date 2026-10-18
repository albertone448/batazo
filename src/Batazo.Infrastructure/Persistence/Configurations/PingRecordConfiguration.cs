using Batazo.Domain.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Batazo.Infrastructure.Persistence.Configurations;

internal sealed class PingRecordConfiguration : IEntityTypeConfiguration<PingRecord>
{
    public void Configure(EntityTypeBuilder<PingRecord> builder)
    {
        builder.ToTable("ping_records");

        builder.Property(p => p.Message)
            .HasMaxLength(200)
            .IsRequired();
    }
}
