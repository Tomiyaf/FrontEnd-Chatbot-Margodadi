import { useState } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'
import ChannelBadge from '../../components/admin/ChannelBadge'
import DataTable from '../../components/admin/DataTable'
import ExportModal from '../../components/admin/ExportModal'
import { initialEducationSessions } from '../../data/adminMockData'

export default function EducationPage() {
  const [sessions, setSessions] = useState(initialEducationSessions)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isExportOpen, setIsExportOpen] = useState(false)

  const filteredSessions = sessions.filter((s) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        s.respondentCode.toLowerCase().includes(q) ||
        s.topic.toLowerCase().includes(q)
      )
    }
    return true
  })

  const availableExportFields = [
    { key: 'respondentCode', label: 'Kode Responden Anonim' },
    { key: 'topic', label: 'Topik Modul Edukasi' },
    { key: 'interactionCount', label: 'Jumlah Interaksi / Pertanyaan' },
    { key: 'status', label: 'Status Kelulusan / Selesai' },
    { key: 'materialVersion', label: 'Versi Materi Edukasi' },
    { key: 'startedAt', label: 'Waktu Mulai Sesi' },
    { key: 'completedAt', label: 'Waktu Selesai' },
  ]

  const columns = [
    {
      header: 'Kode Responden (Anonim)',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400 text-sm">badge</span>
          <span className="font-mono font-bold text-slate-900 text-xs">
            {row.respondentCode}
          </span>
        </div>
      ),
    },
    {
      header: 'Topik Materi Edukasi',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-800 text-xs block">{row.topic}</span>
          <span className="text-[11px] text-slate-400 font-mono">Versi {row.materialVersion}</span>
        </div>
      ),
    },
    {
      header: 'Kanal',
      render: (row) => <ChannelBadge channel={row.channel} />,
    },
    {
      header: 'Interaksi',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-slate-700">
          {row.interactionCount} pesan
        </span>
      ),
    },
    {
      header: 'Skor Evaluasi',
      render: (row) => (
        <span
          className={`font-mono text-xs font-bold ${
            row.quizScore === '100%'
              ? 'text-emerald-700'
              : row.quizScore === '-'
              ? 'text-slate-400'
              : 'text-sky-700'
          }`}
        >
          {row.quizScore}
        </span>
      ),
    },
    {
      header: 'Status Sesi',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Waktu Sesi',
      render: (row) => (
        <span className="text-[11px] text-slate-500">{row.startedAt}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Monitoring Edukasi Pengelolaan Sampah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pemantauan sesi pembelajaran interaktif warga berbasis modul 3R & Bank Sampah Margodadi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export Data Edukasi</span>
          </button>
        </div>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sesi Edukasi"
          value="320"
          subtitle="Partisipasi warga desa"
          icon="school"
          trend="+22.5% minggu ini"
          trendType="positive"
        />
        <StatCard
          title="Sesi Tuntas (Completed)"
          value="267"
          subtitle="83.4% kelulusan modul"
          icon="task_alt"
          trend="Tingkat pemahaman tinggi"
          trendType="positive"
        />
        <StatCard
          title="Sedang Berlangsung"
          value="53"
          subtitle="Interaksi aktif"
          icon="hourglass_top"
          badge="Live"
        />
        <StatCard
          title="Topik Populer"
          value="Bank Sampah"
          subtitle="Komoditas ekonomi 3R"
          icon="recycling"
          badge="39% Sesi"
        />
      </div>

      {/* Breakdown 5 Topik Edukasi */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">menu_book</span>
          Sebaran Topik Modul Edukasi Sampah (PKM Margodadi 2026)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {[
            { name: 'Pemilahan Sampah', count: 98, pct: '30.6%', color: 'border-emerald-200 bg-emerald-50/50' },
            { name: 'Prinsip 3R Terapan', count: 82, pct: '25.6%', color: 'border-indigo-200 bg-indigo-50/50' },
            { name: 'Bank Sampah Berkah', count: 68, pct: '21.3%', color: 'border-amber-200 bg-amber-50/50' },
            { name: 'Bahaya Bakar Sampah', count: 42, pct: '13.1%', color: 'border-rose-200 bg-rose-50/50' },
            { name: 'Komposting Sederhana', count: 30, pct: '9.4%', color: 'border-teal-200 bg-teal-50/50' },
          ].map((topic, idx) => (
            <div key={idx} className={`p-3.5 rounded-xl border ${topic.color} space-y-1`}>
              <span className="text-xs font-bold text-slate-800 block truncate">{topic.name}</span>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-lg font-black text-slate-900">{topic.count}</span>
                <span className="text-[11px] font-bold text-slate-500 font-mono">{topic.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Data Table */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode responden (RESP-...) atau topik..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer w-full sm:w-auto"
            >
              <option value="ALL">Semua Status Sesi</option>
              <option value="COMPLETED">Selesai (Completed)</option>
              <option value="IN_PROGRESS">Berjalan (In Progress)</option>
            </select>
          </div>
        </div>

        <DataTable columns={columns} data={filteredSessions} />
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Export Data Sesi Edukasi Sampah"
        description="Pilih parameter untuk mengunduh rekap sesi edukasi warga Margodadi."
        availableFields={availableExportFields}
        onExport={(params) => {
          alert(`Data berhasil diekspor dalam format ${params.format}!`)
        }}
      />
    </div>
  )
}
