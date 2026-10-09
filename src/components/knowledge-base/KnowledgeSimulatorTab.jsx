import React from 'react'

export default function KnowledgeSimulatorTab({
  simQuery,
  onSimQueryChange,
  simTopK,
  onSimTopKChange,
  simDomain,
  onSimDomainChange,
  isTestingRetrieval,
  onTestRetrieval,
  simResults,
}) {
  const sampleQueries = [
    'Bagaimana syarat membuat surat keterangan domisili usaha pekon?',
    'Apa saja produk olahan kopi robusta unggulan Margodadi?',
    'Dimana jadwal pengumpulan sampah organik bank sampah desa?',
    'Berapa lama proses pembuatan izin usaha mikro kecil pekon?',
  ]

  return (
    <div className="space-y-6">
      {/* Simulator Control Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600 text-xl">biotech</span>
            <span>Simulator Semantic Search &amp; Cosine Similarity pgvector</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Uji akurasi pencarian semantik vektor AI berdasarkan query pertanyaan warga Margodadi.
          </p>
        </div>

        {/* Input Query */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Pertanyaan Warga / Query Uji Coba:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={simQuery}
              onChange={(e) => onSimQueryChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onTestRetrieval()}
              placeholder="Ketik pertanyaan warga (contoh: syarat surat izin usaha, bank sampah pekon)..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
            <button
              onClick={() => onTestRetrieval()}
              disabled={isTestingRetrieval || !simQuery.trim()}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <span className={`material-symbols-outlined text-lg ${isTestingRetrieval ? 'animate-spin' : ''}`}>
                {isTestingRetrieval ? 'sync' : 'search_insights'}
              </span>
              <span>{isTestingRetrieval ? 'Menganalisis Vektor...' : 'Uji Retrieval'}</span>
            </button>
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {/* Top-K Slider */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span>Top-K Chunks Terdekat:</span>
              <span className="font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-bold">
                K = {simTopK}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={simTopK}
              onChange={(e) => onSimTopKChange(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 (Spesifik)</span>
              <span>4 (Optimal)</span>
              <span>8 (Luas)</span>
            </div>
          </div>

          {/* Domain Filter */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Filter Domain Layanan:</label>
            <select
              value={simDomain}
              onChange={(e) => onSimDomainChange(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="ALL">Semua Domain (Global)</option>
              <option value="PUBLIC_SERVICE">Layanan Publik Desa</option>
              <option value="UMKM">Potensi &amp; Produk UMKM</option>
              <option value="WASTE_EDUCATION">Edukasi Pengelolaan Sampah</option>
            </select>
          </div>

          {/* Metric Guide */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">analytics</span>
            </div>
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-slate-800">Skor Cosine Distance</p>
              <p className="text-slate-500 text-[11px]">&gt; 75%: Sangat Relevan (RAG Hit)</p>
            </div>
          </div>
        </div>

        {/* Quick Sample Queries */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Contoh Query Populer Warga:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSimQueryChange(q)
                  onTestRetrieval(q)
                }}
                className="text-xs bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-left"
              >
                &ldquo;{q}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulator Results Output */}
      {simResults && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
              <span>Hasil Retrieval Teratas ({simResults.results?.length || 0} Chunks Ditemukan)</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Waktu Eksekusi: <strong>{simResults.benchmark?.latency_ms || 12} ms</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {simResults.results?.map((item, idx) => {
              const scorePct = Math.round((item.similarity_score || 0) * 100)
              const isHighRelevance = scorePct >= 75
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{item.document_title}</span>
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        Chunk #{item.chunk_index}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Similarity Score</span>
                        <span className={`text-sm font-black ${isHighRelevance ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {scorePct}% Match
                        </span>
                      </div>
                      <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isHighRelevance ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${scorePct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Chunk Content Text */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/50 font-sans">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>ID Dokumen: DOC-{item.document_id}</span>
                    <span>Domain: {item.domain}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
