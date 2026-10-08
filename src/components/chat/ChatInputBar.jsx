import React from 'react'

export default function ChatInputBar({
  inputText,
  onInputChange,
  onSend,
  isTyping,
  textareaRef,
  isVoiceActive,
  onToggleVoice,
}) {
  const quickSuggestions = [
    { label: 'Syarat Surat Domisili', prompt: 'Bagaimana syarat dan cara membuat surat keterangan domisili di Pekon Margodadi?' },
    { label: 'Katalog UMKM Kopi', prompt: 'Saya ingin tahu daftar produk UMKM olahan kopi robusta unggulan desa.' },
    { label: 'Jadwal Bank Sampah', prompt: 'Bagaimana alur dan jadwal penyetoran sampah anorganik ke Bank Sampah Margodadi?' },
    { label: 'Surat Izin Usaha Mikro', prompt: 'Apa saja berkas yang harus disiapkan untuk permohonan Surat Keterangan Usaha (SKU)?' },
  ]

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="bg-white border-t border-slate-200/80 p-3 sm:p-4 space-y-3">
      {/* Quick Suggestion Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-primary">lightbulb</span>
          Topik Cepat:
        </span>
        {quickSuggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSend(item.prompt)}
            disabled={isTyping}
            className="text-xs bg-slate-50 hover:bg-primary/10 hover:text-primary text-slate-600 px-3 py-1.5 rounded-full border border-slate-200/80 whitespace-nowrap transition-all cursor-pointer font-medium disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Input Box & Action Buttons */}
      <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
        {/* Voice Toggle Button */}
        <button
          type="button"
          onClick={onToggleVoice}
          title={isVoiceActive ? 'Matikan Mikrofon' : 'Gunakan Input Suara'}
          className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
            isVoiceActive
              ? 'bg-rose-500 text-white animate-pulse'
              : 'text-slate-400 hover:text-primary hover:bg-slate-200/60'
          }`}
        >
          <span className="material-symbols-outlined text-xl">
            {isVoiceActive ? 'mic' : 'mic_none'}
          </span>
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputText}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pertanyaan terkait administrasi desa, UMKM, atau pilah sampah (tekan Enter untuk kirim)..."
          className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none max-h-28 py-1.5 px-1 leading-relaxed"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={() => onSend()}
          disabled={isTyping || !inputText.trim()}
          className="p-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>Didukung oleh Retrieval-Augmented Generation (RAG) &amp; pgvector Pekon Margodadi</span>
        <span className="hidden sm:inline">Shift + Enter untuk baris baru</span>
      </div>
    </div>
  )
}
