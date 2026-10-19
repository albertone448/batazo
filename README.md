# Batazo

[Español](#espanol) · [English](#english)

<a id="espanol"></a>

## Español

Batazo es una aplicación web de quinielas de fútbol privadas para grupos de amigos. Reúne en un solo lugar ligas internacionales, la Primera División de Costa Rica y quinielas libres armadas por el propio grupo.

El nombre viene de la expresión costarricense *batear*: dar algo por hecho sin saberlo. Es exactamente lo que se hace en una quiniela.

### Estado

Fase 0 terminada: la base técnica está lista y la aplicación se despliega en [batazo.onrender.com](https://batazo.onrender.com), pero todavía no tiene funcionalidades de quinielas. La fase 1 construye la primera versión utilizable.

### Qué va a hacer

- Quinielas privadas con invitación por código o enlace.
- Predicciones de marcador que se cierran a la hora de inicio de cada partido, validadas en el servidor.
- Puntaje 5, 3, 1 y 0, con tabla general y por jornada.
- Resultados automáticos de LaLiga mediante football-data.org e ingreso manual para el resto de competiciones.
- Solo lleva puntos. No maneja dinero ni apuestas.

### Stack

- **Backend:** .NET 10, ASP.NET Core Web API, Entity Framework Core, PostgreSQL y ASP.NET Core Identity.
- **Frontend:** React, TypeScript, Vite, React Router y TanStack Query.
- **Pruebas:** xUnit y WebApplicationFactory.
- **Infraestructura:** Docker, GitHub Actions, Render y Neon.

Las decisiones técnicas y sus motivos están en [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md).

### Cómo ejecutarlo

Antes de empezar, instala las herramientas de [`docs/entorno-de-desarrollo.md`](docs/entorno-de-desarrollo.md): .NET 10, Node.js 24, Docker con Compose y Git.

**1. Clona el repositorio**

```bash
gh repo clone albertone448/batazo
cd batazo
```

**2. Levanta la base de datos**

Crea tu `.env` a partir del ejemplo y cambia la contraseña:

```bash
cp .env.example .env
docker compose up -d
```

Esto levanta solo PostgreSQL 18, escuchando en `127.0.0.1`. El `.env` no se versiona.

**3. Guarda la cadena de conexión en user-secrets**

Usa los mismos valores que pusiste en tu `.env`:

```bash
dotnet user-secrets set "ConnectionStrings:Batazo" "Host=localhost;Port=5432;Database=<POSTGRES_DB>;Username=<POSTGRES_USER>;Password=<POSTGRES_PASSWORD>" --project src/Batazo.Api
```

**4. Arranca la API**

```bash
dotnet run --project src/Batazo.Api
```

Al arrancar aplica las migraciones pendientes. La API queda en `http://localhost:5224`, y `http://localhost:5224/health` responde `Healthy` si llega a la base.

**5. Arranca el frontend**

En otra terminal:

```bash
cd web
npm ci
npm run dev
```

Abre `http://localhost:5173`. Vite reenvía las peticiones a `/api` hacia la API del paso 4.

#### Alternativa: todo en Docker

Para probar la misma imagen que se despliega, con la base de Compose:

```bash
docker compose --profile app up --build -d
```

La aplicación queda en `http://localhost:8080`. Tarda unos segundos en aceptar conexiones después del `up`. Para detenerla sin parar la base: `docker compose stop app`.

#### Comprobaciones antes de un pull request

Son las mismas que ejecuta la CI:

```bash
dotnet build
dotnet test
dotnet format --verify-no-changes
cd web && npm run lint && npm run format:check && npm run build
```

#### Publicar

`dotnet publish` construye también el frontend y lo deja en `wwwroot`, así que necesita Node. Para publicar solo el backend, agrega `-p:BuildFrontend=false`.

### Variables de entorno

Ningún valor real se guarda en el repositorio.

| Variable | Dónde se define | Para qué |
| --- | --- | --- |
| `POSTGRES_DB` | `.env` | Nombre de la base local |
| `POSTGRES_USER` | `.env` | Usuario de la base local |
| `POSTGRES_PASSWORD` | `.env` | Contraseña de la base local. Obligatoria: Compose no arranca sin ella |
| `POSTGRES_PORT` | `.env` | Puerto local de la base. Opcional, por defecto 5432 |
| `ConnectionStrings:Batazo` | user-secrets (desarrollo) | Cadena de conexión de la API. Sin ella, la API no arranca |
| `ConnectionStrings__Batazo` | Variable de entorno (producción) | La misma cadena, en el formato de variables de entorno. En el servicio `app` de Compose se arma sola a partir del `.env` |
| `ASPNETCORE_ENVIRONMENT` | Variable de entorno | `Production` en el despliegue. Con `dotnet run` es `Development` |
| `PORT` | La define la plataforma | Puerto en el que escucha el contenedor. Si no existe, usa 8080 |

### Despliegue

Cada cambio en `main` se despliega en Render después de que pasa la CI. La base de producción está en Neon. Los detalles están en [DT-14 y DT-15](docs/decisiones-tecnicas.md#dt-14).

### Autor

Alberto Núñez Trejos

[Volver arriba](#batazo)

---

<a id="english"></a>

## English

Batazo is a web app for private football prediction pools among groups of friends. It brings international leagues, Costa Rica's Primera División and custom pools created by the group together in one place.

The name comes from the Costa Rican expression *batear*: to state something as fact without actually knowing it. That is exactly what you do in a prediction pool.

### Status

Phase 0 is complete: the technical foundation is in place and the app is deployed at [batazo.onrender.com](https://batazo.onrender.com), but it has no prediction pool features yet. Phase 1 builds the first usable version.

### What it will do

- Private pools with invitations by code or link.
- Score predictions that lock at each match's kickoff time, enforced on the server.
- 5, 3, 1 and 0 point scoring, with overall and per-matchday standings.
- Automatic LaLiga results through football-data.org and manual entry for every other competition.
- Points only. No money or betting involved.

### Stack

- **Backend:** .NET 10, ASP.NET Core Web API, Entity Framework Core, PostgreSQL and ASP.NET Core Identity.
- **Frontend:** React, TypeScript, Vite, React Router and TanStack Query.
- **Testing:** xUnit and WebApplicationFactory.
- **Infrastructure:** Docker, GitHub Actions, Render and Neon.

Technical decisions and their rationale are in [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md#english).

### Running it

First install the tools listed in [`docs/entorno-de-desarrollo.md`](docs/entorno-de-desarrollo.md) (Spanish): .NET 10, Node.js 24, Docker with Compose and Git.

**1. Clone the repository**

```bash
gh repo clone albertone448/batazo
cd batazo
```

**2. Start the database**

Create your `.env` from the example and change the password:

```bash
cp .env.example .env
docker compose up -d
```

This starts PostgreSQL 18 only, listening on `127.0.0.1`. The `.env` file is not committed.

**3. Store the connection string in user-secrets**

Use the same values you set in your `.env`:

```bash
dotnet user-secrets set "ConnectionStrings:Batazo" "Host=localhost;Port=5432;Database=<POSTGRES_DB>;Username=<POSTGRES_USER>;Password=<POSTGRES_PASSWORD>" --project src/Batazo.Api
```

**4. Start the API**

```bash
dotnet run --project src/Batazo.Api
```

It applies pending migrations on startup. The API runs at `http://localhost:5224`, and `http://localhost:5224/health` returns `Healthy` when it can reach the database.

**5. Start the frontend**

In another terminal:

```bash
cd web
npm ci
npm run dev
```

Open `http://localhost:5173`. Vite forwards `/api` requests to the API from step 4.

#### Alternative: everything in Docker

To try the same image that gets deployed, against the Compose database:

```bash
docker compose --profile app up --build -d
```

The app runs at `http://localhost:8080`. It takes a few seconds to accept connections after `up`. To stop it without stopping the database: `docker compose stop app`.

#### Checks before a pull request

These are the same checks CI runs:

```bash
dotnet build
dotnet test
dotnet format --verify-no-changes
cd web && npm run lint && npm run format:check && npm run build
```

#### Publishing

`dotnet publish` also builds the frontend into `wwwroot`, so it requires Node. To publish the backend only, add `-p:BuildFrontend=false`.

### Environment variables

No real values are stored in the repository.

| Variable | Where it is set | Purpose |
| --- | --- | --- |
| `POSTGRES_DB` | `.env` | Local database name |
| `POSTGRES_USER` | `.env` | Local database user |
| `POSTGRES_PASSWORD` | `.env` | Local database password. Required: Compose will not start without it |
| `POSTGRES_PORT` | `.env` | Local database port. Optional, defaults to 5432 |
| `ConnectionStrings:Batazo` | user-secrets (development) | API connection string. The API will not start without it |
| `ConnectionStrings__Batazo` | Environment variable (production) | The same string, in environment variable format. The Compose `app` service builds it from `.env` |
| `ASPNETCORE_ENVIRONMENT` | Environment variable | `Production` when deployed. `Development` with `dotnet run` |
| `PORT` | Set by the platform | Port the container listens on. Defaults to 8080 when missing |

### Deployment

Every change to `main` is deployed to Render once CI passes. The production database runs on Neon. Details are in [TD-14 and TD-15](docs/decisiones-tecnicas.md#td-14).

### Author

Alberto Núñez Trejos

[Back to top](#batazo)
