export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendType = 'positive', // 'positive' | 'negative' | 'neutral' | 'warning'
  badge,
  onClick,
  className = '',
}) {
  const getTrendColor = () => {
    switch (trendType) {
      case 'positive':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200'
      case 'negative':
        return 'text-rose-700 bg-rose-50 border-rose-200'
      case 'warning':
        return 'text-amber-700 bg-amber-50 border-amber-200'
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-primary/40' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
            {value}
          </div>
        </div>

        {icon && (
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
            <span className="material-symbols-outlined text-2xl">{icon}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
        {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}

        {trend && (
          <span
            className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full border text-[11px] shrink-0 ${getTrendColor()}`}
          >
            {trend}
          </span>
        )}

        {badge && (
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[11px] shrink-0">
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}
