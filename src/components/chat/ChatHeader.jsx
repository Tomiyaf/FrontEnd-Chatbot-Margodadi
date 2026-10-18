import React from 'react'
import { Link } from 'react-router-dom'

export default function ChatHeader({
  anonymousCode,
  sessionId,
  onResetSession,
  onOpenFeedback,
}) {
  return (
    <div className="bg-gradient-to-r from-white via-surface-container-lowest to-surface-container-low/60 border-b border-surface-container-high/80 px-3 sm:px-6 py-2 sm:py-3.5 flex items-center justify-between gap-2 shadow-2xs relative shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Avatar Virtual Guide */}
        <div className="relative shrink-0">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-primary via-primary-container to-emerald-400 p-0.5 shadow-sm">
            <div className="w-full h-full bg-white rounded-[10px] sm:rounded-[14px] flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg sm:text-2xl">smart_toy</span>
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-400/30"></span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-xs sm:text-base font-bold text-on-surface truncate">
              Virtual Guide Margodadi
            </h1>
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] sm:text-[11px] font-bold border border-emerald-200/80 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="hidden sm:inline">AI + Aparatur Aktif</span>
              <span className="sm:hidden">Online</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
            <span>Sesi: <strong className="font-mono text-primary font-bold">{anonymousCode || 'WARGA-MGD'}</strong></span>
            <span>•</span>
            <span className="text-primary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">verified</span>
              SOP Desa &amp; RAG Terverifikasi
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          onClick={onOpenFeedback}
          className="inline-flex items-center justify-center gap-1.5 w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-xs font-semibold rounded-lg sm:rounded-xl transition-all shadow-2xs cursor-pointer"
          title="Beri Masukan &amp; Rating"
        >
          <span className="material-symbols-outlined text-base sm:text-sm text-amber-600">star</span>
          <span className="hidden sm:inline">Ulasan</span>
        </button>

        <button
          onClick={onResetSession}
          className="inline-flex items-center justify-center gap-1.5 w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg sm:rounded-xl transition-all shadow-2xs cursor-pointer"
          title="Mulai Percakapan Baru"
        >
          <span className="material-symbols-outlined text-base sm:text-sm">restart_alt</span>
          <span className="hidden sm:inline">Sesi Baru</span>
        </button>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-1 w-8 h-8 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1.5 bg-slate-100 hover:bg-surface-container hover:text-primary text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg sm:rounded-xl transition-all shadow-2xs"
          title="Kembali ke Beranda"
        >
          <span className="material-symbols-outlined text-base sm:text-sm">home</span>
        </Link>
      </div>
    </div>
  )
}
