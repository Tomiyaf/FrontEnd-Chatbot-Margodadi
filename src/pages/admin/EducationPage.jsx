import { useState, useEffect, lazy } from 'react'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'
import ChannelBadge from '../../components/admin/ChannelBadge'
import DataTable from '../../components/admin/DataTable'
import LazyModal from '../../components/common/LazyModal'
import { educationService } from '../../services/educationService'
import { researchService } from '../../services/researchService'

const ExportModal = lazy(() => import('../../components/admin/ExportModal'))

export default function EducationPage() {
  const [sessions, setSessions] = useState([])
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    inProgressSessions: 0,
    completionRate: 0,
    growthTrend: '',
    growthType: 'neutral',
    avgQuizScore: '-',
    completionTrend: '',
    popularTopic: '-',
    popularTopicSubtitle: '',
    topicBreakdown: [],
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [exportMessage, setExportMessage] = useState(null)

  const fetchEducationData = async () => {
    try {
      setIsLoading(true)
      const res = await educationService.getSessions({
        search: searchQuery,
        status: statusFilter,
      })
      if (res.status === 'success' && res.data) {
        setSessions(res.data.sessions || [])
        if (res.data.stats) {
          setStats(res.data.stats)
        }
      }
    } catch (err) {
      console.error('Failed to load education data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEducationData()
  }, [statusFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEducationData()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const availableExportFields = [
    { key: 'respondentCode', label: 'Kode Responden Anonim' },
    { key: 'topic', label: 'Topik Modul Edukasi' },
    { key: 'interactionCount', label: 'Jumlah Interaksi / Pertanyaan' },
    { key: 'status', label: 'Status Kelulusan / Selesai' },
    { key: 'materialVersion', label: 'Versi Materi Edukasi' },
    { key: 'startedAt', label: 'Waktu Mulai Sesi' },
    { key: 'completedAt', label: 'Waktu Selesai' },
  ]

  const handleExport = async (params) => {
    try {
      await researchService.exportCsv({
        period: 'ALL',
        fields: params.fields || ['respondentCode', 'topic', 'interactionCount', 'status', 'startedAt'],
      })
      setExportMessage('Data sesi edukasi berhasil diekspor!')
      setTimeout(() => setExportMessage(null), 4000)
    } catch (err) {
      console.error('Export failed:', err)
      alert('Gagal mengekspor data: ' + (err.response?.data?.message || err.message))
    }
  }

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

      {exportMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span>{exportMessage}</span>
        </div>
      )}

      {/* 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sesi Edukasi"
          value={stats.totalSessions ?? sessions.length}
          subtitle="Partisipasi warga desa"
          icon="school"
          trend={stats.growthTrend || '+0 sesi minggu ini'}
          trendType={stats.growthType || 'neutral'}
        />
        <StatCard
          title="Sesi Tuntas (Completed)"
          value={stats.completedSessions}
          subtitle={`${stats.completionRate}% kelulusan modul`}
          icon="task_alt"
          trend={stats.completionTrend || 'Tingkat pemahaman tinggi'}
          trendType="positive"
        />
        <StatCard
          title="Sedang Berlangsung"
          value={stats.inProgressSessions}
          subtitle="Interaksi aktif"
          icon="hourglass_top"
          badge="Live"
        />
        <StatCard
          title="Topik Populer"
          value={stats.popularTopic}
          subtitle={stats.popularTopicSubtitle || 'Modul unggulan warga'}
          icon="recycling"
          badge="Modul Unggulan"
        />
      </div>

      {/* Breakdown Topik Edukasi */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">menu_book</span>
          Sebaran Topik Modul Edukasi Sampah (PKM Margodadi 2026)
        </h3>

        {stats.topicBreakdown && stats.topicBreakdown.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
            {stats.topicBreakdown.map((topic, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl border ${topic.color} space-y-1`}>
                <span className="text-xs font-bold text-slate-800 block truncate" title={topic.name}>
                  {topic.name}
                </span>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-lg font-black text-slate-900">{topic.count}</span>
                  <span className="text-[11px] font-bold text-slate-500 font-mono">{topic.pct}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400">
            Belum ada data topik edukasi tercatat di database.
          </div>
        )}
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

        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <span className="material-symbols-outlined text-3xl text-primary animate-spin">
              progress_activity
            </span>
            <p className="text-xs text-slate-500 mt-2">Memuat data sesi edukasi...</p>
          </div>
        ) : (
          <DataTable columns={columns} data={sessions} />
        )}
      </div>

      {/* Export Modal On-Demand */}
      <LazyModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        Component={ExportModal}
        fallbackTitle="Menyiapkan Panel Ekspor..."
        componentProps={{
          title: 'Export Data Sesi Edukasi Sampah',
          description: 'Pilih parameter untuk mengunduh rekap sesi edukasi warga Margodadi.',
          availableFields: availableExportFields,
          onExport: handleExport,
        }}
      />
    </div>
  )
}
