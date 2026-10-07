import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { publicService } from '../../services/publicService'

export default function EdukasiSampahPage() {
  const navigate = useNavigate()
  const [topics, setTopics] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true)
        const res = await publicService.getEducationTopics()
        if (res?.data && res.data.length > 0) {
          setTopics(res.data)
        }
      } catch (err) {
        console.error('Failed to load education topics:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTopics()
  }, [])

  const handleAskBot = (prompt) => {
    navigate(`/tanya-virtual-guide?q=${encodeURIComponent(prompt)}`)
  }

  const staticCategories = [
    {
      title: 'Sampah Organik',
      badge: 'Dekomposisi Alami',
      color: 'border-emerald-200 bg-emerald-50/60 text-emerald-900',
      icon: 'eco',
      examples: ['Sisa sayur & buah', 'Nasi & lauk basi', 'Daun pekarangan', 'Ranting kecil'],
      destination: 'Pakan Maggot BSF & Pengomposan EM4 Rumah Tangga',
    },
    {
      title: 'Sampah Anorganik (Bernilai)',
      badge: 'Tabungan Bank Sampah',
      color: 'border-blue-200 bg-blue-50/60 text-blue-900',
      icon: 'recycling',
      examples: ['Botol & gelas plastik', 'Kardus & kertas', 'Kaleng minuman', 'Minyak jelantah'],
      destination: 'Setor ke Bank Sampah Berkah Margodadi (Sabtu Pagi)',
    },
    {
      title: 'Sampah Residu (B3 / Limbah)',
      badge: 'Penanganan Khusus',
      color: 'border-rose-200 bg-rose-50/60 text-rose-900',
      icon: 'delete_forever',
      examples: ['Pembalut & popok', 'Plastik sachet kotor', 'Pecahan kaca', 'Baterai bekas'],
      destination: 'Pengangkutan TPS3R Pekon ke TPA Kabupaten',
    },
  ]

  return (
    <div className="flex flex-col w-full">
      {/* Top Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-primary-fixed/20 via-surface-container-high/30 to-surface py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              <span className="material-symbols-outlined text-sm">recycling</span>
              <span>Modul PKM &amp; Gerakan Pekon Margodadi Bersih 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              Edukasi Pengelolaan Sampah Mandiri &amp; Bank Sampah
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed font-medium">
              Pelajari tata cara pemilahan sampah 3 wadah, jadwal penimbangan Bank Sampah Berkah, dan teknologi pengolahan kompos pekarangan warga Margodadi.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* 3 Kategori Wadah Pemilahan */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Panduan Dasar</span>
            <h2 className="text-2xl font-bold text-on-surface mt-1">
              3 Kategori Pemilahan Sampah Rumah Tangga
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Pisahkan sampah dari dapur dan pekarangan sejak dari sumbernya sebelum dibuang atau disetorkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {staticCategories.map((cat, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border ${cat.color} space-y-4 shadow-xs flex flex-col justify-between`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-white/80 rounded-full">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{cat.title}</h3>
                  <div>
                    <span className="text-xs font-semibold block mb-1">Contoh Jenis Sampah:</span>
                    <ul className="text-xs space-y-1 pl-4 list-disc">
                      {cat.examples.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/10 text-xs font-medium">
                  <span className="text-[11px] font-bold block opacity-70">Alur Pemrosesan:</span>
                  <span>{cat.destination}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Database Topics Interactive Modules */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Modul Pengetahuan Desa</span>
              <h2 className="text-2xl font-bold text-on-surface mt-1">
                Topik Materi Edukasi Pekon Margodadi
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Materi interaktif yang terhubung langsung ke kecerdasan buatan Virtual Guide RAG
              </p>
            </div>
            <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-xl border border-emerald-200 self-start sm:self-auto">
              {topics.length} Modul Terdaftar di Database
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-surface-container-high/60">
              <span className="material-symbols-outlined text-3xl text-primary animate-spin">
                progress_activity
              </span>
              <p className="text-xs text-on-surface-variant mt-2">Memuat modul edukasi dari database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((t, idx) => (
                <div
                  key={t.topic_id || idx}
                  className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high/60 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                        0{t.sequence_order || idx + 1}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 rounded-md text-slate-600 font-semibold">
                        {t.knowledge_base_version || 'v2.1'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAskBot(`Jelaskan materi tentang ${t.name} di Pekon Margodadi`)}
                    className="w-full py-2.5 px-4 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Tanyakan ke Virtual Guide</span>
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bank Sampah Quick Schedule Banner */}
        <div className="bg-gradient-to-br from-primary via-primary-container to-secondary-container rounded-3xl p-6 sm:p-10 text-on-primary shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold uppercase tracking-wider">
              Bank Sampah Berkah Margodadi
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Ingin Menjadi Nasabah Tabungan Sampah?
            </h3>
            <p className="text-xs sm:text-sm text-on-primary/90 max-w-xl">
              Daftarkan buku tabungan gratis di Balai Pekon setiap hari kerja atau datang langsung saat jadwal penimbangan rutin setiap hari Sabtu pukul 08.30 – 12.00 WIB.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/tanya-virtual-guide?q=Bagaimana cara daftar Bank Sampah Berkah Margodadi dan berapa harga per kilonya?"
              className="px-6 py-3.5 bg-white text-primary hover:bg-slate-100 font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">help</span>
              <span>Cek Harga &amp; Syarat Setor</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
