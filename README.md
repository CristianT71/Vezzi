
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

## Cómo empezar

```bash
# Clonar e ir al proyecto
git clone https://github.com/CristianT71/Vezzi.git
cd Vezzi

# Configurar variables de entorno
cp .env.example backend/.env

# Levantar la base de datos
docker compose up -d

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
