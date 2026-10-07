import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import FilterBar from '../../components/admin/FilterBar'
import StatusBadge from '../../components/admin/StatusBadge'
import ChannelBadge from '../../components/admin/ChannelBadge'
import CategoryBadge from '../../components/admin/CategoryBadge'
import { initialConversations, initialOperators } from '../../data/adminMockData'

export default function ConversationsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialStatusFromUrl = searchParams.get('status') || 'ALL'

  // Filter States
  const [activeTab, setActiveTab] = useState(
    initialStatusFromUrl === 'NEED_HUMAN' ? 'hitl' : 'all'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [channelFilter, setChannelFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState(
    initialStatusFromUrl === 'NEED_HUMAN' ? 'NEED_HUMAN' : 'ALL'
  )
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [operatorFilter, setOperatorFilter] = useState('ALL')

  const tabs = [
    { id: 'all', label: 'Semua Percakapan', icon: 'forum', filterStatus: 'ALL' },
    {
      id: 'hitl',
      label: 'Perlu Tindakan (HITL)',
      icon: 'crisis_alert',
      filterStatus: 'NEED_HUMAN',
      badge: '3',
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'assigned', label: 'Ditugaskan', icon: 'person', filterStatus: 'ASSIGNED' },
    { id: 'pending', label: 'Pending', icon: 'schedule', filterStatus: 'PENDING' },
    { id: 'resolved', label: 'Selesai', icon: 'check_circle', filterStatus: 'RESOLVED' },
  ]

  const handleTabChange = (tab) => {
    setActiveTab(tab.id)
    setStatusFilter(tab.filterStatus)
    if (tab.filterStatus === 'ALL') {
      searchParams.delete('status')
    } else {
      searchParams.set('status', tab.filterStatus)
    }
    setSearchParams(searchParams)
  }

  const handleResetFilter = () => {
    setSearchQuery('')
    setChannelFilter('ALL')
    setStatusFilter('ALL')
    setCategoryFilter('ALL')
    setOperatorFilter('ALL')
    setActiveTab('all')
    setSearchParams({})
  }

  // Filtered dataset
  const filteredConversations = useMemo(() => {
    return initialConversations.filter((conv) => {
      // Tab / Status filter
      if (statusFilter === 'NEED_HUMAN') {
        if (!conv.needsHuman || conv.status === 'RESOLVED') return false
      } else if (statusFilter !== 'ALL' && conv.status !== statusFilter) {
        return false
      }

      // Channel filter
      if (channelFilter !== 'ALL' && conv.channel !== channelFilter) {
        return false
      }

      // Category filter
      if (categoryFilter !== 'ALL' && conv.category !== categoryFilter) {
        return false
      }

      // Operator filter
      if (operatorFilter === 'UNASSIGNED' && conv.assignedOperator) {
        return false
      }
      if (
        operatorFilter !== 'ALL' &&
        operatorFilter !== 'UNASSIGNED' &&
        conv.assignedOperator?.id !== operatorFilter
      ) {
        return false
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchId = conv.id.toLowerCase().includes(q)
        const matchCitizen = conv.citizenName.toLowerCase().includes(q)
        const matchLastMsg = conv.lastMessage.toLowerCase().includes(q)
        const matchCategory = conv.category?.toLowerCase().includes(q)
        if (!matchId && !matchCitizen && !matchLastMsg && !matchCategory) {
          return false
        }
      }

      return true
    })
  }, [searchQuery, channelFilter, statusFilter, categoryFilter, operatorFilter])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Inbox Percakapan Layanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola dan pantau percakapan interaksi warga dari Website dan WhatsApp Pekon Margodadi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs font-medium">
            Total Sesuai Filter: <strong className="text-slate-900">{filteredConversations.length}</strong> percakapan
          </span>
        </div>
      </div>

      {/* Navigation Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${tab.badgeColor}`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Advanced Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        channelFilter={channelFilter}
        onChannelChange={setChannelFilter}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val)
          if (val === 'NEED_HUMAN') setActiveTab('hitl')
          else if (val === 'ALL') setActiveTab('all')
          else if (val === 'ASSIGNED') setActiveTab('assigned')
          else if (val === 'PENDING') setActiveTab('pending')
          else if (val === 'RESOLVED') setActiveTab('resolved')
        }}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        operatorFilter={operatorFilter}
        onOperatorChange={setOperatorFilter}
        operators={initialOperators}
        onReset={handleResetFilter}
      />

      {/* Conversations List Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredConversations.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <span className="material-symbols-outlined text-5xl text-slate-300">
              chat_bubble_outline
            </span>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-700">
                Tidak ada percakapan yang sesuai dengan filter
              </p>
              <p className="text-xs text-slate-400">
                Coba ubah kata kunci pencarian atau reset filter di atas.
              </p>
            </div>
            <button
              onClick={handleResetFilter}
              className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => navigate(`/admin/conversations/${conv.id}`)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-all cursor-pointer group ${
                  conv.needsHuman && conv.status !== 'RESOLVED'
                    ? 'bg-rose-50/25 border-l-4 border-l-rose-500'
                    : ''
                }`}
              >
                {/* Left Side Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl">
                      {conv.channel === 'whatsapp' ? 'chat' : 'language'}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {conv.id}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {conv.citizenName}
                      </span>
                      <ChannelBadge channel={conv.channel} />
                      <CategoryBadge category={conv.category} />
                      <StatusBadge status={conv.status} needsHuman={conv.needsHuman} />
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {conv.lastMessage}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">support_agent</span>
                        <span>
                          Operator:{' '}
                          <strong className="text-slate-700">
                            {conv.assignedOperator ? conv.assignedOperator.name : 'Belum Ditugaskan'}
                          </strong>
                        </span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        <span>
                          {new Date(conv.updatedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}{' '}
                          {new Date(conv.updatedAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          WIB
                        </span>
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        Session: {conv.sessionId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  {conv.needsHuman && conv.status !== 'RESOLVED' && (
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs animate-bounce">
                        warning
                      </span>
                      Butuh Manusia
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/admin/conversations/${conv.id}`)
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 group-hover:bg-primary group-hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Buka Chat</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
