import { Outlet, useLocation } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'

export default function PublicLayout() {
  const location = useLocation()
  const isChatPage = location.pathname === '/tanya-virtual-guide'

  return (
    <div className={`min-h-screen flex flex-col bg-surface text-on-surface ${isChatPage ? 'h-screen overflow-hidden' : ''}`}>
      <ScrollToTop />
      {/* Sticky NavBar */}
      <NavBar />

      {/* Main Content */}
      <main className={`w-full bg-surface flex-1 flex flex-col ${isChatPage ? 'h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] overflow-hidden' : ''}`}>
        <Outlet />
      </main>

      {/* Footer (Hidden on interactive Virtual Guide chat page for full viewport experience) */}
      {!isChatPage && <Footer />}
    </div>
  )
}
