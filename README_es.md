# Gestor de Tareas

Este repositorio contiene **tanto el frontend como el backend** de la aplicación Gestor de Tareas, una herramienta integral para gestionar tareas y proyectos.

> 📌 **Este README está disponible en inglés:**  
> 🇺🇸 [English](README.md)

---

## Características
- **Autenticación JWT** – Registro e inicio de sesión seguros.
- **Gestión de proyectos y tareas** – Crear, actualizar, visualizar y eliminar proyectos y tareas.
- **Dashboard analítico** – Resumen con métricas y estadísticas de productividad.
- **Interfaz adaptable** – Compatible con dispositivos móviles y de escritorio.
- **API RESTful** – Endpoints claramente definidos para integración frontend-backend.
- **Pruebas robustas** – Pruebas unitarias y de integración con Jest y Supertest (Backend), y herramientas de pruebas para frontend.

---

## Estructura del Proyecto

```bash
.
├── client/         # Frontend - Aplicación React con TypeScript
│   └── src/        # Código fuente del frontend
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── App.tsx
├── server/         # Backend - Servidor Express
│   ├── controllers/    # Manejadores de solicitudes HTTP
│   ├── middlewares/    # Funcionalidad reutilizable (ej.: auth)
│   ├── repositories/   # Operaciones de base de datos con Prisma
│   ├── routes/         # Definiciones de endpoints REST
│   ├── services/       # Lógica de negocio
│   ├── prisma/         # Esquema y migraciones de base de datos
│   ├── app.js
│   └── .env
├── .github/        # Configuraciones de GitHub
│   └── workflows/  # Definiciones de pipelines CI/CD
├── README.md
└── ...             # Otros archivos y configuraciones
```

## Frontend

El frontend está construido con React y TypeScript, ofreciendo una interfaz moderna e interactiva. Sus características clave incluyen:

- **Autenticación de usuarios**: Registro e inicio de sesión mediante JWT.
- **Dashboard interactivo**: Visualización de estadísticas y tareas.
- **Gestión de proyectos y tareas**: Creación, edición y eliminación.
- **Interfaz adaptable con soporte para tema claro/oscuro**.
- **Comunicación con backend**: A través de servicios API organizados.

**Tecnologías principales**:

- React 18, TypeScript, React Router, React Hook Form, Zod, Tailwind CSS, Shadcn UI, Axios, date-fns, Lucide React.

Para más detalles, consulta el README en la carpeta `client/`.

## Backend

El backend es un servidor API construido con Node.js y Express, proporcionando endpoints RESTful para gestionar usuarios, proyectos y tareas. Sus características clave incluyen:

- **Autenticación JWT**: Registro e inicio de sesión seguros.
- **Gestión de proyectos y tareas**: Endpoints para crear, actualizar, listar y eliminar.
- **Dashboard analítico**: Proporciona métricas y estadísticas de productividad.
- **Arquitectura por capas**: Separación clara de rutas, controladores, servicios y repositorios.
- **Pruebas robustas**: Pruebas unitarias y de integración usando Jest y Supertest.

**Tecnologías principales**:

- Node.js, Express.js, Prisma, PostgreSQL, JWT, Jest, Supertest.

Para más detalles, consulta el README en la carpeta `server/`.

## Pipeline de CI/CD

Este proyecto incluye pipelines automatizados de CI/CD implementados con GitHub Actions:

- **Pipeline principal**: Ejecuta pruebas y construye imágenes Docker tanto para el frontend como para el backend.
- **Verificación de PR**: Ejecuta el lint en los pull requests antes de fusionarlos.

Los pipelines verifican:
- Pruebas del backend con una base de datos PostgreSQL real.
- Pruebas y proceso de construcción del frontend.
- Construcción de imágenes Docker para asegurar que la containerización funcione correctamente.


## Comenzando

### Requisitos previos

- **Node.js v18 o superior** (para desarrollo local)
- **PostgreSQL** (para desarrollo local)
- **npm, yarn o pnpm**
- **Docker** y **Docker Compose** (para despliegue en contenedores)

### Opción 1: Configuración local de desarrollo

1. **Clonar el repositorio**:

```bash
git clone <URL-repositorio>
cd <nombre-repositorio>
```

2. **Instalar dependencias**:

```bash
# Dependencias del frontend
cd client
npm install

# Dependencias del backend
cd ../server
npm install
```

3. **Configurar variables de entorno**:

**Frontend**: En la carpeta `client`, crea un archivo `.env`:

```bash
VITE_API_URL=http://localhost:5000/api
```

**Backend**: En la carpeta `server`, crea un archivo `.env`:

```bash
DATABASE_URL=postgres://user:password@localhost:5432/taskmanager_db
JWT_SECRET=tu_clave_secreta
```

4. **Ejecutar migraciones de base de datos**:

```bash
cd server
npx prisma migrate dev --name init
```

5. **Iniciar las aplicaciones**:

```bash
# Iniciar servidor backend
cd server
npm start

# En otra terminal, iniciar frontend
cd client
npm run dev
```

6. **Acceder a la aplicación**:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - API Backend: [http://localhost:5000](http://localhost:5000)

### Opción 2: Despliegue con Docker

Docker Compose permite ejecutar todos los servicios (frontend, backend y base de datos) en contenedores sin instalar dependencias localmente.

1. **Crear archivos de entorno** (opcional - por defecto están definidos en docker-compose.yml):

   **Servidor**: Crea un archivo `.env` en el directorio `server`:

   ```
   NODE_ENV=production
   JWT_SECRET=tu_clave_secreta_jwt
   DATABASE_URL=postgres://postgres:postgres@db:5432/taskmanager_db
   ```

   **Cliente**: Crea un archivo `.env` en el directorio `client`:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

2. **Iniciar la aplicación**:

   ```bash
   docker-compose up -d
   ```

3. **Acceder a la aplicación**:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - API Backend: [http://localhost:5000/api](http://localhost:5000/api)

4. **Comandos comunes de Docker**:

   ```bash
   # Ver registros
   docker-compose logs -f

   # Detener servicios
   docker-compose down

   # Detener servicios y eliminar volúmenes de datos
   docker-compose down -v
   ```

   Los datos de PostgreSQL se almacenan en un volumen Docker llamado `taskmanager_data`, lo que asegura que tus datos persistan.

## Pruebas

### Backend

Para ejecutar pruebas del backend:

```bash
cd server
npm test
```

Las pruebas corren con Jest y Supertest, mostrando informes de cobertura.

### Frontend

Las pruebas del frontend se implementan usando Jest y React Testing Library. Revisa el README en la carpeta `client/` para más detalles.

---

## Licencia

Este proyecto se distribuye bajo la Licencia MIT.

---

