import { useState, useEffect } from 'react'
import StatCard from '../../components/admin/StatCard'
import { analyticsService } from '../../services/analyticsService'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('MONTH')
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({
    kpi: {
      totalConversations: 0,
      autoResponseRatio: '0%',
      humanInterventionRatio: '0%',
      avgOperatorResponseTimeMinutes: 2.4,
    },
    trendDays: [],
    categories: [],
    operators: [],
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        const res = await analyticsService.getOverview(period)
        if (res.status === 'success' && res.data) {
          setData(res.data)
        }
      } catch (err) {
        console.error('Failed to load analytics:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [period])

  const { kpi, categories, trendDays, operators } = data

  const maxTrendTotal = trendDays.length > 0
    ? Math.max(...trendDays.map((d) => d.auto + d.human), 1)
    : 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Analitik & Performa Layanan Virtual Guide
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluasi statistik interaksi, efektivitas respon AI, dan SLA penanganan operator HITL
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-2xs self-start sm:self-auto">
          {[
            { label: '7 Hari', val: 'WEEK' },
            { label: 'Bulan Ini', val: 'MONTH' },
            { label: `Kuartal ${Math.ceil((new Date().getMonth() + 1) / 3)} (${new Date().getFullYear()})`, val: 'Q3' },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setPeriod(tab.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                period === tab.val
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <span className="material-symbols-outlined text-3xl text-primary animate-spin">
            progress_activity
          </span>
          <p className="text-xs text-slate-500 mt-2">Memuat data analitik...</p>
        </div>
      ) : (
        <>
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Interaksi"
              value={kpi.totalConversations.toLocaleString('id-ID')}
              subtitle="Trafik layanan pekon"
              icon="insights"
              trend={kpi.growthTrend || '+0% sesi aktif'}
              trendType={kpi.growthType || 'positive'}
            />
            <StatCard
              title="Efisiensi AI RAG"
              value={kpi.autoResponseRatio}
              subtitle="Dijawab tanpa manusia"
              icon="smart_toy"
              trend={`${kpi.autoResolvedConversations || 0} sesi mandiri AI`}
              trendType="positive"
            />
            <StatCard
              title="Tingkat Eskalasi HITL"
              value={kpi.humanInterventionRatio}
              subtitle="Memerlukan operator"
              icon="support_agent"
              trend={`${kpi.escalatedConversations || 0} sesi dialihkan`}
              trendType="neutral"
            />
            <StatCard
              title="Rata-rata Waktu Respon"
              value={`${kpi.avgOperatorResponseTimeMinutes} mnt`}
              subtitle="Respon operator pekon"
              icon="timer"
              trend="SLA Target < 5.0 mnt"
              trendType="positive"
            />
          </div>

          {/* Tren Percakapan Harian (Bar Chart Visualizer) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">bar_chart</span>
                  Tren Volume Percakapan Harian (AI vs Bantuan Operator)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distribusi beban interaksi yang diselesaikan AI secara otomatis vs intervensi manusia
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded bg-emerald-600"></span>
                  Dijawab AI Otomatis
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded bg-amber-500"></span>
                  Intervensi Operator
                </span>
              </div>
            </div>

            {/* Chart Visualization */}
            <div className="pt-6 pb-2">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 h-64 items-end border-b border-slate-200 px-2 sm:px-4">
                {trendDays.map((item, idx) => {
                  const total = item.auto + item.human
                  const heightPercent = Math.round((total / maxTrendTotal) * 100)
                  const autoHeightPercent = total > 0 ? Math.round((item.auto / total) * 100) : 50
                  const humanHeightPercent = 100 - autoHeightPercent

                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {total}
                      </span>

                      {/* Stacked Bar */}
                      <div
                        className="w-full max-w-[42px] rounded-t-xl overflow-hidden flex flex-col justify-end transition-all group-hover:scale-105 duration-200 shadow-xs"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div
                          className="bg-amber-500 w-full"
                          style={{ height: `${humanHeightPercent}%` }}
                          title={`Operator: ${item.human}`}
                        ></div>
                        <div
                          className="bg-emerald-600 w-full"
                          style={{ height: `${autoHeightPercent}%` }}
                          title={`AI: ${item.auto}`}
                        ></div>
                      </div>

                      <span className="text-xs font-bold text-slate-700 mt-2 block">
                        {item.day}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Grid: Kategori Breakdown & Operator SLA Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Kategori Breakdown */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">category</span>
                  Statistik Kategori Layanan
                </h3>
                <span className="text-xs text-slate-400">Total {categories.length} Kategori</span>
              </div>

              <div className="space-y-3.5">
                {categories.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{cat.count} sesi</span>
                        <span className="font-bold text-slate-900 font-mono">({cat.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, cat.percentage * 2.5)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performa Operator SLA */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">speed</span>
                  Kinerja Waktu Tanggap Operator (SLA)
                </h3>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                  SLA Terpenuhi 100%
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {(operators && operators.length > 0 ? operators : []).map((op) => (
                  <div key={op.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={op.avatar}
                        alt={op.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{op.name}</span>
                        <span className="text-[11px] text-slate-400">
                          {op.resolvedCount} tiket diselesaikan
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-900 block">
                        {op.avgResponseTime}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        Cepat & Responsif
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
