export default function ActivityTimeline({ activities = [], className = '' }) {
  const getActionIcon = (action) => {
    switch (action) {
      case 'TAKE_OVER':
      case 'HITL_ESCALATION':
      case 'ESCALATION_TRIGGER':
        return { icon: 'front_hand', color: 'bg-rose-100 text-rose-700' }
      case 'OPERATOR_RESPONSE':
        return { icon: 'chat', color: 'bg-sky-100 text-sky-700' }
      case 'ASSIGN_OPERATOR':
        return { icon: 'person_add', color: 'bg-violet-100 text-violet-700' }
      case 'STATUS_RESOLVED':
        return { icon: 'check_circle', color: 'bg-emerald-100 text-emerald-700' }
      case 'STATUS_CHANGE':
        return { icon: 'sync_alt', color: 'bg-indigo-100 text-indigo-700' }
      case 'OPERATOR_STATUS':
        return { icon: 'badge', color: 'bg-amber-100 text-amber-700' }
      case 'LOGIN':
        return { icon: 'login', color: 'bg-emerald-100 text-emerald-700' }
      case 'LOGOUT':
        return { icon: 'logout', color: 'bg-slate-100 text-slate-700' }
      case 'SETTING_CHANGE':
      case 'PROFILE_UPDATE':
      case 'PASSWORD_CHANGE':
        return { icon: 'settings', color: 'bg-slate-100 text-slate-700' }
      case 'RESEARCH_EXPORT':
        return { icon: 'download', color: 'bg-teal-100 text-teal-700' }
      case 'CHAT_SESSION_START':
        return { icon: 'forum', color: 'bg-blue-100 text-blue-700' }
      case 'VECTOR_DOC_CREATE':
      case 'VECTOR_DOC_UPDATE':
      case 'VECTOR_DOC_DELETE':
      case 'VECTOR_REINDEX':
      case 'VECTOR_REINDEX_ALL':
        return { icon: 'hub', color: 'bg-indigo-100 text-indigo-700' }
      case 'FEEDBACK_SUBMITTED':
        return { icon: 'star', color: 'bg-amber-100 text-amber-700' }
      default:
        return { icon: 'info', color: 'bg-slate-100 text-slate-700' }
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {activities.map((item, index) => {
        const { icon, color } = getActionIcon(item.action)
        return (
          <div key={item.id || index} className="flex items-start gap-3 relative group">
            {index !== activities.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 -z-0"></div>
            )}

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${color}`}
            >
              <span className="material-symbols-outlined text-base">{icon}</span>
            </div>

            <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs group-hover:border-slate-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-slate-800">
                  {item.operatorName || 'System'}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              {item.target && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400">Target:</span>
                  <span className="px-1.5 py-0.2 bg-slate-100 font-mono text-slate-700 rounded text-[10px]">
                    {item.target}
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
