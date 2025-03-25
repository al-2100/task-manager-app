# Task Manager

This repository contains **both the frontend and backend** for the Task Manager application, a comprehensive tool for managing tasks and projects.

> 📌 **This README is available in spanish:**  
> 🇪🇸 [Español](README_es.md)

---

## Features
- **JWT Authentication** – Secure user registration and login.
- **Project and Task Management** – Create, update, view, and delete projects and tasks.
- **Analytical Dashboard** – Summary with productivity metrics and statistics.
- **Responsive Interface** – Adapts to mobile and desktop devices.
- **RESTful API** – Well-defined endpoints for frontend-backend integration.
- **Robust Testing** – Unit and integration testing with Jest and Supertest (Backend), and frontend testing tools.

---

## Project Structure

```bash
.
├── client/         # Frontend - React application with TypeScript
│   └── src/        # Frontend source code
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── App.tsx
├── server/         # Backend - Express server
│   ├── controllers/    # HTTP request handlers
│   ├── middlewares/    # Reusable functionality (e.g., auth)
│   ├── repositories/   # Database operations via Prisma
│   ├── routes/         # REST endpoint definitions
│   ├── services/       # Business logic
│   ├── prisma/         # Database schema and migrations
│   ├── app.js
│   └── .env
├── .github/        # GitHub configurations
│   └── workflows/  # CI/CD pipeline definitions
├── README.md
└── ...             # Other files and configurations
```

## Frontend

The frontend is built using React and TypeScript, offering a modern and interactive interface. Its key features include:

- **User authentication**: Registration and login using JWT.
- **Interactive dashboard**: Visualization of statistics and tasks.
- **Project and task management**: Creation, editing, and deletion.
- **Responsive interface with light/dark theme support**.
- **Backend communication**: Via organized API services.

**Main technologies**:

- React 18, TypeScript, React Router, React Hook Form, Zod, Tailwind CSS, Shadcn UI, Axios, date-fns, Lucide React.

For more details, see the README in the `client/` folder.


## Backend

The backend is an API server built with Node.js and Express, providing RESTful endpoints for managing users, projects, and tasks. Key features include:

- **JWT authentication**: Secure user registration and login.
- **Project and task management**: Endpoints for creating, updating, listing, and deleting.
- **Analytical dashboard**: Provides productivity metrics and statistics.
- **Layered architecture**: Clear separation of routes, controllers, services, and repositories.
- **Robust testing**: Unit and integration tests using Jest and Supertest.

**Main technologies**:

- Node.js, Express.js, Prisma, PostgreSQL, JWT, Jest, Supertest.

For more details, see the README in the `server/` folder.

## CI/CD Pipeline

This project includes automated CI/CD pipelines implemented with GitHub Actions:

- **Main Pipeline**: Runs tests and builds Docker images for both frontend and backend
- **PR Checks**: Runs linting on pull requests before merging

The pipelines verify:
- Backend tests with a real PostgreSQL database
- Frontend tests and build process
- Docker image builds to ensure containerization works correctly

## Getting Started

### Prerequisites

- **Node.js v18 or higher** (for local development)
- **PostgreSQL** (for local development)
- **npm, yarn, or pnpm**
- **Docker** and **Docker Compose** (for containerized deployment)

### Option 1: Local Development Setup

1. **Clone the repository**:

```bash
git clone <repository-URL>
cd <repository-name>
```

2. **Install dependencies**:

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. **Configure environment variables**:

**Frontend**: In the `client` folder, create a `.env` file:

```bash
VITE_API_URL=http://localhost:5000/api
```

**Backend**: In the `server` folder, create a `.env` file:

```bash
DATABASE_URL=postgres://user:password@localhost:5432/taskmanager_db
JWT_SECRET=your_secret_key
```

4. **Run database migrations**:

```bash
cd server
npx prisma migrate dev --name init
```

5. **Start the applications**:

```bash
# Start the backend server
cd server
npm start

# In a separate terminal, start the frontend
cd client
npm run dev
```

6. **Access the application**:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)

### Option 2: Docker Deployment

Using Docker Compose allows you to run all services (frontend, backend, and database) in containers without installing dependencies locally.

1. **Create environment files** (optional - defaults are provided in docker-compose.yml):

   **For the server**: Create a `.env` file in the `server` directory:

   ```
   NODE_ENV=production
   JWT_SECRET=your_jwt_secret_key
   DATABASE_URL=postgres://postgres:postgres@db:5432/taskmanager_db
   ```

   **For the client**: Create a `.env` file in the `client` directory:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

2. **Start the application stack**:

   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)

4. **Common Docker commands**:

   ```bash
   # View logs
   docker-compose logs -f

   # Stop services
   docker-compose down

   # Stop services and remove data volumes
   docker-compose down -v
   ```

   The PostgreSQL data is stored in a Docker volume named `taskmanager_data`, ensuring your data persists across container restarts.

## Testing

### Backend

To run backend tests:

```bash
cd server
npm test
```

Tests run with Jest and Supertest, displaying coverage reports.

### Frontend

Frontend tests are implemented using Jest and React Testing Library. Check the README in the `client/` folder for more details on their status and execution.

---

## License

This project is distributed under the MIT License.

---

