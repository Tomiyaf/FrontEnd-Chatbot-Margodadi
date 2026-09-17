import { useState } from 'react'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'
import DataTable from '../../components/admin/DataTable'
import { initialOperators } from '../../data/adminMockData'

export default function OperatorsPage() {
  const [operators, setOperators] = useState(initialOperators)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOperator, setEditingOperator] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'OPERATOR',
    phone: '',
    status: 'ONLINE',
  })

  const filteredOperators = operators.filter((op) => {
    if (statusFilter !== 'ALL' && op.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return op.name.toLowerCase().includes(q) || op.email.toLowerCase().includes(q)
    }
    return true
  })

  const handleOpenAdd = () => {
    setEditingOperator(null)
    setFormData({
      name: '',
      email: '',
      role: 'OPERATOR',
      phone: '',
      status: 'ONLINE',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (op) => {
    setEditingOperator(op)
    setFormData({
      name: op.name,
      email: op.email,
      role: op.role,
      phone: op.phone || '',
      status: op.status,
    })
    setIsModalOpen(true)
  }

  const handleToggleStatus = (opId) => {
    setOperators((prev) =>
      prev.map((op) =>
        op.id === opId
          ? { ...op, status: op.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE' }
          : op
      )
    )
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editingOperator) {
      setOperators((prev) =>
        prev.map((op) =>
          op.id === editingOperator.id ? { ...op, ...formData } : op
        )
      )
    } else {
      const newOp = {
        id: `OP-0${operators.length + 1}`,
        ...formData,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        assignedCount: 0,
        resolvedCount: 0,
        avgResponseTime: '0.0 mnt',
      }
      setOperators((prev) => [...prev, newOp])
    }
    setIsModalOpen(false)
  }

  const columns = [
    {
      header: 'Operator / Aparatur',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
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
      header: 'Aksi',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleToggleStatus(row.id)}
            className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              row.status === 'ONLINE'
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
            title={row.status === 'ONLINE' ? 'Set Offline' : 'Set Online'}
          >
            <span className="material-symbols-outlined text-base">
              {row.status === 'ONLINE' ? 'pause_circle' : 'play_circle'}
            </span>
          </button>

          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            title="Edit Data Operator"
          >
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
        </div>
      ),
    },
  ]

  const totalAssigned = operators.reduce((sum, o) => sum + o.assignedCount, 0)
  const totalResolved = operators.reduce((sum, o) => sum + o.resolvedCount, 0)
  const onlineCount = operators.filter((o) => o.status === 'ONLINE').length

  return (
    <div className="space-y-6">
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

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          <span>Tambah Operator Baru</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Operator"
          value={operators.length}
          subtitle="Akun terdaftar"
          icon="groups"
        />
        <StatCard
          title="Operator Online"
          value={onlineCount}
          subtitle="Siap menerima tiket"
          icon="sensors"
          trend={`${onlineCount} aktif saat ini`}
          trendType="positive"
        />
        <StatCard
          title="Tugas Berjalan"
          value={totalAssigned}
          subtitle="Sedang ditangani"
          icon="support_agent"
          trend="Tiket aktif"
          trendType="neutral"
        />
        <StatCard
          title="Total Resolusi"
          value={totalResolved}
          subtitle="Penanganan tuntas"
          icon="task_alt"
          trend="Performa tinggi"
          trendType="positive"
        />
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
            placeholder="Cari nama atau email operator..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">Semua Status</option>
            <option value="ONLINE">Hanya Online</option>
            <option value="OFFLINE">Hanya Offline</option>
          </select>
        </div>
      </div>

      {/* Operator Data Table */}
      <DataTable columns={columns} data={filteredOperators} />

      {/* Add / Edit Operator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingOperator ? 'Edit Data Operator' : 'Tambah Operator Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Siti Aminah"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Email Akun Pekon
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@margodadi.desa.id"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Role Hak Akses
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                  >
                    <option value="OPERATOR">OPERATOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Status Awal
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                  >
                    <option value="ONLINE">ONLINE</option>
                    <option value="OFFLINE">OFFLINE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  No. WhatsApp / HP
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Simpan Operator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
