import api from './api'

export const settingService = {
  /**
   * Get active RAG configuration
   */
  async getRagSettings() {
    const response = await api.get('/admin/settings/rag')
    return response.data
  },

  /**
   * Update active RAG configuration
   * @param {Object} payload - { embedding_model, llm_model, chunking_config, retrieval_config, generation_config }
   */
  async updateRagSettings(payload) {
    const response = await api.put('/admin/settings/rag', payload)
    return response.data
  },

  /**
   * Update current operator profile
   * @param {Object} payload - { name, email, phone }
   */
  async updateProfile(payload) {
    const response = await api.put('/admin/settings/profile', payload)
    return response.data
  },

  /**
   * Change operator password
   * @param {Object} payload - { current_password, new_password }
   */
  async changePassword(payload) {
    const response = await api.post('/admin/settings/change-password', payload)
    return response.data
  },
}

export default settingService
