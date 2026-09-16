import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop automatically resets window scroll position to (0, 0)
 * and clears any residual body overflow locks on route transitions.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Reset body style in case a modal left an overflow lock
    document.body.style.overflow = ''

    // Instantly scroll window to the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [pathname])

  return null
}
