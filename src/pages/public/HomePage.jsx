import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Section Placeholder */}
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-400/30 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4">
            <span>✨</span> Virtual Guide & Pelayanan Publik
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Selamat Datang di Virtual Guide Pekon Margodadi
          </h1>
          <p className="mt-4 text-emerald-100 text-sm sm:text-base leading-relaxed">
            Pusat informasi cerdas dan asisten virtual untuk memudahkan masyarakat dalam mencari informasi administrasi, layanan desa, dan panduan seputar Pekon Margodadi.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="px-5 py-2.5 bg-white text-emerald-800 rounded-xl font-semibold text-sm shadow-md hover:bg-emerald-50 transition-all cursor-pointer">
              Mulai Chatbot Asisten (Placeholder)
            </button>
            <Link
              to="/admin"
              className="px-5 py-2.5 bg-emerald-800/80 border border-emerald-500/50 text-white rounded-xl font-semibold text-sm hover:bg-emerald-900 transition-all"
            >
              Masuk Portal Admin →
            </Link>
          </div>
        </div>

        {/* Decorative Background Circles */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* Feature Cards Placeholder */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900">
            Layanan & Fitur Pekon (Front-Office)
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Placeholder fitur yang akan diakses oleh masyarakat umum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
              💬
            </div>
            <h3 className="font-semibold text-gray-900 text-base mb-1">
              Virtual Guide Chatbot
            </h3>
            <p className="text-sm text-gray-500">
              Asisten AI interaktif untuk menjawab pertanyaan seputar surat pengantar, syarat berkas, dan info pekon secara 24/7.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-4">
              📄
            </div>
            <h3 className="font-semibold text-gray-900 text-base mb-1">
              Panduan Layanan Surat
            </h3>
            <p className="text-sm text-gray-500">
              Daftar persyaratan dan prosedur pengurusan dokumen kependudukan serta administrasi desa lainnya.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg mb-4">
              📢
            </div>
            <h3 className="font-semibold text-gray-900 text-base mb-1">
              Pengumuman & Agenda
            </h3>
            <p className="text-sm text-gray-500">
              Informasi terkini kegiatan kemasyarakatan, bantuan sosial, dan kegiatan penting di Pekon Margodadi.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
