import React from 'react'

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Hapus Data',
  message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  itemName = '',
  isLoading = false,
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">delete_forever</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">Tindakan ini permanen dan menghapus data terkait</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-slate-700 space-y-1.5">
          <p>{message}</p>
          {itemName && (
            <p className="font-bold text-rose-800 bg-white/80 p-2 rounded-xl border border-rose-200/80 truncate">
              &quot;{itemName}&quot;
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">delete</span>
                <span>Ya, Hapus Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
