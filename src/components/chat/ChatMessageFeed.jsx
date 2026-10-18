import React, { forwardRef } from 'react'
import ChatBubble from './ChatBubble'

const ChatMessageFeed = forwardRef(function ChatMessageFeed(
  {
    messages,
    isTyping,
    onViewCitation,
    onChipClick,
  },
  ref
) {
  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-surface-container-low/40 via-white to-surface-container-low/30"
    >
      {/* Welcome Banner Card */}
      <div className="max-w-xl mx-auto p-3.5 sm:p-4.5 rounded-2xl bg-white/95 backdrop-blur-xs border border-primary/15 shadow-xs text-center space-y-1.5 sm:space-y-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-primary/15 to-primary-container/20 text-primary flex items-center justify-center mx-auto shadow-xs border border-primary/10">
          <span className="material-symbols-outlined text-lg sm:text-xl">account_balance</span>
        </div>
        <h2 className="text-xs sm:text-sm font-bold text-slate-900">Virtual Guide Resmi Pekon Margodadi</h2>
        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
          Tanyakan syarat pembuatan surat (Domisili, Keterangan Usaha, NA), atau informasi katalog produk UMKM pekon. Jika sistem membutuhkan verifikasi khusus, aparatur pekon akan langsung memandu percakapan Anda.
        </p>
      </div>

      {/* Messages List */}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <ChatBubble
            message={msg}
            onViewCitation={onViewCitation}
            onChipClick={onChipClick}
          />
        </div>
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-start space-x-2.5 animate-in fade-in duration-200">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-emerald-500 text-white flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-sm">smart_toy</span>
          </div>
          <div className="p-3.5 bg-white border border-primary/20 rounded-2xl rounded-tl-xs shadow-xs flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Virtual Guide sedang mencari informasi di basis pengetahuan...
            </span>
          </div>
        </div>
      )}
    </div>
  )
})

export default ChatMessageFeed
