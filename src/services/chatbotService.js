import api from './api'

export const chatbotService = {
  /**
   * Initialize a new or existing chatbot consultation session
   * @param {Object} payload - { session_id, anonymous_code }
   */
  async initSession(payload = {}) {
    const response = await api.post('/public/chatbot/init', payload)
    return response.data
  },

  /**
   * Send a citizen question to the Virtual Guide AI
   * @param {Object} payload - { message, session_id, anonymous_code, citizen_name }
   */
  async sendMessage(payload) {
    const response = await api.post('/public/chatbot/send', payload)
    return response.data
  },

  /**
   * Sync latest conversation messages from server (including operator replies)
   * @param {Object} params - { session_id, conversation_id }
   */
  async syncMessages(params) {
    const response = await api.get('/public/chatbot/sync', { params })
    return response.data
  },

  /**
   * Submit citizen satisfaction feedback
   * @param {Object} payload - { conversation_id, rating, comment }
   */
  async submitFeedback(payload) {
    const response = await api.post('/public/chatbot/feedback', payload)
    return response.data
  },
}

export default chatbotService
