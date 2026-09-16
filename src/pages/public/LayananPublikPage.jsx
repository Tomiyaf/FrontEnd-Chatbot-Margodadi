import { useState } from 'react'
import { Link } from 'react-router-dom'

const servicesData = [
  {
    id: 'sku',
    category: 'surat',
    categoryBadge: 'SURAT_PENGANTAR',
    subCategoryBadge: null,
    verified: true,
    title: 'Surat Keterangan Usaha (SKU)',
    tags: ['sku', 'surat keterangan usaha', 'modal', 'umkm', 'pinjaman', 'bank', 'kur', 'nib'],
    duration: '1 Hari Kerja',
    cost: 'Gratis (Rp 0)',
    description:
      'Surat resmi untuk legalitas usaha mikro/kecil warga Pekon Margodadi bagi keperluan pengajuan permodalan, perbankan (KUR), izin Nomor Induk Berusaha (NIB), atau sertifikasi produk UMKM desa.',
    legalBasis:
      'Peraturan Pekon Margodadi No. 04 Tahun 2023 tentang Penyelenggaraan Pelayanan Publik Terpadu Berbasis Digital Desa.',
    requirements: [
      'Fotokopi e-KTP Pemohon yang masih berlaku (1 lembar)',
      'Fotokopi Kartu Keluarga (KK) Pekon Margodadi (1 lembar)',
      'Surat Pengantar dari Ketua RT domisili usaha setempat',
      'Foto dokumentasi fisik/tempat/kegiatan produksi usaha',
      'Surat pernyataan usaha bermaterai Rp 10.000 (formulir disediakan gratis di loket pelayanan Pekon)',
    ],
    steps: [
      { step: 'Langkah 1', name: 'Registrasi', desc: 'Ambil nomor antrean & verifikasi kelengkapan berkas fisik di Front Office.', time: '± 5 Menit', icon: 'timer' },
      { step: 'Langkah 2', name: 'Validasi Kasi', desc: 'Pemeriksaan lapangan ringkas & pencatatan buku register oleh Kasi Pelayanan.', time: '± 15 Menit', icon: 'timer' },
      { step: 'Langkah 3', name: 'Tanda Tangan', desc: 'Otorisasi berkas digital / fisik oleh Kepala Pekon atau Sekretaris Pekon.', time: 'Sesuai Agenda', icon: 'draw' },
      { step: 'Langkah 4', name: 'Penyerahan', desc: 'Pembubuhan stempel dinas & penerbitan surat SKU resmi kepada pemohon.', time: 'Selesai (Rp 0)', icon: 'task_alt' },
    ],
    officer: 'Loket Kasi Pelayanan',
  },
  {
    id: 'sktm',
    category: 'surat',
    categoryBadge: 'SURAT_PENGANTAR',
    subCategoryBadge: 'Sosial & Pendidikan',
    verified: true,
    title: 'Surat Keterangan Tidak Mampu (SKTM) Pendidikan & Kesehatan',
    tags: ['sktm', 'surat keterangan tidak mampu', 'pendidikan', 'kip', 'beasiswa', 'bansos', 'bpjs', 'kesehatan'],
    duration: '1 Hari Kerja',
    cost: 'Gratis',
    description:
      'Surat pendukung permohonan beasiswa kuliah/sekolah (KIP/PIP), keringanan biaya rumah sakit, jaminan kesehatan daerah, dan pendataan Data Terpadu Kesejahteraan Sosial (DTKS).',
    legalBasis:
      'Permensos RI No. 3 Tahun 2021 & Petunjuk Teknis Pelayanan Kesejahteraan Sosial Warga Pekon Margodadi.',
    requirements: [
      'Salinan KTP & KK Pekon Margodadi (1 lembar)',
      'Surat Pengantar dari RT/RW setempat',
      'Surat Pernyataan Tidak Mampu ditandatangani 2 saksi tetangga',
      'Foto kondisi rumah tampak depan & ruang utama (jika diperlukan verifikasi lapangan)',
    ],
    steps: [
      { step: 'Langkah 1', name: 'Pemberkasan', desc: 'Menyerahkan pengantar RT dan dokumen pendukung ke Front Office.', time: '± 5 Menit', icon: 'timer' },
      { step: 'Langkah 2', name: 'Verifikasi DTKS', desc: 'Kasi Kesejahteraan memverifikasi kesesuaian data warga dengan basis DTKS.', time: '± 10 Menit', icon: 'timer' },
      { step: 'Langkah 3', name: 'Otorisasi', desc: 'Penandatanganan surat keterangan oleh Kepala Pekon atau Sekdes.', time: '1 Hari Kerja', icon: 'draw' },
      { step: 'Langkah 4', name: 'Penerbitan', desc: 'Penerbitan SKTM berstempel resmi di loket pekon.', time: 'Selesai (Rp 0)', icon: 'task_alt' },
    ],
    officer: 'Loket Kasi Kesejahteraan',
  },
  {
    id: 'ktp',
    category: 'kependudukan',
    categoryBadge: 'ADMINISTRASI',
    subCategoryBadge: 'Kependudukan',
    verified: true,
    title: 'Surat Pengantar Perekaman & Penggantian e-KTP',
    tags: ['ktp', 'e-ktp', 'perekaman e-ktp', 'kartu tanda penduduk', 'rusak', 'hilang', 'disdukcapil'],
    duration: 'Langsung Terbit (Seketika)',
    cost: 'Gratis',
    description:
      'Penerbitan surat pengantar resmi pekon untuk warga usia 17 tahun ke atas guna melakukan perekaman biometrik di Kantor Camat Ambarawa, Kabupaten Pringsewu atau penggantian e-KTP rusak/hilang.',
    legalBasis:
      'UU No. 24 Tahun 2013 tentang Perubahan atas UU No. 23 Tahun 2006 tentang Administrasi Kependudukan.',
    requirements: [
      'Surat Pengantar RT domisili pemohon',
      'Salinan Kartu Keluarga (KK) terbaru (1 lembar)',
      'e-KTP fisik lama (khusus permohonan penggantian fisik yang rusak)',
      'Surat Keterangan Kehilangan dari Polsek setempat (khusus e-KTP yang hilang)',
    ],
    steps: [
      { step: 'Langkah 1', name: 'Pemeriksaan Berkas', desc: 'Petugas loket memeriksa kelengkapan identitas NIK & KK pemohon.', time: '± 5 Menit', icon: 'timer' },
      { step: 'Langkah 2', name: 'Cetak Surat Pengantar', desc: 'Pencetakan surat pengantar perekaman/penggantian e-KTP ke Disdukcapil.', time: '± 5 Menit', icon: 'print' },
      { step: 'Langkah 3', name: 'Legalisir & Stempel', desc: 'Penandatanganan & stempel resmi pekon untuk dibawa ke Kantor Camat/Disdukcapil.', time: 'Langsung Jadi', icon: 'task_alt' },
    ],
    officer: 'Loket Kasi Pemerintahan',
  },
  {
    id: 'domisili',
    category: 'surat',
    categoryBadge: 'SURAT_PENGANTAR',
    subCategoryBadge: 'Kependudukan & Badan Hukum',
    verified: true,
    title: 'Surat Keterangan Domisili Warga / Lembaga',
    tags: ['domisili', 'surat keterangan domisili', 'warga', 'lembaga', 'yayasan', 'tempat tinggal', 'usaha'],
    duration: '1 Hari Kerja',
    cost: 'Gratis',
    description:
      'Surat pernyataan pengesahan alamat tempat tinggal menetap sementara bagi penduduk pendatang maupun alamat sekretariat yayasan/organisasi berbadan hukum di wilayah Margodadi.',
    legalBasis:
      'Peraturan Menteri Dalam Negeri No. 108 Tahun 2019 tentang Pelaksanaan Perpres No. 96 Tahun 2018.',
    requirements: [
      'Fotokopi KTP Pemohon / Penanggung Jawab Lembaga',
      'Surat Pengantar RT/RW setempat',
      'Surat Perjanjian Sewa / Izin Pemilik Rumah (jika mengontrak/tinggal sementara)',
      'Akta Pendirian / SK Kemenkumham (khusus organisasi/lembaga/yayasan)',
    ],
    steps: [
      { step: 'Langkah 1', name: 'Verifikasi Alamat', desc: 'Pemeriksaan keabsahan domisili berdasarkan pengantar RT.', time: '± 5 Menit', icon: 'timer' },
      { step: 'Langkah 2', name: 'Pencatatan Buku Register', desc: 'Registrasi data domisili warga/lembaga ke buku induk kependudukan pekon.', time: '± 10 Menit', icon: 'timer' },
      { step: 'Langkah 3', name: 'Penerbitan Surat', desc: 'Penandatanganan dan penyerahan surat domisili definitif berstempel.', time: '1 Hari Kerja', icon: 'task_alt' },
    ],
    officer: 'Loket Kasi Pemerintahan',
  },
  {
    id: 'fasilitas',
    category: 'fasilitas',
    categoryBadge: 'FASILITAS',
    subCategoryBadge: 'Sarana Publik Warga',
    verified: true,
    title: 'Pelayanan Peminjaman Sarana Aula & Tenda Serbaguna Pekon',
    tags: ['fasilitas', 'sarana prasarana', 'aula', 'balai desa', 'tenda', 'kursi', 'sound system', 'peminjaman'],
    duration: 'Ajukan H-3',
    cost: 'Bebas Biaya Sewa',
    description:
      'Peminjaman fasilitas Balai Kemasyarakatan Pekon Margodadi, tenda hajatan desa, sound system publik, serta kursi lipat untuk kegiatan hajatan, musyawarah warga, atau acara sosial keagamaan.',
    legalBasis:
      'Peraturan Pengelolaan Aset Desa Pekon Margodadi No. 02 Tahun 2022 tentang Pemanfaatan Sarana & Prasarana Umum.',
    requirements: [
      'Surat Permohonan ditujukan ke Kaur Umum Pekon Margodadi',
      'Fotokopi KTP Penanggung Jawab Kegiatan',
      'Surat pernyataan kesediaan menjaga kebersihan, ketertiban & keutuhan inventaris pekon',
    ],
    steps: [
      { step: 'Langkah 1', name: 'Cek Ketersediaan', desc: 'Petugas memeriksa kalender agenda aula dan inventaris alat pada tanggal yang diajukan.', time: '± 5 Menit', icon: 'calendar_month' },
      { step: 'Langkah 2', name: 'Penerbitan Izin Peminjaman', desc: 'Kaur Umum menerbitkan berita acara persetujuan peminjaman fasilitas.', time: 'H-3 Kegiatan', icon: 'assignment_turned_in' },
      { step: 'Langkah 3', name: 'Penyerahan / Pemakaian', desc: 'Penyerahan kunci aula atau inventaris sarpras kepada penanggung jawab.', time: 'Sesuai Jadwal', icon: 'handshake' },
    ],
    officer: 'Kaur Umum & Aset Pekon',
  },
  {
    id: 'sop',
    category: 'sop',
    categoryBadge: 'SOP_LOKET',
    subCategoryBadge: 'Standar Operasional',
    verified: true,
    title: 'Standar Operasional Prosedur (SOP) Pelayanan Loket Terpadu',
    tags: ['sop', 'standar operasional', 'prosedur', 'alur', 'loket', 'pelayanan terpadu', 'jam kerja'],
    duration: 'Transparan & Terbuka',
    cost: '100% Bebas Retribusi',
    description:
      'Panduan tata cara dan etika pelayanan loket Balai Pekon Margodadi bagi masyarakat yang datang langsung untuk pengurusan berbagai dokumen administratif.',
    legalBasis:
      'Permenpan-RB No. 35 Tahun 2012 tentang Pedoman Penyusunan Standar Operasional Prosedur Administrasi Pemerintahan.',
    requirements: [
      'Membawa dokumen identitas asli (e-KTP & KK) untuk verifikasi berkas',
      'Berpakaian sopan dan rapi saat mengunjungi Balai Pekon Margodadi',
      'Mengambil nomor antrean loket di ruang tunggu pelayanan',
    ],
    steps: [
      { step: 'Langkah 1', name: 'Kedatangan', desc: 'Warga tiba di Balai Pekon dan mengambil nomor antrean loket.', time: '08.00 - 15.00 WIB', icon: 'door_front' },
      { step: 'Langkah 2', name: 'Verifikasi Berkas', desc: 'Petugas front-office memeriksa kelengkapan persyaratan fisik.', time: '± 5 - 10 Menit', icon: 'fact_check' },
      { step: 'Langkah 3', name: 'Pemrosesan Dokumen', desc: 'Kasi terkait memproses pencetakan dan penandatanganan surat.', time: 'Maks. 1 Hari Kerja', icon: 'history_edu' },
      { step: 'Langkah 4', name: 'Pengambilan Dokumen', desc: 'Warga menerima dokumen resmi yang telah distempel dinas pekon.', time: 'Selesai', icon: 'verified' },
    ],
    officer: 'Sekretariat Pekon Margodadi',
  },
]

const categories = [
  { id: 'all', name: 'Semua Layanan Publik', icon: 'category', count: 16 },
  { id: 'kependudukan', name: 'Administrasi Kependudukan', icon: 'badge', count: 5 },
  { id: 'surat', name: 'Surat Pengantar & Keterangan', icon: 'description', count: 6 },
  { id: 'sop', name: 'Standar Operasional (SOP) Loket', icon: 'rule', count: 3 },
  { id: 'fasilitas', name: 'Fasilitas & Sarpras Pekon', icon: 'meeting_room', count: 2 },
]

export default function LayananPublikPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedCards, setExpandedCards] = useState({ sku: true })

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

  const filteredServices = servicesData.filter((service) => {
    const query = searchQuery.trim().toLowerCase()
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    const matchesQuery =
      !query ||
      service.title.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.tags.some((tag) => tag.toLowerCase().includes(query))
    return matchesCategory && matchesQuery
  })

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
