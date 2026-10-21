FROM node:24-slim AS frontend
WORKDIR /src/web
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend
WORKDIR /src
COPY global.json Directory.Build.props Directory.Packages.props .editorconfig BannedSymbols.txt ./
COPY src/Batazo.Domain/Batazo.Domain.csproj src/Batazo.Domain/
COPY src/Batazo.Infrastructure/Batazo.Infrastructure.csproj src/Batazo.Infrastructure/
COPY src/Batazo.Api/Batazo.Api.csproj src/Batazo.Api/
RUN dotnet restore src/Batazo.Api/Batazo.Api.csproj
COPY src/ src/
RUN dotnet publish src/Batazo.Api/Batazo.Api.csproj -c Release -o /app/publish --no-restore -p:BuildFrontend=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=backend /app/publish ./
COPY --from=frontend /src/web/dist ./wwwroot
USER $APP_UID
ENTRYPOINT ["sh", "-c", "export ASPNETCORE_HTTP_PORTS=${PORT:-8080} && exec dotnet Batazo.Api.dll"]
