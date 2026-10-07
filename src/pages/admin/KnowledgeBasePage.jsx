import { useState, useEffect, useCallback } from 'react'
import DataTable from '../../components/admin/DataTable'
import Pagination from '../../components/admin/Pagination'
import KnowledgeDocModal from '../../components/admin/KnowledgeDocModal'
import ChunkInspectorModal from '../../components/admin/ChunkInspectorModal'
import { knowledgeBaseService } from '../../services/knowledgeBaseService'

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState('documents') // 'documents' | 'simulator' | 'config'
  const [stats, setStats] = useState({
    total_documents: 0,
    active_documents: 0,
    total_chunks: 0,
    avg_chunks_per_doc: 0,
    domain_breakdown: { PUBLIC_SERVICE: 0, UMKM: 0, WASTE_EDUCATION: 0 },
    embedding_model: 'text-embedding-3-small',
    llm_model: 'gpt-4o-mini',
    chunk_size: 500,
    chunk_overlap: 50,
    last_indexed_at: '-',
  })

  // Documents state
  const [documents, setDocuments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [domainFilter, setDomainFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 })
  const [isLoading, setIsLoading] = useState(true)

  // Modals state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)
  const [isSavingDoc, setIsSavingDoc] = useState(false)

  const [isInspectorOpen, setIsInspectorOpen] = useState(false)
  const [inspectingDoc, setInspectingDoc] = useState(null)

  const [isReindexingAll, setIsReindexingAll] = useState(false)
  const [notification, setNotification] = useState(null)

  // Simulator state
  const [simQuery, setSimQuery] = useState('')
  const [simTopK, setSimTopK] = useState(4)
  const [simDomain, setSimDomain] = useState('ALL')
  const [isTestingRetrieval, setIsTestingRetrieval] = useState(false)
  const [simResults, setSimResults] = useState(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const loadStats = async () => {
    try {
      const res = await knowledgeBaseService.getStats()
      if (res.status === 'success' && res.data) {
        setStats(res.data)
      }
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const loadDocuments = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = {
        page: currentPage,
        per_page: 10,
      }
      if (domainFilter !== 'ALL') params.domain = domainFilter
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim()

      const res = await knowledgeBaseService.getDocuments(params)
      if (res.status === 'success' && res.data) {
        setDocuments(res.data)
        if (res.meta) setMeta(res.meta)
      }
    } catch (err) {
      console.error('Failed to load documents:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, domainFilter, debouncedSearch])

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  // Handlers for Document CRUD
  const handleOpenCreateModal = () => {
    setEditingDoc(null)
    setIsDocModalOpen(true)
  }

  const handleOpenEditModal = async (doc) => {
    try {
      const res = await knowledgeBaseService.getDocument(doc.document_id)
      if (res.status === 'success') {
        setEditingDoc(res.data)
        setIsDocModalOpen(true)
      }
    } catch (err) {
      console.error('Failed to get doc detail:', err)
    }
  }

  const handleOpenInspector = async (doc) => {
    try {
      const res = await knowledgeBaseService.getDocument(doc.document_id)
      if (res.status === 'success') {
        setInspectingDoc(res.data)
        setIsInspectorOpen(true)
      }
    } catch (err) {
      console.error('Failed to get doc chunks:', err)
    }
  }

  const handleSaveDocument = async (formData) => {
    setIsSavingDoc(true)
    try {
      if (editingDoc) {
        await knowledgeBaseService.updateDocument(editingDoc.document_id, formData)
        showNotification('Dokumen SOP dan indeks vektor berhasil diperbarui.')
      } else {
        await knowledgeBaseService.createDocument(formData)
        showNotification('Dokumen SOP baru berhasil ditambahkan dan diindeks.')
      }
      setIsDocModalOpen(false)
      loadDocuments()
      loadStats()
    } catch (err) {
      console.error('Save doc failed:', err)
      alert(err.response?.data?.message || err.message || 'Gagal menyimpan dokumen.')
    } finally {
      setIsSavingDoc(false)
    }
  }

  const handleDeleteDocument = async (docId, title) => {
    if (window.confirm(`Yakin ingin menghapus dokumen "${title}" beserta seluruh data vektornya?`)) {
      try {
        await knowledgeBaseService.deleteDocument(docId)
        showNotification(`Dokumen "${title}" berhasil dihapus.`)
        loadDocuments()
        loadStats()
      } catch (err) {
        console.error('Delete doc failed:', err)
        alert('Gagal menghapus dokumen.')
      }
    }
  }

  const handleReindexDocument = async (docId) => {
    try {
      await knowledgeBaseService.reindexDocument(docId)
      showNotification('Indeks vektor dokumen berhasil diperbarui.')
      loadDocuments()
      loadStats()
      if (inspectingDoc && inspectingDoc.document_id === docId) {
        const res = await knowledgeBaseService.getDocument(docId)
        if (res.status === 'success') setInspectingDoc(res.data)
      }
    } catch (err) {
      console.error('Reindex doc failed:', err)
    }
  }

  const handleReindexAll = async () => {
    if (window.confirm('Jalankan proses re-indexing menyeluruh untuk seluruh dokumen aktif?')) {
      setIsReindexingAll(true)
      try {
        const res = await knowledgeBaseService.reindexAll()
        showNotification(res.message || 'Seluruh basis data vektor berhasil disinkronkan.')
        loadDocuments()
        loadStats()
      } catch (err) {
        console.error('Reindex all failed:', err)
        alert('Gagal sinkronisasi vektor.')
      } finally {
        setIsReindexingAll(false)
      }
    }
  }

  const handleUpdateChunk = async (chunkId, content) => {
    await knowledgeBaseService.updateChunk(chunkId, content)
    showNotification('Potongan chunk vektor berhasil diperbarui.')
    if (inspectingDoc) {
      const res = await knowledgeBaseService.getDocument(inspectingDoc.document_id)
      if (res.status === 'success') setInspectingDoc(res.data)
    }
  }

  const handleDeleteChunk = async (chunkId) => {
    await knowledgeBaseService.deleteChunk(chunkId)
    showNotification('Chunk berhasil dihapus.')
    if (inspectingDoc) {
      const res = await knowledgeBaseService.getDocument(inspectingDoc.document_id)
      if (res.status === 'success') setInspectingDoc(res.data)
    }
    loadDocuments()
    loadStats()
  }

  // Simulator Handler
  const handleTestRetrieval = async (queryText = simQuery) => {
    if (!queryText.trim()) return
    setIsTestingRetrieval(true)
    try {
      const res = await knowledgeBaseService.testRetrieval({
        query: queryText.trim(),
        top_k: simTopK,
        domain: simDomain !== 'ALL' ? simDomain : undefined,
      })
      if (res.status === 'success') {
        setSimResults(res.data)
      }
    } catch (err) {
      console.error('Test retrieval failed:', err)
    } finally {
      setIsTestingRetrieval(false)
    }
  }

  const getDomainBadge = (domain) => {
    switch (domain) {
      case 'PUBLIC_SERVICE':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">account_balance</span>
            <span>Layanan Publik</span>
          </span>
        )
      case 'UMKM':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">storefront</span>
            <span>Potensi UMKM</span>
          </span>
        )
      case 'WASTE_EDUCATION':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">recycling</span>
            <span>Edukasi Sampah</span>
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {domain}
          </span>
        )
    }
  }

  const columns = [
    {
      header: 'Dokumen SOP & Regulasi',
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
              {row.doc_code}
            </span>
            <span className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
              {row.title}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-slate-400">description</span>
            <span>{row.source}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Domain',
      render: (row) => getDomainBadge(row.domain),
    },
    {
      header: 'Validator',
      render: (row) => (
        <div className="text-xs text-slate-700 font-medium">
          <div>{row.validator}</div>
          <div className="text-[10px] text-slate-400 font-mono">Versi {row.version}</div>
        </div>
      ),
    },
    {
      header: 'Vektor Chunks',
      render: (row) => (
        <button
          type="button"
          onClick={() => handleOpenInspector(row)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold font-mono transition-colors cursor-pointer shadow-2xs"
          title="Klik untuk melihat potongan vektor"
        >
          <span className="material-symbols-outlined text-xs">segment</span>
          <span>{row.chunks_count} Chunks</span>
        </button>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
            row.is_active
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${row.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
          <span>{row.is_active ? 'Aktif di AI' : 'Non-Aktif'}</span>
        </span>
      ),
    },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleOpenInspector(row)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
            title="Inspeksi Chunks Vektor"
          >
            <span className="material-symbols-outlined text-lg">segment</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
            title="Sunting Dokumen SOP"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
          <button
            type="button"
            onClick={() => handleReindexDocument(row.document_id)}
            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
            title="Re-Index Vektor"
          >
            <span className="material-symbols-outlined text-lg">sync</span>
          </button>
          <button
            type="button"
            onClick={() => handleDeleteDocument(row.document_id, row.title)}
            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            title="Hapus Dokumen"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      ),
    },
  ]

  const presetQueries = [
    'Berapa biaya pembuatan Surat Keterangan Usaha (SKU)?',
    'Apa saja syarat permohonan SKTM untuk beasiswa?',
    'Kapan jadwal buka dan penimbangan Bank Sampah Berkah?',
    'Apakah ada katalog olahan keripik pisang dan kopi robusta?',
    'Bagaimana alur perekaman KTP-el pemula di Pekon Margodadi?',
  ]

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Knowledge Base & Data Vektor AI</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
              RAG Engine v2.1
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola basis pengetahuan desa, lakukan *chunking* otomatis, dan perbarui data vektor yang digunakan AI Virtual Guide Margodadi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReindexAll}
            disabled={isReindexingAll}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-2xs text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            title="Re-Index Semua Vektor"
          >
            <span className={`material-symbols-outlined text-base ${isReindexingAll ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{isReindexingAll ? 'Menyinkronkan...' : 'Sinkronkan Semua'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Tambah SOP / Dokumen</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">menu_book</span>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Dokumen SOP Aktif</div>
            <div className="text-lg font-black text-slate-900">
              {stats.active_documents} <span className="text-xs font-normal text-slate-400">/ {stats.total_documents}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">hub</span>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Chunks Vektor</div>
            <div className="text-lg font-black text-indigo-600 font-mono">
              {stats.total_chunks} <span className="text-xs font-normal text-slate-400">potongan</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">psychology</span>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Embedding Model</div>
            <div className="text-xs font-black text-slate-900 font-mono truncate max-w-[140px]" title={stats.embedding_model}>
              {stats.embedding_model}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">tune</span>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Ukuran Chunk (RAG)</div>
            <div className="text-xs font-black text-slate-900 font-mono">
              {stats.chunk_size}c / {stats.chunk_overlap}c ovl
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`pb-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'documents'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">folder</span>
          <span>Dokumen SOP & Potongan Vektor ({stats.total_documents})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`pb-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'simulator'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">travel_explore</span>
          <span>Simulator Pencarian Semantik (Vector Retrieval Playground)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('config')}
          className={`pb-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'config'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">settings_suggest</span>
          <span>Spesifikasi Engine RAG</span>
        </button>
      </div>

      {/* TAB 1: DOCUMENTS & CHUNKS */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          {/* Table Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul SOP, nomor regulasi, atau isi teks..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={domainFilter}
                onChange={(e) => {
                  setDomainFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="ALL">Semua Domain Layanan</option>
                <option value="PUBLIC_SERVICE">🏛️ Layanan Publik ({stats.domain_breakdown.PUBLIC_SERVICE || 0})</option>
                <option value="UMKM">🛍️ Potensi UMKM ({stats.domain_breakdown.UMKM || 0})</option>
                <option value="WASTE_EDUCATION">♻️ Edukasi Sampah ({stats.domain_breakdown.WASTE_EDUCATION || 0})</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">
                progress_activity
              </span>
              <p className="text-xs">Memuat data dokumen pengetahuan...</p>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={documents}
                emptyMessage="Belum ada dokumen SOP yang sesuai dengan filter pencarian."
              />

              {meta.last_page > 1 && (
                <div className="pt-2">
                  <Pagination
                    currentPage={meta.current_page}
                    totalPages={meta.last_page}
                    totalItems={meta.total}
                    itemsPerPage={meta.per_page}
                    onPageChange={(p) => setCurrentPage(p)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB 2: SIMULATOR & VECTOR SEARCH TESTER */}
      {activeTab === 'simulator' && (
        <div className="space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">travel_explore</span>
                <span>Uji Simulasi Pencarian Semantik Vektor (Similarity Test)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ketikkan pertanyaan warga untuk melihat bagaimana algoritma RAG mencocokkan potongan vektor (*chunks*) beserta estimasi skor *Cosine Similarity*.
              </p>
            </div>

            {/* Preset Query Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Contoh Pertanyaan Cepat:
              </span>
              <div className="flex flex-wrap gap-2">
                {presetQueries.map((pq, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSimQuery(pq)
                      handleTestRetrieval(pq)
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
                  >
                    💬 {pq}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                  search
                </span>
                <input
                  type="text"
                  value={simQuery}
                  onChange={(e) => setSimQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTestRetrieval()}
                  placeholder="Ketik pertanyaan warga untuk diuji, contoh: Apa saja syarat surat keterangan tidak mampu?"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={simTopK}
                  onChange={(e) => setSimTopK(Number(e.target.value))}
                  className="px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  title="Jumlah Top-K Chunks yang diambil"
                >
                  <option value={2}>Top 2 Chunks</option>
                  <option value={4}>Top 4 Chunks (Default)</option>
                  <option value={6}>Top 6 Chunks</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleTestRetrieval()}
                  disabled={isTestingRetrieval || !simQuery.trim()}
                  className="px-6 py-3 bg-primary hover:bg-primary-container text-white rounded-2xl text-xs font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isTestingRetrieval ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">
                        progress_activity
                      </span>
                      <span>Mencari...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      <span>Uji Retrieval</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Output */}
          {simResults && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Hasil Pencocokan Vektor Terpilih ({simResults.matched_count} dari {simResults.total_candidates} candidates)
                  </h4>
                </div>
                <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                  <span>⏱️ Latensi Inferensi: <b>{simResults.execution_time}</b></span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {simResults.results.map((item, idx) => (
                  <div
                    key={item.chunk_id || idx}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5 hover:border-primary/40 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-white font-mono text-[10px] font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {item.document_title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          (Chunk #{item.chunk_index + 1})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                            item.similarity >= 0.7
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : item.similarity >= 0.4
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          Cosine Similarity: {item.similarity_percentage}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans shadow-2xs">
                      {item.content}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>🏛️ Validator: {item.validator} &bull; Sumber: {item.source}</span>
                      <span>{item.char_count} karakter</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CONFIGURATION */}
      {activeTab === 'config' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Spesifikasi Arsitektur RAG & Vektor</h3>
            <p className="text-xs text-slate-500">
              Parameter pemotongan teks (*chunking*) dan model embedding aktif yang digunakan sistem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <span className="material-symbols-outlined text-primary text-base">hub</span>
                <span>Embedding & Vector Store</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Model Embedding:</span>
                  <span className="font-mono font-bold text-slate-800">{stats.embedding_model}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Dimensi Vektor:</span>
                  <span className="font-mono font-bold text-slate-800">1536 float32 (Standard)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Metrik Kemiripan:</span>
                  <span className="font-mono font-bold text-slate-800">Cosine Similarity (Top-K = 4)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Sinkronisasi Terakhir:</span>
                  <span className="font-mono font-bold text-slate-800">{stats.last_indexed_at}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <span className="material-symbols-outlined text-primary text-base">tune</span>
                <span>Chunking & LLM Synthesis</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Model LLM Utama:</span>
                  <span className="font-mono font-bold text-slate-800">{stats.llm_model}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Ukuran Chunk Target:</span>
                  <span className="font-mono font-bold text-slate-800">{stats.chunk_size} Karakter</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Panjang Overlap:</span>
                  <span className="font-mono font-bold text-slate-800">{stats.chunk_overlap} Karakter</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Pemisah Kalimat:</span>
                  <span className="font-mono font-bold text-slate-800">Sentence boundary / regex delimiter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <KnowledgeDocModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSubmit={handleSaveDocument}
        documentData={editingDoc}
        isLoading={isSavingDoc}
      />

      <ChunkInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        documentData={inspectingDoc}
        onUpdateChunk={handleUpdateChunk}
        onDeleteChunk={handleDeleteChunk}
        onReindexDoc={handleReindexDocument}
      />
    </div>
  )
}
