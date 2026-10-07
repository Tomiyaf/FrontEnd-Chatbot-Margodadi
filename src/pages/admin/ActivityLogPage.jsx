import { useState, useEffect, useCallback } from 'react'
import DataTable from '../../components/admin/DataTable'
import Pagination from '../../components/admin/Pagination'
import activityLogService from '../../services/activityLogService'

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('ALL')
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 20 })
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const loadLogs = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = {
        page: currentPage,
        per_page: 20,
      }
      if (actionFilter !== 'ALL') params.action = actionFilter

      const res = await activityLogService.getActivityLogs(params)
      if (res?.data) {
        setLogs(res.data)
        if (res.meta) setMeta(res.meta)
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, actionFilter])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  const filteredLogs = logs.filter((log) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        log.actor?.toLowerCase().includes(q) ||
        log.description?.toLowerCase().includes(q) ||
        (log.target && log.target.toLowerCase().includes(q))
      )
    }
    return true
  })

  const getActionBadge = (action) => {
    switch (action) {
      case 'TAKE_OVER':
      case 'ASSIGN_OPERATOR':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            {action === 'TAKE_OVER' ? 'TAKE OVER HITL' : 'PENUGASAN'}
          </span>
        )
      case 'OPERATOR_RESPONSE':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            RESPONS OPERATOR
          </span>
        )
      case 'STATUS_CHANGE':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            UBAH STATUS
          </span>
        )
      case 'OPERATOR_STATUS':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            STATUS OPERATOR
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
            {row.date} {row.timestamp} WIB
          </span>
        </div>
      ),
    },
    {
      header: 'Operator / Aktor',
      render: (row) => (
        <span className="font-bold text-slate-900 text-xs">{row.actor}</span>
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
        <span className="text-xs text-slate-600 line-clamp-1 leading-relaxed">
          {row.description}
        </span>
      ),
    },
    {
      header: 'Kanal',
      render: (row) => (
        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase font-mono">
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
            Log Aktivitas & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Catatan kronologis seluruh tindakan intervensi operator, pengalihan AI, dan perubahan status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadLogs}
            disabled={isLoading}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Muat Ulang"
          >
            <span className={`material-symbols-outlined text-base ${isLoading ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter & Table Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Table Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama operator, target tiket, atau deskripsi..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="ALL">Semua Tindakan</option>
              <option value="OPERATOR_RESPONSE">Respons Operator</option>
              <option value="ASSIGN_OPERATOR">Penugasan</option>
              <option value="STATUS_CHANGE">Ubah Status</option>
              <option value="OPERATOR_STATUS">Status Kehadiran</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">
              progress_activity
            </span>
            <p className="text-xs">Memuat log aktivitas...</p>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={filteredLogs}
              emptyMessage="Belum ada catatan aktivitas yang sesuai dengan filter."
            />

            {meta.last_page > 1 && (
              <div className="pt-2">
                <Pagination
                  currentPage={meta.current_page}
                  totalPages={meta.last_page}
                  totalItems={meta.total}
                  itemsPerPage={meta.per_page}
                  onPageChange={(p) => setCurrentPage(p)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
