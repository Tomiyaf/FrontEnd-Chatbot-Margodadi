import React from 'react'
import { Link } from 'react-router-dom'
import ChannelBadge from '../admin/ChannelBadge'
import CategoryBadge from '../admin/CategoryBadge'

export default function UrgentHitlQueueCard({ hitlQueue, loading }) {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-lg">priority_high</span>
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Antrean Butuh Respons Cepat (HITL)
            </h2>
            <p className="text-xs text-slate-500">Tiket warga yang memerlukan tindak lanjut aparatur pekon</p>
          </div>
        </div>

        <Link
          to="/admin/conversations?status=NEED_HUMAN"
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>Semua Antrean</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Memuat antrean percakapan...</div>
      ) : hitlQueue.length === 0 ? (
        <div className="p-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="material-symbols-outlined text-3xl text-emerald-500">task_alt</span>
          <p className="text-xs font-bold text-slate-700">Semua Percakapan Telah Ditangani</p>
          <p className="text-[11px] text-slate-400">Tidak ada tiket warga yang tertunda saat ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hitlQueue.slice(0, 5).map((conv, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 truncate">
                    {conv.citizen_name || 'Warga Anonim'}
                  </span>
                  <ChannelBadge channel={conv.channel || 'web'} />
                  {conv.category && <CategoryBadge category={conv.category} />}
                </div>
                <p className="text-xs text-slate-600 line-clamp-1 italic">
                  &ldquo;{conv.last_message || 'Menunggu respons...'}&rdquo;
                </p>
              </div>

              <Link
                to={`/admin/conversations/${conv.id || conv.conversation_id}`}
                className="inline-flex items-center justify-center gap-1 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
              >
                <span>Tangani</span>
                <span className="material-symbols-outlined text-sm">reply</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
