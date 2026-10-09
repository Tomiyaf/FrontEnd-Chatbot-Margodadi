import React, { forwardRef } from 'react'
import ChatBubble from './ChatBubble'

const ChatMessageFeed = forwardRef(function ChatMessageFeed(
  {
    messages,
    isTyping,
    feedbackGiven,
    onFeedback,
    onViewCitation,
    onChipClick,
  },
  ref
) {
  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60"
    >
      {/* Welcome Banner Card */}
      <div className="max-w-xl mx-auto p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center space-y-2">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-xl">account_balance</span>
        </div>
        <h2 className="text-sm font-bold text-slate-900">Virtual Guide Resmi Pekon Margodadi</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Tanyakan syarat pembuatan surat (Domisili, Keterangan Usaha, NA), informasi katalog UMKM desa, atau edukasi pilah sampah 3R. Jika sistem membutuhkan verifikasi khusus, aparatur pekon akan langsung memandu percakapan Anda.
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
            onFeedback={onFeedback}
            feedbackState={feedbackGiven[msg.id]}
            onViewCitation={onViewCitation}
            onChipClick={onChipClick}
          />
        </div>
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-start space-x-2 animate-in fade-in duration-200">
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs shadow-xs flex items-center space-x-2">
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
