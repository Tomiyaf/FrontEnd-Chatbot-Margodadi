import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import PageLoader from '../components/common/PageLoader'
import ProtectedRoute from '../components/auth/ProtectedRoute'

// Layouts
const PublicLayout = lazy(() => import('../layouts/PublicLayout'))
const AdminLayout = lazy(() => import('../layouts/AdminLayout'))

// Layer Front-Office (Masyarakat / Publik)
const HomePage = lazy(() => import('../pages/public/HomePage'))
const LayananPublikPage = lazy(() => import('../pages/public/LayananPublikPage'))
const PotensiUmkmPage = lazy(() => import('../pages/public/PotensiUmkmPage'))
const EdukasiSampahPage = lazy(() => import('../pages/public/EdukasiSampahPage'))
const TanyaVirtualGuidePage = lazy(() => import('../pages/public/TanyaVirtualGuidePage'))

// Autentikasi
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))

// Layer Back-Office (Admin / Operator Monitoring & HITL Layer)
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'))
const ConversationsPage = lazy(() => import('../pages/admin/ConversationsPage'))
const ConversationDetailPage = lazy(() => import('../pages/admin/ConversationDetailPage'))
const OperatorsPage = lazy(() => import('../pages/admin/OperatorsPage'))
const AnalyticsPage = lazy(() => import('../pages/admin/AnalyticsPage'))
const EducationPage = lazy(() => import('../pages/admin/EducationPage'))
const ReportsPage = lazy(() => import('../pages/admin/ReportsPage'))
const KnowledgeBasePage = lazy(() => import('../pages/admin/KnowledgeBasePage'))
const ActivityLogPage = lazy(() => import('../pages/admin/ActivityLogPage'))
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

// Suspense Helper
const withSuspense = (Component, loadingTitle) => (
  <Suspense fallback={<PageLoader title={loadingTitle} />}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  // Layer Front-Office (Masyarakat / Publik)
  {
    path: '/',
    element: withSuspense(PublicLayout, 'Memuat Portal Margodadi...'),
    children: [
      {
        index: true,
        element: withSuspense(HomePage, 'Memuat Beranda Portal...'),
      },
      {
        path: 'layanan-publik',
        element: withSuspense(LayananPublikPage, 'Memuat Panduan Layanan...'),
      },
      {
        path: 'potensi-umkm',
        element: withSuspense(PotensiUmkmPage, 'Memuat Direktori UMKM...'),
      },
      {
        path: 'edukasi-sampah',
        element: withSuspense(EdukasiSampahPage, 'Memuat Panduan Pilah Sampah...'),
      },
      {
        path: 'tanya-virtual-guide',
        element: withSuspense(TanyaVirtualGuidePage, 'Menghubungkan Virtual Guide...'),
      },
    ],
  },

  // Autentikasi Back-Office
  {
    path: '/login',
    element: withSuspense(LoginPage, 'Menyiapkan Akses Masuk...'),
  },

  // Layer Back-Office (Admin / Operator Monitoring & HITL Layer)
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: withSuspense(AdminLayout, 'Memuat Panel Administrasi...'),
        children: [
          {
            index: true,
            element: withSuspense(DashboardPage, 'Memuat Executive Dashboard...'),
          },
          {
            path: 'dashboard',
            element: withSuspense(DashboardPage, 'Memuat Executive Dashboard...'),
          },
          {
            path: 'conversations',
            element: withSuspense(ConversationsPage, 'Memuat Antrean Tiket...'),
          },
          {
            path: 'conversations/hitl',
            element: withSuspense(ConversationsPage, 'Memuat Tiket Butuh Bantuan...'),
          },
          {
            path: 'conversations/assigned',
            element: withSuspense(ConversationsPage, 'Memuat Tiket Ditugaskan...'),
          },
          {
            path: 'conversations/pending',
            element: withSuspense(ConversationsPage, 'Memuat Tiket Tertunda...'),
          },
          {
            path: 'conversations/resolved',
            element: withSuspense(ConversationsPage, 'Memuat Tiket Selesai...'),
          },
          {
            path: 'conversations/:conversationId',
            element: withSuspense(ConversationDetailPage, 'Memuat Detail Percakapan...'),
          },
          {
            path: 'operators',
            element: withSuspense(OperatorsPage, 'Memuat Direktori Operator...'),
          },
          {
            path: 'analytics',
            element: withSuspense(AnalyticsPage, 'Menghitung Analitik SLA...'),
          },
          {
            path: 'education',
            element: withSuspense(EducationPage, 'Memuat Riset Edukasi Sampah...'),
          },
          {
            path: 'reports',
            element: withSuspense(ReportsPage, 'Menyiapkan Laporan Eksekutif...'),
          },
          {
            path: 'knowledge-base',
            element: withSuspense(KnowledgeBasePage, 'Menghubungkan AI Vector Store...'),
          },
          {
            path: 'research-export',
            element: <Navigate to="/admin/knowledge-base" replace />,
          },
          {
            path: 'activity-log',
            element: withSuspense(ActivityLogPage, 'Memuat Log Aktivitas Sistem...'),
          },
          {
            path: 'settings',
            element: withSuspense(SettingsPage, 'Memuat Pengaturan Sistem...'),
          },
        ],
      },
    ],
  },

  // Rute fallback 404
  {
    path: '*',
    element: withSuspense(NotFoundPage, 'Halaman Tidak Ditemukan'),
  },
])

