import React from 'react'
import StatCard from '../admin/StatCard'

export default function DashboardKpiGrid({ kpi, loading, periodLabel }) {
  const autoResponseRate = kpi.total_conversations > 0
    ? Math.round(((kpi.total_conversations - (kpi.need_human_count || 0)) / kpi.total_conversations) * 100)
    : 100

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      <StatCard
        title="Total Percakapan"
        value={loading ? '...' : (kpi.total_conversations || 0).toLocaleString('id-ID')}
        subtitle="Semua sesi layanan"
        period={periodLabel}
        icon="forum"
        color="primary"
        trend="+14%"
        trendType="positive"
      />

      <StatCard
        title="Butuh Manusia (HITL)"
        value={loading ? '...' : (kpi.need_human_count || 0).toLocaleString('id-ID')}
        subtitle="Eskalasi belum ditugaskan"
        period={periodLabel}
        icon="contact_support"
        color="rose"
        highlight={!loading && (kpi.need_human_count || 0) > 0}
      />

      <StatCard
        title="Ditangani Operator"
        value={loading ? '...' : (kpi.assigned_count || 0).toLocaleString('id-ID')}
        subtitle="Sedang aktif berbalas"
        period={periodLabel}
        icon="support_agent"
        color="indigo"
      />

      <StatCard
        title="Tiket Selesai"
        value={loading ? '...' : (kpi.total_resolved || 0).toLocaleString('id-ID')}
        subtitle="Layanan tuntas"
        period={periodLabel}
        icon="check_circle"
        color="emerald"
      />

      <StatCard
        title="Rasio Otomasi AI"
        value={loading ? '...' : `${autoResponseRate}%`}
        subtitle="Ditangani tanpa operator"
        period={periodLabel}
        icon="smart_toy"
        color="teal"
      />
    </div>
  )
}
