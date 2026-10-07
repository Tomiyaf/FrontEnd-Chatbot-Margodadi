import { useState, useEffect } from 'react'
import DataTable from '../../components/admin/DataTable'
import StatusBadge from '../../components/admin/StatusBadge'
import { researchService } from '../../services/researchService'

export default function ResearchExportPage() {
  const [dateRange, setDateRange] = useState('MONTH')
  const [selectedFields, setSelectedFields] = useState({
    respondentCode: true,
    sessionId: true,
    topic: true,
    interactionCount: true,
    status: true,
    quizScore: true,
    materialVersion: true,
    startedAt: true,
  })
  const [previewData, setPreviewData] = useState([])
  const [isLoadingPreview, setIsLoadingPreview] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [downloadedFileName, setDownloadedFileName] = useState('')

  const fetchPreview = async () => {
    try {
      setIsLoadingPreview(true)
      const res = await researchService.getPreview(dateRange)
      if (res.status === 'success' && res.data) {
        setPreviewData(res.data)
      }
    } catch (err) {
      console.error('Failed to load preview:', err)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  useEffect(() => {
    fetchPreview()
  }, [dateRange])

  const fieldsList = [
    { key: 'respondentCode', label: 'Kode Responden Anonim (RESP-xxx)' },
    { key: 'sessionId', label: 'ID Sesi Sistem (Hashed)' },
    { key: 'topic', label: 'Topik Modul Interaksi' },
    { key: 'interactionCount', label: 'Jumlah Interaksi / Turn Chat' },
    { key: 'status', label: 'Status Penyelesaian Sesi' },
    { key: 'quizScore', label: 'Skor Evaluasi Pemahaman' },
    { key: 'materialVersion', label: 'Versi Konten / Modul' },
    { key: 'startedAt', label: 'Waktu Mulai Sesi' },
  ]

  const handleToggleField = (key) => {
    setSelectedFields((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleExportCSV = async () => {
    const activeFields = Object.keys(selectedFields).filter((k) => selectedFields[k])
    if (activeFields.length === 0) {
      alert('Pilih setidaknya satu atribut data untuk diekspor.')
      return
    }

    try {
      setIsExporting(true)
      const result = await researchService.exportCsv({
        period: dateRange,
        fields: activeFields,
      })
      if (result.success) {
        setDownloadedFileName(result.filename)
        setDownloadSuccess(true)
        setTimeout(() => setDownloadSuccess(false), 5000)
      }
    } catch (err) {
      console.error('Export CSV failed:', err)
      alert('Gagal mengekspor dataset: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsExporting(false)
    }
  }

  const columns = [
    {
      header: 'Kode Responden',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          {row.respondentCode}
        </span>
      ),
    },
    {
      header: 'Topik Materi',
      render: (row) => (
        <span className="text-xs font-semibold text-slate-800">{row.topic}</span>
      ),
    },
    {
      header: 'Interaksi',
      render: (row) => (
        <span className="font-mono text-xs text-slate-600">{row.interactionCount} turn</span>
      ),
    },
    {
      header: 'Evaluasi',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-emerald-700">{row.quizScore}</span>
      ),
    },
    {
      header: 'Status Riset',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Versi',
      render: (row) => (
        <span className="font-mono text-xs text-slate-500">{row.materialVersion}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Export Data Penelitian (Anonim)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ekspor dataset teranonimisasi untuk kebutuhan analisis data riset Skripsi 2 & PKM 2026
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          {isExporting ? (
            <>
              <span className="material-symbols-outlined text-base animate-spin">
                progress_activity
              </span>
              <span>Mengekspor Data...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export Dataset CSV</span>
            </>
          )}
        </button>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span>Berkas dataset anonim berhasil diunduh: {downloadedFileName || 'research_dataset_margodadi.csv'}</span>
        </div>
      )}

      {/* Parameter Box & Privacy Safeguard Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Field Selector */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">checklist</span>
            Pilih Variabel & Atribut Riset yang Diekspor
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {fieldsList.map((f) => (
              <label
                key={f.key}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/80 transition-colors cursor-pointer select-none text-xs text-slate-800"
              >
                <input
                  type="checkbox"
                  checked={!!selectedFields[f.key]}
                  onChange={() => handleToggleField(f.key)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <span className="font-medium">{f.label}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Rentang Waktu Data:</span>
            <div className="flex items-center gap-1.5">
              {[
                { label: 'Bulan Ini', val: 'MONTH' },
                { label: 'Semua Periode', val: 'ALL' },
              ].map((t) => (
                <button
                  key={t.val}
                  type="button"
                  onClick={() => setDateRange(t.val)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    dateRange === t.val
                      ? 'bg-primary text-white border-primary'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Privacy & Security Box */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-5 border border-blue-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">security</span>
            </div>
            <h3 className="text-sm font-bold text-blue-950">
              Perlindungan Privasi Responden (PII Safeguard)
            </h3>
            <p className="text-xs text-blue-800 leading-relaxed">
              Sesuai kaidah etika penelitian Skripsi 2, seluruh data percakapan yang diekspor telah
              melalui proses anonimisasi otomatis:
            </p>
            <ul className="text-xs text-blue-900/90 space-y-1 pl-4 list-disc">
              <li>Nama asli warga diganti dengan kode <code>RESP-xxx</code></li>
              <li>Nomor telepon & WhatsApp disamarkan</li>
              <li>Token autentikasi & password tidak pernah disertakan</li>
            </ul>
          </div>

          <div className="p-2.5 bg-white/80 backdrop-blur-xs rounded-xl border border-blue-200 text-[11px] text-blue-900 font-medium">
            Format file: <strong className="font-mono">CSV (Comma Separated Values)</strong> standar untuk SPSS / Python Pandas / R.
          </div>
        </div>
      </div>

      {/* Preview Dataset Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">preview</span>
              Pratinjau Dataset Teranonimisasi (Preview Sample)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Contoh struktur data yang akan tersimpan dalam file CSV ekspor
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{previewData.length} Sampel Ditampilkan</span>
        </div>

        {isLoadingPreview ? (
          <div className="p-12 text-center bg-white rounded-2xl">
            <span className="material-symbols-outlined text-3xl text-primary animate-spin">
              progress_activity
            </span>
            <p className="text-xs text-slate-500 mt-2">Memuat pratinjau dataset...</p>
          </div>
        ) : (
          <DataTable columns={columns} data={previewData} />
        )}
      </div>
    </div>
  )
}
