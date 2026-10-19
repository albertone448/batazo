using Batazo.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Batazo.Infrastructure;

public static class DatabaseMigrations
{
    // Temporary: F2-06 moves migrations to the deployment pipeline.
    public static async Task ApplyMigrationsAsync(this IServiceProvider services, CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<BatazoDbContext>();
        await dbContext.Database.MigrateAsync(cancellationToken);
    }
}
