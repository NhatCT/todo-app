# 📝 Todo List Application

Ứng dụng **Quản lý công việc (Todo List)** - Bài test Intern Developer.

## 🛠 Công nghệ sử dụng

### Backend
- **Java 17** + **Spring Boot 3.2.5**
- **Spring Data JPA** (Hibernate)
- **MySQL 8.0**
- **Bean Validation** (Jakarta Validation)
- **Maven**

### Frontend (Ngày 2)
- **Next.js** + **TypeScript**
- **Axios**
- **Tailwind CSS**

---

## 📂 Cấu trúc dự án

```
todo-app/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/com/todo/
│   │   ├── controller/        # REST Controllers
│   │   ├── dto/               # Request/Response DTOs
│   │   ├── exception/         # Exception Handler
│   │   ├── model/             # JPA Entity
│   │   ├── repository/        # JPA Repository
│   │   └── service/           # Business Logic
│   ├── src/main/resources/
│   │   └── application.yml    # Cấu hình
│   └── pom.xml
├── docker-compose.yml         # Docker Compose (MySQL)
└── README.md
```

---

## 🚀 Hướng dẫn chạy Backend

### Yêu cầu
- **Java 17+**
- **Maven 3.8+**
- **MySQL 8.0** (hoặc Docker)

### Cách 1: Chạy với MySQL Local

```bash
# 1. Tạo database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS todo_db; CREATE USER IF NOT EXISTS 'todo_user'@'localhost' IDENTIFIED BY 'todo_pass123'; GRANT ALL PRIVILEGES ON todo_db.* TO 'todo_user'@'localhost'; FLUSH PRIVILEGES;"

# 2. Build & Run
cd backend
mvn clean install -DskipTests
java -jar target/todo-backend-1.0.0.jar
```

### Cách 2: Chạy với Docker Compose

```bash
# 1. Start MySQL
docker-compose up -d

# 2. Build & Run
cd backend
mvn clean install -DskipTests
java -jar target/todo-backend-1.0.0.jar
```

Backend sẽ chạy tại: **http://localhost:8080**

---

## 📋 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/todos` | Lấy danh sách công việc |
| `GET` | `/api/todos?search=keyword` | Tìm kiếm theo tiêu đề |
| `GET` | `/api/todos?completed=true` | Lọc theo trạng thái |
| `GET` | `/api/todos/{id}` | Lấy chi tiết công việc |
| `POST` | `/api/todos` | Thêm công việc mới |
| `PUT` | `/api/todos/{id}` | Cập nhật công việc |
| `PATCH` | `/api/todos/{id}/toggle` | Đánh dấu hoàn thành/chưa |
| `DELETE` | `/api/todos/{id}` | Xóa công việc |

### Request Body (POST/PUT)

```json
{
  "title": "Học Spring Boot",
  "description": "Hoàn thành todo app",
  "completed": false
}
```

### Response Mẫu

```json
{
  "id": 1,
  "title": "Học Spring Boot",
  "description": "Hoàn thành todo app",
  "completed": false,
  "createdAt": "2026-07-05T02:14:33.682958",
  "updatedAt": "2026-07-05T02:14:33.682958"
}
```

### Error Response

```json
// Validation Error (400)
{
  "timestamp": "2026-07-05T02:15:29.462",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "errors": {
    "title": "Title is required"
  }
}

// Not Found (404)
{
  "timestamp": "2026-07-05T02:15:29.462",
  "status": 404,
  "error": "Not Found",
  "message": "Todo not found with id: 99"
}
```

---

## 🧪 Kiểm thử API với Postman

Import collection: [Todo App Postman Collection](postman/todo-app.postman_collection.json)

Hoặc dùng curl:

```bash
# Lấy danh sách
curl http://localhost:8080/api/todos

# Thêm mới
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Học Spring Boot","description":"Hoàn thành todo app"}'

# Cập nhật
curl -X PUT http://localhost:8080/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Học Spring Boot","description":"Đã xong","completed":true}'

# Xóa
curl -X DELETE http://localhost:8080/api/todos/1
```

---

## 📦 Cấu hình

File `backend/src/main/resources/application.yml`:

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
```

---

## ✅ Kế hoạch thực hiện

### Ngày 1 - Backend ✅
- [x] Khởi tạo Spring Boot + MySQL
- [x] Thiết kế Database, Entity, Repository
- [x] Service + DTO + CRUD API
- [x] Validation + Global Exception Handler
- [x] Search + Filter API
- [x] Kiểm thử API

### Ngày 2 - Frontend
- [ ] Khởi tạo Next.js + TypeScript + Tailwind CSS
- [ ] Hiển thị danh sách Todo
- [ ] Thêm, sửa, xóa Todo
- [ ] Đánh dấu hoàn thành
- [ ] Search + Filter
- [ ] Responsive, Loading, Empty State, Confirm Delete
- [ ] README hoàn chỉnh + Push GitHub