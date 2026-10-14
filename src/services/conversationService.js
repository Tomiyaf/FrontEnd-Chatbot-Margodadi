import api from './api'

export const conversationService = {
  /**
   * Get paginated list of conversations with multi-criteria filtering
   * @param {Object} params - { status, needs_human, channel, priority, search, page, per_page }
   */
  async getConversations(params = {}) {
    const response = await api.get('/admin/conversations', { params })
    return response.data
  },

  /**
   * Get detailed conversation thread by ID / external ID
   * @param {string|number} id - Conversation ID or External ID (e.g. CV-00123)
   */
  async getConversationById(id) {
    const response = await api.get(`/admin/conversations/${id}`)
    return response.data
  },

  /**
   * Send operator reply message
   * @param {string|number} id - Conversation ID
   * @param {Object} payload - { content: string, close_conversation?: boolean }
   */
  async sendOperatorReply(id, payload) {
    const response = await api.post(`/admin/conversations/${id}/reply`, payload)
    return response.data
  },

  /**
   * Update conversation status
   * @param {string|number} id - Conversation ID
   * @param {string} status - 'OPEN' | 'ASSIGNED' | 'PENDING' | 'RESOLVED'
   * @param {string} notes - Optional note
   */
  async updateConversationStatus(id, status, notes = '') {
    const response = await api.patch(`/admin/conversations/${id}/status`, { status, notes })
    return response.data
  },

  /**
   * Assign conversation to a specific operator
   * @param {string|number} id - Conversation ID
   * @param {number} operatorId - Target operator ID
   * @param {string} notes - Optional assignment note
   */
  async assignOperator(id, operatorId, notes = '') {
    const response = await api.post(`/admin/conversations/${id}/assign`, {
      operator_id: operatorId,
      notes,
    })
    return response.data
  },

  /**
   * Toggle intervention mode between Operator (Human Takeover) and AI (Bot Resume)
   * @param {string|number} id - Conversation ID or External ID
   * @param {Object} payload - { mode: 'OPERATOR'|'AI', notes?: string, notify_citizen?: boolean }
   */
  async toggleInterventionMode(id, payload) {
    const response = await api.patch(`/admin/conversations/${id}/mode`, payload)
    return response.data
  },
}

export default conversationService
