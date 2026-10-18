import React from 'react'

export default function ChatBubble({
  message,
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
        return (
          <strong
            key={index}
            className={`font-bold ${
              isUser
                ? 'text-white font-extrabold'
                : isOperator
                ? 'text-amber-900 font-bold'
                : 'text-primary font-bold'
            }`}
          >
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })
  }

  return (
    <div className={`flex items-start gap-1.5 sm:gap-2.5 max-w-[94%] sm:max-w-[82%]`}>
      {/* Bot / Operator Avatar Icon */}
      {!isUser && (
        <div className="flex-shrink-0 mt-5">
          {isOperator ? (
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-sm sm:text-base">support_agent</span>
            </div>
          ) : (
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-primary to-emerald-500 text-white flex items-center justify-center shadow-xs border border-primary/20">
              <span className="material-symbols-outlined text-sm sm:text-base">smart_toy</span>
            </div>
          )}
        </div>
      )}

      {/* Bubble Column */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1 flex-1 min-w-0`}>
        {/* Sender Header Label */}
        <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-400 font-medium">
          {isOperator && (
            <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-100/80 px-1.5 sm:px-2 py-0.5 rounded-md border border-amber-300">
              <span className="material-symbols-outlined text-xs">support_agent</span>
              <span>Aparatur Pekon</span>
            </span>
          )}
          {isBot && (
            <span className="inline-flex items-center gap-1 text-primary font-bold">
              <span className="material-symbols-outlined text-xs">smart_toy</span>
              <span>Virtual Guide</span>
            </span>
          )}
          {isUser && <span className="font-semibold text-slate-500">Anda</span>}
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Bubble Container */}
        <div
          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs transition-all ${
            isUser
              ? 'bg-gradient-to-br from-primary via-primary-container to-teal-900 text-white rounded-tr-xs shadow-md'
              : isOperator
              ? 'bg-amber-50/95 text-amber-950 border border-amber-300/80 rounded-tl-xs shadow-xs'
              : 'bg-white text-slate-800 border border-emerald-600/20 hover:border-emerald-600/35 rounded-tl-xs shadow-xs'
          }`}
        >
          <div className="whitespace-pre-wrap font-sans">{renderFormattedText(message.text)}</div>

          {/* Citation Trigger Button if RAG sources exist */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-emerald-900/10 flex items-center justify-between">
              <button
                onClick={() => onViewCitation(message.sources)}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-primary-fixed/50 hover:bg-primary-fixed text-primary text-[11px] sm:text-xs font-bold transition-all border border-primary/20 shadow-2xs hover:shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs sm:text-sm text-primary">verified</span>
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
                className="text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white hover:bg-primary/10 text-primary border border-primary/25 shadow-2xs hover:border-primary/50 transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
