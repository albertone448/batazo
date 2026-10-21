using Batazo.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Batazo.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<ConnectionStringsOptions>()
            .Bind(configuration.GetSection(ConnectionStringsOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddDbContext<BatazoDbContext>((serviceProvider, options) =>
        {
            var connectionStrings = serviceProvider.GetRequiredService<IOptions<ConnectionStringsOptions>>().Value;

            options.UseNpgsql(connectionStrings.Batazo)
                .UseSnakeCaseNamingConvention();
        });

        services.AddHealthChecks()
            .AddDbContextCheck<BatazoDbContext>("database");

        return services;
    }
}
