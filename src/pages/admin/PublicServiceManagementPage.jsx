import React, { useState, useEffect, useCallback } from 'react'
import publicServiceAdminService from '../../services/publicServiceAdminService'
import PublicServiceFormModal from '../../components/admin/services/PublicServiceFormModal'
import CategoryFormModal from '../../components/admin/services/CategoryFormModal'
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal'

const normalizeIcon = (icon) => {
  const map = {
    'id-card': 'badge',
    'id_card': 'badge',
    users: 'groups',
    user: 'person',
    store: 'storefront',
  }
  return map[icon] || icon || 'description'
}

export default function PublicServiceManagementPage() {
  const [activeTab, setActiveTab] = useState('services') // 'services' | 'categories'

  // Services State
  const [services, setServices] = useState([])
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 })
  const [categories, setCategories] = useState([])
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 })

  // Filters State
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState('latest')
  const [currentPage, setCurrentPage] = useState(1)

  // Loading & Toast States
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [toast, setToast] = useState(null)

  // Modal States - Services
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [isSubmittingService, setIsSubmittingService] = useState(false)
  const [deletingService, setDeletingService] = useState(null)
  const [isDeletingService, setIsDeletingService] = useState(false)

  // Modal States - Categories
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [isDeletingCategory, setIsDeletingCategory] = useState(false)

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

  // Load Categories
  const loadCategories = useCallback(async () => {
    setLoadingCategories(true)
    try {
      const res = await publicServiceAdminService.getCategories()
      if (res.status === 'success' && res.data) {
        setCategories(res.data)
      }
    } catch (err) {
      console.error('Gagal memuat kategori layanan:', err)
      showToast('Gagal memuat kategori layanan dari server.', 'error')
    } finally {
      setLoadingCategories(false)
    }
  }, [])

  // Load Services
  const loadServices = useCallback(async () => {
    setLoadingServices(true)
    try {
      const params = {
        page: currentPage,
        per_page: 10,
        sort,
      }
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim()
      if (categoryFilter !== 'all') params.category_id = categoryFilter
      if (statusFilter !== 'all') params.status = statusFilter

      const res = await publicServiceAdminService.getServices(params)
      if (res.status === 'success' && res.data) {
        setServices(res.data)
        if (res.meta) setMeta(res.meta)
        if (res.stats) setStats(res.stats)
      }
    } catch (err) {
      console.error('Gagal mengambil data layanan publik:', err)
      showToast('Gagal mengambil data layanan dari server.', 'error')
    } finally {
      setLoadingServices(false)
    }
  }, [currentPage, debouncedSearch, categoryFilter, statusFilter, sort])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  // Service Handlers
  const handleOpenAddService = () => {
    setEditingService(null)
    setIsServiceModalOpen(true)
  }

  const handleOpenEditService = (service) => {
    setEditingService(service)
    setIsServiceModalOpen(true)
  }

  const handleServiceSubmit = async (payload) => {
    setIsSubmittingService(true)
    try {
      if (editingService) {
        await publicServiceAdminService.updateService(editingService.service_id, payload)
        showToast(`Layanan "${payload.title}" berhasil diperbarui.`)
      } else {
        await publicServiceAdminService.createService(payload)
        showToast(`Layanan publik baru "${payload.title}" berhasil ditambahkan.`)
      }
      setIsServiceModalOpen(false)
      setEditingService(null)
      loadServices()
      loadCategories()
    } catch (err) {
      console.error('Gagal menyimpan layanan publik:', err)
      const errorMsg =
        err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data layanan.'
      showToast(errorMsg, 'error')
    } finally {
      setIsSubmittingService(false)
    }
  }

  const handleToggleStatus = async (service) => {
    try {
      const newStatus = !service.is_active
      await publicServiceAdminService.toggleStatus(service.service_id, newStatus)
      showToast(
        `Layanan "${service.title}" berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}.`
      )
      loadServices()
    } catch (err) {
      console.error('Gagal mengubah status layanan:', err)
      showToast('Gagal mengubah status layanan.', 'error')
    }
  }

  const handleDeleteService = async () => {
    if (!deletingService) return
    setIsDeletingService(true)
    try {
      await publicServiceAdminService.deleteService(deletingService.service_id)
      showToast(`Layanan "${deletingService.title}" berhasil dihapus.`)
      setDeletingService(null)
      loadServices()
      loadCategories()
    } catch (err) {
      console.error('Gagal menghapus layanan:', err)
      showToast('Gagal menghapus layanan publik.', 'error')
    } finally {
      setIsDeletingService(false)
    }
  }

  // Category Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat)
    setIsCategoryModalOpen(true)
  }

  const handleCategorySubmit = async (payload) => {
    setIsSubmittingCategory(true)
    try {
      if (editingCategory) {
        await publicServiceAdminService.updateCategory(editingCategory.category_id, payload)
        showToast(`Kategori "${payload.name}" berhasil diperbarui.`)
      } else {
        await publicServiceAdminService.createCategory(payload)
        showToast(`Kategori baru "${payload.name}" berhasil ditambahkan.`)
      }
      setIsCategoryModalOpen(false)
      setEditingCategory(null)
      loadCategories()
      loadServices()
    } catch (err) {
      console.error('Gagal menyimpan kategori:', err)
      const errorMsg =
        err.response?.data?.message || 'Terjadi kesalahan saat menyimpan kategori.'
      showToast(errorMsg, 'error')
    } finally {
      setIsSubmittingCategory(false)
    }
  }

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return
    setIsDeletingCategory(true)
    try {
      await publicServiceAdminService.deleteCategory(deletingCategory.category_id)
      showToast(`Kategori "${deletingCategory.name}" berhasil dihapus.`)
      setDeletingCategory(null)
      loadCategories()
      loadServices()
    } catch (err) {
      console.error('Gagal menghapus kategori:', err)
      showToast('Gagal menghapus kategori layanan.', 'error')
    } finally {
      setIsDeletingCategory(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === 'error'
              ? 'bg-rose-900 text-white'
              : 'bg-slate-900 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
              Pelayanan Publik Resmi
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Pemerintahan Pekon Margodadi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-2xl">assured_workload</span>
            <span>Manajemen Layanan Publik &amp; Kategori</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Kelola direktori prosedur resmi permohonan surat keterangan, persyaratan pemohon, SOP loket balai pekon, dan master kategori secara terpusat.
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleOpenAddCategory}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg text-primary">category</span>
            <span>+ Kategori Baru</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddService}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white hover:bg-primary-container text-xs font-bold transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">post_add</span>
            <span>+ Layanan Publik Baru</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Layanan */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Layanan Terdaftar
            </span>
            <div className="text-2xl font-black text-slate-900">{stats.total}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 mt-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{stats.active} Tampil di Portal</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">folder_shared</span>
          </div>
        </div>

        {/* Card 2: Layanan Aktif */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Layanan Aktif Warga
            </span>
            <div className="text-2xl font-black text-emerald-600">{stats.active}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              Siap diakses secara online
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
        </div>

        {/* Card 3: Nonaktif / Draf */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Nonaktif / Draf
            </span>
            <div className="text-2xl font-black text-amber-600">{stats.inactive}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              Disembunyikan dari publik
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">visibility_off</span>
          </div>
        </div>

        {/* Card 4: Master Kategori */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Master Kategori
            </span>
            <div className="text-2xl font-black text-slate-900">{categories.length}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              Pengelompokan layanan
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">category</span>
          </div>
        </div>
      </div>

      {/* 3. Tabs Navigasi */}
      <div className="flex items-center gap-6 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => setActiveTab('services')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'services'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-lg">assured_workload</span>
          <span>Daftar Layanan Publik ({stats.total})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-lg">category</span>
          <span>Master Kategori Layanan ({categories.length})</span>
        </button>
      </div>

      {/* TAB 1: DAFTAR LAYANAN PUBLIK */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          {/* Filter Bar & Search Toolbar */}
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-xs">
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
                  placeholder="Cari layanan berdasarkan judul, persyaratan, petugas..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Category, Status, Sort & Reset */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Category Select */}
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.name}
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
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif di Portal</option>
                  <option value="inactive">Nonaktif / Draf</option>
                </select>

                {/* Sort Select */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="latest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="title_asc">Nama (A - Z)</option>
                  <option value="title_desc">Nama (Z - A)</option>
                </select>

                {/* Reset Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setCategoryFilter('all')
                    setStatusFilter('all')
                    setSort('latest')
                    setCurrentPage(1)
                  }}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
                  title="Reset Filter"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 sm:px-6">Layanan Publik</th>
                    <th className="py-3.5 px-4">Kategori &amp; Label</th>
                    <th className="py-3.5 px-4">Berkas Persyaratan</th>
                    <th className="py-3.5 px-4">SLA &amp; Biaya</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loadingServices ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400 space-y-3">
                        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-xs">Memuat data direktori layanan publik...</p>
                      </td>
                    </tr>
                  ) : services.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400 space-y-2">
                        <span className="material-symbols-outlined text-4xl text-slate-300">
                          search_off
                        </span>
                        <p className="text-sm font-bold text-slate-700">Layanan Tidak Ditemukan</p>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          Belum ada layanan publik yang cocok dengan filter atau kata kunci pencarian.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    services.map((service) => (
                      <tr
                        key={service.service_id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        {/* Judul & Deskripsi */}
                        <td className="py-3.5 px-4 sm:px-6 max-w-xs sm:max-w-md">
                          <div className="font-bold text-slate-900 text-sm hover:text-primary transition-colors">
                            {service.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {service.description}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                            slug: {service.slug}
                          </div>
                        </td>

                        {/* Kategori & Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-slate-800 font-semibold">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-base">
                                {normalizeIcon(service.category?.icon)}
                              </span>
                            </div>
                            <span className="truncate max-w-[200px]">{service.category?.name || 'Tanpa Kategori'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            {service.category_badge && (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-primary font-bold uppercase tracking-wide">
                                {service.category_badge}
                              </span>
                            )}
                            {service.sub_category_badge && (
                              <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-medium">
                                {service.sub_category_badge}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Berkas Persyaratan Count */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                            <span className="material-symbols-outlined text-xs text-primary">
                              checklist
                            </span>
                            <span>{service.requirements_count} Berkas</span>
                          </span>
                        </td>

                        {/* SLA & Biaya */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-slate-800 font-semibold">{service.sla_duration}</div>
                          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                            {service.cost_info}
                          </div>
                        </td>

                        {/* Status Switch */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(service)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                              service.is_active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                            title="Klik untuk ubah status publikasi"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                service.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                            />
                            <span>{service.is_active ? 'Aktif' : 'Nonaktif'}</span>
                          </button>
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditService(service)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-primary/10 text-slate-600 hover:text-primary transition-colors cursor-pointer"
                              title="Edit Layanan"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingService(service)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Hapus Layanan"
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

            {/* Pagination Controls */}
            {meta.last_page > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/80 bg-slate-50/50 text-xs text-slate-600">
                <div>
                  Menampilkan halaman <span className="font-bold text-slate-900">{meta.current_page}</span>{' '}
                  dari <span className="font-bold text-slate-900">{meta.last_page}</span> (Total{' '}
                  {meta.total} layanan)
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={meta.current_page <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer shadow-2xs"
                  >
                    Sebelumnya
                  </button>
                  <button
                    type="button"
                    disabled={meta.current_page >= meta.last_page}
                    onClick={() => setCurrentPage((p) => Math.min(meta.last_page, p + 1))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer shadow-2xs"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MASTER KATEGORI LAYANAN */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 sm:px-6">Ikon &amp; Kategori</th>
                    <th className="py-3.5 px-4">Slug Identifier</th>
                    <th className="py-3.5 px-4">Deskripsi</th>
                    <th className="py-3.5 px-4 text-center">Jumlah Layanan</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loadingCategories ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400 space-y-3">
                        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-xs">Memuat master kategori layanan...</p>
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400 space-y-2">
                        <span className="material-symbols-outlined text-4xl text-slate-300">
                          category
                        </span>
                        <p className="text-sm font-bold text-slate-700">Belum Ada Kategori</p>
                        <p className="text-xs text-slate-400">
                          Silakan buat kategori layanan publik pertama Anda.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.category_id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Ikon & Nama */}
                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-xl">{normalizeIcon(cat.icon)}</span>
                            </div>
                            <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-500 text-xs">
                          {cat.slug}
                        </td>

                        {/* Deskripsi */}
                        <td className="py-3.5 px-4 text-slate-500 max-w-sm truncate">
                          {cat.description || '-'}
                        </td>

                        {/* Jumlah Layanan */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                            {cat.services_count} Layanan
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              cat.is_active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                cat.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                            />
                            <span>{cat.is_active ? 'Aktif' : 'Nonaktif'}</span>
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCategory(cat)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-primary/10 text-slate-600 hover:text-primary transition-colors cursor-pointer"
                              title="Edit Kategori"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingCategory(cat)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Hapus Kategori"
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
          </div>
        </div>
      )}

      {/* MODAL SERVICES */}
      <PublicServiceFormModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSubmit={handleServiceSubmit}
        editingService={editingService}
        categories={categories}
        isSubmitting={isSubmittingService}
      />

      {/* MODAL CATEGORIES */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
        editingCategory={editingCategory}
        isSubmitting={isSubmittingCategory}
      />

      {/* CONFIRM DELETE SERVICE */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingService)}
        onClose={() => setDeletingService(null)}
        onConfirm={handleDeleteService}
        title="Hapus Layanan Publik"
        message="Apakah Anda yakin ingin menghapus layanan publik ini? Layanan tidak akan lagi dapat diakses di portal direktori warga."
        itemName={deletingService?.title}
        isLoading={isDeletingService}
      />

      {/* CONFIRM DELETE CATEGORY */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
        title="Hapus Kategori Layanan"
        message="Apakah Anda yakin ingin menghapus kategori ini? Layanan yang terkait dengan kategori ini akan diset tanpa kategori."
        itemName={deletingCategory?.name}
        isLoading={isDeletingCategory}
      />
    </div>
  )
}
