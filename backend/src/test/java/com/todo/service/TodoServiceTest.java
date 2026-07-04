package com.todo.service;

import com.todo.dto.TodoRequest;
import com.todo.dto.TodoResponse;
import com.todo.exception.ResourceNotFoundException;
import com.todo.model.Todo;
import com.todo.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    @InjectMocks
    private TodoService todoService;

    private Todo todo;
    private TodoRequest request;

    @BeforeEach
    void setUp() {
        todo = Todo.builder()
                .id(1L)
                .title("Test Todo")
                .description("Test Description")
                .completed(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        request = TodoRequest.builder()
                .title("New Todo")
                .description("New Description")
                .completed(false)
                .build();
    }

    @Test
    void getAllTodos_ShouldReturnAllTodos() {
        when(todoRepository.findAll()).thenReturn(List.of(todo));

        List<TodoResponse> result = todoService.getAllTodos(null, null);

        assertEquals(1, result.size());
        assertEquals("Test Todo", result.get(0).getTitle());
        verify(todoRepository).findAll();
    }

    @Test
    void getAllTodos_WithSearch_ShouldReturnFilteredTodos() {
        when(todoRepository.findByTitleContainingIgnoreCase("Test")).thenReturn(List.of(todo));

        List<TodoResponse> result = todoService.getAllTodos("Test", null);

        assertEquals(1, result.size());
        verify(todoRepository).findByTitleContainingIgnoreCase("Test");
    }

    @Test
    void getAllTodos_WithCompleted_ShouldReturnFilteredTodos() {
        when(todoRepository.findByCompleted(true)).thenReturn(List.of(todo));

        List<TodoResponse> result = todoService.getAllTodos(null, true);

        assertEquals(1, result.size());
        verify(todoRepository).findByCompleted(true);
    }

    @Test
    void getAllTodos_WithSearchAndCompleted_ShouldReturnFilteredTodos() {
        when(todoRepository.findByTitleContainingIgnoreCaseAndCompleted("Test", true))
                .thenReturn(List.of(todo));

        List<TodoResponse> result = todoService.getAllTodos("Test", true);

        assertEquals(1, result.size());
        verify(todoRepository).findByTitleContainingIgnoreCaseAndCompleted("Test", true);
    }

    @Test
    void getTodoById_ShouldReturnTodo() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));

        TodoResponse result = todoService.getTodoById(1L);

        assertEquals("Test Todo", result.getTitle());
        verify(todoRepository).findById(1L);
    }

    @Test
    void getTodoById_ShouldThrowException_WhenNotFound() {
        when(todoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> todoService.getTodoById(99L));
        verify(todoRepository).findById(99L);
    }

    @Test
    void createTodo_ShouldReturnCreatedTodo() {
        when(todoRepository.save(any(Todo.class))).thenReturn(todo);

        TodoResponse result = todoService.createTodo(request);

        assertEquals("Test Todo", result.getTitle());
        verify(todoRepository).save(any(Todo.class));
    }

    @Test
    void updateTodo_ShouldReturnUpdatedTodo() {
        Todo updatedTodo = Todo.builder()
                .id(1L)
                .title("Updated Title")
                .description("Updated Description")
                .completed(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        TodoRequest updateRequest = TodoRequest.builder()
                .title("Updated Title")
                .description("Updated Description")
                .completed(true)
                .build();

        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));
        when(todoRepository.save(any(Todo.class))).thenReturn(updatedTodo);

        TodoResponse result = todoService.updateTodo(1L, updateRequest);

        assertEquals("Updated Title", result.getTitle());
        assertTrue(result.isCompleted());
        verify(todoRepository).findById(1L);
        verify(todoRepository).save(any(Todo.class));
    }

    @Test
    void updateTodo_ShouldThrowException_WhenNotFound() {
        when(todoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> todoService.updateTodo(99L, request));
        verify(todoRepository).findById(99L);
        verify(todoRepository, never()).save(any(Todo.class));
    }

    @Test
    void deleteTodo_ShouldDeleteTodo() {
        when(todoRepository.existsById(1L)).thenReturn(true);

        todoService.deleteTodo(1L);

        verify(todoRepository).existsById(1L);
        verify(todoRepository).deleteById(1L);
    }

    @Test
    void deleteTodo_ShouldThrowException_WhenNotFound() {
        when(todoRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> todoService.deleteTodo(99L));
        verify(todoRepository).existsById(99L);
        verify(todoRepository, never()).deleteById(anyLong());
    }

    @Test
    void toggleTodo_ShouldToggleCompleted() {
        Todo toggledTodo = Todo.builder()
                .id(1L)
                .title("Test Todo")
                .description("Test Description")
                .completed(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));
        when(todoRepository.save(any(Todo.class))).thenReturn(toggledTodo);

        TodoResponse result = todoService.toggleTodo(1L);

        assertTrue(result.isCompleted());
        verify(todoRepository).findById(1L);
        verify(todoRepository).save(any(Todo.class));
    }

    @Test
    void toggleTodo_ShouldThrowException_WhenNotFound() {
        when(todoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> todoService.toggleTodo(99L));
        verify(todoRepository).findById(99L);
        verify(todoRepository, never()).save(any(Todo.class));
    }
}