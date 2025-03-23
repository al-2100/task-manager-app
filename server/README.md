# Task Manager – Backend

Welcome to the **Task Manager** backend! This Express server powers a productivity-focused platform that helps users manage projects and tasks to stay efficient and organized.

---

## Features
- **JWT Authentication** – Secure user registration and login.
- **Project & Task Management** – Create, update, and organize tasks within projects.
- **Dashboard Analytics** – View productivity metrics and task statistics at a glance.
- **User Preferences** – Support for dark mode and notification settings.
- **Task Priority System** – Organize tasks with Low, Medium, and High priority levels.
- **RESTful API** – Well-defined endpoints for easy integration with the React frontend or any third-party client.
- **Robust Testing** – Comprehensive unit and integration tests with Jest and Supertest.

---

## Architecture & Project Structure
This backend follows a **layered architecture** that clearly separates responsibilities:
1. **Routes** – Define API endpoints and map them to controllers.
2. **Controllers** – Handle HTTP requests, validate input, and respond with JSON data.
3. **Services** – Contain the business logic.
4. **Repositories** – Manage direct database interactions via Prisma.
5. **Middlewares** – Common utilities (e.g., auth checks).
6. **Database** – PostgreSQL, accessed securely with Prisma ORM.

Directory structure:
```bash
server/
│
├── controllers/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── prisma/
│   └── schema.prisma
├── .env
├── package.json
└── README.md
```

- **controllers/** – HTTP request handling (e.g., projectController.js).
- **middlewares/** – Reusable logic like `authMiddleware.js` for token verification.
- **repositories/** – Database operations (via Prisma), e.g., `projectRepository.js`.
- **routes/** – REST endpoints that map to controllers.
- **services/** – Business logic, e.g., `authService.js`.
- **prisma/** – Contains the database schema and migration files.

---

## Technologies
- **Node.js / Express.js** for building the RESTful server.
- **Prisma** for database interactions with PostgreSQL.
- **JWT** for secure authentication.
- **Jest / Supertest** for testing.

---

## Getting Started
### Prerequisites
- **Node.js v18**
- **PostgreSQL** instance
- **npm** or **yarn**

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root of the server folder (or wherever you prefer) with the following variables:
   ```bash
   DATABASE_URL=postgres://user:password@localhost:5432/pomodoro_db
   JWT_SECRET=some_secret_key
   ```
   Adjust the `DATABASE_URL` to match your PostgreSQL configuration.

3. **Run database migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start the server**:
   ```bash
   npm start
   ```
   The server will be available at [http://localhost:5000](http://localhost:5000).

---

## API Overview

- **Auth**
    - `POST /api/auth/register` – Register a new user.
    - `POST /api/auth/login` – Authenticate and receive a JWT token.

- **Projects**
    - `POST /api/projects` – Create a new project.
    - `GET /api/projects` – List all projects for the authenticated user.
    - `GET /api/projects/:id` – Retrieve a specific project by ID.
    - `PUT /api/projects/:id` – Update an existing project.
    - `DELETE /api/projects/:id` – Remove a project.

- **Tasks** (nested under projects)
    - `POST /api/projects/:projectId/tasks` – Create a new task under a project.
    - `GET /api/projects/:projectId/tasks` – List all tasks for a project.
    - `GET /api/projects/:projectId/tasks/:id` – Retrieve a specific task by ID.
    - `PUT /api/projects/:projectId/tasks/:id` – Update a task.
    - `DELETE /api/projects/:projectId/tasks/:id` – Remove a task.
    
- **Dashboard**
    - `GET /api/dashboard/summary` – Get user's dashboard summary including project stats and task metrics.

---

## Testing

- **How to Run Tests**:
  ```bash
  npm test
  ```
  This command runs all Jest tests and outputs the coverage report.

  This project has a 80% test coverage.

---