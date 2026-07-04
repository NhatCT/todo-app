# Todo List Application

Todo List - Intern Developer Test.

## Tech Stack

### Backend
- Java 17 + Spring Boot 3.2.5
- Spring Data JPA (Hibernate)
- MySQL 8.0
- Bean Validation (Jakarta Validation)
- Maven

### Frontend
- Next.js + TypeScript
- Axios
- Tailwind CSS

---

## Project Structure

```
todo-app/
├── backend/
│   ├── src/main/java/com/todo/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── exception/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
├── docker-compose.yml
└── README.md
```

---

## How to Run

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0 (or Docker)

### Option 1: MySQL Local

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS todo_db; CREATE USER IF NOT EXISTS 'todo_user'@'localhost' IDENTIFIED BY 'todo_pass123'; GRANT ALL PRIVILEGES ON todo_db.* TO 'todo_user'@'localhost'; FLUSH PRIVILEGES;"

cd backend
mvn clean install -DskipTests
java -jar target/todo-backend-1.0.0.jar
```

### Option 2: Docker Compose

```bash
docker-compose up -d

cd backend
mvn clean install -DskipTests
java -jar target/todo-backend-1.0.0.jar
```

Server runs at: **http://localhost:8080**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/todos | Get all todos |
| GET | /api/todos?search=keyword | Search by title |
| GET | /api/todos?completed=true | Filter by status |
| GET | /api/todos/{id} | Get todo by id |
| POST | /api/todos | Create todo |
| PUT | /api/todos/{id} | Update todo |
| PATCH | /api/todos/{id}/toggle | Toggle completed |
| DELETE | /api/todos/{id} | Delete todo |

### Request Body (POST/PUT)

```json
{
  "title": "Learn Spring Boot",
  "description": "Complete todo app",
  "completed": false
}
```

### Success Response

```json
{
  "id": 1,
  "title": "Learn Spring Boot",
  "description": "Complete todo app",
  "completed": false,
  "createdAt": "2026-07-05T02:14:33.682958",
  "updatedAt": "2026-07-05T02:14:33.682958"
}
```

### Error Responses

```json
// 400 Validation Error
{
  "timestamp": "2026-07-05T02:15:29.462",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "errors": {
    "title": "Title is required"
  }
}

// 404 Not Found
{
  "timestamp": "2026-07-05T02:15:29.462",
  "status": 404,
  "error": "Not Found",
  "message": "Todo not found with id: 99"
}
```

---

## Configuration

File: `backend/src/main/resources/application.yml`

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/todo_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: todo_user
    password: todo_pass123
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true