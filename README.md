# Batazo

[Español](#espanol) · [English](#english)

<a id="espanol"></a>

## Español

Batazo es una aplicación web de quinielas de fútbol privadas para grupos de amigos. Reúne en un solo lugar ligas internacionales, la Primera División de Costa Rica y quinielas libres armadas por el propio grupo.

El nombre viene de la expresión costarricense *batear*: dar algo por hecho sin saberlo. Es exactamente lo que se hace en una quiniela.

### Estado

En desarrollo, fase 0 (preparación del proyecto). Todavía no hay una versión utilizable.

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

### Cómo ejecutarlo

Las instrucciones se agregarán cuando exista la primera versión ejecutable.

### Autor

Alberto Núñez Trejos

[Volver arriba](#batazo)

---

<a id="english"></a>

## English

Batazo is a web app for private football prediction pools among groups of friends. It brings international leagues, Costa Rica's Primera División and custom pools created by the group together in one place.

The name comes from the Costa Rican expression *batear*: to state something as fact without actually knowing it. That is exactly what you do in a prediction pool.

### Status

In development, phase 0 (project setup). There is no usable version yet.

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

### Running it

Instructions will be added once the first runnable version exists.

### Author

Alberto Núñez Trejos

[Back to top](#batazo)
