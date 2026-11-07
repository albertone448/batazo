using Batazo.Domain.Users;
using Batazo.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Batazo.Infrastructure.Persistence.Configurations;

internal sealed class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        // Identity crea este índice sin unicidad. La base de datos también tiene que
        // impedir correos repetidos, aunque dos registros lleguen al mismo tiempo.
        builder.HasIndex(user => user.NormalizedEmail)
            .IsUnique();

        builder.Property(user => user.UserName)
            .HasMaxLength(UsernameRules.MaxLength);

        builder.Property(user => user.NormalizedUserName)
            .HasMaxLength(UsernameRules.MaxLength);
    }
}
