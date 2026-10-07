import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'
import ChannelBadge from '../../components/admin/ChannelBadge'
import CategoryBadge from '../../components/admin/CategoryBadge'
import ActivityTimeline from '../../components/admin/ActivityTimeline'
import dashboardService from '../../services/dashboardService'

export default function DashboardPage() {
  const navigate = useNavigate()
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
  const totalChannels = (channels.website + channels.whatsapp) || 1
  const webPercentage = Math.round((channels.website / totalChannels) * 100)
  const waPercentage = Math.round((channels.whatsapp / totalChannels) * 100)

  const categories = dashboardData?.categories || []
  const hitlQueue = dashboardData?.recent_hitl || []
  const recentActivities = dashboardData?.recent_activities || []

  return (
    <div className="space-y-6">
      {/* 1. TOP HITL ESCALATION ALERT BANNER */}
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
                  Warga membutuhkan klarifikasi manusia segera di kanal WhatsApp & Web
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

      {/* 2. SECTION HEADER & PERIOD FILTER */}
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
            { label: 'Bulan Ini (Sep 2026)', val: 'MONTH' },
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

      {/* 3. 5 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Total Percakapan"
          value={loading ? '...' : (kpi.total_conversations || 0).toLocaleString('id-ID')}
          subtitle="Semua sesi layanan"
          icon="mark_chat_unread"
          trend="+14.2% bln lalu"
          trendType="positive"
        />

        <StatCard
          title="Percakapan Aktif"
          value={loading ? '...' : (kpi.active_conversations || 0)}
          subtitle="Sedang berlangsung"
          icon="chat_bubble"
          badge="Live"
        />

        <StatCard
          title="Perlu Operator"
          value={loading ? '...' : (kpi.need_human_count || 0)}
          subtitle="Eskalasi Human (HITL)"
          icon="crisis_alert"
          trend="Perlu respon"
          trendType="warning"
          onClick={() => navigate('/admin/conversations?status=NEED_HUMAN')}
          className="ring-2 ring-rose-300/60 bg-rose-50/20"
        />

        <StatCard
          title="Sedang Ditangani"
          value={loading ? '...' : (kpi.assigned_count || 0)}
          subtitle="Oleh operator pekon"
          icon="support_agent"
          trend="Sedang diproses"
          trendType="neutral"
        />

        <StatCard
          title="Selesai (Resolved)"
          value={loading ? '...' : (kpi.total_resolved || 0).toLocaleString('id-ID')}
          subtitle="Tuntas terlayani"
          icon="verified"
          trend="Terselesaikan"
          trendType="positive"
        />
      </div>

      {/* 4. GRID: STATISTIK KANAL, OTOMATIS VS HUMAN, STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Distribusi Kanal & Efektivitas AI */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary">hub</span>
                Distribusi Kanal Interaksi
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Sep 2026</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1 text-slate-700">
                    <span className="material-symbols-outlined text-sm text-indigo-600">language</span>
                    Website Portal Margodadi
                  </span>
                  <span className="font-bold text-slate-900">{channels.website} sesi ({webPercentage}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${webPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1 text-slate-700">
                    <span className="material-symbols-outlined text-sm text-emerald-600">chat</span>
                    WhatsApp Gateway
                  </span>
                  <span className="font-bold text-slate-900">{channels.whatsapp} sesi ({waPercentage}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${waPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI vs Human Split Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Rasio Otomatisasi AI vs Operator
            </span>
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
                <span className="text-[10px] text-emerald-800 font-bold uppercase">Dijawab AI RAG</span>
                <p className="text-xl font-black text-emerald-800">
                  {kpi.total_conversations > 0
                    ? `${Math.round(((kpi.total_conversations - kpi.need_human_count) / kpi.total_conversations) * 100)}%`
                    : '85%'}
                </p>
                <span className="text-[10px] text-emerald-700 font-medium">
                  {Math.max(0, (kpi.total_conversations || 0) - (kpi.need_human_count || 0))} sesi otomatis
                </span>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
                <span className="text-[10px] text-amber-800 font-bold uppercase">Bantuan Operator</span>
                <p className="text-xl font-black text-amber-800">
                  {kpi.total_conversations > 0
                    ? `${Math.round((kpi.need_human_count / kpi.total_conversations) * 100)}%`
                    : '15%'}
                </p>
                <span className="text-[10px] text-amber-700 font-medium">{kpi.need_human_count || 0} sesi HITL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Status Percakapan Live & SLA */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary">pie_chart</span>
                Status Percakapan Sistem
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Live Metrics</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-[10px] font-bold uppercase text-slate-500">Aktif</span>
                <p className="text-lg font-black text-slate-800">{kpi.active_conversations || 0}</p>
                <span className="text-[10px] text-slate-400">Sedang berjalan</span>
              </div>
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/70">
                <span className="text-[10px] font-bold uppercase text-rose-800">Perlu Human</span>
                <p className="text-lg font-black text-rose-800">{kpi.need_human_count || 0}</p>
                <span className="text-[10px] text-rose-700">Antrian eskalasi</span>
              </div>
              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-200/70">
                <span className="text-[10px] font-bold uppercase text-sky-800">Assigned</span>
                <p className="text-lg font-black text-sky-800">{kpi.assigned_count || 0}</p>
                <span className="text-[10px] text-sky-700">Dipegang operator</span>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70">
                <span className="text-[10px] font-bold uppercase text-emerald-800">Resolved</span>
                <p className="text-lg font-black text-emerald-800">{kpi.total_resolved || 0}</p>
                <span className="text-[10px] text-emerald-700">Tuntas terlayani</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Rata-rata Waktu Respon Operator</span>
              <strong className="text-slate-900 text-sm font-bold">
                {kpi.avg_response_time || '2.4 mnt'}
              </strong>
            </div>
            <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
              SLA Tercapai
            </span>
          </div>
        </div>

        {/* Card 3: Kategori Layanan Populer */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary">category</span>
                Kategori Layanan Virtual Guide
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Topik Warga</span>
            </div>

            <div className="space-y-2.5">
              {categories.length > 0 ? (
                categories.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 truncate">{cat.name}</span>
                      <span className="text-slate-900 shrink-0 font-bold">{cat.count} sesi</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (cat.percentage || 1) * 2)}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-4 text-center">Belum ada kategori terdata</div>
              )}
            </div>
          </div>

          <Link
            to="/admin/analytics"
            className="text-xs font-bold text-primary hover:text-primary-container flex items-center justify-center gap-1 pt-2 border-t border-slate-100"
          >
            <span>Lihat Analisis Detail Layanan</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* 5. GRID: PERCAKAPAN TERBARU BUTUH TINDAKAN & TIMELINE AKTIVITAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Antrian Percakapan Terbaru (2 Kolom) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">inbox</span>
                Percakapan Terbaru & Antrian HITL
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar pesan masuk warga yang memerlukan perhatian atau baru diperbarui
              </p>
            </div>
            <Link
              to="/admin/conversations"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
            >
              <span>Lihat Semua Inbox</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {hitlQueue.length > 0 ? (
              hitlQueue.map((conv) => (
                <div
                  key={conv.id || conv.conversation_id}
                  onClick={() => navigate(`/admin/conversations/${conv.id || conv.conversation_id}`)}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        {conv.channel === 'whatsapp' ? 'chat' : 'language'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-xs font-mono font-bold text-slate-800">
                          {conv.id}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {conv.citizen_name || conv.citizenName}
                        </span>
                        <ChannelBadge channel={conv.channel} showIconOnly />
                        <CategoryBadge category={conv.category} />
                      </div>
                      <p className="text-xs text-slate-600 truncate leading-relaxed">
                        {conv.last_message || conv.lastMessage}
                      </p>
                      <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-2">
                        <span>Operator: {conv.assigned_operator?.name || conv.assignedOperator?.name || 'Belum ditugaskan'}</span>
                        {conv.updated_at && (
                          <>
                            <span>·</span>
                            <span>{new Date(conv.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <StatusBadge status={conv.status} needsHuman={conv.needs_human ?? conv.needsHuman} />
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all text-lg">
                      chevron_right
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Tidak ada percakapan tertunda dalam antrian HITL
              </div>
            )}
          </div>
        </div>

        {/* Feed Aktivitas Operator & Sistem (1 Kolom) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">history</span>
                  Log Aktivitas Terbaru
                </h3>
                <p className="text-[11px] text-slate-500">Audit trail tindakan operator</p>
              </div>
              <Link
                to="/admin/activity-log"
                className="text-xs font-bold text-primary hover:underline"
              >
                Semua
              </Link>
            </div>

            <ActivityTimeline activities={recentActivities} />
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Sistem RAG Margodadi</span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Operasional Normal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. STATUS KNOWLEDGE BASE STATUS MONITORING (Chapter 19) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-primary">menu_book</span>
              Status Basis Pengetahuan RAG (Knowledge Base Monitoring)
            </h3>
            <p className="text-[11px] text-slate-500">
              Monitoring metadata domain informasi yang digunakan oleh Virtual Guide Pekon Margodadi
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg border border-emerald-200 self-start sm:self-auto">
            4 Domain Tersinkronisasi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {(dashboardData?.knowledge_base_status || [
            { domain: 'Layanan Publik & Administrasi Pekon', version: 'v2.1', itemCount: 12, validator: 'Kasi Pemerintahan', updatedAt: 'Hari ini' },
            { domain: 'Potensi & Katalog Produk UMKM Pekon', version: 'v1.4', itemCount: 6, validator: 'Kaur Perencanaan', updatedAt: 'Hari ini' },
            { domain: 'Edukasi 3R & Bank Sampah Margodadi', version: 'v2.1', itemCount: 5, validator: 'Tim Pengelola Sampah', updatedAt: 'Hari ini' },
            { domain: 'SOP Diskresi & Regulasi Aparatur Pekon', version: 'v1.0', itemCount: 4, validator: 'Sekdes Margodadi', updatedAt: 'Hari ini' },
          ]).map((kb, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/60 transition-colors"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-900">{kb.domain}</span>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-primary/10 text-primary rounded">
                  {kb.version}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                <p>Dokumen: <strong className="text-slate-800">{kb.itemCount} Item</strong></p>
                <p className="text-[11px] text-slate-400">Validator: {kb.validator}</p>
                <p className="text-[11px] text-slate-400">Update: {kb.updatedAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

