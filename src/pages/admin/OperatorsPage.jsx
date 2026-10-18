import { useState, useEffect, useCallback } from 'react'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'
import DataTable from '../../components/admin/DataTable'
import operatorService from '../../services/operatorService'
import { useAuth } from '../../context/AuthContext'
import OperatorFormModal from '../../components/admin/operators/OperatorFormModal'
import DeleteOperatorModal from '../../components/admin/operators/DeleteOperatorModal'

export default function OperatorsPage() {
  const { operator: currentOperator } = useAuth()
  const [operators, setOperators] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingOperator, setEditingOperator] = useState(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingOperator, setDeletingOperator] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
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

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const diffSec = Math.floor((new Date() - date) / 1000)
    if (diffSec < 60) return 'Baru saja'
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin} mnt lalu`
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `${diffHour} jam lalu`
    return `${Math.floor(diffHour / 24)} hari lalu`
  }

  useEffect(() => {
    loadOperators()
    // Auto-refresh background setiap 15 detik untuk memantau status online & timeout 5 menit
    const interval = setInterval(() => {
      operatorService
        .getOperators()
        .then((res) => {
          if (res?.data) {
            setOperators(res.data)
          }
        })
        .catch(() => {})
    }, 15000)

    return () => clearInterval(interval)
  }, [loadOperators])

  const filteredOperators = operators.filter((op) => {
    if (statusFilter !== 'ALL' && op.status !== statusFilter) return false
    if (roleFilter !== 'ALL' && op.role !== roleFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const nameMatch = op.name?.toLowerCase().includes(q)
      const emailMatch = op.email?.toLowerCase().includes(q)
      const usernameMatch = op.username?.toLowerCase().includes(q)
      return nameMatch || emailMatch || usernameMatch
    }
    return true
  })

  const handleToggleStatus = async (op) => {
    const nextStatus = op.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE'
    try {
      await operatorService.updateOperatorStatus(op.operator_id, nextStatus)
      await loadOperators()
      showToast(`Status kehadiran ${op.name} diubah ke ${nextStatus}.`)
    } catch (err) {
      console.error('Failed to toggle status:', err)
      showToast('Gagal mengubah status operator.')
    }
  }

  const handleOpenAddModal = () => {
    setEditingOperator(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEditModal = (op) => {
    setEditingOperator(op)
    setIsFormModalOpen(true)
  }

  const handleSavedOperator = (saved) => {
    loadOperators()
    showToast(
      editingOperator
        ? `Perubahan akun ${saved?.name || 'aparatur'} berhasil disimpan.`
        : `Akun ${saved?.name || 'aparatur baru'} berhasil didaftarkan.`
    )
  }

  const handleOpenDeleteModal = (op) => {
    setDeletingOperator(op)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingOperator) return
    setIsDeleting(true)
    try {
      await operatorService.deleteOperator(deletingOperator.operator_id)
      setIsDeleteModalOpen(false)
      setDeletingOperator(null)
      await loadOperators()
      showToast(`Akun ${deletingOperator.name} berhasil dihapus.`)
    } catch (err) {
      console.error('Failed to delete operator:', err)
      const msg = err.response?.data?.message || 'Gagal menghapus akun operator.'
      showToast(msg)
    } finally {
      setIsDeleting(false)
    }
  }

  const columns = [
    {
      header: 'Operator / Aparatur',
      render: (row) => {
        const isSelf = currentOperator?.operator_id === row.operator_id
        return (
          <div className="flex items-center gap-3">
            <img
              src={row.avatar || '/favicon.svg'}
              alt={row.name}
              onError={(e) => {
                e.currentTarget.src = '/favicon.svg'
              }}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  {row.name}
                </span>
                {isSelf && (
                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md border border-emerald-300">
                    Anda
                  </span>
                )}
                {!row.is_active && (
                  <span className="px-1.5 py-0.2 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-md">
                    Nonaktif
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span className="font-mono text-primary font-semibold">
                  @{row.username || 'operator'}
                </span>
                <span>•</span>
                <span className="truncate">{row.email}</span>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      header: 'Role Akses',
      render: (row) => (
        <span
          className={`px-2.5 py-0.8 rounded-lg text-[11px] font-bold border inline-flex items-center gap-1 ${
            row.role === 'ADMIN'
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-xs">
            {row.role === 'ADMIN' ? 'shield_person' : 'support_agent'}
          </span>
          {row.role}
        </span>
      ),
    },
    {
      header: 'Status Kehadiran',
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <StatusBadge status={row.status} />
          {row.last_activity_at && (
            <span className="text-[10px] text-slate-400">
              {row.status === 'ONLINE' ? 'Aktif baru saja' : `Aktif: ${formatRelativeTime(row.last_activity_at)}`}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Kontak HP/WA',
      render: (row) => (
        <span className="text-xs font-medium text-slate-700">
          {row.phone && row.phone !== '-' ? (
            <a
              href={`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-slate-700 hover:text-emerald-600 hover:underline flex items-center gap-1 font-mono"
              title="Hubungi via WhatsApp"
            >
              <span className="material-symbols-outlined text-xs text-emerald-600">call</span>
              {row.phone}
            </a>
          ) : (
            <span className="text-slate-400">-</span>
          )}
        </span>
      ),
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
      header: 'Selesai',
      render: (row) => (
        <span className="font-bold text-emerald-700 text-xs">
          {row.resolvedCount} Sesi
        </span>
      ),
    },
    {
      header: 'Aksi Kelola',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => {
        const isSelf = currentOperator?.operator_id === row.operator_id
        return (
          <div className="flex items-center justify-end gap-1.5">
            {/* Quick Toggle Status */}
            <button
              onClick={() => handleToggleStatus(row)}
              className={`p-1.5 px-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                row.status === 'ONLINE'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
              title={row.status === 'ONLINE' ? 'Set Offline' : 'Set Online'}
            >
              <span className="material-symbols-outlined text-sm">
                {row.status === 'ONLINE' ? 'pause_circle' : 'play_circle'}
              </span>
              <span className="hidden xl:inline">{row.status === 'ONLINE' ? 'Offline' : 'Online'}</span>
            </button>

            {/* Edit & Reset Password Button */}
            <button
              onClick={() => handleOpenEditModal(row)}
              className="p-1.5 px-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs hover:border-slate-300"
              title="Edit Profil & Reset Password"
            >
              <span className="material-symbols-outlined text-sm text-slate-600">edit_note</span>
              <span>Edit</span>
            </button>

            {/* Delete Button (Protected from self-deletion) */}
            <button
              disabled={isSelf}
              onClick={() => handleOpenDeleteModal(row)}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center ${
                isSelf
                  ? 'border-slate-200 bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300 cursor-pointer shadow-2xs'
              }`}
              title={isSelf ? 'Anda tidak dapat menghapus akun Anda sendiri' : 'Hapus Akun Aparatur'}
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        )
      },
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Manajemen Aparatur & Operator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola data staf pekon, hak akses peran, penugasan tiket, dan pemulihan password
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadOperators}
            disabled={isLoading}
            className="p-2 px-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Muat Ulang"
          >
            <span className={`material-symbols-outlined text-base ${isLoading ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Refresh</span>
          </button>

          {/* Primary Add Operator Button */}
          <button
            onClick={handleOpenAddModal}
            className="p-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-md shadow-primary/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>Tambah Aparatur</span>
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
              placeholder="Cari nama, @username, atau email aparatur..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Role */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="ALL">Semua Peran</option>
              <option value="ADMIN">Admin</option>
              <option value="OPERATOR">Operator</option>
            </select>

            {/* Filter Status */}
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

      {/* Operator Add / Edit Form Modal with Real-time Verification & Password Reset */}
      <OperatorFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSaved={handleSavedOperator}
        editingOperator={editingOperator}
        currentUserId={currentOperator?.operator_id}
      />

      {/* Delete Confirmation Modal */}
      <DeleteOperatorModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeletingOperator(null)
        }}
        onConfirm={handleConfirmDelete}
        operator={deletingOperator}
        isDeleting={isDeleting}
      />
    </div>
  )
}
