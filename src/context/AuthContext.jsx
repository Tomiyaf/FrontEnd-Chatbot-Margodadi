import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [operator, setOperator] = useState(() => {
    const saved = localStorage.getItem('vg_operator')
    try {
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('vg_token') || null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function verifyAuth() {
      if (token) {
        try {
          const res = await authService.getMe()
          if (res?.data?.operator) {
            setOperator(res.data.operator)
            localStorage.setItem('vg_operator', JSON.stringify(res.data.operator))
          }
        } catch {
          // Token invalid
          logout()
        }
      }
      setIsLoading(false)
    }

    verifyAuth()
  }, [token])

  const login = async (identifier, password) => {
    const res = await authService.login(identifier, password)
    if (res?.data?.access_token) {
      const accessToken = res.data.access_token
      const operatorData = res.data.operator

      setToken(accessToken)
      setOperator(operatorData)
      localStorage.setItem('vg_token', accessToken)
      localStorage.setItem('vg_operator', JSON.stringify(operatorData))
      return { success: true, operator: operatorData }
    }
    throw new Error(res?.message || 'Login gagal')
  }

  const logout = async () => {
    if (token) {
      await authService.logout()
    }
    setToken(null)
    setOperator(null)
    localStorage.removeItem('vg_token')
    localStorage.removeItem('vg_operator')
  }

  return (
    <AuthContext.Provider
      value={{
        operator,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
