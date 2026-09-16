export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Back-Office</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ringkasan aktivitas sistem dan interaksi Virtual Guide Pekon Margodadi.
        </p>
      </div>

      {/* Stats Cards Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Sesi Chat
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">1,248</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">↑ 12% dari bulan lalu</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Knowledge / FAQ
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">84 Item</div>
          <div className="text-xs text-gray-400 mt-1">Basis data aktif</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Layanan Terdaftar
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">18 Layanan</div>
          <div className="text-xs text-gray-400 mt-1">Surat & administrasi</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tingkat Akurasi AI
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">96.4%</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">Feedback positif warga</div>
        </div>
      </div>

      {/* Content Section Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Aktivitas Pertanyaan Terakhir Warga (Placeholder)
          </h2>
          <div className="space-y-3">
            {[
              {
                query: 'Bagaimana syarat pengurusan Surat Keterangan Usaha (SKU)?',
                time: '10 menit yang lalu',
                status: 'Terjawab Otomatis',
              },
              {
                query: 'Jadwal pelayanan kantor pekon hari Jumat buka jam berapa?',
                time: '25 menit yang lalu',
                status: 'Terjawab Otomatis',
              },
              {
                query: 'Persyaratan pindah domisili antar pekon',
                time: '1 jam yang lalu',
                status: 'Terjawab Otomatis',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.query}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
                <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Status Layanan (Placeholder)
          </h2>
          <div className="space-y-4 text-xs text-gray-600">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Status Server AI</span>
              <span className="font-semibold text-emerald-600">Online</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>API Gateway</span>
              <span className="font-semibold text-emerald-600">Terhubung</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Penyimpanan Dokumen</span>
              <span className="font-semibold text-gray-700">42% Terpakai</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
