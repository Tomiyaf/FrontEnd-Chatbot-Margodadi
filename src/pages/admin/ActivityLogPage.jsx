import { useState } from 'react'
import DataTable from '../../components/admin/DataTable'
import { initialActivityLogs } from '../../data/adminMockData'

export default function ActivityLogPage() {
  const [logs, setLogs] = useState(initialActivityLogs)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('ALL')

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        log.operatorName.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q) ||
        (log.target && log.target.toLowerCase().includes(q))
      )
    }
    return true
  })

  const getActionBadge = (action) => {
    switch (action) {
      case 'TAKE_OVER':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            TAKE OVER HITL
          </span>
        )
      case 'OPERATOR_RESPONSE':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            RESPONS OPERATOR
          </span>
        )
      case 'ESCALATION_TRIGGER':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            ESKALASI AI
          </span>
        )
      case 'STATUS_RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            RESOLVED
          </span>
        )
      case 'STATUS_CHANGE':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            UBAH STATUS
          </span>
        )
      case 'LOGIN':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            AUTENTIKASI
          </span>
        )
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {action}
          </span>
        )
    }
  }

  const columns = [
    {
      header: 'Waktu Aktivitas',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-slate-400 text-sm">schedule</span>
          <span className="font-mono text-xs text-slate-700 font-medium">
            {row.timestamp}
          </span>
        </div>
      ),
    },
    {
      header: 'Operator / Aktor',
      render: (row) => (
        <span className="font-bold text-slate-900 text-xs">{row.operatorName}</span>
      ),
    },
    {
      header: 'Tipe Tindakan',
      render: (row) => getActionBadge(row.action),
    },
    {
      header: 'Objek / Target',
      render: (row) => (
        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">
          {row.target || '-'}
        </span>
      ),
    },
    {
      header: 'Deskripsi Aktivitas',
      render: (row) => (
        <span className="text-xs text-slate-600 leading-relaxed block max-w-md">
          {row.description}
        </span>
      ),
    },
    {
      header: 'Kanal',
      render: (row) => (
        <span className="text-[11px] font-medium text-slate-500 uppercase">
          {row.channel}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Activity Log & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Riwayat kronologis seluruh tindakan intervensi operator, perubahan status tiket, dan eskalasi HITL
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs font-medium">
            Tercatat: <strong className="text-slate-900">{filteredLogs.length}</strong> entri aktivitas
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama operator, target #CV, atau deskripsi..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">Semua Tipe Tindakan</option>
            <option value="TAKE_OVER">Take Over HITL</option>
            <option value="OPERATOR_RESPONSE">Respons Operator</option>
            <option value="ESCALATION_TRIGGER">Eskalasi AI (Need Human)</option>
            <option value="STATUS_RESOLVED">Penyelesaian Tiket</option>
            <option value="STATUS_CHANGE">Perubahan Status</option>
            <option value="LOGIN">Autentikasi Login</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      <DataTable columns={columns} data={filteredLogs} />
    </div>
  )
}
