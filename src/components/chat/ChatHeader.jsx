import React from 'react'
import { Link } from 'react-router-dom'

export default function ChatHeader({
  anonymousCode,
  sessionId,
  onResetSession,
  onOpenFeedback,
}) {
  return (
    <div className="bg-surface-container-lowest border-b border-surface-container-high/60 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Avatar Virtual Guide */}
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-on-primary shadow-xs">
            <span className="material-symbols-outlined text-xl">smart_toy</span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-on-surface">Virtual Guide Pekon Margodadi</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              AI + Aparatur Aktif
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
            <span>Sesi: <strong className="font-mono text-on-surface">{anonymousCode || 'WARGA-MGD'}</strong></span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">SOP Desa &amp; RAG Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenFeedback}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          title="Beri Masukan &amp; Rating"
        >
          <span className="material-symbols-outlined text-sm text-amber-500">star</span>
          <span className="hidden sm:inline">Ulasan</span>
        </button>

        <button
          onClick={onResetSession}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-rose-50 hover:text-rose-600 text-on-surface-variant text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          title="Mulai Percakapan Baru"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          <span>Sesi Baru</span>
        </button>

        <Link
          to="/"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-on-surface-variant hover:text-on-surface text-xs font-medium rounded-xl hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-sm">home</span>
        </Link>
      </div>
    </div>
  )
}
