import { useState } from 'react'

export default function ChunkInspectorModal({
  isOpen,
  onClose,
  documentData,
  onUpdateChunk,
  onDeleteChunk,
  onReindexDoc,
}) {
  const [editingChunkId, setEditingChunkId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)

  if (!isOpen || !documentData) return null

  const chunks = documentData.chunks || []

  const handleStartEdit = (chunk) => {
    setEditingChunkId(chunk.chunk_id)
    setEditContent(chunk.content)
  }

  const handleSaveEdit = async (chunkId) => {
    if (!editContent.trim()) return
    try {
      setIsActionLoading(true)
      await onUpdateChunk(chunkId, editContent.trim())
      setEditingChunkId(null)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDelete = async (chunkId) => {
    if (window.confirm('Hapus potongan chunk vektor ini?')) {
      try {
        setIsActionLoading(true)
        await onDeleteChunk(chunkId)
      } finally {
        setIsActionLoading(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[88vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">segment</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                  {documentData.title}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-100 text-indigo-800">
                  {chunks.length} Chunks
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Inspeksi potongan vektor teks hasil proses RAG chunking
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onReindexDoc(documentData.document_id)}
              disabled={isActionLoading}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs disabled:opacity-50"
              title="Buat Ulang Indeks Vektor"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              <span>Re-Index</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Chunks List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chunks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <span className="material-symbols-outlined text-4xl">inventory_2</span>
              <p className="text-xs">Belum ada potongan chunk vektor untuk dokumen ini.</p>
            </div>
          ) : (
            chunks.map((chunk, idx) => (
              <div
                key={chunk.chunk_id || idx}
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 transition-all hover:border-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold">
                      Chunk #{chunk.chunk_index !== undefined ? chunk.chunk_index + 1 : idx + 1}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {chunk.char_count || chunk.content.length} Karakter &bull;{' '}
                      {chunk.word_count || chunk.content.split(/\s+/).length} Kata
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {editingChunkId === chunk.chunk_id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(chunk.chunk_id)}
                          disabled={isActionLoading}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 cursor-pointer transition-colors"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingChunkId(null)}
                          className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300 cursor-pointer transition-colors"
                        >
                          Batal
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(chunk)}
                          className="p-1 text-slate-400 hover:text-primary rounded-lg hover:bg-white cursor-pointer transition-colors"
                          title="Edit Teks Chunk"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(chunk.chunk_id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white cursor-pointer transition-colors"
                          title="Hapus Chunk"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editingChunkId === chunk.chunk_id ? (
                  <textarea
                    rows={4}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-3 bg-white border border-primary rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed font-sans"
                  ></textarea>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs font-sans">
                    {chunk.content}
                  </p>
                )}

                {/* Metadata & Vector Embedding Signature */}
                {chunk.embedding_sample && Array.isArray(chunk.embedding_sample) && (
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-indigo-500">
                        hub
                      </span>
                      Vector Hash: [{chunk.embedding_sample.slice(0, 4).join(', ')}...]
                    </span>
                    <span>ID: {chunk.chunk_id}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            Tutup Inspeksi
          </button>
        </div>
      </div>
    </div>
  )
}
