# FlowTodo — Modern Task Management Application

FlowTodo is a complete, full-stack Task Management (Todo List) application designed for speed, clarity, and elegance. The system comprises a high-performance **Spring Boot** REST API backend and a responsive, modern **Next.js** frontend dashboard.

---

## 🌟 Key Features

### Backend
* **Robust CRUD REST API**: High-quality endpoints for listing, searching, creating, editing, deleting, and toggling task completion.
* **Query Parameters**: Built-in support for keyword search and status filters (All, Completed, Active) directly at the database layer.
* **Input Validation**: Strict request payload validation using `@Valid` (Jakarta Validation) ensuring clean, consistent, and secure data.
* **Global Exception Handler**: Standardized REST error payloads with descriptive field-level validation messages.
* **Swagger/OpenAPI Documentation**: Integrated API playground for manual interactive testing.

### Frontend
* **Premium Dashboard Design**: Built with a clean interface featuringOutfit and Inter typography, soft transitions, vibrant status badges, and interactive gradients.
* **Live Query Synced**: Real-time debounced search bar and filter controls that sync seamlessly with Spring Boot API query criteria.
* **Analytics Bar**: Quick-view metrics displaying total tasks, completed counts, pending counts, and completion rate progress.
* **Custom Overlays**: Custom confirm modals for deletion and a lightweight custom Toast notification stack providing interactive feedback.
* **Full Responsiveness**: Adaptive layouts for mobile, tablet, and desktop viewports.
* **Error Handling**: Graceful network error fallbacks and validation message overlays.

---

## 🛠️ Technology Stack

### Backend
* **Java 17+**
* **Spring Boot 3.2.5**
* **Spring Data JPA** (Hibernate)
* **MySQL 8.0**
* **Jakarta Validation**
* **Maven** (Dependencies & Compilation)
* **Lombok** (Code reduction)

### Frontend
* **Next.js 16 (App Router)**
* **TypeScript**
* **Axios** (API Client)
* **Tailwind CSS v4**

---

## 📂 Project Structure

```
todo-app/
├── backend/
│   ├── src/main/java/com/todo/
│   │   ├── controller/      # REST API Controllers (CORS enabled)
│   │   ├── dto/             # Data Transfer Objects (Request/Response validation)
│   │   ├── exception/       # Custom Exceptions & Global Exception Handler
│   │   ├── model/           # JPA Hibernate Entity mapping
│   │   ├── repository/      # Spring Data JPA Database Interfaces
│   │   └── service/         # Core Business Logic implementation
│   ├── src/main/resources/  # Configuration files (application.yml)
│   └── target/              # Compiled deliverables (.jar files)
├── frontend/
│   ├── src/
│   │   ├── app/             # Page routes and base Layout (fonts, global styles)
│   │   ├── components/      # UI Components (Card, Modal, Stats, FilterBar)
│   │   ├── services/        # Axios API Client config and methods
│   │   └── types/           # TypeScript Todo definitions
│   └── package.json
├── docker-compose.yml       # MySQL 8.0 database service configuration
└── README.md                # System user manual
```

---

## 🚀 How to Run the Application

### Prerequisites
* **Java 17+** (with `java` binary exposed in environment variables)
* **Node.js 18+** & **npm**
* **MySQL 8.0** running on port `3306` (or Docker Desktop installed)

---

### Step 1: Set up the Database

#### Option A: Running Local MySQL
Run the following script on your local MySQL server to initialize the database schema and configure access privileges:
```sql
CREATE DATABASE IF NOT EXISTS todo_db;
CREATE USER IF NOT EXISTS 'todo_user'@'localhost' IDENTIFIED BY 'todo_pass123';
GRANT ALL PRIVILEGES ON todo_db.* TO 'todo_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Option B: Using Docker Compose
If you prefer running MySQL in a container, simply start the database daemon using the provided compose file:
```bash
docker-compose up -d
```

---

### Step 2: Run the Backend API Server

A pre-compiled Jar artifact is included in `backend/target/`. To launch the Spring Boot service:
```bash
cd backend
java -jar target/todo-backend-1.0.0.jar
```
The API server will launch and bind to **`http://localhost:8080`**.

*To review the OpenAPI Swagger documentation, open your browser and navigate to: **`http://localhost:8080/swagger-ui/index.html`***

---

### Step 3: Run the Frontend Dashboard

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the package dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to: **`http://localhost:3000`**

---

## 📡 API Reference endpoints

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

### Error Payloads

#### 400 Validation Failure:
```json
{
  "timestamp": "2026-07-05T15:15:29.462",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "errors": {
    "title": "Title is required"
  }
}
```

#### 404 Not Found:
```json
{
  "timestamp": "2026-07-05T15:15:29.462",
  "status": 404,
  "error": "Not Found",
  "message": "Todo not found with id: 99"
}
```