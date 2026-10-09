import { useState, useEffect, lazy } from 'react'
import LazyModal from '../../components/common/LazyModal'
import { analyticsService } from '../../services/analyticsService'
import { dashboardService } from '../../services/dashboardService'
import { researchService } from '../../services/researchService'

const ExportModal = lazy(() => import('../../components/admin/ExportModal'))

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState('MONTH')
  const [selectedChannel, setSelectedChannel] = useState('ALL')
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(null)
  const [data, setData] = useState({
    kpi: {
      totalConversations: 0,
      autoResponseRatio: '0%',
      humanInterventionRatio: '0%',
      avgOperatorResponseTimeMinutes: 2.4,
    },
    channels: { website: 0, whatsapp: 0 },
    categories: [],
  })

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [analyticsRes, dashRes] = await Promise.all([
          analyticsService.getOverview(reportPeriod),
          dashboardService.getDashboardStats(reportPeriod),
        ])

        setData({
          kpi: analyticsRes?.data?.kpi || {
            totalConversations: 0,
            autoResponseRatio: '0%',
            humanInterventionRatio: '0%',
            avgOperatorResponseTimeMinutes: 2.4,
          },
          channels: dashRes?.data?.channels || { website: 0, whatsapp: 0 },
          categories: analyticsRes?.data?.categories || [],
        })
      } catch (err) {
        console.error('Failed to load report data:', err)
      }
    }

    fetchReportData()
  }, [reportPeriod])

  const { kpi, channels, categories } = data

  const reportFields = [
    { key: 'respondentCode', label: 'Kode Responden (Anonim)' },
    { key: 'topic', label: 'Topik Modul / Layanan' },
    { key: 'interactionCount', label: 'Jumlah Interaksi / Pertanyaan' },
    { key: 'status', label: 'Status Sesi (Open / Resolved)' },
    { key: 'startedAt', label: 'Waktu Mulai Sesi' },
  ]

  const handlePrint = () => {
    window.print()
  }

  const handleGenerateReport = () => {
    setIsExportModalOpen(true)
  }

  const handleExport = async (params) => {
    try {
      setIsGenerating(true)
      const res = await researchService.exportCsv({
        period: reportPeriod === 'ALL' ? 'ALL' : 'MONTH',
        fields: params.fields || ['respondentCode', 'topic', 'interactionCount', 'status', 'startedAt'],
      })
      if (res.success) {
        setDownloadSuccess(`Laporan berhasil diekspor: ${res.filename}`)
        setTimeout(() => setDownloadSuccess(null), 5000)
      }
    } catch (err) {
      alert('Gagal mengekspor laporan: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsGenerating(false)
    }
  }

  const totalWebsite = channels.website || 0
  const totalWhatsapp = channels.whatsapp || 0
  const totalConversations = kpi.totalConversations || (totalWebsite + totalWhatsapp) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pelaporan & Rekapitulasi Layanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ekspor rekapitulasi performa Virtual Guide dan penanganan tiket aparatur Pekon Margodadi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span className="hidden sm:inline">Cetak Dokumen</span>
          </button>

          <button
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Download Laporan (CSV / Data)</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Filter Options */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Parameter Filter Laporan
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Periode Laporan</label>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="MONTH">Bulan Ini (30 Hari Terakhir)</option>
              <option value="WEEK">7 Hari Terakhir</option>
              <option value="ALL">Semua Periode Data</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Filter Kanal</label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="ALL">Semua Kanal (Website & WhatsApp)</option>
              <option value="website">Hanya Website Portal</option>
              <option value="whatsapp">Hanya WhatsApp Gateway</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Format Standar</label>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex-1 text-center">
                📄 Cetak Resmi Pekon
              </span>
              <span className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex-1 text-center">
                📊 Data CSV / Excel
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Sheet Laporan (Bisa dicetak langsung / diunduh) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 print:border-none print:shadow-none">
        {/* Kop Surat Pekon Margodadi */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-md">
              PM
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
                Pemerintah Pekon Margodadi
              </h2>
              <p className="text-xs text-slate-600">
                Kecamatan Sumberejo, Kabupaten Tanggamus, Lampung
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                Laporan Kinerja Layanan Digital & Virtual Guide (Sistem Informasi Pekon)
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="font-bold text-slate-900 block">
              Periode: {reportPeriod === 'MONTH' ? 'Bulan Ini' : reportPeriod === 'WEEK' ? '7 Hari Terakhir' : 'Semua Periode'}
            </span>
            <span className="text-slate-500 font-mono">
              Status Sinkronisasi DB: Aktif
            </span>
          </div>
        </div>

        {/* Ringkasan Angka Utama */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500">Total Percakapan</span>
            <p className="text-xl font-black text-slate-900 mt-1">{totalConversations}</p>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800">Dijawab Otomatis AI</span>
            <p className="text-xl font-black text-emerald-800 mt-1">{kpi.autoResponseRatio}</p>
          </div>
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-800">Intervensi Manusia (HITL)</span>
            <p className="text-xl font-black text-amber-800 mt-1">{kpi.humanInterventionRatio}</p>
          </div>
          <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200">
            <span className="text-[10px] uppercase font-bold text-sky-800">Waktu Respon Rata-rata</span>
            <p className="text-xl font-black text-sky-800 mt-1">{kpi.avgOperatorResponseTimeMinutes} Menit</p>
          </div>
        </div>

        {/* Tabel Rincian Data Layanan */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            1. Rincian Volume & Status per Kanal
          </h3>
          <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-2.5">Kanal Layanan</th>
                <th className="p-2.5">Total Sesi</th>
                <th className="p-2.5">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-2.5 font-bold">Website Portal Margodadi</td>
                <td className="p-2.5 font-mono">{totalWebsite} sesi</td>
                <td className="p-2.5 text-slate-500">Portal Tanya Virtual Guide & Informasi Publik</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">WhatsApp Gateway</td>
                <td className="p-2.5 font-mono">{totalWhatsapp} sesi</td>
                <td className="p-2.5 text-slate-500">Layanan Loket Chatbot WhatsApp Pekon</td>
              </tr>
              <tr className="bg-slate-50 font-bold text-slate-900">
                <td className="p-2.5">TOTAL KESELURUHAN</td>
                <td className="p-2.5 font-mono">{totalConversations} sesi</td>
                <td className="p-2.5 text-emerald-700">Tercatat di Database PostgreSQL</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tabel Kategori */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            2. Distribusi Kategori Permohonan Informasi Warga
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {categories.map((c, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-600 block">{c.name}</span>
                <span className="font-bold text-slate-900 font-mono">{c.count} sesi ({c.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tanda Tangan Aparatur Pekon */}
        <div className="pt-8 flex justify-end">
          <div className="text-center text-xs space-y-12">
            <div>
              <p className="text-slate-500">Pekon Margodadi, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-bold text-slate-800">Aparatur Pekon Margodadi</p>
            </div>
            <div>
              <p className="font-bold text-slate-900 underline">( .................................................. )</p>
              <p className="text-[11px] text-slate-500">NIP / Jabatan Aparatur Pekon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal On-Demand */}
      <LazyModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        Component={ExportModal}
        fallbackTitle="Menyiapkan Laporan..."
        componentProps={{
          title: 'Unduh Berkas Laporan Layanan',
          description: 'Pilih format berkas dan rincian data laporan yang ingin diunduh.',
          availableFields: reportFields,
          onExport: handleExport,
        }}
      />
    </div>
  )
}
