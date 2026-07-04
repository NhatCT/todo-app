package com.todo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.dto.TodoRequest;
import com.todo.dto.TodoResponse;
import com.todo.exception.ResourceNotFoundException;
import com.todo.service.TodoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TodoService todoService;

    private TodoResponse createMockResponse() {
        return TodoResponse.builder()
                .id(1L)
                .title("Test Todo")
                .description("Test Description")
                .completed(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getAllTodos_ShouldReturnTodoList() throws Exception {
        when(todoService.getAllTodos(null, null)).thenReturn(List.of(createMockResponse()));

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Todo"));
    }

    @Test
    void getTodoById_ShouldReturnTodo() throws Exception {
        when(todoService.getTodoById(1L)).thenReturn(createMockResponse());

        mockMvc.perform(get("/api/todos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Todo"));
    }

    @Test
    void getTodoById_ShouldReturn404_WhenNotFound() throws Exception {
        when(todoService.getTodoById(99L)).thenThrow(new ResourceNotFoundException("Todo not found with id: 99"));

        mockMvc.perform(get("/api/todos/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createTodo_ShouldReturnCreated() throws Exception {
        TodoRequest request = TodoRequest.builder()
                .title("New Todo")
                .description("New Description")
                .build();

        when(todoService.createTodo(any(TodoRequest.class))).thenReturn(createMockResponse());

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Test Todo"));
    }

    @Test
    void createTodo_ShouldReturn400_WhenTitleEmpty() throws Exception {
        TodoRequest request = TodoRequest.builder()
                .title("")
                .description("Description")
                .build();

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateTodo_ShouldReturnUpdatedTodo() throws Exception {
        TodoRequest request = TodoRequest.builder()
                .title("Updated Todo")
                .description("Updated Description")
                .completed(true)
                .build();

        TodoResponse updatedResponse = TodoResponse.builder()
                .id(1L)
                .title("Updated Todo")
                .description("Updated Description")
                .completed(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(todoService.updateTodo(eq(1L), any(TodoRequest.class))).thenReturn(updatedResponse);

        mockMvc.perform(put("/api/todos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Todo"))
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    void deleteTodo_ShouldReturn204() throws Exception {
        doNothing().when(todoService).deleteTodo(1L);

        mockMvc.perform(delete("/api/todos/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void toggleTodo_ShouldReturnToggledTodo() throws Exception {
        TodoResponse toggledResponse = TodoResponse.builder()
                .id(1L)
                .title("Test Todo")
                .description("Test Description")
                .completed(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(todoService.toggleTodo(1L)).thenReturn(toggledResponse);

        mockMvc.perform(patch("/api/todos/1/toggle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));
    }
}