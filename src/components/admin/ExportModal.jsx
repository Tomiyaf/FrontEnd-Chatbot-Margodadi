import { useState } from 'react'

export default function ExportModal({
  isOpen,
  onClose,
  title = 'Export Data',
  description = 'Pilih parameter dan format data yang ingin diekspor.',
  availableFields = [],
  onExport,
}) {
  const [selectedFields, setSelectedFields] = useState(
    availableFields.reduce((acc, curr) => ({ ...acc, [curr.key]: true }), {})
  )
  const [format, setFormat] = useState('CSV')
  const [dateRange, setDateRange] = useState('MONTH')
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen) return null

  const handleToggleField = (key) => {
    setSelectedFields((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSelectAll = (checkAll) => {
    const updated = {}
    availableFields.forEach((f) => {
      updated[f.key] = checkAll
    })
    setSelectedFields(updated)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      if (onExport) {
        onExport({
          fields: selectedFields,
          format,
          dateRange,
        })
      }
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Periode */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Rentang Waktu
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '7 Hari Terakhir', val: '7DAYS' },
                { label: 'Bulan Ini', val: 'MONTH' },
                { label: 'Semua Waktu', val: 'ALL' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.val}
                  onClick={() => setDateRange(item.val)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    dateRange === item.val
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Format Berkas
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['CSV', 'PDF', 'EXCEL'].map((fmt) => (
                <button
                  type="button"
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    format === fmt
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {fmt === 'CSV' ? 'table_view' : fmt === 'PDF' ? 'picture_as_pdf' : 'analytics'}
                  </span>
                  <span>{fmt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fields Selection */}
          {availableFields.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Data yang Diekspor
                </label>
                <div className="space-x-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleSelectAll(true)}
                    className="text-primary hover:underline font-semibold"
                  >
                    Pilih Semua
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(false)}
                    className="text-slate-500 hover:underline"
                  >
                    Hapus Semua
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 max-h-36 overflow-y-auto space-y-2">
                {availableFields.map((f) => (
                  <label
                    key={f.key}
                    className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={!!selectedFields[f.key]}
                      onChange={() => handleToggleField(f.key)}
                      className="rounded text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>{f.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2 text-[11px] text-blue-800">
            <span className="material-symbols-outlined text-sm text-blue-600 mt-0.5">lock</span>
            <span>
              Data identitas pribadi (PII) sensitif disamarkan secara otomatis sesuai standar anonimitas riset.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isExporting}
              className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Mengekspor...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Unduh Berkas</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
