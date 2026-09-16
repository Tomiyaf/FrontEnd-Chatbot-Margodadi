import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AdminLayout from '../layouts/AdminLayout'
import HomePage from '../pages/public/HomePage'
import LayananPublikPage from '../pages/public/LayananPublikPage'
import PotensiUmkmPage from '../pages/public/PotensiUmkmPage'
import EdukasiSampahPage from '../pages/public/EdukasiSampahPage'
import TanyaVirtualGuidePage from '../pages/public/TanyaVirtualGuidePage'
import DashboardPage from '../pages/admin/DashboardPage'
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

  // Layer Back-Office (Admin / Pegawai Pekon)
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
    ],
  },

  // Rute fallback 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
