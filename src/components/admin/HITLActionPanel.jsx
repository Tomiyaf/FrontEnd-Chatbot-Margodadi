import { useState } from 'react'

export default function HITLActionPanel({
  conversation = {},
  channel,
  onTakeOver,
  onResumeAi,
  onSwitchMode,
  onSendMessage,
  isSending = false,
  isSwitchingMode = false,
  disabled = false,
}) {
  const effectiveChannel = channel || conversation?.channel || 'web'
  const isWhatsApp = effectiveChannel.toLowerCase() === 'whatsapp'
  const isNeedsHuman = Boolean(conversation?.needs_human ?? conversation?.needsHuman)

  const [replyContent, setReplyContent] = useState('')
  const [notifyCitizen, setNotifyCitizen] = useState(true)
  const [modeNote, setModeNote] = useState('')
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [localSending, setLocalSending] = useState(false)

  const quickTemplates = [
    'Selamat pagi/siang, mohon lampirkan fotokopi KTP & KK untuk kelengkapan berkas pelayanan.',
    'Untuk pengurusan surat tersebut, Bapak/Ibu dapat datang langsung ke Balai Pekon Margodadi setiap Senin–Jumat pukul 08.00–15.30 WIB.',
    'Pengajuan Bapak/Ibu saat ini sedang diverifikasi oleh Seksi Pelayanan Pekon Margodadi.',
    'Informasi Bank Sampah Berkah dapat diakses di Balai Dusun 1 setiap Minggu ke-2 dan ke-4.',
    'Terima kasih telah menghubungi Layanan Pekon Margodadi. Apakah ada hal lain yang dapat kami bantu?',
  ]

  const handleSend = async (e) => {
    e.preventDefault()
    if (!replyContent.trim() || isSending || localSending || disabled) return
    setLocalSending(true)
    try {
      if (onSendMessage) {
        await onSendMessage(replyContent)
      }
      setReplyContent('')
    } finally {
      setLocalSending(false)
    }
  }

  const handleToggleMode = (targetMode) => {
    if (onSwitchMode) {
      onSwitchMode(targetMode, modeNote, notifyCitizen)
      setModeNote('')
      setShowNoteInput(false)
    } else if (targetMode === 'OPERATOR' && onTakeOver) {
      onTakeOver()
    } else if (targetMode === 'AI' && onResumeAi) {
      onResumeAi()
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4 min-w-0">
      {/* ============================================================ */}
      {/* 1. DYNAMIC HITL INTERVENTION MODE BANNER                     */}
      {/* ============================================================ */}
      {conversation.status !== 'RESOLVED' ? (
        isNeedsHuman ? (
          // Mode Operator Aktif (AI Dijeda)
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 rounded-2xl p-4 sm:p-4.5 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-xl">support_agent</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-black text-[10px] tracking-wider uppercase">
                      Mode Operator Aktif
                    </span>
                    <span className="text-amber-800 font-bold text-xs">AI Dijeda (HITL)</span>
                  </div>
                  <h4 className="text-sm font-bold text-amber-950 mt-0.5">
                    Percakapan sedang ditangani secara manual oleh Petugas
                  </h4>
                  <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                    Bot AI tidak akan menjawab pertanyaan warga secara otomatis. Segala balasan dikirim langsung oleh aparatur ke {isWhatsApp ? 'WhatsApp' : 'Web'} warga.
                  </p>
                </div>
              </div>

              {/* Action: Resume AI */}
              <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleMode('AI')}
                  disabled={isSwitchingMode || disabled}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  title="Kembalikan kendali agar dijawab otomatis oleh Bot AI"
                >
                  {isSwitchingMode ? (
                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-base">smart_toy</span>
                  )}
                  <span>Kembalikan ke Bot AI</span>
                </button>
              </div>
            </div>

            {/* Notification Checkbox & Reason Toggle */}
            <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifyCitizen}
                  onChange={(e) => setNotifyCitizen(e.target.checked)}
                  className="rounded border-amber-300 text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] font-medium text-amber-900">
                  Kirim notifikasi otomatis ke {isWhatsApp ? 'WhatsApp' : 'Web'} warga saat ganti mode
                </span>
              </label>

              <button
                type="button"
                onClick={() => setShowNoteInput(!showNoteInput)}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
              >
                {showNoteInput ? 'Tutup Catatan' : '+ Tambah Catatan Audit'}
              </button>
            </div>

            {showNoteInput && (
              <div className="pt-1">
                <input
                  type="text"
                  value={modeNote}
                  onChange={(e) => setModeNote(e.target.value)}
                  placeholder="Alasan perubahan mode (opsional, untuk jejak audit pekon)..."
                  className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            )}
          </div>
        ) : (
          // Mode AI Aktif (Bot Menjawab Otomatis)
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 sm:p-4.5 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-xl">smart_toy</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] tracking-wider uppercase">
                      Mode AI Aktif
                    </span>
                    <span className="text-emerald-800 font-bold text-xs">Asisten Virtual Pekon</span>
                  </div>
                  <h4 className="text-sm font-bold text-emerald-950 mt-0.5">
                    Pertanyaan warga dijawab otomatis oleh RAG AI Basis Data Desa
                  </h4>
                  <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
                    Sistem otomatis mengalihkan bila warga butuh staf. Aparatur pekon dapat mengambil alih kapan pun untuk menjawab manual.
                  </p>
                </div>
              </div>

              {/* Action: Take Over */}
              <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleMode('OPERATOR')}
                  disabled={isSwitchingMode || disabled}
                  className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  title="Ambil alih percakapan dan jeda balasan otomatis Bot AI"
                >
                  {isSwitchingMode ? (
                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-base">front_hand</span>
                  )}
                  <span>Ambil Alih (Jeda AI)</span>
                </button>
              </div>
            </div>

            {/* Notification Checkbox & Reason Toggle */}
            <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifyCitizen}
                  onChange={(e) => setNotifyCitizen(e.target.checked)}
                  className="rounded border-emerald-300 text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] font-medium text-emerald-900">
                  Kirim notifikasi ke {isWhatsApp ? 'WhatsApp' : 'Web'} warga saat operator mengambil alih
                </span>
              </label>

              <button
                type="button"
                onClick={() => setShowNoteInput(!showNoteInput)}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                {showNoteInput ? 'Tutup Catatan' : '+ Tambah Catatan Audit'}
              </button>
            </div>

            {showNoteInput && (
              <div className="pt-1">
                <input
                  type="text"
                  value={modeNote}
                  onChange={(e) => setModeNote(e.target.value)}
                  placeholder="Alasan ambil alih tiket (opsional, untuk jejak audit pekon)..."
                  className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            )}
          </div>
        )
      ) : (
        // Status Selesai
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">task_alt</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Tiket Percakapan Telah Selesai (RESOLVED)</h4>
              <p className="text-xs text-slate-500">Percakapan ini telah ditutup oleh aparatur pekon.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleToggleMode('AI')}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            Buka Kembali dengan AI
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. OPERATOR DIRECT REPLY BOX                                 */}
      {/* ============================================================ */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <span className={`material-symbols-outlined text-base ${isWhatsApp ? 'text-emerald-600' : 'text-sky-600'}`}>
              {isWhatsApp ? 'chat' : 'reply'}
            </span>
            <span>
              Balas Pesan ke Warga via {isWhatsApp ? 'WhatsApp' : 'Website Portal'}
            </span>
            {isWhatsApp && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                WA Gateway Terhubung
              </span>
            )}
          </label>
          <span className="text-[11px] text-slate-400">
            {isWhatsApp ? 'Terkirim langsung ke WhatsApp pemohon' : 'Terkirim ke sesi web warga'}
          </span>
        </div>

        {/* Quick Response Templates */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Template Respon Cepat:</span>
          <div className="flex flex-wrap gap-1.5">
            {quickTemplates.map((tpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setReplyContent(tpl)}
                className="text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 px-2.5 py-1 rounded-lg transition-colors truncate max-w-xs text-left cursor-pointer border border-slate-200/60"
                title={tpl}
              >
                💬 {tpl}
              </button>
            ))}
          </div>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSend} className="space-y-2.5">
          <textarea
            rows="3"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            disabled={disabled}
            placeholder={
              disabled
                ? 'Percakapan telah diselesaikan. Buka kembali tiket jika ingin mengirim pesan balasan.'
                : isWhatsApp
                ? 'Ketik balasan resmi aparatur pekon (akan otomatis terkirim ke WhatsApp warga)...'
                : 'Ketik balasan aparatur pekon di sini...'
            }
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all resize-none disabled:bg-slate-100 disabled:cursor-not-allowed"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              {isWhatsApp ? (
                <>
                  <span className="material-symbols-outlined text-xs text-emerald-600">smartphone</span>
                  <span>Gateway WAHA: Balasan terkirim langsung ke nomor WhatsApp warga.</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xs text-sky-600">public</span>
                  <span>Balasan terkirim langsung ke obrolan portal web warga.</span>
                </>
              )}
            </span>

            <button
              type="submit"
              disabled={!replyContent.trim() || isSending || localSending || disabled}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed ${
                isWhatsApp
                  ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white'
                  : 'bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white'
              }`}
            >
              {isSending || localSending ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Mengirim ke {isWhatsApp ? 'WhatsApp...' : 'Warga...'}</span>
                </>
              ) : (
                <>
                  <span>Kirim ke {isWhatsApp ? 'WhatsApp' : 'Warga'}</span>
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
