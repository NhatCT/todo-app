'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types/todo';
import { todoService } from '../services/api';
import { TodoCard } from '../components/TodoCard';
import { TodoModal } from '../components/TodoModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { StatsBar } from '../components/StatsBar';
import { FilterBar } from '../components/FilterBar';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Dashboard() {
  // Todo list & query state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [completedFilter, setCompletedFilter] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<number | undefined>(undefined);

  // Custom Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch todos and compute global metrics
  const fetchTodosAndStats = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // 1. Fetch current filtered list
      const data = await todoService.getAllTodos(debouncedSearch, completedFilter);
      setTodos(data);

      // 2. Fetch all todos to calculate accurate stats metrics
      const allTodos = await todoService.getAllTodos();
      const total = allTodos.length;
      const completed = allTodos.filter((t) => t.completed).length;
      const pending = total - completed;
      setStats({ total, completed, pending });
    } catch (err: any) {
      console.error(err);
      setError('Không thể tải danh sách công việc. Vui lòng kiểm tra kết nối với máy chủ API.');
      addToast('Không thể kết nối với API backend.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, completedFilter, addToast]);

  useEffect(() => {
    fetchTodosAndStats();
  }, [fetchTodosAndStats]);

  // Create or Update submit handler
  const handleModalSubmit = async (data: { title: string; description: string; completed?: boolean }) => {
    if (selectedTodo) {
      // Edit mode
      await todoService.updateTodo(selectedTodo.id, {
        title: data.title,
        description: data.description,
        completed: data.completed,
      });
      addToast('Cập nhật công việc thành công!');
    } else {
      // Create mode
      await todoService.createTodo({
        title: data.title,
        description: data.description,
        completed: false,
      });
      addToast('Tạo mới công việc thành công!');
    }
    fetchTodosAndStats();
  };

  // Toggle status handler
  const handleToggleTodo = async (id: number) => {
    try {
      const updated = await todoService.toggleTodo(id);
      addToast(
        updated.completed
          ? 'Đã hoàn thành công việc! 🎉'
          : 'Đã mở lại công việc.'
      );
      fetchTodosAndStats();
    } catch (err) {
      console.error(err);
      addToast('Không thể thay đổi trạng thái công việc.', 'error');
    }
  };

  // Trigger Delete confirmation
  const handleDeleteTrigger = (id: number) => {
    setTodoToDelete(id);
    setIsConfirmOpen(true);
  };

  // Execute Delete
  const handleConfirmDelete = async () => {
    if (todoToDelete === undefined) return;
    try {
      await todoService.deleteTodo(todoToDelete);
      addToast('Đã xóa công việc thành công.');
      fetchTodosAndStats();
    } catch (err) {
      console.error(err);
      addToast('Lỗi khi xóa công việc.', 'error');
    } finally {
      setTodoToDelete(undefined);
    }
  };

  // Trigger Edit modal
  const handleEditTrigger = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsTodoModalOpen(true);
  };

  // Trigger Add Modal
  const handleAddTrigger = () => {
    setSelectedTodo(undefined);
    setIsTodoModalOpen(true);
  };

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-outfit">
            Bảng điều khiển
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Theo dõi, phân loại và hoàn thành mục tiêu ngày của bạn.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <StatsBar
        total={stats.total}
        completed={stats.completed}
        pending={stats.pending}
      />

      {/* Filters and Search */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        completedFilter={completedFilter}
        onFilterChange={setCompletedFilter}
        onAddNew={handleAddTrigger}
      />

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-3xl bg-rose-50 border border-rose-100 text-rose-700 text-sm flex items-center space-x-3 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400 animate-pulse">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold">Lỗi kết nối máy chủ</p>
            <p className="mt-0.5 text-xs opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Main Todo Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 bg-white border border-slate-200 rounded-3xl p-6 space-y-4 animate-pulse dark:bg-slate-900 dark:border-slate-800/80">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 h-5 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-5/6" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/4" />
                <div className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded w-1/6" />
              </div>
            </div>
          ))}
        </div>
      ) : todos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...todos]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((todo) => (
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
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white border border-slate-200/80 rounded-3xl dark:bg-slate-900 dark:border-slate-800/80 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4.5m12 3.5l-1.812-1.812a1.5 1.5 0 00-2.122 0L10.5 15" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white font-outfit">
            Không tìm thấy công việc nào
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            {search || completedFilter !== undefined
              ? 'Không có công việc nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn.'
              : 'Danh sách công việc đang trống. Hãy bắt đầu bằng cách thêm một công việc mới!'}
          </p>
          {(search || completedFilter !== undefined) && (
            <button
              onClick={() => {
                setSearch('');
                setCompletedFilter(undefined);
              }}
              className="mt-4 px-4 py-2 border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 rounded-xl transition-all"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Todo Modal (Add / Edit) */}
      <TodoModal
        isOpen={isTodoModalOpen}
        onClose={() => setIsTodoModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialTodo={selectedTodo}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa công việc"
        message="Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác."
        confirmText="Xóa bỏ"
        cancelText="Hủy"
      />

      {/* Toast Notification Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center space-x-2.5 px-4.5 py-3 rounded-2xl shadow-xl border text-sm font-semibold animate-slide-up transition-all ${
              toast.type === 'success'
                ? 'bg-slate-900 border-slate-800 text-white dark:bg-white dark:border-slate-100 dark:text-slate-900'
                : toast.type === 'error'
                ? 'bg-rose-600 border-rose-500 text-white'
                : 'bg-indigo-600 border-indigo-500 text-white'
            }`}
          >
            {toast.type === 'success' && (
              <svg className="w-4.5 h-4.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-4.5 h-4.5 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
