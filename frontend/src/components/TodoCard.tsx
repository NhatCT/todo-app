'use client';

import React from 'react';
import { Todo } from '../types/todo';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({ todo, onToggle, onEdit, onDelete }) => {
  const formattedDate = new Date(todo.createdAt).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`group relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
        todo.completed
          ? 'bg-slate-50/50 border-slate-200/60 dark:bg-slate-900/30 dark:border-slate-800/50'
          : 'bg-white border-slate-200 shadow-sm hover:border-indigo-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-indigo-900/50'
      }`}
    >
      {/* Visual background glow for active cards on hover */}
      {!todo.completed && (
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-tr from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      <div className="flex items-start space-x-4">
        {/* Toggle Status Checkbox Container */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
            todo.completed
              ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500'
              : 'border-slate-300 hover:border-indigo-500 dark:border-slate-700 dark:hover:border-indigo-400'
          }`}
          aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
        >
          {todo.completed && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-base font-semibold truncate transition-all duration-200 ${
              todo.completed
                ? 'text-slate-400 line-through dark:text-slate-500'
                : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            {todo.title}
          </h3>
          <p
            className={`mt-1.5 text-sm line-clamp-3 leading-relaxed transition-all duration-200 ${
              todo.completed
                ? 'text-slate-400/80 dark:text-slate-500/80'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {todo.description || <span className="italic text-slate-400 dark:text-slate-600">No description provided</span>}
          </p>
        </div>
      </div>

      {/* Meta Actions & Time */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 dark:text-slate-500">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/30 transition-all duration-200"
            title="Edit Todo"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition-all duration-200"
            title="Delete Todo"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
