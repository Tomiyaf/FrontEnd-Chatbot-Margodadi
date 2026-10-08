import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import KnowledgeStatsHeader from '../../components/knowledge-base/KnowledgeStatsHeader'
import TabSkeletonLoader from '../../components/common/TabSkeletonLoader'
import LazyModal from '../../components/common/LazyModal'
import { knowledgeBaseService } from '../../services/knowledgeBaseService'

// Lazy loaded sub-tabs (only loaded when the tab is clicked)
const KnowledgeDocumentsTab = lazy(() => import('../../components/knowledge-base/KnowledgeDocumentsTab'))
const KnowledgeSimulatorTab = lazy(() => import('../../components/knowledge-base/KnowledgeSimulatorTab'))
const KnowledgeConfigTab = lazy(() => import('../../components/knowledge-base/KnowledgeConfigTab'))

// Lazy loaded modals
const KnowledgeDocModal = lazy(() => import('../../components/admin/KnowledgeDocModal'))
const ChunkInspectorModal = lazy(() => import('../../components/admin/ChunkInspectorModal'))

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

  // Debounce search query
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
    if (activeTab === 'documents') {
      loadDocuments()
    }
  }, [activeTab, loadDocuments])

  // Handlers for Document Actions
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

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 animate-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <span className="text-xs sm:text-sm font-medium">{notification.msg}</span>
        </div>
      )}

      {/* 1. Header Metrik Stat Ringan */}
      <KnowledgeStatsHeader
        stats={stats}
        onReindexAll={handleReindexAll}
        isReindexingAll={isReindexingAll}
      />

      {/* 2. Tab Navigation Bar */}
      <div className="flex border-b border-slate-200/80 gap-2">
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'documents'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-lg">folder_open</span>
          <span>Daftar Dokumen SOP</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
            {stats.total_documents}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'simulator'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-lg">biotech</span>
          <span>Simulator RAG &amp; Cosine Search</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'config'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-lg">tune</span>
          <span>Konfigurasi Vector Store</span>
        </button>
      </div>

      {/* 3. On-Demand Active Tab Rendering with Suspense */}
      <Suspense fallback={<TabSkeletonLoader rows={4} title="Memuat Modul..." />}>
        {activeTab === 'documents' && (
          <KnowledgeDocumentsTab
            documents={documents}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            domainFilter={domainFilter}
            onDomainFilterChange={setDomainFilter}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            meta={meta}
            onOpenCreate={handleOpenCreateModal}
            onOpenEdit={handleOpenEditModal}
            onOpenInspector={handleOpenInspector}
            onReindexDoc={handleReindexDocument}
            onDeleteDoc={handleDeleteDocument}
          />
        )}

        {activeTab === 'simulator' && (
          <KnowledgeSimulatorTab
            simQuery={simQuery}
            onSimQueryChange={setSimQuery}
            simTopK={simTopK}
            onSimTopKChange={setSimTopK}
            simDomain={simDomain}
            onSimDomainChange={setSimDomain}
            isTestingRetrieval={isTestingRetrieval}
            onTestRetrieval={handleTestRetrieval}
            simResults={simResults}
          />
        )}

        {activeTab === 'config' && (
          <KnowledgeConfigTab
            stats={stats}
            onReindexAll={handleReindexAll}
            isReindexingAll={isReindexingAll}
          />
        )}
      </Suspense>

      {/* 4. Modals On-Demand (Lazy Loaded) */}
      <LazyModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        Component={KnowledgeDocModal}
        fallbackTitle="Menyiapkan Editor Dokumen..."
        componentProps={{
          onSubmit: handleSaveDocument,
          documentData: editingDoc,
          isLoading: isSavingDoc,
        }}
      />

      <LazyModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        Component={ChunkInspectorModal}
        fallbackTitle="Membuka Inspector Vector Chunks..."
        componentProps={{
          documentData: inspectingDoc,
          onUpdateChunk: handleUpdateChunk,
          onDeleteChunk: handleDeleteChunk,
          onReindexDoc: handleReindexDocument,
        }}
      />
    </div>
  )
}
