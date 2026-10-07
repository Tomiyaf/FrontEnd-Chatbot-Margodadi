import { useState } from 'react'

export default function HITLActionPanel({
  conversation,
  operators = [],
  currentOperator,
  onTakeOver,
  onAssign,
  onStatusChange,
  onSendMessage,
  onResolve,
}) {
  const [selectedOperatorId, setSelectedOperatorId] = useState(
    conversation.assignedOperator?.id || ''
  )
  const [selectedStatus, setSelectedStatus] = useState(conversation.status || 'OPEN')
  const [replyContent, setReplyContent] = useState('')
  const [isSending, setIsSending] = useState(false)

  const isAssignedToMe =
    conversation.assignedOperator &&
    currentOperator &&
    conversation.assignedOperator.id === currentOperator.id

  const quickTemplates = [
    'Selamat pagi/siang, mohon lampirkan fotokopi KTP & KK untuk kelengkapan berkas.',
    'Untuk pelayanan tersebut dapat langsung datang ke Kantor Pekon Margodadi setiap Senin-Jumat pukul 08.00 - 15.00 WIB.',
    'Pengajuan Bapak/Ibu sedang diverifikasi oleh Seksi Pemerintahan Pekon.',
    'Informasi Bank Sampah Berkah dapat diakses di Balai Dusun 1 setiap Minggu ke-2 dan ke-4.',
  ]

  const handleSend = (e) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    setIsSending(true)
    setTimeout(() => {
      onSendMessage(replyContent)
      setReplyContent('')
      setIsSending(false)
    }, 400)
  }

  const handleApplyAssignment = () => {
    const target = operators.find((op) => op.id === selectedOperatorId)
    if (target) {
      onAssign(target)
    }
  }

  const handleApplyStatus = () => {
    onStatusChange(selectedStatus)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
      {/* HITL Escalation Alert Banner if Needs Human */}
      {conversation.needsHuman && conversation.status !== 'RESOLVED' && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-rose-600 text-2xl mt-0.5 animate-bounce">
              warning
            </span>
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                Percakapan Membutuhkan Intervensi Manusia (HITL)
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                AI tidak dapat menjawab pertanyaan spesifik atau warga meminta bantuan operator langsung.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {(!conversation.assignedOperator || !isAssignedToMe) && (
              <button
                onClick={onTakeOver}
                className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">front_hand</span>
                <span>Ambil Alih Percakapan</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Control Grid: Assignment & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Assignment Box */}
        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary">person_add</span>
            Penugasan Operator
          </label>
          <div className="flex items-center gap-2">
            <select
              value={selectedOperatorId}
              onChange={(e) => setSelectedOperatorId(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
            >
              <option value="">-- Pilih Operator --</option>
              {operators.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.name} ({op.role} - {op.status})
                </option>
              ))}
            </select>
            <button
              onClick={handleApplyAssignment}
              disabled={!selectedOperatorId}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold transition-colors disabled:cursor-not-allowed"
            >
              Tugaskan
            </button>
          </div>
          {conversation.assignedOperator && (
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
              <span>Saat ini ditangani oleh:</span>
              <span className="font-bold text-slate-800">
                {conversation.assignedOperator.name}
              </span>
            </div>
          )}
        </div>

        {/* Status Box */}
        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary">sync_alt</span>
            Status Percakapan
          </label>
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
            >
              <option value="OPEN">OPEN (Terbuka)</option>
              <option value="ASSIGNED">ASSIGNED (Ditugaskan)</option>
              <option value="PENDING">PENDING (Menunggu Info)</option>
              <option value="RESOLVED">RESOLVED (Selesai)</option>
            </select>
            <button
              onClick={handleApplyStatus}
              className="px-3.5 py-2 bg-primary hover:bg-primary-container text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Simpan
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Status aktif: <strong className="text-slate-800">{conversation.status}</strong></span>
            {conversation.status !== 'RESOLVED' && (
              <button
                onClick={onResolve}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">check_circle</span>
                Tandai Selesai
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Operator Direct Reply Box */}
      <div className="border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-sky-600">reply</span>
            Kirim Respons Operator ke Warga ({conversation.channel === 'whatsapp' ? 'WhatsApp' : 'Website'})
          </label>
          <span className="text-[11px] text-slate-400">
            Respons dikirim real-time ke kanal aktif warga
          </span>
        </div>

        {/* Quick Response Chips */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {quickTemplates.map((tpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setReplyContent(tpl)}
              className="text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors truncate max-w-xs text-left"
              title={tpl}
            >
              💬 {tpl}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="space-y-2">
          <textarea
            rows="3"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Ketik balasan resmi aparatur pekon di sini..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all resize-none"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Tekan tombol Kirim untuk menyalurkan pesan via gateway {conversation.channel}
            </span>

            <button
              type="submit"
              disabled={!replyContent.trim() || isSending}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <span>Kirim Respons Operator</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
