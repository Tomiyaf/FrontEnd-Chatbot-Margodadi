import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Public Navbar */}
      <NavBar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <Footer />
    </div>
  )
}
