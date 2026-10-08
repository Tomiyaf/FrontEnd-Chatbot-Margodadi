import React from 'react'
import { Link } from 'react-router-dom'
import ActivityTimeline from '../admin/ActivityTimeline'

export default function RecentActivityWidget({ activities, loading }) {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-slate-700 text-lg">history</span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">Aktivitas Sistem Terkini</h2>
        </div>
        <Link
          to="/admin/activity-log"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span>Lihat Log Lengkap</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Memuat riwayat log aktivitas...</div>
      ) : (
        <ActivityTimeline activities={activities} maxItems={6} />
      )}
    </div>
  )
}
