package com.todo;

import com.todo.model.Todo;
import com.todo.repository.TodoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Configuration
@Profile("!test")
public class DatabaseSeederConfig {

    @Bean
    public CommandLineRunner seedDatabase(TodoRepository todoRepository) {
        return args -> {
            if (todoRepository.count() == 0) {
                List<Todo> sampleTodos = List.of(
                    Todo.builder()
                        .title("Xây dựng cấu trúc dự án và thiết lập môi trường Docker")
                        .description("Tạo khung dự án Spring Boot + Next.js, viết Dockerfile và docker-compose.yml kết nối database MySQL.")
                        .completed(true)
                        .build(),
                    Todo.builder()
                        .title("Thiết kế giao diện bảng điều khiển (Dashboard) với Tailwind CSS")
                        .description("Thiết kế giao diện người dùng hiện đại bằng font chữ Outfit/Inter, tích hợp hiệu ứng gradient và các card công việc trực quan.")
                        .completed(true)
                        .build(),
                    Todo.builder()
                        .title("Tích hợp tính năng chuyển đổi giao diện Sáng/Tối (Light/Dark Mode)")
                        .description("Cấu hình CSS-first cho Tailwind CSS v4 để nhận diện bộ chọn .dark, lưu tùy chọn giao diện người dùng qua localStorage.")
                        .completed(true)
                        .build(),
                    Todo.builder()
                        .title("Triển khai phân trang dữ liệu ở giao diện người dùng (Pagination)")
                        .description("Chia danh sách công việc thành các trang nhỏ (6 công việc trên mỗi trang), tự động sắp xếp theo thứ tự mới nhất.")
                        .completed(true)
                        .build(),
                    Todo.builder()
                        .title("Tạo chức năng xuất dữ liệu báo cáo sang tệp tin CSV")
                        .description("Xuất danh sách công việc hiện tại ra file CSV. Tích hợp mã hóa UTF-8 BOM giúp hiển thị chữ tiếng Việt chính xác trong Excel.")
                        .completed(true)
                        .build(),
                    Todo.builder()
                        .title("Viết bộ kiểm thử đơn vị (Unit Tests) cho Backend")
                        .description("Sử dụng JUnit 5 và Mockito để kiểm thử tầng dịch vụ (TodoService) và tầng điều khiển (TodoController).")
                        .completed(true)
                        .build(),
                    Todo.builder()
                        .title("Thiết lập GitHub Actions CI/CD Pipeline")
                        .description("Tự động chạy kiểm thử trên GitHub bằng cách khởi tạo container dịch vụ MySQL, kiểm tra kiểu dữ liệu TypeScript và build mã nguồn.")
                        .completed(true)
                        .build(),
                    Todo.builder()
                        .title("Hoàn thiện tài liệu hướng dẫn vận hành chi tiết trong README.md")
                        .description("Cung cấp các bước cài đặt thủ công và cài đặt bằng Docker Compose cụ thể, liệt kê danh sách API endpoints của hệ thống.")
                        .completed(true)
                        .build(),
                    Todo.builder()
                        .title("Kiểm thử hệ thống và viết Unit Test cho Frontend client")
                        .description("Cài đặt Vitest / Jest để thực hiện viết các bộ kiểm thử đơn vị cho các component React quan trọng của ứng dụng khách.")
                        .completed(false)
                        .build(),
                    Todo.builder()
                        .title("Tối ưu hóa hiệu năng tải trang và trải nghiệm người dùng")
                        .description("Kiểm tra chỉ số Core Web Vitals, tối ưu hóa dung lượng build bundle của ứng dụng Next.js.")
                        .completed(false)
                        .build()
                );
                todoRepository.saveAll(sampleTodos);
                System.out.println(">>> Database seeded with realistic sample todos!");
            }
        };
    }
}
