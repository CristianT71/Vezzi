
# Vezzi

Plataforma web para la gestión de pequeñas tiendas locales. Permite administrar inventario, clientes, ventas y pagos desde un solo lugar.

## Stack

| Tecnología    | Propósito                          |
| ------------- | ---------------------------------- |
| **NestJS**    | API backend                        |
| **Angular**   | Frontend                           |
| **TypeORM**   | ORM para la base de datos          |
| **PostgreSQL**| Base de datos                      |
| **Docker**    | Base de datos en contenedor        |
| **JWT**       | Autenticación                      |
| **bcrypt**    | Hashing de contraseñas             |

## Requisitos

- Node.js 18+
- Docker y Docker Compose
- npm
- DataGRID

## Cómo empezar

```bash
# Clonar e ir al proyecto
git clone https://github.com/CristianT71/Vezzi.git
cd Vezzi

# Configurar variables de entorno
cp .env.example backend/.env

# Levantar la base de datos
docker compose up --build -d

# Backend
cd backend
npm install
npm run start:dev

# Frontend (nueva terminal)
cd frontend
npm install
ng serve
```

## Variables de entorno (backend)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=vezzi
```

## Scripts del backend

| Comando                | Descripción                              |
| ---------------------- | ---------------------------------------- |
| `npm run start:dev`    | Iniciar con hot-reload                   |
| `npm run migration:run`| Aplicar migraciones                      |
| `npm run migration:generate` | Generar migración nueva           |
| `npm run build`        | Compilar                                 |
| `npm run lint`         | Linter                                   |

## Despliegue a producción

El backend + base de datos se despliegan en **Render** y el frontend en **Netlify**.

### Backend y base de datos (Render)

1. En Render: **New → Blueprint**, selecciona este repositorio (rama `main`). Detecta `render.yaml` en la raíz y crea el servicio web `vezzi-backend` y la base de datos `vezzi-db` automáticamente.
2. Completa las variables marcadas como secretas en el Blueprint:
   - `JWT_SECRET`: cadena aleatoria larga (ej. `openssl rand -hex 32`).
   - `SENDGRID_API_KEY` / `EMAIL_FROM`: credenciales de SendGrid para el envío de facturas y recordatorios de deuda (Gmail por SMTP no funciona en Render, ver nota abajo).
   - `ALLOWED_ORIGINS`: URL del frontend en Netlify (se completa después, ver abajo).
   - `APP_BASE_URL`: URL pública del propio backend en Render (ej. `https://vezzi-backend.onrender.com`).
   - `ADMIN_DEFAULT_PASSWORD`: contraseña real para el usuario admin que crea el seed (ver punto 4) — no la dejes en el valor de ejemplo.
3. Al desplegar, la build corre `npm install && npm run build && npm run migration:run`, así que las migraciones se aplican solas.
4. Base de datos nueva y sin datos: llama una vez a `POST /api/seed` para crear los roles y el usuario admin inicial (con la contraseña de `ADMIN_DEFAULT_PASSWORD`) — ver [Scripts del backend](#scripts-del-backend). El endpoint es público a propósito: en una base de datos nueva no existe todavía ningún admin con el que autenticarse, y es idempotente (no crea un segundo admin si ya existe uno).

> **Nota sobre el correo**: Render bloquea los puertos SMTP salientes (25/465/587) en su plan gratuito, así que el envío de correos por Gmail/SMTP nunca conecta desde producción (aunque funcione en local). Por eso el envío usa la API HTTPS de [SendGrid](https://sendgrid.com) en vez de SMTP — crea una cuenta gratis (100 correos/día), verifica un remitente individual (Settings → Sender Authentication → Single Sender) y genera una API key (Settings → API Keys) para `SENDGRID_API_KEY`.

### Frontend (Netlify)

1. En Netlify: **Add new site → Import an existing project**, selecciona el repo (rama `main`). Detecta `netlify.toml` (base `frontend`, build `npm run build`, publish `dist/frontend/browser`).
2. La URL del backend para producción está fija en `frontend/src/environments/environment.prod.ts` (usado solo en el build de producción vía `fileReplacements` de `angular.json`) — si cambia el nombre del servicio en Render, hay que actualizar ese archivo.
3. Una vez desplegado, vuelve a Render → `vezzi-backend` → Environment y pon `ALLOWED_ORIGINS` con la URL exacta de Netlify (sin `/` al final) para que el CORS deje pasar las peticiones del frontend.

## Estructura

```
backend/            # API con NestJS
  src/              # Código fuente
    auth/           # Autenticación JWT
    categoria/      # CRUD categorías
    cliente/        # CRUD clientes
    detalle-venta/  # Detalle de ventas
    historial-stock/# Movimientos de stock
    pago/           # Gestión de pagos
    producto/       # CRUD productos
    rol/            # Roles de usuario
    seed/           # Datos iniciales
    usuario/        # Gestión de usuarios
    venta/          # Registro de ventas
    common/         # DTOs y filtros compartidos
    config/         # Configuración de BD
    migrations/     # Migraciones TypeORM
frontend/           # Aplicación Angular
```
