import React from 'react'

export default function PageLoader({ title = 'Memuat Halaman...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 space-y-4 animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing halo */}
        <div className="absolute w-16 h-16 rounded-full bg-emerald-500/10 blur-xl animate-pulse"></div>
        
        {/* Spinning ring */}
        <div className="w-12 h-12 rounded-full border-3 border-emerald-100 border-t-emerald-600 border-r-emerald-500 animate-spin"></div>
        
        {/* Inner pulsing badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></div>
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-slate-700 tracking-wide">{title}</p>
        <p className="text-xs text-slate-400">Virtual Guide Margodadi</p>
      </div>
    </div>
  )
}
