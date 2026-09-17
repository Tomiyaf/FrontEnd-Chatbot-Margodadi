export default function ChannelBadge({ channel, showIconOnly = false, className = '' }) {
  const isWA = (channel || '').toLowerCase() === 'whatsapp'

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        isWA
          ? 'bg-emerald-50 text-emerald-800 border-emerald-300/80'
          : 'bg-indigo-50 text-indigo-800 border-indigo-200'
      } ${className}`}
      title={isWA ? 'Kanal WhatsApp' : 'Kanal Web Portal'}
    >
      <span className="material-symbols-outlined text-[14px]">
        {isWA ? 'chat' : 'language'}
      </span>
      {!showIconOnly && <span>{isWA ? 'WhatsApp' : 'Website'}</span>}
    </span>
  )
}
