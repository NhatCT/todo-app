'use client';

import React from 'react';

interface StatsBarProps {
  total: number;
  completed: number;
  pending: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({ total, completed, pending }) => {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800/80 transition-all duration-300">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Total */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">Tổng công việc</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-outfit mt-0.5">{total}</p>
          </div>
        </div>

        {/* Metric 2: Completed */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">Hoàn thành</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-outfit mt-0.5">{completed}</p>
          </div>
        </div>

        {/* Metric 3: Pending */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">Chờ xử lý</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-outfit mt-0.5">{pending}</p>
          </div>
        </div>

        {/* Metric 4: Progress Bar */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            <span>Tiến độ hoàn thành</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{completionRate}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
