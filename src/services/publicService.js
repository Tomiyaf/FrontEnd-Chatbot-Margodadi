import api from './api'

export const publicService = {
  /**
   * Get public service directory with filtering and search
   * @param {Object} params - { search, category }
   */
  async getPublicServices(params = {}) {
    const response = await api.get('/public/services', { params })
    return response.data
  },

  /**
   * Get detail of a specific public service
   * @param {string} idOrSlug
   */
  async getServiceDetail(idOrSlug) {
    const response = await api.get(`/public/services/${idOrSlug}`)
    return response.data
  },

  /**
   * Get UMKM directory with filtering, search, and sorting
   * @param {Object} params - { search, category, sort }
   */
  async getUmkms(params = {}) {
    const response = await api.get('/public/umkms', { params })
    return response.data
  },

  /**
   * Get detail of a specific UMKM by ID
   * @param {number|string} id
   */
  async getUmkmDetail(id) {
    const response = await api.get(`/public/umkms/${id}`)
    return response.data
  },

  /**
   * Get public waste education topics
   */
  async getEducationTopics() {
    const response = await api.get('/public/education/topics')
    return response.data
  },
}

export default publicService
