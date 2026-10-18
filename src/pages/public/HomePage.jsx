import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import heroBg from '../../assets/hero-bg.jpg'
import publicService from '../../services/publicService'
import LazyImage from '../../components/common/LazyImage'
import UmkmDetailModal from '../../components/umkm/UmkmDetailModal'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [umkmList, setUmkmList] = useState([])
  const [totalUmkm, setTotalUmkm] = useState(0)
  const [umkmLoading, setUmkmLoading] = useState(true)
  const [selectedUmkmModal, setSelectedUmkmModal] = useState(null)
  const [servicesList, setServicesList] = useState([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    // Fetch UMKM dari database
    publicService
      .getUmkms({ sort: 'popular' })
      .then((res) => {
        if (isMounted && res?.data?.umkms) {
          setUmkmList(res.data.umkms)
          setTotalUmkm(res.data.umkms.length)
        }
      })
      .catch((err) => {
        console.error('Failed to load featured UMKMs from DB:', err)
      })
      .finally(() => {
        if (isMounted) setUmkmLoading(false)
      })

    // Fetch Layanan Publik Populer dari database
    publicService
      .getPublicServices()
      .then((res) => {
        if (isMounted && res?.data?.services) {
          setServicesList(res.data.services)
        }
      })
      .catch((err) => {
        console.error('Failed to load public services from DB:', err)
      })
      .finally(() => {
        if (isMounted) setServicesLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedUmkmModal(null)
      }
    }
    if (selectedUmkmModal) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedUmkmModal])

  const popularSearches = [
    'Surat Pengantar SKTM',
    'Syarat KTP/KK',
    'Surat Pengantar Nikah',
    'Kopi Robusta Margodadi',
    'Surat Keterangan Usaha',
  ]

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/tanya-virtual-guide?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* Top Ambient Glow Decor */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-96 bg-gradient-to-b from-primary-fixed/40 via-surface-container-high/30 to-transparent blur-3xl pointer-events-none rounded-full -z-10"></div>

        {/* 1. HERO SECTION WITH BACKGROUND IMAGE */}
        <section className="relative w-full overflow-hidden isolate">
          {/* Background Image Layer */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={heroBg}
              alt="Pemandangan Desa Margodadi Placeholder"
              className="w-full h-full object-cover object-center"
            />
            {/* Gradient overlay: ensures landscape is clearly visible while text stays sharp */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/55 to-surface"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-16">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight drop-shadow-2xs">
                Selamat Datang di{' '}
                <span className="text-primary font-black">Layanan Cerdas Pekon Margodadi</span>
              </h1>

              <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mt-4 leading-relaxed font-medium">
                Pusat Informasi Pelayanan Administrasi Warga dan Direktori Potensi UMKM Desa Berbasis Virtual Guide AI.
              </p>

              {/* Interactive Global Search Bar */}
              <div className="w-full mt-8 md:mt-10">
                <form
                  className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-primary/10 p-2 sm:p-2.5 transition-all focus-within:ring-2 focus-within:ring-primary border border-gray-200/80"
                  onSubmit={handleSearchSubmit}
                >
                  <div className="flex items-center pl-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-2xl text-primary">search</span>
                  </div>
                  <input
                    className="w-full px-3 py-3 text-sm sm:text-base text-on-surface bg-transparent focus:outline-none placeholder:text-outline/70"
                    id="global-portal-search"
                    placeholder="Cari syarat surat, SOP layanan, produk UMKM, atau regulasi pekon..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="shrink-0 bg-primary hover:bg-primary-container text-on-primary px-5 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-md cursor-pointer"
                    type="submit"
                  >
                    <span>Cari</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </form>

                {/* Popular Search Chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-left">
                  <span className="text-xs text-on-surface-variant font-semibold flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-gray-200/60">
                    <span className="material-symbols-outlined text-sm">trending_up</span> Sering Dicari:
                  </span>
                  {popularSearches.map((chip, index) => (
                    <button
                      key={index}
                      type="button"
                      className="text-xs px-3 py-1 rounded-full bg-white/85 hover:bg-white text-on-surface border border-gray-200/70 shadow-2xs transition-all cursor-pointer font-medium"
                      onClick={() => setSearchQuery(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Banner Asisten Virtual Interaktif */}
              <div className="w-full mt-10 rounded-2xl bg-gradient-to-r from-primary via-primary-container to-tertiary-container text-on-primary p-6 md:p-8 shadow-xl relative overflow-hidden text-left">
                <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-[200px]">smart_toy</span>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <h2 className="text-xl sm:text-2xl text-on-primary font-bold">
                      Butuh Panduan Surat atau Produk Pekon dalam Sekejap?
                    </h2>
                  </div>
                  <div className="shrink-0 w-full md:w-auto">
                    <Link
                      to="/tanya-virtual-guide"
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 bg-secondary-container hover:bg-secondary text-on-secondary px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md"
                    >
                      <span className="material-symbols-outlined text-xl">forum</span>
                      <span>Mulai Konsultasi Online</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PUSAT AKSES LAYANAN CEPAT (Quick Service Grid 3 Kolom) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs text-secondary font-bold tracking-wider uppercase">
                Akses Mandiri
              </span>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-bold">
                Tiga Kanal Utama Pekon Margodadi
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md">
              Gerbang pelayanan terpadu terintegrasi digital untuk kemudahan birokrasi, kemajuan ekonomi warga, dan pendampingan cerdas pekon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Administrasi & Kependudukan */}
            <Link
              to="/layanan-publik"
              className="group bg-surface-container-lowest hover:bg-surface-container p-6 rounded-2xl shadow-xs hover:shadow-xl transition-all flex flex-col justify-between border border-surface-container-high/40"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors mb-5 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">description</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                  Administrasi &amp; Kependudukan
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                  Panduan kilat berkas SKTM, Surat Usaha, Pengantar KTP/KK, izin domisili, dan persuratan resmi kantor pekon.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-primary">
                <span>Buka Layanan Surat</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>

            {/* Card 2: Potensi & Produk UMKM */}
            <Link
              to="/potensi-umkm"
              className="group bg-surface-container-lowest hover:bg-surface-container p-6 rounded-2xl shadow-xs hover:shadow-xl transition-all flex flex-col justify-between border border-surface-container-high/40"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary-container group-hover:text-on-secondary transition-colors mb-5 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">storefront</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-2 group-hover:text-secondary transition-colors">
                  Potensi &amp; Produk UMKM
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                  Etalase komoditas unggulan kopi robusta lereng, anyaman bambu, olahan pisang, dan produk lokal berdaya saing.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-secondary">
                <span>Jelajahi Katalog</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>

            {/* Card 3: Tanya Asisten Virtual Guide */}
            <Link
              to="/tanya-virtual-guide"
              className="group bg-surface-container-lowest hover:bg-surface-container p-6 rounded-2xl shadow-xs hover:shadow-xl transition-all flex flex-col justify-between border border-surface-container-high/40"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors mb-5 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">smart_toy</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                  Tanya Virtual Guide AI
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                  Pusat konsultasi percakapan pintar dengan sitasi aturan desa, panduan dokumen akurat, dan direktori UMKM.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-primary">
                <span>Buka Ruang Tanya</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* 3. RINGKASAN PROSEDUR POPULER & JADWAL LOKET */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-10 shadow-xs border border-surface-container-high/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Col: 3 Prosedur Populer */}
              <div className="lg:col-span-8 space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Standar Operasional Pelayanan
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                    Prosedur Administrasi Terpopuler
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    Layanan pengurusan surat keterangan umum yang paling sering diajukan warga Margodadi.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {servicesLoading ? (
                    [1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="bg-surface-container-low p-5 rounded-2xl flex flex-col justify-between border border-surface-container-high/30 animate-pulse space-y-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-surface-container-high" />
                        <div className="h-4 bg-surface-container-high rounded w-3/4" />
                        <div className="space-y-1">
                          <div className="h-3 bg-surface-container-high rounded w-1/2" />
                          <div className="h-3 bg-surface-container-high rounded w-full" />
                          <div className="h-3 bg-surface-container-high rounded w-4/5" />
                        </div>
                      </div>
                    ))
                  ) : servicesList.length > 0 ? (
                    servicesList.slice(0, 3).map((service, idx) => {
                      const reqs = Array.isArray(service.requirements)
                        ? service.requirements
                        : []
                      return (
                        <Link
                          key={service.id || service.service_id || idx}
                          to="/layanan-publik"
                          className="bg-surface-container-low p-5 rounded-2xl flex flex-col justify-between hover:bg-surface-container hover:shadow-md transition-all border border-surface-container-high/30 group cursor-pointer"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center font-bold text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span className="text-[10px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                                {service.duration || '1 Hari Kerja'}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                              {service.title}
                            </h3>
                            <div className="text-xs text-on-surface-variant space-y-1">
                              <p className="font-semibold text-on-surface">Syarat Berkas:</p>
                              <ul className="list-disc list-inside space-y-0.5 text-[11px] line-clamp-4">
                                {reqs.length > 0 ? (
                                  reqs.slice(0, 4).map((r, ri) => (
                                    <li key={ri} className="truncate">
                                      {typeof r === 'string' ? r : r.title || r.name}
                                    </li>
                                  ))
                                ) : (
                                  <li>KTP &amp; Kartu Keluarga pemohon</li>
                                )}
                              </ul>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-surface-container-high/50 flex items-center justify-between text-[11px] text-primary font-semibold mt-3">
                            <span>{service.cost || 'Gratis (Rp 0)'}</span>
                            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                              arrow_forward
                            </span>
                          </div>
                        </Link>
                      )
                    })
                  ) : null}
                </div>
              </div>

              {/* Right Col: Jadwal Loket & Petunjuk Tatap Muka */}
              <div className="lg:col-span-4 bg-surface-container p-6 rounded-2xl space-y-5 border border-surface-container-high/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-xl">account_balance</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">Jam Operasional</h4>
                    <p className="text-xs text-on-surface-variant">Balai Pekon Margodadi</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
                      <span className="text-xs font-medium text-on-surface">Senin - Kamis</span>
                    </div>
                    <span className="text-xs font-bold text-primary">08.00 - 16.00 WIB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
                      <span className="text-xs font-medium text-on-surface">Jumat</span>
                    </div>
                    <span className="text-xs font-bold text-secondary">08.00 - 16.30 WIB</span>
                  </div>
                  {/* <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest opacity-75">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-base">event_busy</span>
                      <span className="text-xs font-medium text-on-surface">Sabtu, Minggu &amp; Libur</span>
                    </div>
                    <span className="text-xs font-semibold text-error">Tutup</span>
                  </div>*/}
                </div>

                {/* <div className="p-3.5 rounded-xl bg-primary-fixed/30 text-xs text-on-primary-fixed-variant space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">info</span> Pengurusan Berkas Asli
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Warga diimbau membawa dokumen asli (KTP/KK) untuk verifikasi paraf Kepala Dusun sebelum pencetakan surat definitif di loket.
                  </p>
                </div>*/}
              </div>
            </div>
          </div>
        </section>

        {/* 4. SOROTAN POTENSI & UMKM UNGGULAN PEKON */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs text-secondary font-bold tracking-wider uppercase">
                Pemberdayaan Ekonomi Warga
              </span>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-bold">
                Produk &amp; UMKM Unggulan Desa
              </h2>
            </div>
            <Link
              to="/potensi-umkm"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary-container text-on-secondary text-xs font-semibold hover:bg-secondary transition-colors shadow-xs"
            >
              <span>
                {totalUmkm > 0
                  ? `Lihat Semua ${totalUmkm} UMKM Terdaftar`
                  : 'Lihat Semua Katalog UMKM'}
              </span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>

          {umkmLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-surface-container-high/40 animate-pulse"
                >
                  <div className="h-52 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-12 bg-slate-100 rounded" />
                    <div className="h-8 bg-slate-200 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : umkmList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {umkmList.slice(0, 3).map((item) => {
                const firstProduct = item.featuredProducts?.[0]
                const price = firstProduct?.price || 'Hubungi Penjual'
                const waLink = item.waNumber
                  ? `https://wa.me/${String(item.waNumber).replace(/[^0-9]/g, '')}`
                  : item.phone
                    ? `https://wa.me/${String(item.phone).replace(/[^0-9]/g, '')}`
                    : 'https://wa.me/6282177890112'

                return (
                  <div
                    key={item.id}
                    className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col border border-surface-container-high/40 group"
                  >
                    <div className="relative h-52 w-full overflow-hidden bg-surface-container">
                      <LazyImage
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={item.name}
                        src={item.image}
                      />
                      <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1 shadow-xs z-10">
                        <span className="material-symbols-outlined text-xs">verified</span>{' '}
                        {item.categoryBadge || 'UMKM Desa'}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-primary text-on-primary px-3 py-1 rounded-lg text-xs font-bold shadow-sm z-10">
                        {price}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1">
                          <span className="material-symbols-outlined text-sm text-secondary">person</span>
                          <span>
                            {item.owner} {item.address ? `(${item.address})` : ''}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-surface-container flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUmkmModal(item)}
                          className="text-xs font-semibold text-primary hover:text-primary-container flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          <span>Detail Profil</span>
                        </button>
                        <a
                          className="inline-flex items-center gap-1 bg-primary text-on-primary hover:bg-primary-container px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-2xs"
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="material-symbols-outlined text-sm">chat</span>{' '}
                          <span>Hubungi Penjual</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface-container-low rounded-2xl border border-surface-container-high/40">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">storefront</span>
              <p className="text-sm font-semibold text-on-surface">Belum ada UMKM yang terdaftar</p>
              <p className="text-xs text-on-surface-variant mt-1">
                Data UMKM desa akan segera diperbarui melalui sistem.
              </p>
            </div>
          )}
        </section>

        {/* 6. HUBUNGI KAMI & HOTLINE WHATSAPP PEKON */}
        {/*
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-10 shadow-xs border border-surface-container-high/60">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-semibold">
                  <span className="material-symbols-outlined text-sm">support_agent</span>
                  <span>Layanan Responsif &amp; Terbuka</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">
                  Pusat Pengaduan, Informasi &amp; Hotline Pekon
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Memiliki kendala dalam administrasi kependudukan, ingin mendaftarkan produk UMKM baru ke portal, atau membutuhkan informasi seputar musyawarah desa? Tim operator kantor siap menyambut pesan Anda.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-on-primary px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md"
                    href="https://wa.me/6282177890112"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-xl">chat</span>
                    <span>Chat Hotline WhatsApp (+62 821-7789-0112)</span>
                  </a>
                  <Link
                    to="/layanan-publik"
                    className="inline-flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface px-5 py-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">contact_support</span>
                    <span>Alur Permohonan PPID Pekon</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 bg-surface-container-low p-6 rounded-2xl space-y-4 border border-surface-container-high/40">
                <h4 className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">map</span>
                  Lokasi Kantor Sekretariat
                </h4>
                <div className="w-full h-44 rounded-xl overflow-hidden relative shadow-inner bg-surface-container-high flex items-center justify-center text-center p-4">
                  <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-3xl text-primary animate-bounce">
                      location_on
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      Kantor Kepala Pekon Margodadi
                    </span>
                    <span className="text-[11px] max-w-xs text-on-surface-variant">
                      Margodadi, Kec. Ambarawa, Kabupaten Pringsewu, Lampung 35376
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                  <span>Status: Kantor Buka Jam Kerja</span>
                  <span className="font-semibold text-primary">Petugas Standby: 4 Aparatur</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        */}
      </div>

      {/* Modal Detail Profil UMKM */}
      <UmkmDetailModal
        isOpen={Boolean(selectedUmkmModal)}
        onClose={() => setSelectedUmkmModal(null)}
        umkm={selectedUmkmModal}
      />
    </div>
  )
}
