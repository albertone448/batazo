# Entorno de desarrollo

Esta guía deja listo un equipo para trabajar en Batazo. La lista de herramientas sirve en cualquier sistema operativo; los comandos están probados en **Ubuntu 24.04**. En otro sistema, instala las mismas herramientas con el método oficial de cada una.

## Herramientas necesarias

| Herramienta | Versión | Para qué sirve |
| --- | --- | --- |
| Git | Cualquiera reciente | Control de versiones |
| GitHub CLI (`gh`) | Cualquiera reciente | Clonar el repositorio y trabajar con GitHub desde la terminal |
| SDK de .NET | 10.0 | Compilar y ejecutar el backend |
| `dotnet-ef` | Compatible con .NET 10 | Crear y aplicar migraciones de Entity Framework Core |
| Node.js | 24 LTS | Vite, React y TypeScript |
| Docker Engine con Compose | Cualquiera reciente | PostgreSQL local y la imagen de despliegue |
| VS Code | Cualquiera reciente | Editor recomendado para C# y React |
| Postman | Cualquiera reciente | Probar los endpoints de la API |

No hace falta instalar PostgreSQL en el sistema: la base de datos local corre en un contenedor de Docker.

## 1. .NET 10 y dotnet-ef

En Ubuntu 24.04 el SDK viene del repositorio de Ubuntu. Microsoft ya no publica paquetes de .NET para esta versión en su propio repositorio ([documentación oficial](https://learn.microsoft.com/dotnet/core/install/linux-ubuntu)). Evita la versión Snap.

```bash
sudo apt-get update && sudo apt-get install -y dotnet-sdk-10.0
dotnet --version
```

La versión debe empezar con `10.0`. Después instala `dotnet-ef` y agrega la carpeta de herramientas globales al PATH:

```bash
dotnet tool install --global dotnet-ef
echo 'export PATH="$PATH:$HOME/.dotnet/tools"' >> ~/.bashrc && source ~/.bashrc
dotnet ef --version
```

Si `dotnet ef` no se encuentra, abre una terminal nueva y prueba otra vez.

## 2. Node.js con nvm

nvm instala Node dentro de tu usuario, así que `npm` nunca necesita `sudo`, y permite cambiar de versión con un comando.

1. Copia el comando de instalación de la sección "Install & Update Script" del repositorio oficial [nvm-sh/nvm](https://github.com/nvm-sh/nvm). Tiene la forma `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/vX.Y.Z/install.sh | bash`. Usa el de esa página para tener la versión más reciente.
2. Instala Node 24 y déjalo como predeterminado:

```bash
source ~/.bashrc
nvm install 24 && nvm alias default 24
node --version && npm --version && which node
```

`which node` debe mostrar una ruta dentro de `~/.nvm`. Si muestra una ruta de Anaconda o Miniconda, Conda está tapando a nvm. Desactiva su entorno automático y abre una terminal nueva:

```bash
conda config --set auto_activate_base false
```

## 3. Docker Engine

En Linux basta Docker Engine; Docker Desktop no hace falta. Estos pasos siguen la [documentación oficial de Docker](https://docs.docker.com/engine/install/ubuntu). Si algo no coincide, sigue esa página.

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Agrega tu usuario al grupo `docker` para usarlo sin `sudo`, y después **cierra sesión y vuelve a entrar**:

```bash
sudo usermod -aG docker $USER
```

Pertenecer al grupo `docker` equivale en la práctica a tener permisos de administrador, así que hazlo solo en tu propio equipo.

Comprueba la instalación y haz una prueba rápida de PostgreSQL con un contenedor temporal:

```bash
docker run hello-world && docker compose version
docker run --name pg-prueba -e POSTGRES_PASSWORD=prueba -p 5432:5432 -d postgres:17
sleep 5 && docker exec -it pg-prueba psql -U postgres -c "SELECT version();"
docker rm -f pg-prueba
```

Opcional: si no quieres que Docker arranque con el sistema, desactívalo y lo inicias con `sudo systemctl start docker` cuando lo necesites:

```bash
sudo systemctl disable docker.service containerd.service
```

## 4. Extensiones de VS Code

| Extensión | Identificador | Para qué |
| --- | --- | --- |
| C# Dev Kit | `ms-dotnettools.csdevkit` | Autocompletado, depuración, pruebas y explorador de la solución |
| ESLint | `dbaeumer.vscode-eslint` | Errores y malas prácticas en TypeScript |
| Prettier | `esbenp.prettier-vscode` | Formato del frontend |
| Container Tools | `ms-azuretools.vscode-containers` | Manejar contenedores de Docker |
| PostgreSQL | `ms-ossdata.vscode-pgsql` | Conectarse a la base y revisar tablas |
| EditorConfig | `EditorConfig.EditorConfig` | Formato de archivos común a todo el repositorio |
| Error Lens (opcional) | `usernamehw.errorlens` | Errores en la misma línea |
| GitLens (opcional) | `eamodio.gitlens` | Historial de Git en el editor |

Con VS Code cerrado:

```bash
for ext in ms-dotnettools.csdevkit dbaeumer.vscode-eslint esbenp.prettier-vscode ms-azuretools.vscode-containers ms-ossdata.vscode-pgsql EditorConfig.EditorConfig usernamehw.errorlens eamodio.gitlens; do code --install-extension "$ext"; done
```

## 5. Navegador y Postman

- Instala **React Developer Tools** en Chrome o Firefox desde la tienda de extensiones.
- En **Postman**, guarda las direcciones (`localhost` y la de producción) como variables de entorno en lugar de escribirlas en cada petición. La autenticación usa cookies, y Postman las conserva después del inicio de sesión.

## 6. Clonar el repositorio

```bash
gh auth login
gh repo clone <usuario>/batazo
cd batazo
```

Reemplaza `<usuario>` por el dueño del repositorio en GitHub.

## Comprobación final

En una terminal nueva, este comando debe mostrar una versión por herramienta, sin errores:

```bash
git --version && gh --version && dotnet --version && dotnet ef --version && node --version && npm --version && docker --version && docker compose version
```

Las instrucciones para ejecutar la aplicación se agregarán a medida que el proyecto avance.
