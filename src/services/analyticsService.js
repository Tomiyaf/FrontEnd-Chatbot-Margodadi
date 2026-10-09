import api from './api'

export const analyticsService = {
  getOverview: async (period = 'MONTH') => {
    const response = await api.get('/admin/analytics/overview', {
      params: { period },
    })
    return response.data
  },
}

export default analyticsService
