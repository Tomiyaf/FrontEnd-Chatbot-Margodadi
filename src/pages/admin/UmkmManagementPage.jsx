import React, { useState, useEffect, useCallback } from 'react'
import umkmAdminService from '../../services/umkmAdminService'
import UmkmFormModal from '../../components/admin/umkm/UmkmFormModal'
import UmkmPreviewModal from '../../components/admin/umkm/UmkmPreviewModal'
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal'

export default function UmkmManagementPage() {
  const [umkms, setUmkms] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({
    total_umkm: 0,
    active_umkm: 0,
    inactive_umkm: 0,
    verified_umkm: 0,
    unverified_umkm: 0,
    total_products: 0,
    ai_indexed_count: 0,
    ai_indexed_percent: 0,
  })

  // Filter States
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [verifiedFilter, setVerifiedFilter] = useState('all')
  const [aiSyncFilter, setAiSyncFilter] = useState('all')
  const [sort, setSort] = useState('latest')
  const [currentPage, setCurrentPage] = useState(1)
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 })

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSyncingAll, setIsSyncingAll] = useState(false)
  const [syncingId, setSyncingId] = useState(null)
  const [toast, setToast] = useState(null)

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUmkm, setEditingUmkm] = useState(null)
  const [previewUmkm, setPreviewUmkm] = useState(null)
  const [deletingUmkm, setDeletingUmkm] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3500)
  }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // Load KPI Stats
  const loadStats = async () => {
    try {
      const res = await umkmAdminService.getStats()
      if (res.status === 'success' && res.data) {
        setStats(res.data)
      }
    } catch (err) {
      console.warn('Gagal memuat statistik UMKM:', err)
    }
  }

  // Load Categories
  const loadCategories = async () => {
    try {
      const res = await umkmAdminService.getCategories()
      if (res.status === 'success' && res.data) {
        setCategories(res.data)
      }
    } catch (err) {
      console.warn('Gagal memuat kategori UMKM:', err)
    }
  }

  // Load UMKMs
  const loadUmkms = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        per_page: 10,
        sort,
      }
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim()
      if (selectedCategory !== 'all') params.category_id = selectedCategory
      if (statusFilter !== 'all') params.status = statusFilter
      if (verifiedFilter !== 'all') params.verified = verifiedFilter
      if (aiSyncFilter !== 'all') params.ai_synced = aiSyncFilter

      const res = await umkmAdminService.getUmkms(params)
      if (res.status === 'success' && res.data) {
        setUmkms(res.data)
        if (res.meta) setMeta(res.meta)
      }
    } catch (err) {
      console.error('Gagal mengambil data UMKM:', err)
      showToast('Gagal mengambil data UMKM dari server.', 'error')
    } finally {
      setLoading(false)
    }
  }, [currentPage, debouncedSearch, selectedCategory, statusFilter, verifiedFilter, aiSyncFilter, sort])

  useEffect(() => {
    loadCategories()
    loadStats()
  }, [])

  useEffect(() => {
    loadUmkms()
  }, [loadUmkms])

  // Form submit (Create or Update)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      if (editingUmkm) {
        await umkmAdminService.updateUmkm(editingUmkm.id, formData)
        showToast(`Data UMKM "${editingUmkm.name}" berhasil diperbarui dan disinkronkan ke AI.`)
      } else {
        await umkmAdminService.createUmkm(formData)
        showToast('Data UMKM baru berhasil disimpan dan diindeks ke AI Virtual Guide.')
      }
      setIsFormOpen(false)
      setEditingUmkm(null)
      loadUmkms()
      loadStats()
    } catch (err) {
      console.error('Gagal menyimpan UMKM:', err)
      let errorMsg =
        err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data UMKM.'
      if (err.response?.data?.errors) {
        const errorList = Object.values(err.response.data.errors).flat().join(' • ')
        if (errorList) errorMsg = errorList
      }
      showToast(errorMsg, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick Toggle Active Status
  const handleToggleStatus = async (umkm) => {
    const newStatus = !umkm.is_active
    // Optimistic update
    setUmkms((prev) =>
      prev.map((item) => (item.id === umkm.id ? { ...item, is_active: newStatus } : item))
    )

    try {
      await umkmAdminService.toggleStatus(umkm.id, newStatus)
      showToast(`Status publikasi "${umkm.name}" berhasil diubah.`)
      loadStats()
    } catch (err) {
      console.error('Gagal mengubah status aktif:', err)
      showToast('Gagal mengubah status aktif UMKM.', 'error')
      // Revert optimistic update
      setUmkms((prev) =>
        prev.map((item) => (item.id === umkm.id ? { ...item, is_active: umkm.is_active } : item))
      )
    }
  }

  // Quick Verify UMKM
  const handleVerify = async (umkm) => {
    try {
      await umkmAdminService.verifyUmkm(umkm.id)
      showToast(`UMKM "${umkm.name}" berhasil diverifikasi resmi oleh Balai Pekon.`)
      loadUmkms()
      loadStats()
    } catch (err) {
      console.error('Gagal memverifikasi UMKM:', err)
      showToast('Gagal memverifikasi UMKM.', 'error')
    }
  }

  // Single AI Sync
  const handleSingleAiSync = async (umkm) => {
    setSyncingId(umkm.id)
    try {
      const res = await umkmAdminService.syncUmkmToAi(umkm.id)
      if (res.data?.status === 'warning') {
        showToast(`Data tersimpan, namun ${res.data.message}`, 'warning')
      } else {
        showToast(`UMKM "${umkm.name}" berhasil disinkronkan ke AI Vector Store!`)
      }
      loadUmkms()
      loadStats()
    } catch (err) {
      console.error('Gagal sinkron AI:', err)
      showToast('Gagal menyinkronkan data ke AI (Pastikan layanan RAG aktif).', 'error')
    } finally {
      setSyncingId(null)
    }
  }

  // Bulk AI Sync
  const handleBulkAiSync = async () => {
    setIsSyncingAll(true)
    try {
      const res = await umkmAdminService.syncAllToAi()
      const data = res.data
      if (data && data.success > 0) {
        showToast(
          `Sinkronisasi massal selesai: ${data.success} dari ${data.total} UMKM berhasil diindeks (${data.total_chunks} chunks).`
        )
      } else {
        showToast(
          `Sinkronisasi selesai: Layanan AI Python sedang offline. Silakan pastikan server Python berjalan di port 8001.`,
          'warning'
        )
      }
      loadUmkms()
      loadStats()
    } catch (err) {
      console.error('Gagal sinkronisasi massal ke AI:', err)
      showToast('Gagal melakukan sinkronisasi AI massal.', 'error')
    } finally {
      setIsSyncingAll(false)
    }
  }

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!deletingUmkm) return
    setIsDeleting(true)
    try {
      await umkmAdminService.deleteUmkm(deletingUmkm.id)
      showToast(`UMKM "${deletingUmkm.name}" berhasil dihapus dari sistem dan AI.`)
      setDeletingUmkm(null)
      loadUmkms()
      loadStats()
    } catch (err) {
      console.error('Gagal menghapus UMKM:', err)
      showToast('Gagal menghapus data UMKM.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Edit Action (load full details)
  const handleOpenEdit = async (umkm) => {
    try {
      const res = await umkmAdminService.getUmkmDetail(umkm.id)
      if (res.status === 'success' && res.data) {
        setEditingUmkm(res.data)
        setIsFormOpen(true)
      }
    } catch (err) {
      console.error('Gagal memuat detail UMKM untuk diedit:', err)
      showToast('Gagal memuat rincian data UMKM.', 'error')
    }
  }

  // Preview Action
  const handleOpenPreview = async (umkm) => {
    try {
      const res = await umkmAdminService.getUmkmDetail(umkm.id)
      if (res.status === 'success' && res.data) {
        setPreviewUmkm(res.data)
      }
    } catch (err) {
      console.error('Gagal memuat detail UMKM untuk preview:', err)
      showToast('Gagal membuka pratinjau UMKM.', 'error')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === 'error'
              ? 'bg-rose-900 text-white'
              : toast.type === 'warning'
              ? 'bg-amber-900 text-white'
              : 'bg-slate-900 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {toast.type === 'error' ? 'error' : toast.type === 'warning' ? 'warning' : 'check_circle'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. Header & Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
              Potensi Pekon &amp; Etalase UMKM
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Terintegrasi AI Vector Store</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Direktori Potensi UMKM Margodadi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data usaha warga, perbarui varian produk, dan sinkronkan otomatis ke Virtual Guide AI (Zero Re-upload)
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleBulkAiSync}
            disabled={isSyncingAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            title="Sinkronkan seluruh profil UMKM ke basis pengetahuan AI RAG"
          >
            <span
              className={`material-symbols-outlined text-lg text-indigo-600 ${
                isSyncingAll ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
            <span>{isSyncingAll ? 'Menyinkronkan AI...' : 'Sinkronkan ke AI Vector'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingUmkm(null)
              setIsFormOpen(true)
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white hover:bg-primary-container text-xs font-bold transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add_business</span>
            <span>+ Registrasi UMKM Baru</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total UMKM */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total UMKM Terdaftar
            </span>
            <div className="text-2xl font-black text-slate-900">{stats.total_umkm}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 mt-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{stats.active_umkm} Aktif di Portal</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">storefront</span>
          </div>
        </div>

        {/* Card 2: Terverifikasi Pekon */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Terverifikasi Pekon
            </span>
            <div className="text-2xl font-black text-slate-900">{stats.verified_umkm}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              {stats.unverified_umkm} Butuh Peninjauan
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
        </div>

        {/* Card 3: Total Produk Unggulan */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Ragam Produk Unggulan
            </span>
            <div className="text-2xl font-black text-slate-900">{stats.total_products}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              Katalog Varian Produk
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">inventory_2</span>
          </div>
        </div>

        {/* Card 4: Terindeks AI Vector Store */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              AI Vector Store Sync
            </span>
            <div className="text-2xl font-black text-indigo-700">
              {stats.ai_indexed_count}{' '}
              <span className="text-sm font-normal text-slate-400">/ {stats.total_umkm}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 mt-1 font-bold">
              <span className="material-symbols-outlined text-xs">smart_toy</span>
              <span>{stats.ai_indexed_percent}% Siap di Virtual Guide</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">hub</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Search Toolbar */}
      <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari UMKM, produk unggulan, pemilik, dusun..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Category, Status, & Verification Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name} ({cat.umkms_count})
                </option>
              ))}
            </select>

            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="all">Status: Semua</option>
              <option value="active">Aktif di Portal</option>
              <option value="inactive">Nonaktif</option>
            </select>

            {/* Verified Select */}
            <select
              value={verifiedFilter}
              onChange={(e) => {
                setVerifiedFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="all">Verifikasi: Semua</option>
              <option value="verified">Terverifikasi Pekon</option>
              <option value="unverified">Belum Diverifikasi</option>
            </select>

            {/* AI Sync Select */}
            <select
              value={aiSyncFilter}
              onChange={(e) => {
                setAiSyncFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="all">AI Vektor: Semua</option>
              <option value="synced">Sudah di AI</option>
              <option value="unsynced">Belum di AI</option>
            </select>

            {/* Sort Select */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="latest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="az">Nama (A - Z)</option>
              <option value="za">Nama (Z - A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 sm:px-6">UMKM &amp; Sampul</th>
                <th className="py-3.5 px-4">Pemilik &amp; Kontak</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Produk Unggulan</th>
                <th className="py-3.5 px-4 text-center">Status Publik</th>
                <th className="py-3.5 px-4">Verifikasi</th>
                <th className="py-3.5 px-4 text-center">Vektor AI</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center text-slate-400 space-y-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs">Memuat data direktori UMKM...</p>
                  </td>
                </tr>
              ) : umkms.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center text-slate-400 space-y-2">
                    <span className="material-symbols-outlined text-4xl text-slate-300">
                      storefront
                    </span>
                    <p className="text-sm font-bold text-slate-700">Data UMKM Tidak Ditemukan</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Belum ada UMKM yang cocok dengan filter atau kata kunci pencarian.
                    </p>
                  </td>
                </tr>
              ) : (
                umkms.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* UMKM & Banner */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {item.banner_image_url ? (
                            <img
                              src={item.banner_image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <span className="material-symbols-outlined text-xl">store</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono font-bold text-slate-400 block mb-0.5">
                            {item.reg_number}
                          </span>
                          <span className="font-bold text-slate-900 block truncate hover:text-primary transition-colors">
                            {item.name}
                          </span>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">
                            {item.sub_title || item.address}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Pemilik & Kontak */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{item.owner_name}</div>
                      {item.wa_number ? (
                        <a
                          href={`https://wa.me/${item.wa_number}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold hover:underline mt-0.5"
                        >
                          <span className="material-symbols-outlined text-xs">chat</span>
                          <span>+{item.wa_number}</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">{item.phone || '-'}</span>
                      )}
                    </td>

                    {/* Kategori */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
                        {item.category?.name || 'UMKM Desa'}
                      </span>
                    </td>

                    {/* Produk Unggulan */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-bold text-[11px]">
                          {item.products_count} Produk
                        </span>
                      </div>
                      {item.products_preview && item.products_preview.length > 0 && (
                        <p className="text-[11px] text-slate-400 mt-1 truncate max-w-xs">
                          {item.products_preview.map((p) => p.name).join(', ')}
                        </p>
                      )}
                    </td>

                    {/* Status Publik (Switch Toggle) */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          item.is_active ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        title={item.is_active ? 'Nonaktifkan publikasi' : 'Aktifkan publikasi'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            item.is_active ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Verifikasi */}
                    <td className="py-3.5 px-4">
                      {item.is_verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          <span>{item.last_verified_formatted}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleVerify(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">how_to_reg</span>
                          <span>Verifikasi</span>
                        </button>
                      )}
                    </td>

                    {/* Status Vektor AI */}
                    <td className="py-3.5 px-4 text-center">
                      {item.is_ai_synced ? (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold"
                          title={`Disinkronkan: ${item.ai_synced_formatted || 'Aktif'}`}
                        >
                          <span className="material-symbols-outlined text-xs">smart_toy</span>
                          <span>Terindeks</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={syncingId === item.id}
                          onClick={() => handleSingleAiSync(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 text-[10px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                          title="Klik untuk mengindeks profil UMKM ini ke AI RAG"
                        >
                          <span
                            className={`material-symbols-outlined text-xs ${
                              syncingId === item.id ? 'animate-spin' : ''
                            }`}
                          >
                            sync
                          </span>
                          <span>{syncingId === item.id ? 'Proses...' : 'Indeks AI'}</span>
                        </button>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenPreview(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Lihat Pratinjau Profil"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          title="Sunting Data UMKM"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingUmkm(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus Data UMKM"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {!loading && umkms.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 text-xs text-slate-500">
            <div>
              Menampilkan <strong>{umkms.length}</strong> dari <strong>{meta.total}</strong> data UMKM
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 cursor-pointer"
              >
                Sebelumnya
              </button>
              <span className="px-3 py-1 font-bold text-slate-800">
                Hal {meta.current_page} dari {meta.last_page || 1}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={currentPage >= meta.last_page}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 cursor-pointer"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Modals */}
      {/* Form Create / Edit Modal */}
      <UmkmFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingUmkm(null)
        }}
        onSubmit={handleFormSubmit}
        umkmData={editingUmkm}
        categories={categories}
        isLoading={isSubmitting}
      />

      {/* Preview Detail Modal */}
      <UmkmPreviewModal
        isOpen={Boolean(previewUmkm)}
        onClose={() => setPreviewUmkm(null)}
        umkm={previewUmkm}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingUmkm)}
        onClose={() => setDeletingUmkm(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Profil UMKM"
        message="Apakah Anda yakin ingin menghapus UMKM ini? Seluruh data produk, galeri, dan dokumen vektor AI terkait akan dihapus secara permanen."
        itemName={deletingUmkm?.name}
        isLoading={isDeleting}
      />
    </div>
  )
}
