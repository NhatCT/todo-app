# FlowTodo - Full-Stack Task Management Application

FlowTodo is a full-stack Task Management (Todo List) application. The project is built with a Spring Boot REST API backend, a MySQL database, and a Next.js frontend client.

### Project Links
* GitHub Repository: https://github.com/NhatCT/todo-app
* Live Demo (Frontend): https://todo-app-chi-ten-70.vercel.app
* Production API (Backend): https://todo-app-3m2x.onrender.com

---

## Key Features

### Backend (Spring Boot & MySQL)
* REST API endpoints for listing, searching, creating, updating, deleting, and toggling task completion.
* Database-level filtering (search query and completion status) using Spring Data JPA.
* Request payload validation using Jakarta Validation annotations.
* Global exception handler for standardized error responses.
* Swagger/OpenAPI documentation for interactive API testing.

### Frontend (Next.js & Tailwind CSS v4)
* Modern dashboard interface with responsive grid layouts.
* Light/Dark mode with local storage persistence.
* Real-time search with a 300ms debounce buffer.
* Statistics panel showing total, completed, pending tasks, and completion rate progress.
* Client-side pagination (6 items per page) and chronological sorting (newest first).
* UTF-16LE TSV CSV report exporter to support Vietnamese accents in Excel without encoding issues.
* Custom confirmation and toast alert system.
* Responsive layouts designed for mobile, tablet, and desktop viewports.

---

## Technology Stack

### Backend
* Java 17
* Spring Boot 3.2.5
* Spring Data JPA (Hibernate)
* MySQL 8.0
* Jakarta Validation
* Maven

### Frontend
* Next.js 16 (App Router)
* TypeScript
* Axios
* Tailwind CSS v4

---

## Project Structure

```
todo-app/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions CI/CD pipeline
├── backend/
│   ├── src/
│   │   ├── main/java/com/todo/
│   │   │   ├── controller/  # REST API Controllers
│   │   │   ├── dto/         # Request/Response validation models
│   │   │   ├── exception/   # Custom exception handlers
│   │   │   ├── model/       # JPA Entities
│   │   │   ├── repository/  # Data Access Object interfaces
│   │   │   └── service/     # Business logic classes
│   │   └── test/java/com/todo/ # JUnit 5 & Mockito tests
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── app/             # Application entry points and global styles
│   │   ├── components/      # UI component files
│   │   ├── services/        # Axios API Client configuration
│   │   └── types/           # TypeScript definitions
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## How to Run the Application

### Option A: Running with Docker Compose (Recommended)
You can run the entire stack (Database, Backend, and Frontend) using Docker Compose.

#### Prerequisites
* Docker Desktop installed and running.

#### Instructions
1. Navigate to the root directory `todo-app/`.
2. Run the command:
   ```bash
   docker-compose up --build -d
   ```
3. Docker will start:
   * MySQL container on port `3306` (with `todo_db` initialized).
   * Spring Boot API container on port `8080`.
   * Next.js frontend client container on port `3000`.
4. Open the browser and visit `http://localhost:3000`.

---

### Option B: Running Locally (Manual Setup)

#### Prerequisites
* Java 17+ (JDK) and Maven.
* Node.js 20+ and npm.
* MySQL 8.0 running locally on port `3306`.

#### Step 1: Database Setup
Execute the following script on your local MySQL server to initialize the database:
```sql
CREATE DATABASE IF NOT EXISTS todo_db;
CREATE USER IF NOT EXISTS 'todo_user'@'localhost' IDENTIFIED BY 'todo_pass123';
GRANT ALL PRIVILEGES ON todo_db.* TO 'todo_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Step 2: Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and package the application:
   ```bash
   mvn clean package
   ```
3. Run the JAR file:
   ```bash
   java -jar target/todo-backend-1.0.0.jar
   ```
   * The API server will run on `http://localhost:8080`.
   * You can access the Swagger UI playground at `http://localhost:8080/swagger-ui/index.html`.

#### Step 3: Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the dashboard at `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).

---

## Unit Testing

### Running Tests
To run the backend JUnit 5 and Mockito tests locally, execute:
```bash
cd backend
mvn clean test
```

### Docker Integration Notes
During the Docker build process, tests are skipped using `-DskipTests`. This is because the database container is not running during the initial build phase. Full integration tests are instead run inside the isolated environment of the CI/CD pipeline.

---

## CI/CD Pipeline
The repository uses GitHub Actions for continuous integration (configured in `.github/workflows/deploy.yml`).

On every push or pull request to the `main` and `develop` branches:
1. **Backend Tests**: Sets up Java 17, spins up a temporary MySQL 8.0 database container, and runs all maven test suites.
2. **Frontend Checks**: Sets up Node.js 20, runs TypeScript compiler type checks (`tsc --noEmit`), and compiles a Next.js production build (`npm run build`).

---

## API Endpoints

| Method | Endpoint | Description | Query Parameters |
|:---|:---|:---|:---|
| **GET** | `/api/todos` | Fetch all or filtered tasks | `search` (string), `completed` (boolean) |
| **GET** | `/api/todos/{id}` | Fetch a single task | None |
| **POST** | `/api/todos` | Create a new task | None (Payload required) |
| **PUT** | `/api/todos/{id}` | Update task title and description | None (Payload required) |
| **PATCH** | `/api/todos/{id}/toggle` | Toggle completion status | None |
| **DELETE** | `/api/todos/{id}` | Delete a task | None |

### Payload Format (POST / PUT)
```json
{
  "title": "Task title",
  "description": "Task description details",
  "completed": false
}
```

### Success Response Format (200 OK / 201 Created)
```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description details",
  "completed": false,
  "createdAt": "2026-07-06T09:40:21.000",
  "updatedAt": "2026-07-06T09:40:21.000"
}
```

---

## Production Online Deployment Guide

### 1. Database Deployment
Deploy a MySQL database instance on a cloud provider (such as Aiven.io, Clever Cloud, or Railway) and note the host, port, database name, and credentials.

### 2. Backend Deployment
1. Create a new Web Service on Render or Railway.
2. Connect your GitHub repository.
3. Choose the **Docker** runtime option (the service automatically detects the `Dockerfile` inside the `backend` subdirectory).
4. Define the following environment variables:
   * `SPRING_DATASOURCE_URL`: `jdbc:mysql://[DATABASE_HOST]:[DATABASE_PORT]/[DATABASE_NAME]?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC`
   * `SPRING_DATASOURCE_USERNAME`: `[DATABASE_USER]`
   * `SPRING_DATASOURCE_PASSWORD`: `[DATABASE_PASSWORD]`
   * `TZ`: `Asia/Ho_Chi_Minh`
5. Deploy and save the API URL (e.g. `https://your-api.onrender.com`).

### 3. Frontend Deployment
1. Import the repository into Vercel.
2. Select the **frontend** subdirectory as the project root.
3. Configure the following environment variable:
   * `NEXT_PUBLIC_API_URL`: `https://[YOUR_RENDER_BACKEND_URL]/api/todos`
4. Run the deployment.