export default function StatusBadge({ status, needsHuman = false, className = '' }) {
  const normalized = (status || '').toUpperCase()

  const getBadgeStyle = () => {
    if (needsHuman || normalized === 'NEED_HUMAN') {
      return {
        label: 'PERLU OPERATOR',
        icon: 'warning',
        classes: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse',
      }
    }

    switch (normalized) {
      case 'OPEN':
        return {
          label: 'OPEN',
          icon: 'radio_button_checked',
          classes: 'bg-slate-100 text-slate-700 border-slate-200',
        }
      case 'PENDING':
        return {
          label: 'PENDING',
          icon: 'schedule',
          classes: 'bg-amber-50 text-amber-700 border-amber-200',
        }
      case 'ASSIGNED':
        return {
          label: 'ASSIGNED',
          icon: 'person',
          classes: 'bg-sky-50 text-sky-700 border-sky-200',
        }
      case 'RESOLVED':
        return {
          label: 'RESOLVED',
          icon: 'check_circle',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        }
      case 'ONLINE':
        return {
          label: 'ONLINE',
          icon: 'fiber_manual_record',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        }
      case 'OFFLINE':
        return {
          label: 'OFFLINE',
          icon: 'do_not_disturb_on',
          classes: 'bg-slate-100 text-slate-500 border-slate-200',
        }
      case 'COMPLETED':
        return {
          label: 'SELESAI',
          icon: 'task_alt',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        }
      case 'IN_PROGRESS':
        return {
          label: 'BERJALAN',
          icon: 'hourglass_top',
          classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        }
      default:
        return {
          label: normalized || 'UNKNOWN',
          icon: 'info',
          classes: 'bg-slate-100 text-slate-700 border-slate-200',
        }
    }
  }

  const badge = getBadgeStyle()

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border tracking-wide transition-all ${badge.classes} ${className}`}
    >
      <span className="material-symbols-outlined text-[14px] leading-none">{badge.icon}</span>
      <span>{badge.label}</span>
    </span>
  )
}
