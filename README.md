# FlowTodo — Modern Task Management Application

FlowTodo is a complete, full-stack Task Management (Todo List) application designed for speed, clarity, and elegance. The system comprises a high-performance **Spring Boot** REST API backend, a database layer powered by **MySQL**, and a responsive, modern **Next.js** frontend dashboard.

---

## 🌟 Key Features

### 💻 Backend (Spring Boot & MySQL)
* **Robust CRUD REST API**: High-quality endpoints for listing, searching, creating, editing, deleting, and toggling task completion.
* **Database-Level Filtering**: Keyword search and status filters (All, Completed, Active) processed directly in MySQL via Spring Data JPA.
* **Input Validation**: Strict request payload validation using `@Valid` (Jakarta Validation) ensuring clean, consistent, and secure data.
* **Global Exception Handler**: Standardized REST error responses returning descriptive field-level validation messages.
* **Swagger/OpenAPI Documentation**: Integrated API playground for manual interactive testing.

### 🎨 Frontend (Next.js & Tailwind CSS v4)
* **Premium Dashboard Design**: Built with a clean interface featuring Outfit and Inter typography, soft transitions, and interactive gradients.
* **Theme Toggle (Light/Dark Mode)**: Persistence-enabled theme changer using `localStorage` and system media preferences for comfortable work.
* **Live Query Syncing**: Real-time debounced search bar and filter controls that sync seamlessly with the backend API.
* **Analytics Bar**: Quick-view metrics displaying total tasks, completed counts, pending counts, and completion rate progress.
* **Client-Side Pagination**: Tasks are sorted chronologically (newest first) and partitioned into pages of 6 items for clean spacing.
* **CSV Report Exporter**: Download task data instantly in CSV format. Embedded with UTF-8 BOM encoding to ensure Vietnamese accents render correctly in Excel.
* **Floating "Back to Top" Button**: Smooth scroll trigger appears when scrolling down the page.
* **Custom Confirmations & Toast Stack**: Interactive confirmation dialogs for deletes and custom Toast alerts providing instant visual feedback.
* **Full Responsiveness**: Adaptive layouts for mobile, tablet, and desktop viewports.

---

## 🛠️ Technology Stack

### Backend
* **Java 17**
* **Spring Boot 3.2.5**
* **Spring Data JPA** (Hibernate)
* **MySQL 8.0**
* **Jakarta Validation**
* **Maven** (Dependencies & Compilation)
* **Lombok** (Boilerplate reduction)

### Frontend
* **Next.js 16 (App Router)**
* **TypeScript**
* **Axios** (API Client)
* **Tailwind CSS v4**

---

## 📂 Project Structure

```
todo-app/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions CI/CD pipeline
├── backend/
│   ├── src/
│   │   ├── main/java/com/todo/
│   │   │   ├── controller/  # REST API Controllers (CORS enabled)
│   │   │   ├── dto/         # Data Transfer Objects (Request/Response validations)
│   │   │   ├── exception/   # Custom Exceptions & Global Exception Handler
│   │   │   ├── model/       # JPA Hibernate Entity mapping
│   │   │   ├── repository/  # Spring Data JPA Database Interfaces
│   │   │   └── service/     # Core Business Logic implementation
│   │   └── test/java/com/todo/ # Junit 5 & Mockito Unit Tests
│   ├── Dockerfile           # Backend container build instructions
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── app/             # Page routes and base Layout (fonts, global styles)
│   │   ├── components/      # UI Components (Card, Modal, Stats, FilterBar, ThemeToggle)
│   │   ├── services/        # Axios API Client config and methods
│   │   └── types/           # TypeScript Todo definitions
│   ├── Dockerfile           # Frontend container build instructions (Node 20)
│   └── package.json
├── docker-compose.yml       # Unified multi-container orchestration script
└── README.md                # Project user manual
```

---

## 🚀 How to Run the Application

### Option A: Unified Multi-Container Orchestration (Docker Compose)
This is the recommended way to spin up the entire stack (Database, Backend, and Frontend) simultaneously with a single command.

#### Prerequisites
* **Docker Desktop** installed and running on your machine.

#### Instructions
1. Clone or navigate to the root directory `todo-app/`.
2. Run the following command to build the Docker images and run the containers in the background:
   ```bash
   docker-compose up --build -d
   ```
3. Docker will automatically launch:
   * **MySQL Database Container** on port `3306` (with `todo_db` initialized).
   * **Spring Boot REST API Container** on port `8080` (waiting until the database is healthy).
   * **Next.js Frontend Client Container** on port `3000`.
4. Open your browser and navigate to **`http://localhost:3000`** to view the application.

---

### Option B: Manual Local Development (No Docker)

#### Prerequisites
* **Java 17+** (JDK) and **Maven** installed.
* **Node.js 20+** and **npm** installed.
* **MySQL 8.0** server running locally on port `3306`.

#### Step 1: Set up the Database
Run the following script on your local MySQL server to initialize the database schema and configure access privileges:
```sql
CREATE DATABASE IF NOT EXISTS todo_db;
CREATE USER IF NOT EXISTS 'todo_user'@'localhost' IDENTIFIED BY 'todo_pass123';
GRANT ALL PRIVILEGES ON todo_db.* TO 'todo_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Step 2: Run the Backend API Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and package the Spring Boot JAR:
   ```bash
   mvn clean package
   ```
3. Run the compiled application JAR:
   ```bash
   java -jar target/todo-backend-1.0.0.jar
   ```
   *The API server will launch and bind to `http://localhost:8080`.*
   *To inspect the OpenAPI documentation, visit `http://localhost:8080/swagger-ui/index.html`.*

#### Step 3: Run the Frontend Dashboard
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Launch the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to: **`http://localhost:3000`**

---

## 🧪 Unit Testing

### Backend Unit Tests
The backend code features high-coverage unit and controller-slice tests using **JUnit 5** and **Mockito**.
* `TodoServiceTest`: Validates transaction rules, data mapping, and custom resource not found behaviors.
* `TodoControllerTest`: Validates request bodies (blank title rejections), response structures, and HTTP statuses.

#### Running Backend Tests Locally
To run tests locally:
```bash
cd backend
mvn clean test
```

#### Docker Build Optimization
When creating the backend Docker image, Maven packaging is executed with tests skipped (`mvn clean package -DskipTests`). This is intentional: during the isolated Docker image build process, there is no active database container running yet (as MySQL starts up concurrently in Docker Compose). Skipping tests in the Dockerfile prevents connection failures, while full unit tests are safely run and validated within the CI/CD pipeline.

---

## ⛓️ CI/CD Pipeline (GitHub Actions)
The repository is integrated with a GitHub Actions workflow defined in `.github/workflows/deploy.yml`. 

### Pipeline Steps
On every push or pull request to the `main` and `develop` branches, the CI runner automatically executes the following jobs:
1. **Backend Integration & Unit Tests**:
   * Spins up a temporary **MySQL 8.0 service container** in GitHub.
   * Loads Java 17 and builds backend dependencies via Maven.
   * Runs `mvn clean test` to ensure all tests pass.
2. **Frontend Build & Linter**:
   * Sets up Node.js 20.
   * Installs packages clean via `npm ci`.
   * Performs type safety checks using `npx tsc --noEmit`.
   * Builds the Next.js production build (`npm run build`).

---

## 📡 API Reference Endpoints

| Method | Endpoint | Description | Query Parameters |
|:---|:---|:---|:---|
| **GET** | `/api/todos` | Fetch all/filtered todos | `search` (string), `completed` (boolean) |
| **GET** | `/api/todos/{id}` | Fetch a single todo by ID | None |
| **POST** | `/api/todos` | Create a new todo task | None (Payload required) |
| **PUT** | `/api/todos/{id}` | Update title/description | None (Payload required) |
| **PATCH** | `/api/todos/{id}/toggle` | Toggle task completion | None |
| **DELETE** | `/api/todos/{id}` | Delete a todo task | None |

### Payload Schema (POST / PUT)
```json
{
  "title": "Clean the workspace",
  "description": "Organize books, dust table, clean monitors.",
  "completed": false
}
```

### Response Schema (Success 200/201)
```json
{
  "id": 1,
  "title": "Clean the workspace",
  "description": "Organize books, dust table, clean monitors.",
  "completed": false,
  "createdAt": "2026-07-06T09:40:21.000",
  "updatedAt": "2026-07-06T09:40:21.000"
}
```