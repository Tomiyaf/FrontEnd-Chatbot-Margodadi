import React from 'react'

export default function RagContextDrawer({ isOpen, onClose, sources = [] }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">menu_book</span>
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Sumber Referensi SOP Desa</h2>
                <p className="text-xs text-slate-500">Konteks pgvector yang digunakan AI</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {sources.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Tidak ada data sumber referensi untuk pesan ini.
              </div>
            ) : (
              sources.map((src, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 line-clamp-1">
                      {src.title || src.document_title || `Dokumen SOP #${idx + 1}`}
                    </span>
                    {src.similarity && (
                      <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {Math.round(src.similarity * 100)}% Match
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/50">
                    &ldquo;{src.content || src.text}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Domain: {src.domain || 'Layanan Publik'}</span>
                    <span>Validator: Aparatur Pekon Margodadi</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 text-center">
            Seluruh data telah divalidasi oleh Pemerintahan Pekon Margodadi.
          </div>
        </div>
      </div>
    </div>
  )
}
