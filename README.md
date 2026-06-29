
# Vezzi

Plataforma web para la gestión integral de pequeñas tiendas locales. Permite administrar inventario, realizar ventas rápidas, gestionar clientes, procesar pagos y más.

## Stack Tecnológico

| Tecnología    | Propósito                          |
| ------------- | ---------------------------------- |
| **NestJS**    | Framework backend (Node.js)        |
| **TypeORM**   | ORM para la base de datos          |
| **PostgreSQL**| Base de datos relacional           |
| **Docker**    | Contenedor de la base de datos     |
| **HTML/CSS/JS** | Frontend (vanilla)              |
| **bcrypt**    | Hashing de contraseñas             |
| **class-validator / class-transformer** | Validación de datos |

## Módulos

- **Usuarios** — Gestión de usuarios del sistema con roles
- **Roles** — Definición y asignación de roles
- **Productos** — Catálogo de productos con precios y stock
- **Categorías** — Clasificación de productos
- **Clientes** — Registro y gestión de clientes
- **Ventas** — Registro de ventas con detalle
- **Detalle de Ventas** — Desglose de productos por venta
- **Pagos** — Registro y seguimiento de pagos
- **Historial de Stock** — Control de movimientos de inventario

## Requisitos

- Node.js >= 18
- Docker y Docker Compose
- npm

## Instalación y configuración

```bash
# 1. Clonar el repositorio
git clone https://github.com/CristianT71/Vezzi.git
cd Vezzi

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con los datos de conexión a PostgreSQL

# 3. Levantar la base de datos con Docker
docker compose up -d

# 4. Instalar dependencias
npm install

# 5. Iniciar el servidor en modo desarrollo
npm run start:dev
```

## Scripts disponibles

| Comando            | Descripción                               |
| ------------------ | ----------------------------------------- |
| `npm run start`    | Iniciar el servidor                       |
| `npm run start:dev`| Iniciar en modo desarrollo con hot-reload |
| `npm run start:prod` | Iniciar en producción                   |
| `npm run build`    | Compilar el proyecto                      |
| `npm run lint`     | Ejecutar linter                           |
| `npm run test`     | Ejecutar pruebas unitarias                |
| `npm run test:e2e` | Ejecutar pruebas end-to-end               |

## Variables de entorno

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=vezzi
```

## Estructura del proyecto

```
src/
├── categoria/        # CRUD de categorías
├── cliente/          # CRUD de clientes
├── detalle-venta/    # Detalle de ventas
├── historial-stock/  # Historial de movimientos de stock
├── pago/             # Gestión de pagos
├── producto/         # CRUD de productos
├── rol/              # Gestión de roles
├── usuario/          # Gestión de usuarios
├── venta/            # Registro de ventas
├── app.module.ts     # Módulo principal
└── main.ts           # Punto de entrada

Frontend/
├── acceso.html       # Pantalla de inicio de sesión
├── panel.html        # Panel principal
├── script.js         # Lógica del frontend
└── styles.css        # Estilos
```

## Licencia

Este proyecto es de uso privado.
