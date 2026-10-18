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
   * Get detail of single operator
   * @param {number|string} id
   */
  async getOperator(id) {
    const response = await api.get(`/admin/operators/${id}`)
    return response.data
  },

  /**
   * Check real-time availability of username and email
   * @param {Object} params - { username, email, exclude_id }
   */
  async checkAvailability(params = {}) {
    const response = await api.get('/admin/operators/check-availability', { params })
    return response.data
  },

  /**
   * Create a new operator account
   * @param {Object} data
   */
  async createOperator(data) {
    const response = await api.post('/admin/operators', data)
    return response.data
  },

  /**
   * Update existing operator account (and optionally reset password)
   * @param {number|string} id
   * @param {Object} data
   */
  async updateOperator(id, data) {
    const response = await api.put(`/admin/operators/${id}`, data)
    return response.data
  },

  /**
   * Delete an operator account
   * @param {number|string} id
   */
  async deleteOperator(id) {
    const response = await api.delete(`/admin/operators/${id}`)
    return response.data
  },

  /**
   * Reset operator password directly
   * @param {number|string} id
   * @param {string} password
   */
  async resetPassword(id, password) {
    const response = await api.post(`/admin/operators/${id}/reset-password`, { password })
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
