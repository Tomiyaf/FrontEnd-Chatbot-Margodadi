import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom'
import MessageBubble from '../../components/admin/MessageBubble'
import HITLActionPanel from '../../components/admin/HITLActionPanel'
import StatusBadge from '../../components/admin/StatusBadge'
import ChannelBadge from '../../components/admin/ChannelBadge'
import CategoryBadge from '../../components/admin/CategoryBadge'
import conversationService from '../../services/conversationService'
import operatorService from '../../services/operatorService'

export default function ConversationDetailPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const { activeOperator } = useOutletContext() || {}

  const [conversation, setConversation] = useState(null)
  const [operators, setOperators] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)
  const [isSending, setIsSending] = useState(false)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Load conversation details and operators
  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [convRes, opsRes] = await Promise.all([
        conversationService.getConversationById(conversationId),
        operatorService.getOperators(),
      ])

      if (convRes?.data) {
        setConversation(convRes.data)
      }
      if (opsRes?.data) {
        setOperators(opsRes.data)
      }
    } catch (err) {
      console.error('Failed to load conversation details:', err)
      showToast('Gagal memuat detail percakapan.')
    } finally {
      setIsLoading(false)
    }
  }, [conversationId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // HITL Handlers
  const handleTakeOver = async () => {
    const targetOp = activeOperator || operators[0]
    if (!targetOp) return

    try {
      await conversationService.assignOperator(
        conversation.id || conversationId,
        targetOp.operator_id || 1,
        `Diambil alih langsung oleh ${targetOp.name} (Take Over HITL)`
      )
      await loadData()
      showToast(`Percakapan berhasil diambil alih oleh Anda (${targetOp.name}).`)
    } catch (err) {
      console.error('Failed to take over:', err)
      showToast('Gagal mengambil alih percakapan.')
    }
  }

  const handleAssignOperator = async (targetOperator) => {
    try {
      await conversationService.assignOperator(
        conversation.id || conversationId,
        targetOperator.operator_id,
        `Ditugaskan kepada ${targetOperator.name}`
      )
      await loadData()
      showToast(`Percakapan berhasil ditugaskan ke ${targetOperator.name}.`)
    } catch (err) {
      console.error('Failed to assign operator:', err)
      showToast('Gagal menugaskan operator.')
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await conversationService.updateConversationStatus(
        conversation.id || conversationId,
        newStatus,
        `Status percakapan diubah menjadi ${newStatus}`
      )
      await loadData()
      showToast(`Status percakapan diubah menjadi ${newStatus}.`)
    } catch (err) {
      console.error('Failed to update status:', err)
      showToast('Gagal memperbarui status.')
    }
  }

  const handleSendMessage = async (content) => {
    setIsSending(true)
    try {
      await conversationService.sendOperatorReply(
        conversation.id || conversationId,
        { content, close_conversation: false }
      )
      await loadData()
      showToast(`Respons berhasil terkirim ke warga via kanal ${conversation.channel?.toUpperCase()}.`)
    } catch (err) {
      console.error('Failed to send reply:', err)
      showToast('Gagal mengirim pesan balasan.')
    } finally {
      setIsSending(false)
    }
  }

  const handleResolve = async () => {
    try {
      await conversationService.updateConversationStatus(
        conversation.id || conversationId,
        'RESOLVED',
        'Percakapan diselesaikan oleh operator'
      )
      await loadData()
      showToast('Percakapan berhasil diselesaikan (RESOLVED).')
    } catch (err) {
      console.error('Failed to resolve conversation:', err)
      showToast('Gagal menyelesaikan percakapan.')
    }
  }

  if (isLoading && !conversation) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">
          progress_activity
        </span>
        <span className="text-sm font-medium">Memuat data percakapan...</span>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="py-20 text-center text-slate-500 space-y-3">
        <span className="material-symbols-outlined text-5xl text-slate-300">error</span>
        <p className="text-base font-bold">Percakapan tidak ditemukan.</p>
        <Link
          to="/admin/conversations"
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold inline-flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Kembali ke Inbox</span>
        </Link>
      </div>
    )
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
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            title="Kembali ke Inbox"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {conversation.id || `CV-${conversation.conversation_id}`}
              </h1>
              <ChannelBadge channel={conversation.channel} />
              <CategoryBadge category={conversation.category} />
              <StatusBadge status={conversation.status} needsHuman={conversation.needs_human} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sesi Warga: <strong className="text-slate-800">{conversation.citizen_name}</strong> ·
              ID Sesi: <span className="font-mono">{conversation.session_id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Muat Ulang Pesan"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
          </button>

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
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col justify-start bg-slate-50/30 space-y-3">
              {conversation.messages?.map((msg) => (
                <MessageBubble key={msg.id || msg.message_id} message={msg} />
              ))}
            </div>
          </div>

          {/* HITL Intervention & Reply Form */}
          <HITLActionPanel
            channel={conversation.channel}
            isAssigned={!!conversation.assigned_operator}
            assignedOperator={conversation.assigned_operator}
            onSendMessage={handleSendMessage}
            isSending={isSending}
            disabled={conversation.status === 'RESOLVED'}
          />
        </div>

        {/* Right Column (1 Col): Citizen Info & Operator Assignment Controls */}
        <div className="space-y-5">
          {/* Citizen Info Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">person</span>
              Informasi Warga Pemohon
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Identitas / Alias Warga</label>
                <p className="text-sm font-bold text-slate-900">{conversation.citizen_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Kanal Masuk</label>
                  <div className="pt-0.5">
                    <ChannelBadge channel={conversation.channel} />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Prioritas</label>
                  <p className="font-bold text-slate-800 uppercase">{conversation.priority}</p>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Nomor WhatsApp / Kontak</label>
                <p className="text-xs font-mono font-bold text-slate-800">
                  {conversation.phone && conversation.phone !== '-' ? conversation.phone : 'Anonim (Web Session)'}
                </p>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Kategori Kebutuhan</label>
                <div className="pt-0.5">
                  <CategoryBadge category={conversation.category} />
                </div>
              </div>
            </div>
          </div>

          {/* Operator Assignment & Status Management */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">support_agent</span>
              Penugasan Operator & Status
            </h3>

            {/* Current Assigned Operator */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[11px] text-slate-400 font-medium">Operator Bertugas:</span>
              {conversation.assigned_operator ? (
                <div className="flex items-center gap-2.5">
                  <img
                    src={conversation.assigned_operator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={conversation.assigned_operator.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {conversation.assigned_operator.name}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {conversation.assigned_operator.email}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-rose-600 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  <span>Belum ada operator yang menangani</span>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleTakeOver}
                className="w-full py-2.5 px-3 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">front_hand</span>
                <span>Ambil Alih Percakapan (Take Over)</span>
              </button>

              {/* Assign to other operator dropdown */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-medium">Tugaskan ke Staf Lain:</label>
                <select
                  onChange={(e) => {
                    const selected = operators.find((op) => String(op.operator_id || op.id) === e.target.value)
                    if (selected) handleAssignOperator(selected)
                  }}
                  value={conversation.assigned_operator?.operator_id || ''}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="" disabled>
                    -- Pilih Operator --
                  </option>
                  {operators.map((op) => (
                    <option key={op.id || op.operator_id} value={op.operator_id || op.id}>
                      {op.name} ({op.role}) - {op.status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Change Dropdown */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] text-slate-500 font-medium">Ubah Status Tiket:</label>
                <select
                  value={conversation.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="OPEN">OPEN (Menunggu)</option>
                  <option value="ASSIGNED">ASSIGNED (Sedang Ditangani)</option>
                  <option value="PENDING">PENDING (Menunggu Berkas Warga)</option>
                  <option value="RESOLVED">RESOLVED (Selesai)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status & HITL History Timeline */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">history</span>
              Linimasa & Jejak Audit HITL
            </h3>

            <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {conversation.status_history?.map((hist, idx) => (
                <div key={idx} className="flex items-start gap-3 relative pl-6">
                  <span className="w-2 h-2 rounded-full bg-primary absolute left-1 top-1.5 ring-4 ring-white"></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{hist.status}</span>
                      <span className="text-[10px] text-slate-400">{hist.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{hist.note}</p>
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
