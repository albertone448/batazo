# Registro de decisiones técnicas

[Español](#espanol) · [English](#english)

<a id="espanol"></a>

## Español

Este documento recoge las decisiones técnicas de Batazo que ya se tomaron y se aplicaron, con su motivo. Sirve para entender por qué el proyecto está construido así y para revisar una decisión si las condiciones cambian.

Solo entran decisiones vigentes. Lo que todavía es un plan se agrega cuando se implementa. Si una decisión cambia, se actualiza su entrada y se indica qué la reemplazó.

Cada entrada tiene el mismo formato: contexto, decisión, por qué y consecuencias.

| ID | Decisión | Fecha |
| --- | --- | --- |
| [DT-01](#dt-01) | Stack principal | 16 oct 2026 |
| [DT-02](#dt-02) | Entorno de desarrollo | 16 oct 2026 |
| [DT-03](#dt-03) | Gestión del trabajo con Jira Kanban | 16 oct 2026 |
| [DT-04](#dt-04) | Flujo de Git y protección de `main` | 17 oct 2026 |
| [DT-05](#dt-05) | Estructura de la solución .NET | 17 oct 2026 |

<a id="dt-01"></a>

### DT-01 · Stack principal

**Contexto.** Batazo es una app de quinielas para un grupo de amigos y, a la vez, una pieza de portafolio de backend. El stack tenía que tener demanda en el mercado costarricense, aprovechar experiencia previa y funcionar con infraestructura gratuita.

**Decisión.**

- Backend en **.NET 10** (versión LTS) con **ASP.NET Core Web API** basado en controladores.
- Persistencia con **Entity Framework Core** y **PostgreSQL** (proveedor Npgsql).
- Frontend en **React con TypeScript**, construido con **Vite**.
- Un **monolito en capas**: la API sirve también el build de React, así que todo se despliega como una sola aplicación.

**Por qué.**

- .NET 10 tiene soporte hasta noviembre de 2028; .NET 8 y 9 lo pierden en noviembre de 2026.
- Los controladores son el estilo más común en proyectos empresariales y en entrevistas.
- PostgreSQL tiene planes gratuitos permanentes y lo aprendido con EF Core y SQL se traslada a SQL Server.
- Servir el frontend desde la misma aplicación evita configurar CORS y permite cookies seguras en el mismo dominio.

**Consecuencias.** Un solo servicio que desplegar y mantener. Se descartan a propósito microservicios, CQRS y MediatR, porque en un proyecto de este tamaño agregan capas sin un beneficio real.

<a id="dt-02"></a>

### DT-02 · Entorno de desarrollo

**Contexto.** El entorno tiene que ser reproducible para que cualquiera pueda clonar el repositorio y ejecutarlo siguiendo una guía.

**Decisión.**

- Desarrollo en **Ubuntu 24.04** con **VS Code** y un conjunto fijo de extensiones.
- **SDK de .NET 10** desde el repositorio oficial de Ubuntu, más la herramienta `dotnet-ef`.
- **Node.js 24 LTS** instalado con **nvm**, no con el gestor de paquetes del sistema.
- **PostgreSQL local dentro de Docker**, nunca instalado en el sistema.
- **Postman** para probar la API.

El detalle de instalación está en [`entorno-de-desarrollo.md`](entorno-de-desarrollo.md).

**Por qué.**

- Microsoft ya no publica paquetes de .NET para Ubuntu 24.04 en su propio repositorio; el de Ubuntu es el camino recomendado.
- nvm instala Node dentro del usuario, sin `sudo`, y permite cambiar de versión con un comando.
- PostgreSQL en Docker deja la base local con la misma versión mayor que la de producción y se puede borrar y recrear sin tocar el sistema.

**Consecuencias.** Hace falta Docker Engine y que el usuario pertenezca al grupo `docker`, que en la práctica equivale a permisos de administrador. Es aceptable en un equipo personal.

<a id="dt-03"></a>

### DT-03 · Gestión del trabajo con Jira Kanban

**Contexto.** Es un proyecto personal, sin fechas fijas, que se avanza cuando hay tiempo disponible. Aun así se quiere trabajar como en un equipo profesional.

**Decisión.**

- Jira con un tablero **Kanban**, sin sprints. Estados: Por hacer, En curso, En revisión y Finalizado.
- **Épicas** para cada módulo o área técnica; **historias** para lo que el usuario puede hacer o ver; **tareas** para trabajo técnico.
- Cada elemento tiene criterios de aceptación y se termina en una o dos sesiones de trabajo.
- Las fases del proyecto se marcan con **etiquetas** (`fase-0`, `fase-1`...).
- Máximo dos elementos en curso a la vez.

**Por qué.**

- Scrum supone sprints con fechas y un equipo; aquí solo agregaría ceremonias sin valor.
- Elementos pequeños con criterios claros obligan a terminar cosas completas y verificables.
- Jira permite asignar fases como versiones, pero esa función no está activa en el espacio; las etiquetas cumplen el mismo propósito de filtrar.

**Consecuencias.** El backlog completo vive en un documento aparte y en Jira se cargan las fases a medida que se acercan.

<a id="dt-04"></a>

### DT-04 · Flujo de Git y protección de `main`

**Contexto.** Se quiere un historial claro, revisable y conectado con Jira, y evitar cambios directos a la rama principal.

**Decisión.**

- **Una rama por historia o tarea**, con la clave de Jira y una descripción corta: `KAN-19-plantilla-pr`.
- Commits con **Conventional Commits** y la clave al final: `chore: add pull request template (KAN-19)`.
- **Pull request** al terminar cada elemento, con una plantilla que pide contexto, cambios, criterios de aceptación y cómo se probó.
- **Merge normal** (merge commit), no squash ni rebase.
- **`main` protegida con un ruleset de GitHub**: solo cambia por pull request, no se puede borrar ni reescribir con force push. Las aprobaciones requeridas están en cero.
- **GitHub for Atlassian** conectado con acceso solo al repositorio `batazo`, para que Jira muestre ramas, commits y pull requests de cada elemento.

**Por qué.**

- La clave de Jira en ramas y commits es lo que permite a la integración enlazarlos automáticamente.
- El merge normal conserva todos los commits del elemento y el punto exacto en que se integró.
- Las aprobaciones están en cero porque GitHub no permite aprobar un pull request propio, y el proyecto tiene un solo desarrollador.
- Dar acceso solo al repositorio necesario sigue el principio de mínimo privilegio.

**Consecuencias.** Cada mensaje de commit tiene que entenderse por sí solo, porque todos quedan en `main`. La regla que exige que la CI pase antes del merge se agregará cuando exista la CI (KAN-30).

<a id="dt-05"></a>

### DT-05 · Estructura de la solución .NET

**Contexto.** Las reglas del negocio (puntaje, cierre de predicciones) tienen que poder probarse sin base de datos ni servicios externos, y separadas de la exposición HTTP y de la persistencia.

**Decisión.** Tres proyectos de código y uno de pruebas. Todas las referencias apuntan hacia el dominio:

```
src/
  Batazo.Domain           (no referencia a ningún proyecto)
  Batazo.Infrastructure   -> Domain
  Batazo.Api              -> Domain, Infrastructure
tests/
  Batazo.Domain.Tests     -> Domain
web/                      (React, fuera de la solución .NET)
```

- **Domain:** entidades, value objects y reglas de negocio, más las interfaces de lo que el sistema necesita del exterior, como `IMatchResultProvider`. No referencia EF Core, ASP.NET Core ni paquetes externos.
- **Infrastructure:** `DbContext`, configuraciones de EF Core, migraciones, envío de correos y las implementaciones de las interfaces del dominio.
- **Api:** controladores, autenticación, autorización, DTO, validación de entrada y servicios que coordinan cada caso de uso. Es el punto donde se registra la inyección de dependencias.
- **Domain.Tests:** pruebas unitarias del dominio con xUnit.

**Por qué.**

- Un dominio sin dependencias se prueba en milisegundos y no cambia si cambia la base de datos o el proveedor de resultados.
- Las interfaces viven en el dominio porque quien usa un contrato no debe depender de quien lo implementa.
- Se descartó un cuarto proyecto **Application** para los casos de uso. Necesitaría el `DbContext`, así que dependería de EF Core o de interfaces sobre él que no aportan valor a este tamaño. Si la coordinación crece demasiado dentro de la API, extraerla a un proyecto nuevo es un refactor razonable.
- El proyecto de pruebas de integración se crea en la fase 2, cuando se necesite.

**Consecuencias.** Hay que vigilar que la lógica de negocio no se pase a los controladores o servicios de la API. Regla: si es una decisión del negocio, va en el dominio; la API solo coordina.

[Volver arriba](#registro-de-decisiones-técnicas)

---

<a id="english"></a>

## English

This document records the technical decisions in Batazo that have already been made and applied, along with the reasons behind them. It explains why the project is built this way and makes it easier to revisit a decision if circumstances change.

Only current decisions are included. Anything still in planning is added once it is implemented. When a decision changes, its entry is updated and notes what replaced it.

Every entry follows the same format: context, decision, rationale and consequences.

| ID | Decision | Date |
| --- | --- | --- |
| [TD-01](#td-01) | Core stack | Oct 16, 2026 |
| [TD-02](#td-02) | Development environment | Oct 16, 2026 |
| [TD-03](#td-03) | Work management with Jira Kanban | Oct 16, 2026 |
| [TD-04](#td-04) | Git workflow and `main` protection | Oct 17, 2026 |
| [TD-05](#td-05) | .NET solution structure | Oct 17, 2026 |

<a id="td-01"></a>

### TD-01 · Core stack

**Context.** Batazo is a prediction pool app for a group of friends and also a backend portfolio project. The stack had to be in demand in the Costa Rican job market, build on previous experience and run on free infrastructure.

**Decision.**

- Backend on **.NET 10** (LTS) with a controller-based **ASP.NET Core Web API**.
- Persistence with **Entity Framework Core** and **PostgreSQL** (Npgsql provider).
- Frontend in **React with TypeScript**, built with **Vite**.
- A **layered monolith**: the API also serves the React build, so everything ships as a single application.

**Rationale.**

- .NET 10 is supported until November 2028; .NET 8 and 9 lose support in November 2026.
- Controllers are the most common style in enterprise projects and job interviews.
- PostgreSQL has permanent free hosting tiers, and what is learned with EF Core and SQL carries over to SQL Server.
- Serving the frontend from the same app avoids CORS configuration and allows secure same-domain cookies.

**Consequences.** One service to deploy and maintain. Microservices, CQRS and MediatR are deliberately left out, since at this size they add layers without real benefit.

<a id="td-02"></a>

### TD-02 · Development environment

**Context.** The environment must be reproducible so anyone can clone the repository and run it by following a guide.

**Decision.**

- Development on **Ubuntu 24.04** with **VS Code** and a fixed set of extensions.
- **.NET 10 SDK** from Ubuntu's official repository, plus the `dotnet-ef` tool.
- **Node.js 24 LTS** installed with **nvm**, not with the system package manager.
- **Local PostgreSQL inside Docker**, never installed on the host.
- **Postman** to test the API.

Installation details are in [`entorno-de-desarrollo.md`](entorno-de-desarrollo.md) (Spanish).

**Rationale.**

- Microsoft no longer publishes .NET packages for Ubuntu 24.04 in its own repository; Ubuntu's is the recommended path.
- nvm installs Node per user, without `sudo`, and switches versions with one command.
- PostgreSQL in Docker matches the production major version and can be wiped and recreated without touching the host.

**Consequences.** Docker Engine is required, and the user must belong to the `docker` group, which is effectively root-level access. That is acceptable on a personal machine.

<a id="td-03"></a>

### TD-03 · Work management with Jira Kanban

**Context.** This is a personal project with no fixed deadlines, moving forward whenever time allows. Even so, the goal is to work the way a professional team would.

**Decision.**

- Jira with a **Kanban** board and no sprints. Statuses: To do, In progress, In review and Done.
- **Epics** for each module or technical area, **stories** for things a user can do or see, **tasks** for technical work.
- Every item has acceptance criteria and fits in one or two work sessions.
- Project phases are tracked with **labels** (`fase-0`, `fase-1`...).
- At most two items in progress at a time.

**Rationale.**

- Scrum assumes dated sprints and a team; here it would only add ceremony.
- Small items with clear criteria force each piece of work to be complete and verifiable.
- Jira can track phases as versions, but that feature is not enabled in the space; labels serve the same filtering purpose.

**Consequences.** The full backlog lives in a separate document, and phases are loaded into Jira as they approach.

<a id="td-04"></a>

### TD-04 · Git workflow and `main` protection

**Context.** The goal is a clear, reviewable history connected to Jira, with no direct changes to the main branch.

**Decision.**

- **One branch per story or task**, named with the Jira key and a short description: `KAN-19-plantilla-pr`.
- **Conventional Commits** with the key at the end: `chore: add pull request template (KAN-19)`.
- A **pull request** when each item is done, using a template that asks for context, changes, acceptance criteria and how it was tested.
- **Regular merge** (merge commit), not squash or rebase.
- **`main` protected by a GitHub ruleset**: it only changes through pull requests and cannot be deleted or force-pushed. Required approvals are set to zero.
- **GitHub for Atlassian** connected with access to the `batazo` repository only, so Jira shows the branches, commits and pull requests for each item.

**Rationale.**

- The Jira key in branches and commits is what lets the integration link them automatically.
- A regular merge keeps every commit of the item and the exact point where it was integrated.
- Approvals are set to zero because GitHub does not allow approving your own pull request, and the project has a single developer.
- Granting access to only the needed repository follows the principle of least privilege.

**Consequences.** Every commit message must make sense on its own, since all of them end up in `main`. The rule requiring CI to pass before merging will be added once CI exists (KAN-30).

<a id="td-05"></a>

### TD-05 · .NET solution structure

**Context.** Business rules (scoring, prediction locking) must be testable without a database or external services, and kept separate from HTTP and persistence concerns.

**Decision.** Three code projects and one test project. Every reference points toward the domain:

```
src/
  Batazo.Domain           (references no project)
  Batazo.Infrastructure   -> Domain
  Batazo.Api              -> Domain, Infrastructure
tests/
  Batazo.Domain.Tests     -> Domain
web/                      (React, outside the .NET solution)
```

- **Domain:** entities, value objects and business rules, plus the interfaces for what the system needs from the outside world, such as `IMatchResultProvider`. It does not reference EF Core, ASP.NET Core or external packages.
- **Infrastructure:** the `DbContext`, EF Core configurations, migrations, email sending and the implementations of the domain interfaces.
- **Api:** controllers, authentication, authorization, DTOs, input validation and the services that coordinate each use case. It is where dependency injection is wired up.
- **Domain.Tests:** domain unit tests with xUnit.

**Rationale.**

- A domain with no dependencies is tested in milliseconds and does not change when the database or the results provider changes.
- Interfaces live in the domain because whoever uses a contract should not depend on whoever implements it.
- A fourth **Application** project for use cases was ruled out. It would need the `DbContext`, so it would depend on EF Core or on interfaces over it that add no value at this size. If coordination grows too large inside the API, extracting it into a new project is a reasonable refactor.
- The integration test project is created in phase 2, when it is needed.

**Consequences.** Business logic must not drift into API controllers or services. Rule of thumb: if it is a business decision, it belongs in the domain; the API only coordinates.

[Back to top](#registro-de-decisiones-técnicas)
