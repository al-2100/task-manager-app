# Task Manager - Frontend

This repository contains the frontend for the Task Manager application, a modern tool for managing tasks and projects.

## ✨ Features

- **User Authentication** - Complete registration and login system
- **Interactive Dashboard** - Overview of tasks and projects with statistics
- **Project Management** - Creation, editing, and deletion of projects
- **Task Management** - Organization of tasks with priorities, dates, and statuses
- **Responsive Interface** - Adaptive design for mobile and desktop devices
- **Light/Dark Theme** - Support for user theme preferences
- **Visual Statistics** - Progress bars and completion metrics
- **Pomodoro Timer** - Built-in timer for productivity sessions

## 🛠️ Technologies

- **React 18** - Library for building user interfaces
- **TypeScript** - Typed JavaScript superset
- **React Router** - Navigation and routing
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Accessible and customizable UI components
- **Axios** - HTTP client for making requests
- **date-fns** - Library for date manipulation
- **Lucide React** - SVG icons
- **Context API** - For global state management

## 📂 Project Structure

```
client/
├── src/
│   ├── components/     # Reusable components
│   │   ├── ui/         # Basic UI components
│   │   └── ...         # Application-specific components
│   ├── context/        # React contexts
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities and configurations
│   ├── pages/          # Page components
│   │   ├── app/        # Application pages
│   │   └── auth/       # Authentication pages
│   ├── routes/         # Route configurations
│   ├── services/       # API services
│   └── App.tsx         # Main component
└── ...
```

## 🚀 Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. Configure environment variables:
   - Create a `.env` file
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:5173/](http://localhost:5173/) in your browser to view the application.

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- Tokens are stored in localStorage for persistence between sessions
- Protected routes verify authentication before rendering
- The `AuthContext` provides current user information and methods for login/logout

## 📡 API Services

The application communicates with the backend through organized services:

- **authService** - User authentication (registration, login)
- **projectService** - CRUD for projects
- **taskService** - CRUD for tasks
- **dashboardService** - Data for the main dashboard

## 🎨 UI Customization

Components use Tailwind CSS with Shadcn UI, allowing:
- Easy theme customization
- Modification of individual components
- Visual consistency throughout the application

## 🚧 Under Development
The following features are currently under development or planned for future implementation:

- Testing - Frontend testing will be implemented using Jest and React Testing Library for unit and integration tests, along with Cypress for end-to-end tests where applicable.
- Team Collaboration - Sharing projects and tasks between multiple users
- Calendar Integration - View and manage tasks in calendar format
- Offline Support - Ability to work offline with synchronization when back online
