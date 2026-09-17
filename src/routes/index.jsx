import { createBrowserRouter, Navigate } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AdminLayout from '../layouts/AdminLayout'
import HomePage from '../pages/public/HomePage'
import LayananPublikPage from '../pages/public/LayananPublikPage'
import PotensiUmkmPage from '../pages/public/PotensiUmkmPage'
import EdukasiSampahPage from '../pages/public/EdukasiSampahPage'
import TanyaVirtualGuidePage from '../pages/public/TanyaVirtualGuidePage'
import LoginPage from '../pages/auth/LoginPage'
import DashboardPage from '../pages/admin/DashboardPage'
import ConversationsPage from '../pages/admin/ConversationsPage'
import ConversationDetailPage from '../pages/admin/ConversationDetailPage'
import OperatorsPage from '../pages/admin/OperatorsPage'
import AnalyticsPage from '../pages/admin/AnalyticsPage'
import EducationPage from '../pages/admin/EducationPage'
import ReportsPage from '../pages/admin/ReportsPage'
import ResearchExportPage from '../pages/admin/ResearchExportPage'
import ActivityLogPage from '../pages/admin/ActivityLogPage'
import SettingsPage from '../pages/admin/SettingsPage'
import NotFoundPage from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  // Layer Front-Office (Masyarakat / Publik)
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'layanan-publik',
        element: <LayananPublikPage />,
      },
      {
        path: 'potensi-umkm',
        element: <PotensiUmkmPage />,
      },
      {
        path: 'edukasi-sampah',
        element: <EdukasiSampahPage />,
      },
      {
        path: 'tanya-virtual-guide',
        element: <TanyaVirtualGuidePage />,
      },
    ],
  },

  // Autentikasi Back-Office
  {
    path: '/login',
    element: <LoginPage />,
  },

  // Layer Back-Office (Admin / Operator Monitoring & HITL Layer)
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'conversations',
        element: <ConversationsPage />,
      },
      {
        path: 'conversations/hitl',
        element: <ConversationsPage />,
      },
      {
        path: 'conversations/assigned',
        element: <ConversationsPage />,
      },
      {
        path: 'conversations/pending',
        element: <ConversationsPage />,
      },
      {
        path: 'conversations/resolved',
        element: <ConversationsPage />,
      },
      {
        path: 'conversations/:conversationId',
        element: <ConversationDetailPage />,
      },
      {
        path: 'operators',
        element: <OperatorsPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'education',
        element: <EducationPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'research-export',
        element: <ResearchExportPage />,
      },
      {
        path: 'activity-log',
        element: <ActivityLogPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },

  // Rute fallback 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
