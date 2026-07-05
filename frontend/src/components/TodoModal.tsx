'use client';

import React, { useState, useEffect } from 'react';
import { Todo } from '../types/todo';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; completed?: boolean }) => Promise<void>;
  initialTodo?: Todo;
}

export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTodo,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialTodo) {
        setTitle(initialTodo.title);
        setDescription(initialTodo.description || '');
        setCompleted(initialTodo.completed);
      } else {
        setTitle('');
        setDescription('');
        setCompleted(false);
      }
      setError('');
    }
  }, [isOpen, initialTodo]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side Validation
    if (!title.trim()) {
      setError('Tiêu đề công việc không được để trống.');
      return;
    }
    if (title.length > 255) {
      setError('Tiêu đề không được vượt quá 255 ký tự.');
      return;
    }
    if (description.length > 5000) {
      setError('Mô tả không được vượt quá 5000 ký tự.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        completed: initialTodo ? completed : false,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      const serverMessage = err.response?.data?.errors?.title || err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      setError(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800/80 p-6 overflow-hidden transition-all duration-300 scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-outfit">
            {initialTodo ? 'Cập nhật công việc' : 'Thêm công việc mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm flex items-center space-x-2 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              Tiêu đề <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Hoàn thành báo cáo tháng..."
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-sm dark:bg-slate-800/40 dark:border-slate-800 dark:focus:bg-slate-900 dark:hover:bg-slate-800/60 dark:text-slate-100 transition-all duration-200"
              maxLength={255}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              Mô tả chi tiết
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi chú thêm về công việc này..."
              rows={4}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-sm dark:bg-slate-800/40 dark:border-slate-800 dark:focus:bg-slate-900 dark:hover:bg-slate-800/60 dark:text-slate-100 transition-all duration-200 resize-none"
              maxLength={5000}
            />
          </div>

          {initialTodo && (
            <div className="flex items-center space-x-3 py-2">
              <button
                type="button"
                onClick={() => setCompleted(!completed)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  completed
                    ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                {completed && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span
                onClick={() => setCompleted(!completed)}
                className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
              >
                Đánh dấu đã hoàn thành
              </span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-sm font-semibold text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>Lưu lại</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
