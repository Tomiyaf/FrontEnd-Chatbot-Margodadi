import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import publicService from '../../services/publicService'

export default function LayananPublikPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedCards, setExpandedCards] = useState({ sku: true })
  const [servicesData, setServicesData] = useState([])
  const [categories, setCategories] = useState([
    { id: 'all', name: 'Semua Layanan Publik', icon: 'category', count: 6 },
    { id: 'administrasi-kependudukan', name: 'Administrasi Kependudukan', icon: 'badge', count: 1 },
    { id: 'surat-pengantar', name: 'Surat Pengantar & Keterangan', icon: 'description', count: 3 },
    { id: 'sop-loket', name: 'Standar Operasional (SOP) Loket', icon: 'rule', count: 1 },
    { id: 'fasilitas-desa', name: 'Fasilitas & Sarpras Pekon', icon: 'meeting_room', count: 1 },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchServices = async () => {
      setLoading(true)
      try {
        const res = await publicService.getPublicServices({
          search: searchQuery.trim() || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
        })
        if (isMounted && res?.data) {
          if (res.data.services) setServicesData(res.data.services)
          if (res.data.categories) setCategories(res.data.categories)
        }
      } catch (err) {
        console.error('Failed to load public services:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    const timer = setTimeout(fetchServices, 250)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [searchQuery, selectedCategory])

  const toggleCard = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
  }

  const filteredServices = servicesData


  return (
    <div className="flex flex-col w-full">
      {/* 1. SECTION HEADER DIREKTORI */}
      <section className="relative overflow-hidden bg-surface-container-low px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-b border-surface-container-high/60">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Tag / Micro Info */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
              <span className="material-symbols-outlined text-sm leading-none">assured_workload</span>
              PELAYANAN PUBLIK RESMI
            </span>
            <span className="text-on-surface-variant text-xs">•</span>
            <span className="text-on-surface-variant text-xs font-medium">Pemerintahan Pekon Margodadi</span>
          </div>

          {/* Main Headline Content */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-primary tracking-tight font-extrabold">
              Direktori Layanan Publik &amp; Administrasi Pekon
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-3xl leading-relaxed">
              Daftar prosedur resmi permohonan surat keterangan, kependudukan, dan standar operasional pelayanan warga Pekon Margodadi secara transparan dan akuntabel.
            </p>
          </div>

          {/* Live Search & Filter Bar */}
          <div className="mt-2 bg-surface-container-lowest p-2.5 sm:p-3 rounded-2xl shadow-md border border-surface-container-high/60 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                search
              </span>
              <input
                className="w-full bg-surface-container-low pl-11 pr-4 py-3 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/60"
                id="service-search-input"
                placeholder="Ketik kata kunci layanan (misal: KTP, SKU, Domisili, SKTM, Tenda)..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <button
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                onClick={resetFilters}
                type="button"
              >
                <span className="material-symbols-outlined text-base">refresh</span>
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION DUAL PANEL TATA LETAK */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SISI KIRI: FILTER SUBKATEGORI & VIRTUAL GUIDE PROMPT */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Filter Navigation Box */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-surface-container-high/60 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">tune</span>
                  Kategori Layanan
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-xs text-on-surface-variant font-semibold">
                  16 Total
                </span>
              </div>

              {/* Buttons Group Filter */}
              <nav className="flex flex-col gap-1.5" id="category-filter-nav">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      type="button"
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-base leading-none">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          isActive
                            ? 'bg-on-primary/20 text-on-primary'
                            : 'bg-surface-container text-on-surface-variant font-semibold'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Info Jam Operasional */}
            <div className="bg-surface-container-low p-5 rounded-2xl space-y-3 shadow-xs border border-surface-container-high/40">
              <div className="flex items-center gap-2 text-primary text-sm font-bold">
                <span className="material-symbols-outlined text-base">access_time_filled</span>
                <span>Jam Operasional</span>
              </div>
              <div className="space-y-2 text-xs text-on-surface">
                <div className="flex justify-between items-center py-1 border-b border-surface-container-high/40">
                  <span className="text-on-surface-variant">Senin — Kamis:</span>
                  <span className="font-semibold text-primary">08.00 – 16.00 WIB</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-on-surface-variant">Jumat:</span>
                  <span className="font-semibold text-primary">08.00 – 16.30 WIB</span>
                </div>
              </div>
            </div>

            {/* Box Bantuan Virtual Guide Interaktif */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-container to-teal-900 p-6 rounded-2xl text-on-primary shadow-md">
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
                  <span className="material-symbols-outlined text-xs">smart_toy</span>
                  ASISTEN AI PEKON
                </div>
                <h4 className="text-base font-bold text-on-primary leading-tight">
                  Tidak yakin layanan yang tepat?
                </h4>
                <p className="text-xs text-on-primary/85 leading-relaxed">
                  Tanyakan persyaratan, cek status nomor antrean, atau konsultasikan kebutuhan surat keluarga Anda dengan AI Virtual Guide Pekon Margodadi berbasis RAG resmi.
                </p>
                <Link
                  to="/tanya-virtual-guide"
                  className="mt-2 inline-flex items-center justify-center gap-2 w-full bg-secondary-container hover:bg-secondary text-on-secondary py-2.5 px-4 rounded-xl text-xs font-semibold shadow-xs transition-all"
                >
                  <span className="material-symbols-outlined text-base">forum</span>
                  <span>Tanya Virtual Guide Sekarang</span>
                </Link>
              </div>

              {/* Watermark Logo Ambience */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-15 pointer-events-none">
                <span className="material-symbols-outlined text-9xl text-on-primary">psychology_alt</span>
              </div>
            </div>
          </aside>

          {/* SISI KANAN: GRID & LEMBAR DETAIL LAYANAN */}
          <main className="lg:col-span-8 space-y-6">
            {filteredServices.length === 0 ? (
              /* Pesan Tidak Ditemukan (Empty State) */
              <div className="p-10 bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container-high/60 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl">search_off</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface">Layanan Tidak Ditemukan</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  Tidak ada layanan yang sesuai dengan kata kunci &quot;{searchQuery}&quot; atau filter yang dipilih. Silakan coba kata kunci lain atau gunakan bantuan asisten pintar.
                </p>
                <div className="pt-3 flex justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Reset Filter Pencarian
                  </button>
                  <Link
                    to="/tanya-virtual-guide"
                    className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">support_agent</span>
                    <span>Tanya Asisten AI</span>
                  </Link>
                </div>
              </div>
            ) : (
              filteredServices.map((service) => {
                const isExpanded = !!expandedCards[service.id]

                return (
                  <article
                    key={service.id}
                    className="service-card bg-surface-container-lowest rounded-2xl shadow-xs hover:shadow-md p-5 sm:p-6 transition-all border border-surface-container-high/60 space-y-4"
                  >
                    {/* Header Kartu */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-surface-container text-xs font-semibold text-primary uppercase tracking-wide">
                            {service.categoryBadge}
                          </span>
                          {service.subCategoryBadge && (
                            <span className="px-2.5 py-0.5 rounded-md bg-surface-container-high text-xs text-on-surface-variant font-medium">
                              {service.subCategoryBadge}
                            </span>
                          )}
                        </div>
                        <h2 className="text-lg sm:text-xl text-primary font-bold">{service.title}</h2>
                      </div>
                    </div>

                    {/* Ringkasan Singkat */}
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      {service.description}
                    </p>

                    {/* Syarat Ringkas Highlight jika belum di-expand */}
                    {!isExpanded && (
                      <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-on-surface-variant font-medium border border-surface-container-high/30">
                        <span className="font-semibold text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">checklist</span> Persyaratan Utama:
                        </span>
                        <span>• {service.requirements[0]}</span>
                        <span>• {service.requirements[1]}</span>
                      </div>
                    )}

                    {/* Accordion Detail Expansion */}
                    {isExpanded && (
                      <div className="pt-4 space-y-5 bg-surface-container-low/60 p-4 sm:p-5 rounded-xl border border-surface-container-high/40">
                        {/* Dasar Hukum & Regulasi */}
                        {service.legalBasis && (
                          <div className="flex items-start gap-3 bg-surface-container-lowest p-3.5 rounded-xl shadow-2xs border border-surface-container-high/40">
                            <span className="material-symbols-outlined text-primary mt-0.5 text-lg shrink-0">
                              gavel
                            </span>
                            <div>
                              <div className="text-xs font-bold text-on-surface">Dasar Hukum &amp; Regulasi:</div>
                              <div className="text-xs text-on-surface-variant leading-relaxed mt-0.5">
                                {service.legalBasis}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Berkas Persyaratan */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">fact_check</span>
                            Berkas Persyaratan Pemohon
                          </h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-on-surface">
                            {service.requirements.map((req, idx) => (
                              <li
                                key={idx}
                                className={`flex items-start gap-2 bg-surface-container-lowest p-3 rounded-lg shadow-2xs border border-surface-container-high/40 ${
                                  idx === service.requirements.length - 1 && service.requirements.length % 2 !== 0
                                    ? 'md:col-span-2'
                                    : ''
                                }`}
                              >
                                <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                                  check_circle
                                </span>
                                <span className="leading-snug">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Alur Tahapan Pelayanan (Step Flow Visual) - Disembunyikan sementara */}
                        {/* 
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">route</span>
                            Alur Tahapan Pelayanan Loket
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                            {service.steps.map((st, sidx) => (
                              <div
                                key={sidx}
                                className="bg-surface-container-lowest p-3 rounded-lg shadow-2xs border border-surface-container-high/40 flex flex-col space-y-1.5"
                              >
                                <span className="w-fit px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                                  {st.step}
                                </span>
                                <h4 className="text-xs font-bold text-on-surface">{st.name}</h4>
                                <p className="text-[11px] text-on-surface-variant leading-relaxed">{st.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        */}

                        {/* Action Buttons Grid */}
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <Link
                            to={`/tanya-virtual-guide?layanan=${encodeURIComponent(service.title)}`}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs"
                          >
                            <span className="material-symbols-outlined text-base">smart_toy</span>
                            <span>Konsultasikan Persyaratan Ini dengan Virtual Guide</span>
                          </Link>
                          <a
                            href="https://wa.me/6282177890112"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-surface-container-highest hover:bg-surface-container text-on-surface px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                          >
                            <span className="material-symbols-outlined text-base text-primary">download</span>
                            <span>Unduh Blangko Permohonan</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Footer Kartu & Toggle Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/40">
                      <button
                        onClick={() => toggleCard(service.id)}
                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:text-primary-container transition-colors cursor-pointer"
                        type="button"
                      >
                        <span>{isExpanded ? 'Tutup Persyaratan' : 'Lihat Persyaratan Lengkap'}</span>
                        <span
                          className={`material-symbols-outlined text-base transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        >
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </article>
                )
              })
            )}
          </main>
        </div>
      </section>
    </div>
  )
}
