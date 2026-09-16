import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AdminLayout from '../layouts/AdminLayout'
import HomePage from '../pages/public/HomePage'
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
      // Tambahkan rute public lainnya di sini (contoh: /chatbot, /layanan, /profil)
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
      // Tambahkan rute admin lainnya di sini (contoh: /admin/knowledge, /admin/layanan)
    ],
  },

  // Rute fallback 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
