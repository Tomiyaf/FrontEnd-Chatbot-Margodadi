import React from 'react'

export default function ServiceDistributionWidget({ categories, channels }) {
  const totalChannels = (channels.website + channels.whatsapp) || 1
  const webPercentage = Math.round((channels.website / totalChannels) * 100)
  const waPercentage = Math.round((channels.whatsapp / totalChannels) * 100)

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Channels Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">hub</span>
          <span>Distribusi Kanal Warga</span>
        </h3>

        <div className="space-y-2">
          {/* Web Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-blue-600">language</span>
                Portal Web Pekon
              </span>
              <span className="font-bold text-slate-900">{channels.website} ({webPercentage}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${webPercentage}%` }}></div>
            </div>
          </div>

          {/* WhatsApp Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-emerald-600">chat</span>
                WhatsApp Resmi Pekon
              </span>
              <span className="font-bold text-slate-900">{channels.whatsapp} ({waPercentage}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${waPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-600 text-base">category</span>
          <span>Topik Layanan Terpopuler</span>
        </h3>

        <div className="space-y-2.5">
          {categories.slice(0, 4).map((cat, cidx) => (
            <div key={cidx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-200/50">
              <span className="font-medium text-slate-800 truncate pr-2">{cat.name || cat.category}</span>
              <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md shrink-0">
                {cat.count} sesi
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
