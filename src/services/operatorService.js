import api from './api'

export const operatorService = {
  /**
   * Get all operators and their current workload statistics
   */
  async getOperators() {
    const response = await api.get('/admin/operators')
    return response.data
  },

  /**
   * Update operator presence status (ONLINE, OFFLINE, BUSY)
   * @param {number|string} id - Operator ID
   * @param {string} status - 'ONLINE' | 'OFFLINE' | 'BUSY'
   */
  async updateOperatorStatus(id, status) {
    const response = await api.patch(`/admin/operators/${id}/status`, { status })
    return response.data
  },
}

export default operatorService
