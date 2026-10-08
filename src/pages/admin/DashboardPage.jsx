import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import dashboardService from '../../services/dashboardService'
import DashboardKpiGrid from '../../components/dashboard/DashboardKpiGrid'
import UrgentHitlQueueCard from '../../components/dashboard/UrgentHitlQueueCard'
import RecentActivityWidget from '../../components/dashboard/RecentActivityWidget'
import ServiceDistributionWidget from '../../components/dashboard/ServiceDistributionWidget'

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('MONTH') // 'TODAY' | 'WEEK' | 'MONTH'
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    let isMounted = true
    const fetchDashboard = async () => {
      setLoading(true)
      try {
        const res = await dashboardService.getDashboardStats(selectedPeriod)
        if (isMounted && res?.data) {
          setDashboardData(res.data)
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchDashboard()
    return () => {
      isMounted = false
    }
  }, [selectedPeriod])

  const kpi = dashboardData?.kpi || {
    total_conversations: 0,
    active_conversations: 0,
    need_human_count: 0,
    assigned_count: 0,
    total_resolved: 0,
    online_operators: 0,
    total_operators: 0,
    avg_response_time: '2.4 mnt',
    satisfaction_rating: 4.85,
  }

  const channels = dashboardData?.channels || { website: 0, whatsapp: 0 }
  const categories = dashboardData?.categories || []
  const hitlQueue = dashboardData?.recent_hitl || []
  const recentActivities = dashboardData?.recent_activities || []

  const currentMonthLabel = new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
  const periodLabel = dashboardData?.period?.label || (
    selectedPeriod === 'TODAY'
      ? 'Hari Ini'
      : selectedPeriod === 'WEEK'
        ? '7 Hari Terakhir'
        : new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  )

  return (
    <div className="space-y-6">
      {/* 1. Top HITL Escalation Alert Banner */}
      {hitlQueue.length > 0 && (
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-rose-900/20 border border-rose-700/60 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-full bg-radial from-rose-500/20 to-transparent pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/60 border border-rose-400/40 flex items-center justify-center shrink-0 animate-pulse">
                <span className="material-symbols-outlined text-2xl text-rose-200">
                  notification_important
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase tracking-wider">
                    Perhatian HITL
                  </span>
                  <span className="text-rose-200 text-xs font-semibold">
                    {hitlQueue.length} Percakapan Membutuhkan Tindakan Operator
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  Warga membutuhkan klarifikasi manusia segera di kanal WhatsApp &amp; Web
                </h3>
                <p className="text-xs text-rose-200/90 mt-0.5">
                  AI mendeteksi pertanyaan di luar basis pengetahuan atau permohonan disposisi khusus pekon.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <Link
                to="/admin/conversations?status=NEED_HUMAN"
                className="w-full md:w-auto px-5 py-2.5 bg-white hover:bg-rose-50 text-rose-900 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Lihat Antrian HITL</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Section Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Ringkasan Monitoring Layanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitoring performa AI RAG dan intervensi Human-in-the-Loop Pekon Margodadi
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-2xs self-start sm:self-auto">
          {[
            { label: 'Hari Ini', val: 'TODAY' },
            { label: '7 Hari', val: 'WEEK' },
            { label: `Bulan Ini (${currentMonthLabel})`, val: 'MONTH' },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setSelectedPeriod(tab.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPeriod === tab.val
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 5 KPI Metrics Grid */}
      <DashboardKpiGrid
        kpi={kpi}
        loading={loading}
        periodLabel={periodLabel}
      />

      {/* 4. Grid 2 Kolom: Urgent HITL Queue & Activity Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <UrgentHitlQueueCard hitlQueue={hitlQueue} loading={loading} />
          <RecentActivityWidget activities={recentActivities} loading={loading} />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <ServiceDistributionWidget categories={categories} channels={channels} />
        </div>
      </div>
    </div>
  )
}
