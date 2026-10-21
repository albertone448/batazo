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
| [DT-06](#dt-06) | Persistencia con EF Core y PostgreSQL | 18 oct 2026 |
| [DT-07](#dt-07) | Configuración y secretos | 18 oct 2026 |
| [DT-08](#dt-08) | Compilación y calidad del backend | 17 oct 2026 |
| [DT-09](#dt-09) | Convenciones de la API | 18 oct 2026 |
| [DT-10](#dt-10) | Herramientas del frontend | 18 oct 2026 |
| [DT-11](#dt-11) | Servir el frontend desde ASP.NET Core | 19 oct 2026 |
| [DT-12](#dt-12) | Imagen Docker de la aplicación | 19 oct 2026 |
| [DT-13](#dt-13) | Integración continua con GitHub Actions | 19 oct 2026 |
| [DT-14](#dt-14) | Base de datos de producción en Neon | 19 oct 2026 |
| [DT-15](#dt-15) | Despliegue en Render | 19 oct 2026 |
| [DT-16](#dt-16) | Contrato de errores de la API | 21 oct 2026 |
| [DT-17](#dt-17) | Validación de entrada | 21 oct 2026 |

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

**Consecuencias.** Cada mensaje de commit tiene que entenderse por sí solo, porque todos quedan en `main`. Desde KAN-30, el ruleset también exige que la CI pase antes del merge (ver [DT-13](#dt-13)).

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

<a id="dt-06"></a>

### DT-06 · Persistencia con EF Core y PostgreSQL

**Contexto.** DT-01 eligió EF Core y PostgreSQL. Faltaba definir la versión, las convenciones del esquema y cómo se registra la persistencia sin que la API dependa de sus detalles.

**Decisión.**

- **PostgreSQL 18** en todos los entornos: imagen `postgres:18` en local y la misma versión mayor en producción.
- **EF Core 10 con Npgsql** y nombres en **`snake_case`** mediante `UseSnakeCaseNamingConvention` (paquete `EFCore.NamingConventions`). Las clases siguen en PascalCase en C#.
- La configuración de cada entidad va en su propia clase con **`IEntityTypeConfiguration<T>`**, no dentro del `DbContext`.
- Infrastructure expone un método **`AddInfrastructure`** que registra el `DbContext` y su health check. La API solo lo llama.

**Por qué.**

- Usar la misma versión mayor en local y en producción evita diferencias de comportamiento entre entornos.
- PostgreSQL convierte a minúsculas los identificadores sin comillas. Con `snake_case`, las tablas y columnas se consultan en SQL sin comillas (`ping_records.created_at`), que es la convención habitual en PostgreSQL.
- Separar la configuración por entidad mantiene el `DbContext` pequeño a medida que crece el modelo.
- Con `AddInfrastructure`, los detalles de EF Core quedan dentro de Infrastructure y `Program.cs` no necesita conocerlos.

**Consecuencias.** Las migraciones generan nombres en `snake_case`, incluida la tabla de historial (`__EFMigrationsHistory` con columnas `migration_id` y `product_version`). Cambiar de convención más adelante obligaría a renombrar todo el esquema.

<a id="dt-07"></a>

### DT-07 · Configuración y secretos

**Contexto.** El repositorio es público. La cadena de conexión y las contraseñas no pueden quedar versionadas, pero cada entorno las necesita.

**Decisión.**

- **Desarrollo:** la cadena de conexión `ConnectionStrings:Batazo` vive en **user-secrets**, fuera de la carpeta del proyecto.
- **Docker Compose local:** las credenciales de PostgreSQL vienen de un **`.env` sin versionar**. En el repositorio solo está **`.env.example`**, con valores de ejemplo. Compose falla si falta `POSTGRES_PASSWORD`, y el puerto de la base solo se publica en `127.0.0.1`.
- **Producción:** variables de entorno del servicio, como `ConnectionStrings__Batazo` y `ASPNETCORE_ENVIRONMENT`.
- La API **no arranca** si falta la cadena de conexión: lanza una excepción con un mensaje claro en vez de fallar más tarde.

**Por qué.**

- User-secrets y `.env` mantienen los secretos fuera del repositorio sin cambiar el código: ASP.NET Core lee la misma clave desde cualquier fuente de configuración.
- Las variables de entorno son la forma estándar de configurar contenedores y servicios en la nube. El doble guion bajo (`__`) es como .NET representa las secciones (`:`) en variables de entorno.
- Fallar al arrancar hace evidente un error de configuración en el primer despliegue, no en la primera petición.

**Consecuencias.** Quien clone el repositorio tiene que crear su `.env` a partir de `.env.example` y configurar los user-secrets, como explica la guía del entorno. User-secrets no cifra nada: es un archivo JSON en la carpeta del usuario, pensado solo para desarrollo.

<a id="dt-08"></a>

### DT-08 · Compilación y calidad del backend

**Contexto.** El proyecto se compila en la máquina de desarrollo, en la CI y dentro de Docker. Las tres compilaciones tienen que dar el mismo resultado y los problemas deben detectarse pronto.

**Decisión.**

- **`global.json`** fija el SDK `10.0.112` con `rollForward: latestFeature`.
- **`Directory.Build.props`** activa para todos los proyectos los tipos de referencia anulables y **`TreatWarningsAsErrors`**.
- **Central Package Management** (`Directory.Packages.props`): las versiones de los paquetes NuGet se declaran en un solo lugar.
- **`.editorconfig`** define el estilo: UTF-8, saltos de línea LF, sangría y convenciones de C#. `dotnet format --verify-no-changes` lo comprueba.
- La carpeta de **migraciones se marca como código generado** (`generated_code = true`), porque EF Core las crea con su propio estilo y en UTF-8 con BOM.

**Por qué.**

- `latestFeature` acepta parches y bandas posteriores del SDK 10.0, pero nunca uno anterior al fijado. La CI lee el mismo `global.json`.
- Una advertencia suele ser un error real. Tratarla como error impide que se acumulen.
- Con las versiones centralizadas, todos los proyectos usan la misma versión de cada paquete y actualizar es cambiar una línea.
- Las migraciones no las escribe una persona, así que aplicarles reglas de estilo solo genera ruido.

**Consecuencias.** Cualquier advertencia rompe el build. Por ejemplo, usar en .NET 10 la API obsoleta `KnownNetworks` en vez de `KnownIPNetworks` impide compilar. Las migraciones siguen revisándose en cada PR, porque cambian la base; solo se excluyen del chequeo de estilo.

<a id="dt-09"></a>

### DT-09 · Convenciones de la API

**Contexto.** Antes de construir funcionalidades reales hacía falta fijar cómo recibe y responde la API, cómo informa errores y cómo maneja el tiempo, para que todos los endpoints sigan el mismo patrón.

**Decisión.**

- Controladores con **`[ApiController]`** y **DTO explícitos** para solicitudes y respuestas. Las entidades de EF Core nunca salen de la API.
- **Validación de formato con atributos** en los DTO (`[Required]`, `[MaxLength]`). `[ApiController]` responde 400 automáticamente si no se cumplen. El detalle está en [DT-17](#dt-17).
- **ProblemDetails** como formato de todos los errores HTTP.
- **`TimeProvider`** registrado como singleton para obtener la hora actual, siempre en UTC.
- **OpenAPI** solo se publica en desarrollo.
- **`/health`** con un health check que comprueba la conexión a la base: responde 200 si está bien y 503 si no.
- El endpoint **`api/pings`** y su tabla son **temporales**: sirvieron para probar la cadena completa en la fase 0 y se eliminan en la fase 1.

**Por qué.**

- Los DTO separan el contrato HTTP del modelo de datos. Un cambio en la base no rompe a los clientes, y nunca se exponen campos internos por accidente.
- ProblemDetails es un estándar (RFC 9457) y ASP.NET Core lo genera sin código adicional.
- Pedir la hora a `TimeProvider` en vez de usar `DateTime.UtcNow` directamente permite controlar el tiempo en las pruebas. Es clave para probar el cierre exacto de las predicciones. Además, Npgsql solo acepta instantes con desfase cero en columnas `timestamptz`.
- No publicar OpenAPI en producción reduce la información que se expone sobre la API.
- Un health check que no mira la base diría que todo está bien con la base caída.

**Consecuencias.** Hay que mapear cada entidad a su DTO. PostgreSQL guarda los instantes con precisión de microsegundos y .NET con 100 nanosegundos, así que un valor leído de la base puede diferir en el último dígito del que se tenía en memoria; las pruebas que comparen instantes deben tenerlo en cuenta. El formato común de todos los errores se define en [DT-16](#dt-16).

<a id="dt-10"></a>

### DT-10 · Herramientas del frontend

**Contexto.** DT-01 eligió React con TypeScript y Vite. Faltaba definir la calidad del código del frontend y cómo se comunica con la API durante el desarrollo.

**Decisión.**

- Proyecto en **`web/`** creado con la plantilla oficial de Vite para React con TypeScript, con **TypeScript en modo estricto**.
- **ESLint** con la configuración de la plantilla (reglas de TypeScript y de hooks de React), en lugar de Oxlint.
- **Prettier** para el formato, con `eslint-config-prettier` para que ESLint no aplique reglas de formato que choquen con él. Scripts `format` y `format:check`.
- **Proxy de Vite** en desarrollo: las peticiones a `/api` se reenvían a la API local en el puerto 5224.

**Por qué.**

- El modo estricto atrapa en compilación errores que de otro modo aparecerían en el navegador.
- ESLint es la herramienta más madura, tiene el ecosistema de plugins que usa la plantilla (`typescript-eslint` y las reglas de hooks de React) y viene configurado. Oxlint es más rápido, pero en un proyecto de este tamaño la velocidad no es un problema.
- Separar formato (Prettier) de calidad (ESLint) evita que dos herramientas se contradigan.
- Con el proxy, el navegador ve el frontend y la API en el mismo origen, igual que en producción. Así no hace falta CORS y las cookies de la fase 1 funcionarán igual en desarrollo.

**Consecuencias.** En desarrollo hay que levantar dos procesos, la API y el servidor de Vite. La CI ejecuta lint, el chequeo de formato y el build, que incluye la revisión de tipos.

<a id="dt-11"></a>

### DT-11 · Servir el frontend desde ASP.NET Core

**Contexto.** DT-01 definió que la API sirve el build de React. Había que resolver cómo llega ese build a la aplicación publicada y cómo conviven las rutas del cliente con las de la API.

**Decisión.**

- **`UseStaticFiles`** sirve los archivos de `wwwroot`, en lugar de `MapStaticAssets`.
- Una ruta **`/api/{**path}`** responde **404 con ProblemDetails** para cualquier ruta de API que no exista.
- **`MapFallbackToFile("index.html")`** devuelve el frontend para las rutas del cliente, como `/quinielas/5`.
- Un target de MSBuild, **`PublishFrontend`**, ejecuta `npm ci` y `npm run build` al publicar y agrega `web/dist` a la salida bajo `wwwroot`. Se desactiva con `-p:BuildFrontend=false`. El build nunca se copia a la carpeta `wwwroot` del código fuente.

**Por qué.**

- `MapStaticAssets` trabaja con los archivos que conoce al compilar el proyecto .NET. El build de Vite se agrega después, al publicar o dentro de Docker, así que `UseStaticFiles`, que sirve lo que haya en disco, encaja mejor.
- Sin el fallback de `/api`, una ruta de API inexistente devolvería el HTML de React con un 200, y el cliente no podría distinguir el error.
- El fallback a `index.html` permite que React Router resuelva las rutas en el navegador. No captura rutas con extensión, así que un archivo inexistente devuelve 404.
- Con el target, `dotnet publish` produce la aplicación completa con un solo comando, y el repositorio no contiene archivos generados.

**Consecuencias.** `dotnet publish` necesita Node instalado, salvo con `BuildFrontend=false`. Por el fallback, un método no soportado en una ruta existente, como `GET /api/pings`, responde 404 en vez de 405.

<a id="dt-12"></a>

### DT-12 · Imagen Docker de la aplicación

**Contexto.** La aplicación se despliega como contenedor. La imagen tenía que ser pequeña, segura y funcionar igual en local y en Render.

**Decisión.**

- **Dockerfile multietapa**:
  - `frontend` (`node:24-slim`) construye React.
  - `backend` (`sdk:10.0`) restaura en su propia capa y publica con `-p:BuildFrontend=false`.
  - `final` (`aspnet:10.0`) solo lleva la salida publicada y el build de React en `wwwroot`.
- La imagen final corre con el **usuario sin privilegios** de la imagen base (`USER $APP_UID`).
- El **`ENTRYPOINT`** traduce la variable `PORT` a `ASPNETCORE_HTTP_PORTS`, con 8080 por defecto, y usa `exec` para que `dotnet` sea el proceso principal.
- **`.dockerignore`** excluye `.env`, `bin`, `obj`, `node_modules`, `web/dist`, `.git`, `tests` y `docs`.
- **Compose** incluye un servicio `app` con el perfil `app`, conectado a la base por la red interna (`Host=db`).

**Por qué.**

- Con varias etapas, la imagen final no lleva Node, el SDK ni el código fuente.
- Copiar primero los archivos de dependencias aprovecha la caché de capas: si solo cambia el código, no se vuelven a descargar paquetes.
- `node:24-slim` usa glibc, como el entorno donde se generó `package-lock.json`. Alpine usa musl y puede fallar con dependencias nativas.
- Sin root, una vulnerabilidad en la app tiene muy pocos permisos dentro del contenedor.
- Leer `PORT` al arrancar cumple lo que pide Render sin que la aplicación conozca a Render. Con `exec`, la app recibe la señal de apagado y termina ordenadamente.
- Excluir `.env` del contexto impide que la contraseña de la base termine dentro de una capa de la imagen.
- El servicio en Compose deja documentado y reproducible cómo correr la imagen contra una base real.

**Consecuencias.** La imagen ocupa unos 350 MB en disco. Al arrancar, Npgsql registra que no encuentra `libgssapi_krb5.so.2`, la biblioteca de Kerberos; no afecta porque la autenticación es por contraseña. Después de `docker compose up`, la app tarda unos segundos en aceptar conexiones.

<a id="dt-13"></a>

### DT-13 · Integración continua con GitHub Actions

**Contexto.** Antes de la CI, cada comprobación dependía de ejecutarla a mano. Se necesitaba una verificación automática y obligatoria antes de integrar cambios.

**Decisión.**

- Un workflow (`.github/workflows/ci.yml`) con dos jobs en paralelo:
  - **Backend:** restore, build en Release, pruebas y `dotnet format --verify-no-changes`. El SDK se instala desde `global.json`.
  - **Frontend:** Node 24 con caché de npm, `npm ci`, lint, `format:check` y build.
- Se ejecuta en **push a `main`** y en **todos los pull requests**.
- Permisos mínimos: **`contents: read`**.
- El ruleset de `main` exige los checks **`Backend`** y **`Frontend`**, sin exigir que la rama esté actualizada con `main`.

**Por qué.**

- Como `main` solo cambia por PR, cada push a la rama de un PR ya dispara la CI. Ejecutarla también en todo push duplicaría el trabajo.
- Los chequeos de formato no estaban en los criterios mínimos, pero son baratos y evitan que el estilo se degrade.
- Exigir la rama actualizada obligaría a sincronizarla cada vez que `main` avance. En un proyecto de una persona es fricción sin beneficio claro.
- El runner usa `ubuntu-latest` sin fijar versión: las herramientas se instalan con sus propias acciones y dependen poco del sistema base.

**Consecuencias.** Si GitHub Actions no puede ejecutarse, no se puede integrar nada en `main`. Ya ocurrió con un bloqueo de facturación de la cuenta, que impidió arrancar los jobs hasta resolverlo. El despliegue también espera a la CI (ver [DT-15](#dt-15)).

<a id="dt-14"></a>

### DT-14 · Base de datos de producción en Neon

**Contexto.** La aplicación necesita una base PostgreSQL siempre disponible, gratuita y cerca del servicio que la usa.

**Decisión.**

- Proyecto en **Neon**, región **AWS US East 1 (N. Virginia)**, con **PostgreSQL 18** y la rama `production`.
- Cadena de conexión con el formato de Npgsql, **`SSL Mode=VerifyFull`** y **`Channel Binding=Require`**.
- Una **sola cadena, con pooling** (host con `-pooler`), para la aplicación y para las migraciones.
- La cadena solo existe en la consola de Neon y como variable de entorno del servicio.

**Por qué.**

- Virginia es una región que ofrecen Neon y Render, y la más cercana a Costa Rica de las disponibles en ambos. Tener la app y la base en la misma región evita latencia en cada consulta.
- `VerifyFull` cifra la conexión y además comprueba que el certificado corresponde al servidor, lo que protege contra suplantación. Es el formato que recomienda Neon para .NET.
- Neon recomienda la conexión directa para migraciones porque algunas herramientas no funcionan con PgBouncer en modo transacción. Con Npgsql, el bloqueo de migraciones de EF Core es un `LOCK TABLE` dentro de la transacción, que sí funciona a través del pooler. Así basta con un secreto.

**Consecuencias.** La región no se puede cambiar sin migrar los datos. El plan gratuito apaga el cómputo cuando no hay actividad: la primera consulta después tarda más (en la prueba, cerca de 5,6 segundos contando el arranque de la app). Hay que vigilar el consumo de cómputo, porque el health check periódico consulta la base. Cuando las migraciones pasen al pipeline (F2-06), se podrá usar la conexión directa para ellas.

<a id="dt-15"></a>

### DT-15 · Despliegue en Render

**Contexto.** La fase 0 termina con la aplicación pública leyendo y escribiendo en la base de producción.

**Decisión.**

- **Web service con Docker** en Render, desde la rama `main`, región **Virginia (US East)** y plan gratuito.
- **Auto-deploy "After CI Checks Pass"**: Render despliega un commit de `main` solo después de que su CI pasa.
- **`/health`** como health check del servicio.
- Variables de entorno: **`ConnectionStrings__Batazo`** y **`ASPNETCORE_ENVIRONMENT=Production`**.
- **Migraciones al arrancar**: `ApplyMigrationsAsync`, en Infrastructure, las aplica antes de atender peticiones. Si fallan, la aplicación no arranca.
- **Encabezados reenviados** (`X-Forwarded-For` y `X-Forwarded-Proto`) como primer middleware, aceptándolos de cualquier origen (`KnownIPNetworks` y `KnownProxies` vacíos).

**Por qué.**

- Render construye la imagen desde el Dockerfile del repositorio, así que no hace falta un registro de imágenes aparte.
- Esperar a la CI garantiza que nunca llega a producción un commit que no pasó las comprobaciones.
- Con el health check, una versión nueva que no responde no reemplaza a la que funciona.
- Aplicar las migraciones al arrancar es la opción del plan gratuito, donde el comando previo al despliegue (*pre-deploy*) es de pago. Es temporal: en F2-06 pasan al pipeline.
- Render termina el HTTPS en su balanceador y reenvía la petición por HTTP. Sin los encabezados reenviados, la app vería el esquema y la IP del proxy, y construiría URL con `http://`. Las IP del proxy no son fijas y el contenedor solo es accesible a través de él, así que se aceptan de cualquier origen.

**Consecuencias.** El plan gratuito duerme el servicio tras 15 minutos sin tráfico, y la primera visita después tarda en responder. El health check de Render llega directo al contenedor, sin encabezados reenviados, y genera el aviso "Failed to determine the https port"; se resuelve en F1-18. Si la versión nueva no pasa el health check, por ejemplo porque falló una migración, Render cancela el deploy y mantiene la anterior, según su documentación. No se ha probado en el plan gratuito. Si la migración se aplica pero la app falla después, la versión anterior queda corriendo con el esquema nuevo.

<a id="dt-16"></a>

### DT-16 · Contrato de errores de la API

**Contexto.** Los errores de los controladores ya eran ProblemDetails, pero una excepción no controlada no tenía un manejador propio, las respuestas de error sin cuerpo (como un 404 de un archivo inexistente) llegaban vacías y no estaba definido qué significa cada código HTTP en Batazo.

**Decisión.**

- **Todo error de la API responde con ProblemDetails** (RFC 9457) e incluye `traceId`. `AddProblemDetails` registra el servicio común que usan los controladores, `Results.Problem` y los middleware de errores.
- **Excepciones no controladas:** fuera de desarrollo, `UseExceptionHandler` responde un 500 genérico y el detalle queda en los logs. En desarrollo se usa la página de excepciones para desarrolladores.
- **Errores sin cuerpo:** `UseStatusCodePages` los convierte en ProblemDetails.
- **Significado de cada código:**

| Código | Cuándo se usa | Quién lo produce |
| --- | --- | --- |
| 400 Bad Request | La solicitud no tiene el formato correcto (campo obligatorio vacío, valor fuera de rango) o incumple una regla de negocio sobre los datos enviados | Validación del DTO, con `errors` por campo; o el dominio, con `code` |
| 401 Unauthorized | No hay sesión iniciada o expiró | Autenticación |
| 403 Forbidden | Hay sesión, pero el usuario no tiene permiso para esa acción sobre un recurso que sí puede ver (por ejemplo, un miembro que no administra la quiniela intenta expulsar a otro) | Autorización |
| 404 Not Found | El recurso no existe, **o el usuario no es miembro de la quiniela** a la que pertenece | Controladores y autorización |
| 409 Conflict | La operación choca con el estado actual: un dato único repetido (nombre de usuario), una predicción sobre un partido ya cerrado, unirse a una quiniela de la que ya es miembro | El dominio, con `code` |
| 429 Too Many Requests | Se superó el límite de solicitudes | Limitador de solicitudes |
| 500 Internal Server Error | Un fallo inesperado: la base no responde, un error de programación | Manejador global |

- **Errores de negocio con código propio:** además del código HTTP, llevan un campo `code` estable, en inglés porque es un identificador, con el formato `module.reason`, en minúsculas y con guiones (`prediction.closed`, `user.username-taken`). El catálogo crece con cada historia; el mecanismo con el que el dominio informa estos errores se decide con la primera regla de negocio.
- **Excepción consciente:** `/health` responde texto plano (`Healthy` o `Unhealthy`), porque lo consume la plataforma de despliegue, no los clientes de la API.

**Por qué.**

- Un solo formato permite que el frontend interprete cualquier error con el mismo código.
- El `traceId` en cada respuesta permite relacionar un error que ve un usuario con su registro en los logs.
- En producción nunca se exponen trazas, mensajes internos ni SQL: revelan cómo está construido el sistema y el cliente no puede hacer nada con ellos.
- Responder 404 a quien no es miembro evita confirmar que una quiniela existe.
- El código HTTP indica el tipo de problema, pero no cuál. El campo `code` permite que el frontend y las pruebas distingan errores concretos sin depender del texto del mensaje.

**Consecuencias.**

- Un archivo estático inexistente también responde ProblemDetails en JSON.
- Hoy los logs de consola no incluyen el `traceId`, así que todavía no se puede buscar un error a partir de él. Se resuelve con la salida JSON de los logs (F1-03).
- Una sola excepción de base de datos genera tres entradas de error en los logs (EF Core y el manejador global). Se revisa al configurar los niveles de log (F1-03).
- Los mensajes de validación se escriben en español en cada DTO; ver [DT-17](#dt-17).

<a id="dt-17"></a>

### DT-17 · Validación de entrada

**Contexto.** La validación con atributos ya funcionaba, pero los mensajes salían en inglés, las claves de `errors` usaban el nombre de la propiedad de C# (`Message`) en vez del nombre del JSON (`message`), y un JSON mal formado devolvía mensajes con nombres de clases internas, posiciones del texto y el nombre del parámetro del controlador.

**Decisión.**

- **Formato en los DTO, reglas de negocio en el dominio.** Las anotaciones nativas de `System.ComponentModel.DataAnnotations` comprueban la forma de los datos (obligatorio, longitud, rango, formato). Lo que depende del estado del sistema, como si una predicción sigue abierta, va en el dominio. Sin FluentValidation.
- **Cada anotación lleva su `ErrorMessage` en español**, porque el frontend muestra ese texto tal cual junto al campo. En los mensajes se usan los marcadores del atributo en vez de repetir valores (`{1}` para la longitud en `MaxLength`).
- **Los DTO de entrada son records con propiedades `init`**, con los atributos sobre cada propiedad. Los DTO de salida, que no se validan, pueden ser records posicionales.
- **Las claves de `errors` usan el nombre del JSON**, gracias a `SystemTextJsonValidationMetadataProvider`.
- **Sin `[Required]` implícito** (`SuppressImplicitRequiredAttributeForNonNullableReferenceTypes`): todo campo obligatorio lleva su `[Required]` explícito.
- **Los errores al leer el JSON no exponen detalles** (`AllowInputFormatterExceptionMessages = false`), y el cuerpo vacío tiene un mensaje en español.
- **Idioma:** los identificadores (claves de `errors`, `code` de los errores de negocio, nombres en el código) van en inglés; los textos para el usuario, en español.

**Por qué.**

- La aplicación es solo en español, así que es más simple que la API mande el texto final que mantener un diccionario aparte en el frontend.
- Con un record posicional, los atributos quedan en el parámetro del constructor y no en la propiedad, y `SystemTextJsonValidationMetadataProvider` no los renombra. Con propiedades, el nombre de la clave coincide con el JSON y el frontend puede marcar el campo correcto.
- El `[Required]` implícito de los tipos no anulables genera mensajes en inglés y errores sobre el parámetro del controlador. Hacerlo explícito deja cada regla visible en el DTO.
- Los mensajes de System.Text.Json revelan cómo está construida la API sin ayudar al cliente.

**Consecuencias.**

- Las propiedades de texto obligatorias se declaran con `= string.Empty` para cumplir la nulabilidad; `[Required]` sigue rechazando el texto vacío. No se usa el modificador `required` de C#, porque System.Text.Json lo aplica al leer el JSON y el error llegaría como un error de formato, sin el mensaje en español.
- Un JSON mal formado o con un tipo incorrecto responde con el texto genérico `The input was not valid.`, en inglés. No es configurable sin reemplazar la fábrica de respuestas de validación, y el frontend nunca lo provoca, así que se acepta.

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
| [TD-06](#td-06) | Persistence with EF Core and PostgreSQL | Oct 18, 2026 |
| [TD-07](#td-07) | Configuration and secrets | Oct 18, 2026 |
| [TD-08](#td-08) | Backend build and code quality | Oct 17, 2026 |
| [TD-09](#td-09) | API conventions | Oct 18, 2026 |
| [TD-10](#td-10) | Frontend tooling | Oct 18, 2026 |
| [TD-11](#td-11) | Serving the frontend from ASP.NET Core | Oct 19, 2026 |
| [TD-12](#td-12) | Application Docker image | Oct 19, 2026 |
| [TD-13](#td-13) | Continuous integration with GitHub Actions | Oct 19, 2026 |
| [TD-14](#td-14) | Production database on Neon | Oct 19, 2026 |
| [TD-15](#td-15) | Deployment on Render | Oct 19, 2026 |
| [TD-16](#td-16) | API error contract | Oct 21, 2026 |
| [TD-17](#td-17) | Input validation | Oct 21, 2026 |

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

**Consequences.** Every commit message must make sense on its own, since all of them end up in `main`. Since KAN-30, the ruleset also requires CI to pass before merging (see [TD-13](#td-13)).

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

<a id="td-06"></a>

### TD-06 · Persistence with EF Core and PostgreSQL

**Context.** TD-01 chose EF Core and PostgreSQL. The version, the schema conventions and how persistence is registered without the API depending on its details were still open.

**Decision.**

- **PostgreSQL 18** in every environment: the `postgres:18` image locally and the same major version in production.
- **EF Core 10 with Npgsql** and **`snake_case`** names through `UseSnakeCaseNamingConvention` (the `EFCore.NamingConventions` package). Classes stay in PascalCase in C#.
- Each entity is configured in its own **`IEntityTypeConfiguration<T>`** class, not inside the `DbContext`.
- Infrastructure exposes an **`AddInfrastructure`** method that registers the `DbContext` and its health check. The API only calls it.

**Rationale.**

- Using the same major version locally and in production avoids behavior differences between environments.
- PostgreSQL folds unquoted identifiers to lowercase. With `snake_case`, tables and columns can be queried in SQL without quotes (`ping_records.created_at`), the usual PostgreSQL convention.
- Configuring each entity separately keeps the `DbContext` small as the model grows.
- With `AddInfrastructure`, EF Core details stay inside Infrastructure and `Program.cs` does not need to know them.

**Consequences.** Migrations produce `snake_case` names, including the history table (`__EFMigrationsHistory` with `migration_id` and `product_version` columns). Changing the convention later would mean renaming the whole schema.

<a id="td-07"></a>

### TD-07 · Configuration and secrets

**Context.** The repository is public. The connection string and passwords cannot be committed, yet every environment needs them.

**Decision.**

- **Development:** the `ConnectionStrings:Batazo` connection string lives in **user-secrets**, outside the project folder.
- **Local Docker Compose:** PostgreSQL credentials come from an **untracked `.env`**. The repository only contains **`.env.example`** with sample values. Compose fails if `POSTGRES_PASSWORD` is missing, and the database port is only published on `127.0.0.1`.
- **Production:** service environment variables such as `ConnectionStrings__Batazo` and `ASPNETCORE_ENVIRONMENT`.
- The API **refuses to start** without a connection string: it throws an exception with a clear message instead of failing later.

**Rationale.**

- User-secrets and `.env` keep secrets out of the repository without code changes: ASP.NET Core reads the same key from any configuration source.
- Environment variables are the standard way to configure containers and cloud services. The double underscore (`__`) is how .NET represents configuration sections (`:`) in environment variables.
- Failing at startup makes a configuration error obvious on the first deploy, not on the first request.

**Consequences.** Anyone who clones the repository must create their `.env` from `.env.example` and set up user-secrets, as described in the environment guide. User-secrets is not encrypted: it is a JSON file in the user's profile, meant for development only.

<a id="td-08"></a>

### TD-08 · Backend build and code quality

**Context.** The project is built on the development machine, in CI and inside Docker. All three builds must produce the same result, and problems should surface early.

**Decision.**

- **`global.json`** pins SDK `10.0.112` with `rollForward: latestFeature`.
- **`Directory.Build.props`** enables nullable reference types and **`TreatWarningsAsErrors`** for every project.
- **Central Package Management** (`Directory.Packages.props`): NuGet package versions are declared in one place.
- **`.editorconfig`** defines the style: UTF-8, LF line endings, indentation and C# conventions. `dotnet format --verify-no-changes` enforces it.
- The **migrations folder is marked as generated code** (`generated_code = true`), since EF Core creates those files with its own style and as UTF-8 with BOM.

**Rationale.**

- `latestFeature` accepts later patches and feature bands of SDK 10.0, but never one older than the pinned version. CI reads the same `global.json`.
- A warning is often a real bug. Treating it as an error keeps them from piling up.
- With centralized versions, every project uses the same version of each package, and upgrading means changing one line.
- Migrations are not written by a person, so applying style rules to them only creates noise.

**Consequences.** Any warning breaks the build. For example, using the obsolete `KnownNetworks` API in .NET 10 instead of `KnownIPNetworks` prevents compilation. Migrations are still reviewed in every PR because they change the database; they are only excluded from the style check.

<a id="td-09"></a>

### TD-09 · API conventions

**Context.** Before building real features, the API needed a fixed pattern for how it receives and returns data, reports errors and handles time, so that every endpoint follows the same rules.

**Decision.**

- Controllers with **`[ApiController]`** and **explicit DTOs** for requests and responses. EF Core entities never leave the API.
- **Format validation with attributes** on the DTOs (`[Required]`, `[MaxLength]`). `[ApiController]` returns 400 automatically when they fail. Details are in [TD-17](#td-17).
- **ProblemDetails** as the format for every HTTP error.
- **`TimeProvider`** registered as a singleton to get the current time, always in UTC.
- **OpenAPI** is only published in development.
- **`/health`** with a health check that tests the database connection: 200 when it works, 503 when it does not.
- The **`api/pings`** endpoint and its table are **temporary**: they proved the full chain in phase 0 and are removed in phase 1.

**Rationale.**

- DTOs separate the HTTP contract from the data model. A database change does not break clients, and internal fields are never exposed by accident.
- ProblemDetails is a standard (RFC 9457), and ASP.NET Core produces it with no extra code.
- Asking `TimeProvider` for the time instead of calling `DateTime.UtcNow` directly lets tests control time. That is key to testing the exact moment predictions lock. Npgsql also only accepts zero-offset instants in `timestamptz` columns.
- Not publishing OpenAPI in production reduces what is exposed about the API.
- A health check that ignores the database would report everything as fine while the database is down.

**Consequences.** Every entity has to be mapped to its DTO. PostgreSQL stores instants with microsecond precision and .NET with 100-nanosecond precision, so a value read back from the database can differ in the last digit from the one held in memory; tests that compare instants must account for that. The common format for every error is defined in [TD-16](#td-16).

<a id="td-10"></a>

### TD-10 · Frontend tooling

**Context.** TD-01 chose React with TypeScript and Vite. Frontend code quality and how the frontend talks to the API during development were still open.

**Decision.**

- A project in **`web/`** created from Vite's official React with TypeScript template, with **TypeScript in strict mode**.
- **ESLint** with the template's configuration (TypeScript and React hooks rules), instead of Oxlint.
- **Prettier** for formatting, with `eslint-config-prettier` so ESLint does not apply formatting rules that clash with it. `format` and `format:check` scripts.
- **Vite proxy** in development: requests to `/api` are forwarded to the local API on port 5224.

**Rationale.**

- Strict mode catches at compile time errors that would otherwise show up in the browser.
- ESLint is the most mature option, has the plugin ecosystem the template relies on (`typescript-eslint` and the React hooks rules) and comes preconfigured. Oxlint is faster, but at this project size speed is not a problem.
- Keeping formatting (Prettier) apart from code quality (ESLint) prevents two tools from contradicting each other.
- With the proxy, the browser sees the frontend and the API on the same origin, just like in production. No CORS is needed, and the phase 1 cookies will behave the same in development.

**Consequences.** Development requires two processes, the API and the Vite dev server. CI runs lint, the format check and the build, which includes type checking.

<a id="td-11"></a>

### TD-11 · Serving the frontend from ASP.NET Core

**Context.** TD-01 established that the API serves the React build. It remained to decide how that build reaches the published app and how client routes coexist with API routes.

**Decision.**

- **`UseStaticFiles`** serves the files in `wwwroot`, instead of `MapStaticAssets`.
- An **`/api/{**path}`** route returns **404 with ProblemDetails** for any API route that does not exist.
- **`MapFallbackToFile("index.html")`** returns the frontend for client routes such as `/quinielas/5`.
- An MSBuild target, **`PublishFrontend`**, runs `npm ci` and `npm run build` on publish and adds `web/dist` to the output under `wwwroot`. It is turned off with `-p:BuildFrontend=false`. The build is never copied into the source `wwwroot` folder.

**Rationale.**

- `MapStaticAssets` works with the files it knows about when the .NET project is built. The Vite build is added later, on publish or inside Docker, so `UseStaticFiles`, which serves whatever is on disk, is a better fit.
- Without the `/api` fallback, a missing API route would return the React HTML with a 200, and the client could not tell it was an error.
- The `index.html` fallback lets React Router resolve routes in the browser. It does not match paths with an extension, so a missing file returns 404.
- With the target, `dotnet publish` produces the complete app in one command, and the repository holds no generated files.

**Consequences.** `dotnet publish` requires Node, unless `BuildFrontend=false` is set. Because of the fallback, an unsupported method on an existing route, such as `GET /api/pings`, returns 404 instead of 405.

<a id="td-12"></a>

### TD-12 · Application Docker image

**Context.** The app is deployed as a container. The image had to be small, secure and behave the same locally and on Render.

**Decision.**

- A **multi-stage Dockerfile**:
  - `frontend` (`node:24-slim`) builds React.
  - `backend` (`sdk:10.0`) restores in its own layer and publishes with `-p:BuildFrontend=false`.
  - `final` (`aspnet:10.0`) only contains the published output and the React build in `wwwroot`.
- The final image runs as the base image's **non-root user** (`USER $APP_UID`).
- The **`ENTRYPOINT`** maps the `PORT` variable to `ASPNETCORE_HTTP_PORTS`, defaulting to 8080, and uses `exec` so `dotnet` is the main process.
- **`.dockerignore`** excludes `.env`, `bin`, `obj`, `node_modules`, `web/dist`, `.git`, `tests` and `docs`.
- **Compose** includes an `app` service under the `app` profile, connected to the database over the internal network (`Host=db`).

**Rationale.**

- With several stages, the final image carries no Node, SDK or source code.
- Copying dependency files first takes advantage of the layer cache: if only code changes, packages are not downloaded again.
- `node:24-slim` uses glibc, like the environment where `package-lock.json` was generated. Alpine uses musl and can break native dependencies.
- Without root, a vulnerability in the app has very few permissions inside the container.
- Reading `PORT` at startup meets Render's requirement without the app knowing about Render. With `exec`, the app receives the shutdown signal and stops gracefully.
- Excluding `.env` from the build context keeps the database password out of every image layer.
- The Compose service documents a reproducible way to run the image against a real database.

**Consequences.** The image takes about 350 MB on disk. On startup, Npgsql logs that it cannot find `libgssapi_krb5.so.2`, the Kerberos library; it has no effect because authentication uses a password. After `docker compose up`, the app takes a few seconds to accept connections.

<a id="td-13"></a>

### TD-13 · Continuous integration with GitHub Actions

**Context.** Before CI, every check depended on running it by hand. An automatic, mandatory check was needed before integrating changes.

**Decision.**

- A workflow (`.github/workflows/ci.yml`) with two parallel jobs:
  - **Backend:** restore, Release build, tests and `dotnet format --verify-no-changes`. The SDK is installed from `global.json`.
  - **Frontend:** Node 24 with npm caching, `npm ci`, lint, `format:check` and build.
- It runs on **pushes to `main`** and on **every pull request**.
- Minimal permissions: **`contents: read`**.
- The `main` ruleset requires the **`Backend`** and **`Frontend`** checks, without requiring the branch to be up to date with `main`.

**Rationale.**

- Since `main` only changes through PRs, every push to a PR branch already triggers CI. Running it on every push as well would duplicate the work.
- The format checks were not in the minimum criteria, but they are cheap and keep the style from degrading.
- Requiring an up-to-date branch would force a sync every time `main` moves. For a one-person project that is friction without a clear benefit.
- The runner uses `ubuntu-latest` without pinning a version: tools are installed by their own actions and depend little on the base system.

**Consequences.** If GitHub Actions cannot run, nothing can be merged into `main`. This already happened when a billing lock on the account kept jobs from starting until it was resolved. Deployment also waits for CI (see [TD-15](#td-15)).

<a id="td-14"></a>

### TD-14 · Production database on Neon

**Context.** The app needs a PostgreSQL database that is always available, free and close to the service that uses it.

**Decision.**

- A **Neon** project in **AWS US East 1 (N. Virginia)**, with **PostgreSQL 18** and the `production` branch.
- A connection string in Npgsql format with **`SSL Mode=VerifyFull`** and **`Channel Binding=Require`**.
- A **single pooled connection string** (host with `-pooler`) for both the app and migrations.
- The string only exists in the Neon console and as a service environment variable.

**Rationale.**

- Virginia is offered by both Neon and Render and is the closest of their shared regions to Costa Rica. Keeping the app and the database in the same region avoids latency on every query.
- `VerifyFull` encrypts the connection and also checks that the certificate matches the server, which protects against impersonation. It is the format Neon recommends for .NET.
- Neon recommends direct connections for migrations because some tools do not work with PgBouncer in transaction mode. With Npgsql, EF Core's migration lock is a `LOCK TABLE` inside the transaction, which does work through the pooler. One secret is enough.

**Consequences.** The region cannot be changed without migrating the data. The free plan suspends compute when idle: the first query afterwards is slower (about 5.6 seconds in testing, including app startup). Compute usage needs watching, since the periodic health check queries the database. Once migrations move to the pipeline (F2-06), they can use the direct connection.

<a id="td-15"></a>

### TD-15 · Deployment on Render

**Context.** Phase 0 ends with the public app reading from and writing to the production database.

**Decision.**

- A **Docker web service** on Render, from the `main` branch, in the **Virginia (US East)** region, on the free plan.
- **Auto-deploy "After CI Checks Pass"**: Render deploys a `main` commit only after its CI passes.
- **`/health`** as the service health check.
- Environment variables: **`ConnectionStrings__Batazo`** and **`ASPNETCORE_ENVIRONMENT=Production`**.
- **Migrations on startup**: `ApplyMigrationsAsync`, in Infrastructure, applies them before serving requests. If they fail, the app does not start.
- **Forwarded headers** (`X-Forwarded-For` and `X-Forwarded-Proto`) as the first middleware, accepted from any source (`KnownIPNetworks` and `KnownProxies` cleared).

**Rationale.**

- Render builds the image from the repository's Dockerfile, so no separate image registry is needed.
- Waiting for CI guarantees that no commit that failed the checks reaches production.
- With the health check, a new version that does not respond never replaces the working one.
- Applying migrations on startup is the free-plan option, since the pre-deploy command is a paid feature. It is temporary: they move to the pipeline in F2-06.
- Render terminates HTTPS at its load balancer and forwards requests over HTTP. Without forwarded headers, the app would see the proxy's scheme and IP and would build URLs with `http://`. The proxy's addresses are not fixed and the container is only reachable through it, so headers are accepted from any source.

**Consequences.** The free plan puts the service to sleep after 15 minutes without traffic, and the first visit afterwards is slow. Render's health check reaches the container directly, without forwarded headers, and triggers the "Failed to determine the https port" warning; this is addressed in F1-18. If the new version fails its health check, for example because a migration failed, Render cancels the deploy and keeps the previous one, according to its documentation. This has not been tested on the free plan. If a migration is applied but the app fails afterwards, the previous version keeps running against the new schema.

<a id="td-16"></a>

### TD-16 · API error contract

**Context.** Controller errors were already ProblemDetails, but unhandled exceptions had no dedicated handler, error responses without a body (such as a 404 for a missing file) went out empty, and the meaning of each HTTP status code in Batazo was not defined.

**Decision.**

- **Every API error responds with ProblemDetails** (RFC 9457) and includes a `traceId`. `AddProblemDetails` registers the shared service used by controllers, `Results.Problem` and the error middleware.
- **Unhandled exceptions:** outside development, `UseExceptionHandler` returns a generic 500 and the details go to the logs. Development uses the developer exception page.
- **Errors without a body:** `UseStatusCodePages` turns them into ProblemDetails.
- **Meaning of each status code:**

| Code | When it is used | Produced by |
| --- | --- | --- |
| 400 Bad Request | The request is malformed (a required field is empty, a value is out of range) or breaks a business rule about the submitted data | DTO validation, with per-field `errors`; or the domain, with a `code` |
| 401 Unauthorized | There is no session, or it expired | Authentication |
| 403 Forbidden | The user is signed in but lacks permission for that action on a resource they can see (for example, a member who does not manage the pool tries to remove someone) | Authorization |
| 404 Not Found | The resource does not exist, **or the user is not a member of the pool** it belongs to | Controllers and authorization |
| 409 Conflict | The operation clashes with the current state: a duplicate unique value (username), a prediction on a match that has already locked, joining a pool the user already belongs to | The domain, with a `code` |
| 429 Too Many Requests | The request limit was exceeded | Rate limiter |
| 500 Internal Server Error | An unexpected failure: the database is down, a programming error | Global handler |

- **Business errors with their own code:** besides the HTTP status, they carry a stable `code` field, in English since it is an identifier, formatted as `module.reason`, lowercase with hyphens (`prediction.closed`, `user.username-taken`). The catalog grows with each story; how the domain reports these errors is decided with the first business rule.
- **Deliberate exception:** `/health` responds with plain text (`Healthy` or `Unhealthy`), since it is consumed by the hosting platform, not by API clients.

**Rationale.**

- A single format lets the frontend handle any error with the same code.
- A `traceId` on every response links an error a user sees to its log entry.
- Production never exposes stack traces, internal messages or SQL: they reveal how the system is built and the client cannot act on them.
- Returning 404 to non-members avoids confirming that a pool exists.
- The HTTP status says what kind of problem occurred, not which one. The `code` field lets the frontend and tests tell specific errors apart without relying on message text.

**Consequences.**

- A missing static file also responds with JSON ProblemDetails.
- Console logs do not include the `traceId` yet, so an error cannot be looked up from it. This is addressed by JSON log output (F1-03).
- A single database exception produces three error entries in the logs (EF Core and the global handler). Log levels are reviewed in F1-03.
- Validation messages are written in Spanish on each DTO; see [TD-17](#td-17).

<a id="td-17"></a>

### TD-17 · Input validation

**Context.** Attribute validation already worked, but messages came out in English, `errors` keys used the C# property name (`Message`) instead of the JSON name (`message`), and malformed JSON returned messages with internal class names, text positions and the controller parameter name.

**Decision.**

- **Format in DTOs, business rules in the domain.** Native `System.ComponentModel.DataAnnotations` attributes check the shape of the data (required, length, range, format). Anything that depends on system state, such as whether a prediction is still open, belongs in the domain. No FluentValidation.
- **Every attribute carries a Spanish `ErrorMessage`**, since the frontend shows that text as-is next to the field. Messages use the attribute's placeholders instead of repeating values (`{1}` for the length in `MaxLength`).
- **Input DTOs are records with `init` properties**, with attributes on each property. Output DTOs, which are not validated, can be positional records.
- **`errors` keys use the JSON name**, through `SystemTextJsonValidationMetadataProvider`.
- **No implicit `[Required]`** (`SuppressImplicitRequiredAttributeForNonNullableReferenceTypes`): every required field carries an explicit `[Required]`.
- **JSON read errors expose no details** (`AllowInputFormatterExceptionMessages = false`), and an empty body has a Spanish message.
- **Language:** identifiers (`errors` keys, business error `code` values, names in code) are in English; user-facing text is in Spanish.

**Rationale.**

- The app is Spanish only, so having the API send the final text is simpler than keeping a separate dictionary in the frontend.
- In a positional record, attributes land on the constructor parameter rather than the property, and `SystemTextJsonValidationMetadataProvider` does not rename them. With properties, the key matches the JSON and the frontend can highlight the right field.
- The implicit `[Required]` for non-nullable types produces English messages and errors about the controller parameter. Making it explicit keeps every rule visible in the DTO.
- System.Text.Json messages reveal how the API is built without helping the client.

**Consequences.**

- Required text properties are declared with `= string.Empty` to satisfy nullability; `[Required]` still rejects empty text. The C# `required` modifier is not used, because System.Text.Json enforces it while reading the JSON and the error would arrive as a format error, without the Spanish message.
- Malformed JSON or a wrong type responds with the generic text `The input was not valid.`, in English. It cannot be configured without replacing the validation response factory, and the frontend never triggers it, so it is accepted.

[Back to top](#registro-de-decisiones-técnicas)
