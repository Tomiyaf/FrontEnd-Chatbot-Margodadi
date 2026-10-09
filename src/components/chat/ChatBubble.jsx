import React from 'react'

export default function ChatBubble({
  message,
  onFeedback,
  feedbackState,
  onViewCitation,
  onChipClick,
}) {
  const isUser = message.sender === 'user'
  const isOperator = message.sender === 'operator'
  const isBot = message.sender === 'bot' || !message.sender

  // Helper to render bold markdown (**text**)
  const renderFormattedText = (text) => {
    if (!text) return ''
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1 max-w-[88%] sm:max-w-[80%]`}>
      {/* Sender Header Label */}
      <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-400 font-medium">
        {isOperator && (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <span className="material-symbols-outlined text-xs">support_agent</span>
            <span>Aparatur Pekon (Manusia)</span>
          </span>
        )}
        {isBot && (
          <span className="inline-flex items-center gap-1 text-primary font-bold">
            <span className="material-symbols-outlined text-xs">smart_toy</span>
            <span>Virtual Guide</span>
          </span>
        )}
        {isUser && <span>Anda</span>}
        <span>•</span>
        <span>{message.timestamp}</span>
      </div>

      {/* Bubble Container */}
      <div
        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs transition-all ${
          isUser
            ? 'bg-primary text-on-primary rounded-tr-xs'
            : isOperator
            ? 'bg-emerald-50/90 text-emerald-950 border border-emerald-200 rounded-tl-xs'
            : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
        }`}
      >
        <div className="whitespace-pre-wrap font-sans">{renderFormattedText(message.text)}</div>

        {/* Citation Trigger Button if RAG sources exist */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onViewCitation(message.sources)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">menu_book</span>
              <span>Lihat {message.sources.length} Sumber SOP Terverifikasi</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Action Chips if any */}
      {message.chips && message.chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1.5">
          {message.chips.map((chip, cidx) => (
            <button
              key={cidx}
              onClick={() => onChipClick && onChipClick(chip)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white hover:bg-primary/10 text-primary border border-primary/20 shadow-2xs transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Mini Feedback for Bot Messages */}
      {!isUser && (
        <div className="flex items-center gap-1 px-1 pt-0.5">
          <button
            onClick={() => onFeedback(message.id, 'positive')}
            disabled={!!feedbackState}
            title="Jawaban Membantu"
            className={`p-1 rounded-md text-xs transition-colors cursor-pointer ${
              feedbackState === 'positive'
                ? 'text-emerald-600 font-bold bg-emerald-50'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">thumb_up</span>
          </button>
          <button
            onClick={() => onFeedback(message.id, 'negative')}
            disabled={!!feedbackState}
            title="Kurang Akurat"
            className={`p-1 rounded-md text-xs transition-colors cursor-pointer ${
              feedbackState === 'negative'
                ? 'text-rose-600 font-bold bg-rose-50'
                : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">thumb_down</span>
          </button>
        </div>
      )}
    </div>
  )
}
