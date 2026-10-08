import React, { Suspense } from 'react'

export default function LazyModal({
  isOpen,
  onClose,
  Component,
  componentProps = {},
  fallbackTitle = 'Memuat Modal...',
}) {
  if (!isOpen || !Component) return null

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex items-center space-x-3.5 animate-scale-in">
            <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-700">{fallbackTitle}</span>
          </div>
        </div>
      }
    >
      <Component isOpen={isOpen} onClose={onClose} {...componentProps} />
    </Suspense>
  )
}
