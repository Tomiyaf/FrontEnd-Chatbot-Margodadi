import api from './api'

export const authService = {
  async login(identifier, password) {
    const response = await api.post('/auth/login', {
      username: identifier,
      email: identifier,
      password,
    })
    return response.data
  },

  async getMe() {
    const response = await api.get('/auth/me')
    return response.data
  },

  async logout() {
    try {
      const response = await api.post('/auth/logout')
      return response.data
    } catch {
      // Ignore network failure on logout
      return { status: 'success' }
    }
  },

  async heartbeat() {
    try {
      const response = await api.post('/auth/heartbeat')
      return response.data
    } catch {
      return null
    }
  },
}

export default authService
