import React from 'react'

export default function RagEngineTab({
  ragSettings,
  setRagSettings,
  savingRag,
  ragMessage,
  onSubmit,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">psychology</span>
            <span>Konfigurasi Engine RAG AI &amp; Eskalasi HITL</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur parameter model LLM, ambang batas kemiripan vektor, dan sensitivitas pengalihan tiket ke operator manusia.
          </p>
        </div>

        {ragMessage.text && (
          <div
            className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 ${
              ragMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {ragMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{ragMessage.text}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Model LLM Generative:
              </label>
              <input
                type="text"
                value={ragSettings.llm_model}
                onChange={(e) => setRagSettings({ ...ragSettings, llm_model: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Model Embeddings Vector:
              </label>
              <input
                type="text"
                value={ragSettings.embedding_model}
                onChange={(e) => setRagSettings({ ...ragSettings, embedding_model: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Similarity Threshold (Batas Eskalasi HITL):
              </label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={ragSettings.similarity_threshold}
                onChange={(e) => setRagSettings({ ...ragSettings, similarity_threshold: parseFloat(e.target.value) || 0.75 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Jika kemiripan &lt; {ragSettings.similarity_threshold}, sistem otomatis mengalihkan ke antrean operator manusia.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Top-K Dokumen Relevan (Chunks):
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={ragSettings.top_k}
                onChange={(e) => setRagSettings({ ...ragSettings, top_k: parseInt(e.target.value, 10) || 3 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingRag}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingRag ? 'Menyimpan...' : 'Simpan Parameter RAG'}
            </button>
          </div>
        </form>
      </div>

      {/* Gateway Status Cards */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-base text-primary">settings_ethernet</span>
          <span>Status Koneksi Gateway &amp; Vector Database</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <span className="font-bold text-slate-900 block">RAG AI &amp; pgvector (PostgreSQL)</span>
                <span className="text-[11px] text-slate-500">Retrieval Augmented Generation Margodadi</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px]">
              ONLINE
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <span className="font-bold text-slate-900 block">Webhook Notifikasi HITL Real-Time</span>
                <span className="text-[11px] text-slate-500">Pemicu eskalasi antrean cepat ke operator</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px]">
              AKTIF
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
