import api from './api'

export const activityLogService = {
  /**
   * Get paginated list of activity logs
   * @param {Object} params - { action, operator_id, page, per_page }
   */
  async getActivityLogs(params = {}) {
    const response = await api.get('/admin/activity-logs', { params })
    return response.data
  },
}

export default activityLogService
