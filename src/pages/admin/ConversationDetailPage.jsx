import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom'
import MessageBubble from '../../components/admin/MessageBubble'
import HITLActionPanel from '../../components/admin/HITLActionPanel'
import StatusBadge from '../../components/admin/StatusBadge'
import ChannelBadge from '../../components/admin/ChannelBadge'
import CategoryBadge from '../../components/admin/CategoryBadge'
import { initialConversations, initialOperators } from '../../data/adminMockData'

export default function ConversationDetailPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const { activeOperator } = useOutletContext() || {}

  const [conversation, setConversation] = useState(null)
  const [operators, setOperators] = useState(initialOperators)
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    const found = initialConversations.find((c) => c.id === conversationId)
    if (found) {
      setConversation({ ...found })
    } else {
      // Default to first conversation if not found
      setConversation({ ...initialConversations[0] })
    }
  }, [conversationId])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  if (!conversation) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">
          progress_activity
        </span>
        <span className="text-sm font-medium">Memuat data percakapan...</span>
      </div>
    )
  }

  // HITL Handlers
  const handleTakeOver = () => {
    const operator = activeOperator || operators[0]
    setConversation((prev) => ({
      ...prev,
      assignedOperator: operator,
      status: 'ASSIGNED',
      statusHistory: [
        ...prev.statusHistory,
        {
          status: 'ASSIGNED',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          note: `Diambil alih oleh ${operator.name} (Take Over HITL)`,
        },
      ],
    }))
    showToast(`Percakapan berhasil diambil alih oleh Anda (${operator.name}).`)
  }

  const handleAssignOperator = (targetOperator) => {
    setConversation((prev) => ({
      ...prev,
      assignedOperator: targetOperator,
      status: 'ASSIGNED',
      statusHistory: [
        ...prev.statusHistory,
        {
          status: 'ASSIGNED',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          note: `Ditugaskan kepada ${targetOperator.name}`,
        },
      ],
    }))
    showToast(`Percakapan berhasil ditugaskan ke ${targetOperator.name}.`)
  }

  const handleStatusChange = (newStatus) => {
    setConversation((prev) => ({
      ...prev,
      status: newStatus,
      needsHuman: newStatus === 'RESOLVED' ? false : prev.needsHuman,
      statusHistory: [
        ...prev.statusHistory,
        {
          status: newStatus,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          note: `Status diperbarui menjadi ${newStatus}`,
        },
      ],
    }))
    showToast(`Status percakapan diubah menjadi ${newStatus}.`)
  }

  const handleSendMessage = (content) => {
    const operatorName = activeOperator ? activeOperator.name : 'Operator Pekon'
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'OPERATOR',
      senderName: `${operatorName} (Operator)`,
      content,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      date: 'Hari Ini',
    }

    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      lastMessage: content,
      lastMessageSender: 'OPERATOR',
      statusHistory: [
        ...prev.statusHistory,
        {
          status: 'OPERATOR_RESPONSE',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          note: `Operator mengirim balasan resmi ke ${prev.channel}`,
        },
      ],
    }))
    showToast(`Respons terkirim ke warga via kanal ${conversation.channel.toUpperCase()}.`)
  }

  const handleResolve = () => {
    handleStatusChange('RESOLVED')
    showToast('Percakapan berhasil diselesaikan (RESOLVED).')
  }

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/conversations"
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-2xs"
            title="Kembali ke Inbox"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {conversation.id}
              </h1>
              <ChannelBadge channel={conversation.channel} />
              <CategoryBadge category={conversation.category} />
              <StatusBadge status={conversation.status} needsHuman={conversation.needsHuman} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sesi Warga: <strong className="text-slate-800">{conversation.citizenName}</strong> ·
              ID Sesi: <span className="font-mono">{conversation.sessionId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {conversation.status !== 'RESOLVED' && (
            <button
              onClick={handleResolve}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Selesaikan Percakapan</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Chat Stream + Right Metadata & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols): Chat Message Stream + HITL Action Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Chat Stream Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[520px]">
            {/* Chat Box Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-slate-800">Riwayat Percakapan Interaktif</span>
                <span className="text-slate-400">({conversation.messages?.length || 0} pesan)</span>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                Kanal Aktif: <span className="font-bold text-slate-700 uppercase">{conversation.channel}</span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col justify-start bg-slate-50/30">
              <div className="text-center my-2">
                <span className="text-[11px] bg-white border border-slate-200 text-slate-400 px-3 py-1 rounded-full font-medium shadow-2xs">
                  Awal Percakapan · {new Date(conversation.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                </span>
              </div>

              {conversation.messages?.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>
          </div>

          {/* Action Panel for HITL (Take Over, Direct Reply, Assign, Status) */}
          <HITLActionPanel
            conversation={conversation}
            operators={operators}
            currentOperator={activeOperator}
            onTakeOver={handleTakeOver}
            onAssign={handleAssignOperator}
            onStatusChange={handleStatusChange}
            onSendMessage={handleSendMessage}
            onResolve={handleResolve}
          />
        </div>

        {/* Right Column (1 Col): Metadata, Operator Info & Status Transitions */}
        <div className="space-y-5">
          {/* Metadata Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-base text-primary">info</span>
              Metadata Percakapan
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400">ID Percakapan</span>
                <span className="font-mono font-bold text-slate-800">{conversation.id}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400">ID Sesi Sistem</span>
                <span className="font-mono text-slate-700 text-[11px]">{conversation.sessionId}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400">Kanal Layanan</span>
                <ChannelBadge channel={conversation.channel} />
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400">Kategori Topik</span>
                <CategoryBadge category={conversation.category} />
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400">Waktu Masuk</span>
                <span className="font-medium text-slate-800">
                  {new Date(conversation.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  WIB
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-400">Operator Bertanggung Jawab</span>
                <span className="font-bold text-slate-800">
                  {conversation.assignedOperator ? conversation.assignedOperator.name : 'Belum Ada'}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Operator Card */}
          {conversation.assignedOperator && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <span className="material-symbols-outlined text-base text-primary">person</span>
                Profil Operator Penanggung Jawab
              </h3>

              <div className="flex items-center gap-3">
                <img
                  src={conversation.assignedOperator.avatar}
                  alt={conversation.assignedOperator.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {conversation.assignedOperator.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">{conversation.assignedOperator.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full">
                    {conversation.assignedOperator.role} · {conversation.assignedOperator.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* State Transition Flow Stepper (Chapter 25) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-base text-primary">timeline</span>
              Riwayat Transisi Status (HITL Workflow)
            </h3>

            <div className="space-y-3 relative pl-2">
              {conversation.statusHistory?.map((hist, idx) => (
                <div key={idx} className="flex items-start gap-2.5 relative">
                  {idx !== conversation.statusHistory.length - 1 && (
                    <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-200"></div>
                  )}

                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 z-10">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </div>

                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 font-mono text-[11px]">
                        {hist.status}
                      </span>
                      <span className="text-[10px] text-slate-400">{hist.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{hist.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
