'use client';

import React from 'react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  completedFilter: boolean | undefined;
  onFilterChange: (value: boolean | undefined) => void;
  onAddNew: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  completedFilter,
  onFilterChange,
  onAddNew,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800/80 transition-all duration-300">
      
      {/* Search Bar */}
      <div className="relative w-full md:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm công việc theo tiêu đề..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-sm dark:bg-slate-800/40 dark:border-slate-800 dark:focus:bg-slate-900 dark:hover:bg-slate-800/60 dark:text-slate-100 transition-all duration-200"
        />
      </div>

      {/* Tabs & Create Button */}
      <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 w-full md:w-auto">
        {/* Filter Segmented Controls */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
          <button
            onClick={() => onFilterChange(undefined)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              completedFilter === undefined
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => onFilterChange(false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              completedFilter === false
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Chưa xong
          </button>
          <button
            onClick={() => onFilterChange(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              completedFilter === true
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Hoàn thành
          </button>
        </div>

        {/* Create Todo Button */}
        <button
          onClick={onAddNew}
          className="px-5 py-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center space-x-2 cursor-pointer"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tạo mới</span>
        </button>
      </div>

    </div>
  );
};
