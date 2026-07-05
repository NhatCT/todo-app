'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types/todo';
import { todoService } from '../services/api';
import { TodoCard } from '../components/TodoCard';
import { TodoModal } from '../components/TodoModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { FilterBar } from '../components/FilterBar';

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(undefined);

  // Deletion state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<number | undefined>(undefined);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [completedFilter, setCompletedFilter] = useState<boolean | undefined>(undefined);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await todoService.getAllTodos(debouncedSearch, completedFilter);
      setTodos(data);
    } catch (err: any) {
      console.error(err);
      setError('Không thể tải danh sách công việc. Vui lòng kiểm tra kết nối với API.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, completedFilter]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleModalSubmit = async (data: { title: string; description: string; completed?: boolean }) => {
    try {
      if (selectedTodo) {
        await todoService.updateTodo(selectedTodo.id, {
          title: data.title,
          description: data.description,
          completed: data.completed,
        });
      } else {
        await todoService.createTodo({
          title: data.title,
          description: data.description,
          completed: false,
        });
      }
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      await todoService.toggleTodo(id);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTrigger = (id: number) => {
    setTodoToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (todoToDelete === undefined) return;
    try {
      await todoService.deleteTodo(todoToDelete);
      fetchTodos();
    } catch (err) {
      console.error(err);
    } finally {
      setTodoToDelete(undefined);
    }
  };

  const handleEditTrigger = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsTodoModalOpen(true);
  };

  const handleAddTrigger = () => {
    setSelectedTodo(undefined);
    setIsTodoModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-outfit">
            Danh sách công việc
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Xem, thêm mới và chỉnh sửa các công việc hàng ngày của bạn.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        completedFilter={completedFilter}
        onFilterChange={setCompletedFilter}
        onAddNew={handleAddTrigger}
      />

      {error && (
        <div className="p-4 rounded-3xl bg-rose-50 border border-rose-100 text-rose-700 text-sm dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Đang tải...</div>
      ) : todos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onEdit={handleEditTrigger}
              onDelete={handleDeleteTrigger}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 border border-dashed rounded-3xl">
          Không tìm thấy công việc nào phù hợp.
        </div>
      )}

      <TodoModal
        isOpen={isTodoModalOpen}
        onClose={() => setIsTodoModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialTodo={selectedTodo}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa công việc"
        message="Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác."
        confirmText="Xóa bỏ"
        cancelText="Hủy"
      />
    </div>
  );
}
