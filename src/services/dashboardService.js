import api from './api'

export const dashboardService = {
  /**
   * Get aggregate KPI statistics, channel/category breakdown, and recent HITL queue
   * @param {string} period - 'TODAY' | 'WEEK' | 'MONTH'
   */
  async getDashboardStats(period = 'MONTH') {
    const response = await api.get('/admin/dashboard/stats', {
      params: { period },
    })
    return response.data
  },
}

export default dashboardService
