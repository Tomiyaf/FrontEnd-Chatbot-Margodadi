import React from 'react'

export default function DeleteOperatorModal({
  isOpen,
  onClose,
  onConfirm,
  operator,
  isDeleting,
}) {
  if (!isOpen || !operator) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Danger Accent */}
        <div className="p-6 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 mx-auto flex items-center justify-center text-rose-600 shadow-xs">
            <span className="material-symbols-outlined text-3xl">delete_forever</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Hapus Akun Aparatur?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tindakan ini permanen. Akun aparatur berikut tidak akan dapat lagi mengakses sistem Back-Office Pekon Margodadi.
            </p>
          </div>

          {/* Operator Preview Card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left flex items-center gap-3">
            <img
              src={operator.avatar || '/favicon.svg'}
              alt={operator.name}
              onError={(e) => {
                e.currentTarget.src = '/favicon.svg'
              }}
              className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
            />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">
                {operator.name}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="font-mono text-primary font-semibold">@{operator.username || 'operator'}</span>
                <span>•</span>
                <span className="truncate">{operator.email}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 text-slate-700">
              {operator.role}
            </span>
          </div>

          {/* Note Info */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-left flex items-start gap-2">
            <span className="material-symbols-outlined text-amber-600 text-base shrink-0 mt-0.5">
              shield_with_heart
            </span>
            <p className="text-[11px] text-amber-900 leading-snug">
              Riwayat pesan, statistik, dan percakapan warga yang pernah ditangani oleh aparatur ini akan tetap diarsipkan secara aman di pangkalan data pekon.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isDeleting && (
              <span className="material-symbols-outlined text-base animate-spin">
                progress_activity
              </span>
            )}
            <span>Ya, Hapus Akun</span>
          </button>
        </div>
      </div>
    </div>
  )
}
