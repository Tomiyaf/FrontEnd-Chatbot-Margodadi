import { useState, useEffect } from 'react'

export default function KnowledgeDocModal({
  isOpen,
  onClose,
  onSubmit,
  documentData = null,
  isLoading = false,
}) {
  const [title, setTitle] = useState('')
  const [domain, setDomain] = useState('PUBLIC_SERVICE')
  const [source, setSource] = useState('')
  const [validator, setValidator] = useState('Kasi Pelayanan')
  const [version, setVersion] = useState('v1.0')
  const [isActive, setIsActive] = useState(true)
  const [content, setContent] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    if (documentData) {
      setTitle(documentData.title || '')
      setDomain(documentData.domain || 'PUBLIC_SERVICE')
      setSource(documentData.source || '')
      setValidator(documentData.validator || 'Kasi Pelayanan')
      setVersion(documentData.version || 'v1.0')
      setIsActive(documentData.is_active ?? true)
      setSelectedFile(null)
      // If documentData has chunks, join them as default content
      if (documentData.chunks && documentData.chunks.length > 0) {
        setContent(documentData.chunks.map((c) => c.content).join('\n\n'))
      } else {
        setContent(documentData.content || '')
      }
    } else {
      setTitle('')
      setDomain('PUBLIC_SERVICE')
      setSource('')
      setValidator('Kasi Pelayanan')
      setVersion('v1.0')
      setIsActive(true)
      setContent('')
      setSelectedFile(null)
    }
  }, [documentData, isOpen])

  if (!isOpen) return null

  const estimatedChunks = Math.max(1, Math.ceil((content.trim().length || 0) / 450))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      title,
      domain,
      source,
      validator,
      version,
      is_active: isActive,
      content,
      file: selectedFile,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">
                {documentData ? 'edit_note' : 'post_add'}
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {documentData ? 'Sunting Dokumen Pengetahuan & Vektor' : 'Tambah Dokumen SOP Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Dokumen akan otomatis dipecah menjadi potongan vektor (chunks) untuk AI RAG
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Judul Dokumen / SOP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: SOP Pengurusan Surat Keterangan Usaha (SKU)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kategori Domain Layanan <span className="text-red-500">*</span>
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                <option value="PUBLIC_SERVICE">🏛️ Layanan Publik & Administrasi</option>
                <option value="UMKM">🛍️ Direktori & Produk UMKM</option>
                <option value="WASTE_EDUCATION">♻️ Edukasi Pengelolaan Sampah 3R</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pejabat / Validator SOP
              </label>
              <input
                type="text"
                value={validator}
                onChange={(e) => setValidator(e.target.value)}
                placeholder="Contoh: Kasi Pelayanan / Tim TPS3R"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Sumber Regulasi / SOP Dasar
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Contoh: Peraturan Desa No. 04/2024"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Versi
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="v2.1"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isActive ? 'check_circle' : 'do_not_disturb_on'}
                  </span>
                  <span>{isActive ? 'Aktif' : 'Non-Aktif'}</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            {!documentData && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Upload File SOP / Dokumen
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.xlsx,.xls,.txt"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all file:mr-3 file:border-0 file:bg-primary/10 file:text-primary file:rounded-lg file:px-3 file:py-1.5 file:text-xs file:font-bold"
                />
                {selectedFile && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    File siap diindeks: {selectedFile.name}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Materi / Konten Teks Dokumen {!selectedFile && <span className="text-red-500">*</span>}
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {content.length} karakter &bull; ~{estimatedChunks} Chunks Vektor
              </span>
            </div>
            <textarea
              required={!selectedFile}
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan isi aturan SOP, rincian syarat berkas, alur pembuatan, tarif/biaya, dan informasi operasional terkait disini..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all leading-relaxed"
            ></textarea>
            <p className="text-[11px] text-slate-400 mt-1">
              💡 Sistem akan memecah teks menjadi potongan (*chunks*) semantik berukuran 400–600 karakter dengan overlap 50 karakter agar pencarian RAG akurat.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">
                    progress_activity
                  </span>
                  <span>Menyimpan & Mengindeks...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>{documentData ? 'Perbarui & Re-Index' : 'Simpan & Indeks Vektor'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
