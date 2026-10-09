import React from 'react'

export default function KnowledgeConfigTab({ stats, onReindexAll, isReindexingAll }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-700 text-xl">tune</span>
            <span>Konfigurasi Vector Store &amp; Hyperparameter RAG</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan arsitektur pemrosesan teks, model embedding pgvector, dan kebijakan chunking dokumen.
          </p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Model AI Configuration */}
          <div className="space-y-4 p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-base">psychology</span>
              <span>Model &amp; Dimensi Vektor</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Model Embedding:</label>
                <input
                  type="text"
                  disabled
                  value={stats.embedding_model || 'text-embedding-3-small'}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Dimensi output: 1536 float arrays</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Model LLM Synthesizer:</label>
                <input
                  type="text"
                  disabled
                  value={stats.llm_model || 'gpt-4o-mini'}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Context window: 128k tokens</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Metrik Kemiripan Vektor:</label>
                <input
                  type="text"
                  disabled
                  value="Cosine Distance (<=> pgvector operator)"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Chunking & Token Policy */}
          <div className="space-y-4 p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-base">view_stream</span>
              <span>Parameter Chunking Dokumen</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Target Chunk Size (Karakter):</label>
                <input
                  type="text"
                  disabled
                  value={`${stats.chunk_size || 500} Karakter (~100-120 token kata)`}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Ukuran optimal untuk pasal SOP layanan</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Chunk Overlap:</label>
                <input
                  type="text"
                  disabled
                  value={`${stats.chunk_overlap || 50} Karakter`}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Overlap 10% menjaga kontinuitas konteks</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Pemisah Kalimat (Boundary):</label>
                <input
                  type="text"
                  disabled
                  value="Sentence Boundary / Paragraf Splitter"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sync / Rebuild Action */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Catatan Perubahan Parameter:</p>
            <p>Pengaturan hyperparameter dikelola secara tersentralisasi pada tabel <code>rag_configurations</code>.</p>
          </div>

          <button
            onClick={onReindexAll}
            disabled={isReindexingAll}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span className={`material-symbols-outlined text-lg ${isReindexingAll ? 'animate-spin' : ''}`}>
              autorenew
            </span>
            <span>{isReindexingAll ? 'Sedang Re-indexing...' : 'Terapkan & Re-index Seluruh Dokumen'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
