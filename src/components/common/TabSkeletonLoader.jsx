import React from 'react'

export default function TabSkeletonLoader({ rows = 4, title = 'Memuat Data...' }) {
  return (
    <div className="space-y-4 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs animate-pulse">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="space-y-2 w-1/3">
          <div className="h-5 bg-slate-200 rounded-lg w-3/4"></div>
          <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
        </div>
        <div className="h-9 bg-slate-100 rounded-xl w-32"></div>
      </div>

      <div className="space-y-3 pt-2">
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-100"
          >
            <div className="flex items-center space-x-3 w-3/4">
              <div className="w-9 h-9 rounded-lg bg-slate-200 shrink-0"></div>
              <div className="space-y-1.5 w-full">
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-3 bg-slate-100 rounded w-1/3"></div>
              </div>
            </div>
            <div className="h-8 bg-slate-200 rounded-lg w-20"></div>
          </div>
        ))}
      </div>

      <div className="pt-2 flex items-center justify-center text-xs font-medium text-slate-400">
        <span>{title}</span>
      </div>
    </div>
  )
}
