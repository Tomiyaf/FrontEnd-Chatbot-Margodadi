import { useState, useEffect, useCallback } from 'react'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'
import DataTable from '../../components/admin/DataTable'
import operatorService from '../../services/operatorService'

export default function OperatorsPage() {
  const [operators, setOperators] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const loadOperators = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await operatorService.getOperators()
      if (res?.data) {
        setOperators(res.data)
      }
    } catch (err) {
      console.error('Failed to load operators:', err)
      showToast('Gagal memuat data operator.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOperators()
  }, [loadOperators])

  const filteredOperators = operators.filter((op) => {
    if (statusFilter !== 'ALL' && op.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return op.name.toLowerCase().includes(q) || op.email.toLowerCase().includes(q)
    }
    return true
  })

  const handleToggleStatus = async (op) => {
    const nextStatus = op.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE'
    try {
      await operatorService.updateOperatorStatus(op.operator_id, nextStatus)
      await loadOperators()
      showToast(`Status ${op.name} berhasil diubah menjadi ${nextStatus}.`)
    } catch (err) {
      console.error('Failed to toggle status:', err)
      showToast('Gagal mengubah status operator.')
    }
  }

  const columns = [
    {
      header: 'Operator / Aparatur',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={row.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div>
            <span className="font-bold text-slate-900 block text-xs sm:text-sm">
              {row.name}
            </span>
            <span className="text-[11px] text-slate-400">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Role Akses',
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
            row.role === 'ADMIN'
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: 'Status Kehadiran',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Tugas Aktif',
      render: (row) => (
        <span className="font-bold text-slate-800 text-xs">
          {row.assignedCount} Sesi
        </span>
      ),
    },
    {
      header: 'Selesai (Resolved)',
      render: (row) => (
        <span className="font-bold text-emerald-700 text-xs">
          {row.resolvedCount} Sesi
        </span>
      ),
    },
    {
      header: 'Rata-rata Respon',
      render: (row) => (
        <span className="font-medium text-slate-600 text-xs">
          {row.avgResponseTime}
        </span>
      ),
    },
    {
      header: 'Aksi Status',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleToggleStatus(row)}
            className={`p-1.5 px-2.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              row.status === 'ONLINE'
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
            title={row.status === 'ONLINE' ? 'Set Offline' : 'Set Online'}
          >
            <span className="material-symbols-outlined text-base">
              {row.status === 'ONLINE' ? 'pause_circle' : 'play_circle'}
            </span>
            <span>{row.status === 'ONLINE' ? 'Set Offline' : 'Set Online'}</span>
          </button>
        </div>
      ),
    },
  ]

  const totalAssigned = operators.reduce((sum, o) => sum + (o.assignedCount || 0), 0)
  const totalResolved = operators.reduce((sum, o) => sum + (o.resolvedCount || 0), 0)
  const onlineCount = operators.filter((o) => o.status === 'ONLINE').length

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Operator & Penugasan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola data aparatur pekon penanggung jawab intervensi Human-in-the-Loop
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadOperators}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Operator"
          value={operators.length}
          subtitle="Akun aparatur terdaftar"
          icon="groups"
        />
        <StatCard
          title="Operator Online"
          value={onlineCount}
          subtitle="Siap menerima tiket"
          icon="sensors"
          trend={`${onlineCount} staf aktif`}
          trendType="up"
        />
        <StatCard
          title="Total Ditugaskan"
          value={totalAssigned}
          subtitle="Sesi sedang ditangani"
          icon="assignment_ind"
        />
        <StatCard
          title="Total Terselesaikan"
          value={totalResolved}
          subtitle="Tiket selesai dilayani"
          icon="task_alt"
          trend="Performa Layanan Baik"
          trendType="up"
        />
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
              placeholder="Cari nama aparatur atau email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
              <option value="BUSY">Sibuk</option>
            </select>
          </div>
        </div>

        {/* Operators Table */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">
              progress_activity
            </span>
            <p className="text-xs">Memuat data aparatur...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredOperators}
            emptyMessage="Tidak ada operator yang sesuai dengan filter pencarian."
          />
        )}
      </div>
    </div>
  )
}
