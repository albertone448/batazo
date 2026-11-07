using Batazo.Domain.Diagnostics;
using Batazo.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Batazo.Infrastructure.Persistence;

public class BatazoDbContext(DbContextOptions<BatazoDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<PingRecord> PingRecords => Set<PingRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Primero el modelo de Identity; después las configuraciones propias, que lo ajustan.
        base.OnModelCreating(modelBuilder);

        RenameIdentityTables(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BatazoDbContext).Assembly);
    }

    // Identity fija los nombres de sus tablas en PascalCase y la convención snake_case
    // no cambia nombres explícitos; se renombran para que todo el esquema sea igual.
    private static void RenameIdentityTables(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ApplicationUser>().ToTable("asp_net_users");
        modelBuilder.Entity<IdentityRole<Guid>>().ToTable("asp_net_roles");
        modelBuilder.Entity<IdentityUserRole<Guid>>().ToTable("asp_net_user_roles");
        modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("asp_net_user_claims");
        modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("asp_net_user_logins");
        modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("asp_net_user_tokens");
        modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("asp_net_role_claims");
    }
}
