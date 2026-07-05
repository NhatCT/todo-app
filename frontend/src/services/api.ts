import axios from 'axios';
import { Todo, TodoRequest } from '../types/todo';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/todos';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoService = {
  getAllTodos: async (search?: string, completed?: boolean): Promise<Todo[]> => {
    const params: Record<string, any> = {};
    if (search !== undefined && search !== '') {
      params.search = search;
    }
    if (completed !== undefined) {
      params.completed = completed;
    }
    const response = await apiClient.get<Todo[]>('', { params });
    return response.data;
  },

  getTodoById: async (id: number): Promise<Todo> => {
    const response = await apiClient.get<Todo>(`/${id}`);
    return response.data;
  },

  createTodo: async (request: TodoRequest): Promise<Todo> => {
    const response = await apiClient.post<Todo>('', request);
    return response.data;
  },

  updateTodo: async (id: number, request: TodoRequest): Promise<Todo> => {
    const response = await apiClient.put<Todo>(`/${id}`, request);
    return response.data;
  },

  deleteTodo: async (id: number): Promise<void> => {
    await apiClient.delete(`/${id}`);
  },

  toggleTodo: async (id: number): Promise<Todo> => {
    const response = await apiClient.patch<Todo>(`/${id}/toggle`);
    return response.data;
  },
};
