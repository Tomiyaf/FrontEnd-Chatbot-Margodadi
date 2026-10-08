import React from 'react'

export default function KnowledgeStatsHeader({ stats, onReindexAll, isReindexingAll }) {
  return (
    <div className="space-y-4">
      {/* Top Title & Sync All Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-emerald-600">database</span>
            <h1 className="text-2xl font-bold text-slate-900">Knowledge Base & AI Vector Store</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manajemen dokumen SOP, chunking cerdas, dan visualisasi retrieval semantik pgvector.
          </p>
        </div>

        <button
          onClick={onReindexAll}
          disabled={isReindexingAll}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-700 font-semibold text-sm rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <span className={`material-symbols-outlined text-lg ${isReindexingAll ? 'animate-spin text-emerald-600' : ''}`}>
            sync
          </span>
          <span>{isReindexingAll ? 'Menyinkronkan...' : 'Re-index Semua Vektor'}</span>
        </button>
      </div>

      {/* 4 Bento Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Dokumen</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">article</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{stats.total_documents}</span>
            <span className="text-xs font-semibold text-emerald-600">({stats.active_documents} Aktif)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">SOP & Panduan Terdaftar</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Chunks Vektor</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">view_stream</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{stats.total_chunks}</span>
            <span className="text-xs font-semibold text-slate-500">~{stats.avg_chunks_per_doc} / doc</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dimensi 1536 (pgvector)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Model AI Embedding</span>
            <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">psychology</span>
            </span>
          </div>
          <div className="mt-2">
            <span className="text-sm font-bold text-slate-900 truncate block">{stats.embedding_model}</span>
            <span className="text-xs font-medium text-slate-500">LLM: {stats.llm_model}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Chunk: {stats.chunk_size}c (ov: {stats.chunk_overlap}c)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Terakhir Sinkron</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">history</span>
            </span>
          </div>
          <div className="mt-2">
            <span className="text-sm font-bold text-slate-900 truncate block">{stats.last_indexed_at}</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Vector Store Sinkron
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Status pgvector Ready</p>
        </div>
      </div>
    </div>
  )
}
