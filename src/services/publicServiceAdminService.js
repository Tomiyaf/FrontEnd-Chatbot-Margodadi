import api from './api'

export const publicServiceAdminService = {
  /**
   * Get list of public services for admin table with filtering and pagination.
   * @param {Object} params - { search, category_id, status, sort, page, per_page }
   */
  async getServices(params = {}) {
    const response = await api.get('/admin/services', { params })
    return response.data
  },

  /**
   * Get detail of a specific public service.
   * @param {number|string} id
   */
  async getServiceDetail(id) {
    const response = await api.get(`/admin/services/${id}`)
    return response.data
  },

  /**
   * Create a new public service.
   * @param {Object} data
   */
  async createService(data) {
    const response = await api.post('/admin/services', data)
    return response.data
  },

  /**
   * Update an existing public service.
   * @param {number|string} id
   * @param {Object} data
   */
  async updateService(id, data) {
    const response = await api.put(`/admin/services/${id}`, data)
    return response.data
  },

  /**
   * Delete a public service.
   * @param {number|string} id
   */
  async deleteService(id) {
    const response = await api.delete(`/admin/services/${id}`)
    return response.data
  },

  /**
   * Toggle or update active status of a public service.
   * @param {number|string} id
   * @param {boolean} [isActive]
   */
  async toggleStatus(id, isActive) {
    const payload = typeof isActive === 'boolean' ? { is_active: isActive } : {}
    const response = await api.patch(`/admin/services/${id}/status`, payload)
    return response.data
  },

  /**
   * Get categories list for public services.
   */
  async getCategories() {
    const response = await api.get('/admin/services/categories')
    return response.data
  },

  /**
   * Create a new category for public services.
   * @param {Object} data - { name, slug, icon, description, is_active }
   */
  async createCategory(data) {
    const response = await api.post('/admin/services/categories', data)
    return response.data
  },

  /**
   * Update an existing category.
   * @param {number|string} id
   * @param {Object} data
   */
  async updateCategory(id, data) {
    const response = await api.put(`/admin/services/categories/${id}`, data)
    return response.data
  },

  /**
   * Delete a category.
   * @param {number|string} id
   */
  async deleteCategory(id) {
    const response = await api.delete(`/admin/services/categories/${id}`)
    return response.data
  },
}

export default publicServiceAdminService
