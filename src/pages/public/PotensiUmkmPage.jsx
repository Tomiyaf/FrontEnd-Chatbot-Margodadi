import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import publicService from '../../services/publicService'
import UmkmFilterBar from '../../components/umkm/UmkmFilterBar'
import UmkmCard from '../../components/umkm/UmkmCard'
import LazyModal from '../../components/common/LazyModal'

// Lazy loaded modals
const UmkmDetailModal = lazy(() => import('../../components/umkm/UmkmDetailModal'))
const UmkmManualModal = lazy(() => import('../../components/umkm/UmkmManualModal'))

export default function PotensiUmkmPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [selectedProfileModal, setSelectedProfileModal] = useState(null)
  const [showManualModal, setShowManualModal] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [umkmList, setUmkmList] = useState([])
  const [categories, setCategories] = useState([
    { id: 'all', name: 'Semua Kategori', count: 7 },
    { id: 'kuliner', name: 'Kuliner & Olahan', count: 3 },
    { id: 'kerajinan', name: 'Kerajinan & Kriya', count: 2 },
    { id: 'pertanian', name: 'Pertanian & Agribisnis', count: 3 },
    { id: 'jasa', name: 'Jasa & Perdagangan', count: 1 },
  ])
  const [loading, setLoading] = useState(true)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current))
    }, 3200)
  }

  // Handle ESC key when any modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProfileModal(null)
        setShowManualModal(false)
      }
    }
    if (selectedProfileModal || showManualModal) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedProfileModal, showManualModal])

  // Fetch UMKM from API
  useEffect(() => {
    let isMounted = true
    const fetchUmkms = async () => {
      setLoading(true)
      try {
        const res = await publicService.getUmkms({
          search: searchQuery.trim() || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          sort: sortBy,
        })
        if (isMounted && res?.data) {
          if (res.data.umkms) setUmkmList(res.data.umkms)
          if (res.data.categories) setCategories(res.data.categories)
        }
      } catch (err) {
        console.error('Failed to load UMKM catalog:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    const timer = setTimeout(fetchUmkms, 250)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <div className="flex flex-col w-full">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-medium animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* 1. Top Decorative Hero Header */}
      <section className="relative overflow-hidden bg-surface-container-low px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-b border-surface-container-high/60">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <span className="material-symbols-outlined text-sm leading-none">storefront</span>
              Etalase Mandiri Warga Pekon
            </span>
            <span className="text-on-surface-variant text-xs">•</span>
            <span className="text-on-surface-variant text-xs font-medium">
              Pemerintahan Pekon Margodadi
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl text-primary font-black tracking-tight">
                Direktori Potensi &amp; Produk Unggulan UMKM Margodadi
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                Jelajahi produk olahan kopi robusta, kerajinan kriya bambu, madu hutan murni, dan jasa lokal masyarakat Pekon Margodadi yang terverifikasi resmi oleh balai desa.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                to="/tanya-virtual-guide?prompt=Rekomendasikan%20produk%20UMKM%20unggulan%20Pekon%20Margodadi"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-on-primary hover:bg-primary-container text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">smart_toy</span>
                <span>Tanya Rekomendasi Produk AI</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 w-full">
        {/* Filter Toolbar */}
        <UmkmFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
        />

        {/* UMKM Cards Grid */}
        {loading ? (
          <div className="p-16 text-center space-y-3 bg-surface-container-lowest rounded-2xl border border-surface-container-high/60">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-on-surface-variant">Memuat direktori UMKM Pekon Margodadi...</p>
          </div>
        ) : umkmList.length === 0 ? (
          <div className="p-10 bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container-high/60 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl">storefront</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface">UMKM Tidak Ditemukan</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Tidak ada UMKM atau produk yang cocok dengan pencarian &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:bg-primary-container transition-colors cursor-pointer"
              type="button"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {umkmList.map((item) => (
              <UmkmCard
                key={item.id}
                item={item}
                onSelectProfile={setSelectedProfileModal}
              />
            ))}
          </div>
        )}

        {/* 3. Call-To-Action Banner */}
        <section className="bg-primary text-on-primary rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-md">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                <span className="material-symbols-outlined text-sm">how_to_reg</span>
                PROGRAM PEMBERDAYAAN EKONOMI PEKON
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                Apakah Anda Pelaku Usaha Warga Margodadi?
              </h3>
              <p className="text-xs sm:text-sm text-on-primary/90 max-w-2xl leading-relaxed">
                Daftarkan UMKM Anda secara gratis di kantor balai pekon atau melalui formulir panduan asisten virtual. Dapatkan publikasi katalog digital, verifikasi legalitas usaha pekon, dan kemudahan pencarian pelanggan daring!
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                to="/tanya-virtual-guide?prompt=Saya%20ingin%20mendaftarkan%20UMKM%20baru%20di%20Pekon%20Margodadi"
                className="inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-secondary text-on-secondary px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors text-center"
              >
                <span className="material-symbols-outlined text-lg">app_registration</span>
                <span>Daftar Lewat Asisten AI</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowManualModal(true)}
                className="inline-flex items-center justify-center gap-2 bg-on-primary/10 hover:bg-on-primary/20 text-on-primary px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors text-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">contact_support</span>
                <span>Persyaratan Registrasi Manual</span>
              </button>
            </div>
          </div>
        </section>
      </section>

      {/* 4. On-Demand Lazy Modals */}
      <LazyModal
        isOpen={!!selectedProfileModal}
        onClose={() => setSelectedProfileModal(null)}
        Component={UmkmDetailModal}
        fallbackTitle="Memuat Profil UMKM..."
        componentProps={{
          umkm: selectedProfileModal,
          onToast: showToast,
        }}
      />

      <LazyModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        Component={UmkmManualModal}
        fallbackTitle="Memuat Panduan Registrasi..."
      />
    </div>
  )
}
