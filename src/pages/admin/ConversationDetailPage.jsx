import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useOutletContext } from 'react-router-dom'
import MessageBubble from '../../components/admin/MessageBubble'
import HITLActionPanel from '../../components/admin/HITLActionPanel'
import StatusBadge from '../../components/admin/StatusBadge'
import ChannelBadge from '../../components/admin/ChannelBadge'
import CategoryBadge from '../../components/admin/CategoryBadge'
import conversationService from '../../services/conversationService'
import operatorService from '../../services/operatorService'

export default function ConversationDetailPage() {
  const { conversationId } = useParams()
  const { activeOperator } = useOutletContext() || {}

  const [conversation, setConversation] = useState(null)
  const [operators, setOperators] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [isSwitchingMode, setIsSwitchingMode] = useState(false)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Load conversation details and operators
  const loadData = useCallback(async (isQuiet = false) => {
    if (!isQuiet) setIsLoading(true)
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
      if (!isQuiet) showToast('Gagal memuat detail percakapan.')
    } finally {
      if (!isQuiet) setIsLoading(false)
    }
  }, [conversationId])

  useEffect(() => {
    loadData()

    // 5s polling interval for real-time chat updates
    const interval = setInterval(() => {
      loadData(true)
    }, 5000)

    return () => clearInterval(interval)
  }, [loadData])

  // HITL Intervention Handlers (Toggle Mode Operator vs AI)
  const handleToggleMode = async (targetMode, notes = '', notifyCitizen = true) => {
    const isOperatorTarget = targetMode === 'OPERATOR'
    const opName = activeOperator?.name || 'Operator Pelayanan'

    setIsSwitchingMode(true)
    try {
      const res = await conversationService.toggleInterventionMode(
        conversation.id || conversation.conversation_id || conversationId,
        {
          mode: targetMode,
          notes: notes || (isOperatorTarget
            ? `Mode intervensi operator diaktifkan oleh ${opName} (AI Dijeda)`
            : `Kendali percakapan dikembalikan ke Bot AI oleh ${opName}`),
          notify_citizen: notifyCitizen,
        }
      )

      await loadData(true)
      showToast(
        res?.message ||
          (isOperatorTarget
            ? 'Mode Operator aktif! Bot AI dijeda untuk percakapan ini.'
            : 'Kendali percakapan berhasil dikembalikan ke Bot AI.')
      )
    } catch (err) {
      console.error('Failed to toggle mode:', err)
      showToast('Gagal mengubah mode intervensi percakapan.')
    } finally {
      setIsSwitchingMode(false)
    }
  }

  const handleTakeOver = () => handleToggleMode('OPERATOR', '', true)
  const handleResumeAi = () => handleToggleMode('AI', '', true)

  const handleAssignOperator = async (targetOperator) => {
    try {
      await conversationService.assignOperator(
        conversation.id || conversation.conversation_id || conversationId,
        targetOperator.operator_id || targetOperator.id,
        `Ditugaskan kepada ${targetOperator.name}`
      )
      await loadData(true)
      showToast(`Percakapan berhasil ditugaskan ke ${targetOperator.name}.`)
    } catch (err) {
      console.error('Failed to assign operator:', err)
      showToast('Gagal menugaskan operator.')
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await conversationService.updateConversationStatus(
        conversation.id || conversation.conversation_id || conversationId,
        newStatus,
        `Status percakapan diubah menjadi ${newStatus}`
      )
      await loadData(true)
      showToast(`Status percakapan diubah menjadi ${newStatus}.`)
    } catch (err) {
      console.error('Failed to update status:', err)
      showToast('Gagal memperbarui status.')
    }
  }

  const handleSendMessage = async (content) => {
    setIsSending(true)
    try {
      const res = await conversationService.sendOperatorReply(
        conversation.id || conversation.conversation_id || conversationId,
        { content, close_conversation: false }
      )
      await loadData(true)
      const chLabel = conversation.channel === 'whatsapp' ? 'WhatsApp' : 'Website Portal'
      showToast(res?.message || `Respons berhasil terkirim langsung ke ${chLabel} warga.`)
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
        conversation.id || conversation.conversation_id || conversationId,
        'RESOLVED',
        'Percakapan diselesaikan oleh operator'
      )
      await loadData(true)
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
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Kembali ke Inbox</span>
        </Link>
      </div>
    )
  }

  const isNeedsHuman = Boolean(conversation?.needs_human ?? conversation?.needsHuman)
  const isWhatsApp = (conversation.channel || '').toLowerCase() === 'whatsapp'

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
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link
            to="/admin/conversations"
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
            title="Kembali ke Inbox"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                {conversation.id || `CV-${conversation.conversation_id}`}
              </h1>
              <ChannelBadge channel={conversation.channel} />
              <CategoryBadge category={conversation.category} />
              <StatusBadge status={conversation.status} />

              {/* Mode Intervensi Badge */}
              {conversation.status !== 'RESOLVED' && (
                isNeedsHuman ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs animate-pulse">
                    <span className="material-symbols-outlined text-[14px] text-amber-700">support_agent</span>
                    <span>Mode Operator (AI Dijeda)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                    <span className="material-symbols-outlined text-[14px] text-emerald-700">smart_toy</span>
                    <span>Mode AI Aktif</span>
                  </span>
                )
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1 truncate">
              Sesi Warga: <strong className="text-slate-800">{conversation.citizen_name}</strong>
              {conversation.phone && conversation.phone !== '-' && (
                <> · Nomor WA: <span className="font-mono font-bold text-emerald-700">{conversation.phone}</span></>
              )}
              {' '}· ID Sesi: <span className="font-mono text-slate-400">{conversation.session_id || conversation.id}</span>
              {isWhatsApp && (
                <span className="ml-1.5 inline-flex items-center gap-0.5 text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 text-[10px]">
                  <span className="material-symbols-outlined text-[11px]">bolt</span>
                  Gateway WAHA
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Top Action Bar Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => loadData()}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Muat Ulang Pesan & Status"
          >
            <span className={`material-symbols-outlined text-base ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {conversation.status !== 'RESOLVED' && (
            <button
              type="button"
              onClick={handleResolve}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Tandai Selesai"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span className="hidden sm:inline">Selesaikan</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Chat Stream + Right Metadata & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols): Chat Message Stream + HITL Action Form */}
        <div className="lg:col-span-2 space-y-5 min-w-0">
          {/* Chat Stream Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[520px]">
            {/* Chat Box Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
              <div className="flex items-center gap-2 text-xs">
                <span className={`w-2.5 h-2.5 rounded-full ${isNeedsHuman ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
                <span className="font-bold text-slate-800">Riwayat Percakapan Warga</span>
                <span className="text-slate-400">({conversation.messages?.length || 0} pesan)</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                <span>Kanal:</span>
                <ChannelBadge channel={conversation.channel} />
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
            conversation={conversation}
            channel={conversation.channel}
            onSendMessage={handleSendMessage}
            isSending={isSending}
            isSwitchingMode={isSwitchingMode}
            disabled={conversation.status === 'RESOLVED'}
            onTakeOver={handleTakeOver}
            onResumeAi={handleResumeAi}
            onSwitchMode={handleToggleMode}
          />
        </div>

        {/* Right Column (1 Col): Citizen Info & Operator Assignment Controls */}
        <div className="space-y-5 min-w-0">
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
                  <p className="font-bold text-slate-800 uppercase">{conversation.priority || 'NORMAL'}</p>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Nomor WhatsApp / Kontak</label>
                <p className="text-xs font-mono font-bold text-slate-800 pt-0.5">
                  {conversation.phone && conversation.phone !== '-' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <span className="material-symbols-outlined text-xs">chat</span>
                      <span>{conversation.phone}</span>
                    </span>
                  ) : (
                    'Anonim (Web Session)'
                  )}
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
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Petugas Bertugas:</span>
              {conversation.assigned_operator ? (
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={conversation.assigned_operator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={conversation.assigned_operator.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-300 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {conversation.assigned_operator.name}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium truncate block">
                      {conversation.assigned_operator.email || conversation.assigned_operator.role || 'Operator Pekon'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-rose-600 font-bold flex items-center gap-1.5 py-0.5">
                  <span className="material-symbols-outlined text-base">warning</span>
                  <span>Belum ada operator yang menangani</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-3 pt-1">
              {/* Assign to other operator dropdown */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-600 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">person_add</span>
                  Tugaskan ke Petugas Lain:
                </label>
                <select
                  onChange={(e) => {
                    const selected = operators.find((op) => String(op.operator_id || op.id) === e.target.value)
                    if (selected) handleAssignOperator(selected)
                  }}
                  value={conversation.assigned_operator?.operator_id || ''}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="" disabled>
                    -- Pilih Petugas / Aparatur --
                  </option>
                  {operators.map((op) => (
                    <option key={op.id || op.operator_id} value={op.operator_id || op.id}>
                      {op.name} ({op.role || 'Operator'}) {op.status ? ` - ${op.status}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Change Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-600 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">sync_alt</span>
                  Ubah Status Tiket:
                </label>
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

              {/* Quick Resolve Button if not yet resolved */}
              {conversation.status !== 'RESOLVED' && (
                <button
                  type="button"
                  onClick={handleResolve}
                  className="w-full mt-2 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Tandai Selesai (Resolve)</span>
                </button>
              )}
            </div>
          </div>

          {/* Status & HITL History Timeline */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">history</span>
              Linimasa &amp; Jejak Audit HITL
            </h3>

            <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 max-h-64 overflow-y-auto">
              {conversation.status_history?.map((hist, idx) => (
                <div key={idx} className="flex items-start gap-3 relative pl-6">
                  <span className="w-2 h-2 rounded-full bg-primary absolute left-1 top-1.5 ring-4 ring-white"></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{hist.status}</span>
                      <span className="text-[10px] text-slate-400">{hist.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{hist.note}</p>
                    {hist.operator_name && (
                      <span className="text-[10px] text-slate-400 italic">Oleh: {hist.operator_name}</span>
                    )}
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
