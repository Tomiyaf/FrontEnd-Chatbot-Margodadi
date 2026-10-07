export default function FilterBar({
  searchQuery,
  onSearchChange,
  channelFilter,
  onChannelChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  operatorFilter,
  onOperatorChange,
  operators = [],
  onReset,
  className = '',
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3 ${className}`}
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari ID percakapan, nama warga, kata kunci pesan..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Kanal */}
          <select
            value={channelFilter}
            onChange={(e) => onChannelChange(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
          >
            <option value="ALL">Semua Kanal</option>
            <option value="website">Website Portal</option>
            <option value="whatsapp">WhatsApp</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="NEED_HUMAN">⚠ Perlu Tindakan (HITL)</option>
            <option value="OPEN">Open</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          {/* Kategori */}
          {categoryFilter !== undefined && (
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Administrasi">Administrasi</option>
              <option value="Edukasi Sampah">Edukasi Sampah</option>
              <option value="Potensi UMKM">Potensi UMKM</option>
              <option value="Informasi Publik">Informasi Publik</option>
            </select>
          )}

          {/* Operator */}
          {operatorFilter !== undefined && (
            <select
              value={operatorFilter}
              onChange={(e) => onOperatorChange(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
            >
              <option value="ALL">Semua Operator</option>
              <option value="UNASSIGNED">Belum Ditugaskan</option>
              {operators.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.name} ({op.role})
                </option>
              ))}
            </select>
          )}

          {/* Reset */}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset Filter"
            >
              <span className="material-symbols-outlined text-base">restart_alt</span>
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
