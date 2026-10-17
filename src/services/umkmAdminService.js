import api from './api'

export const umkmAdminService = {
  /**
   * Get list of UMKMs for back-office table with filtering and pagination.
   * @param {Object} params - { search, category_id, status, verified, ai_synced, sort, page, per_page }
   */
  async getUmkms(params = {}) {
    const response = await api.get('/admin/umkms', { params })
    return response.data
  },

  /**
   * Get KPI summary statistics for UMKM dashboard.
   */
  async getStats() {
    const response = await api.get('/admin/umkms/stats')
    return response.data
  },

  /**
   * Get active UMKM categories for filter & form dropdown.
   */
  async getCategories() {
    const response = await api.get('/admin/umkms/categories')
    return response.data
  },

  /**
   * Get detail of a specific UMKM.
   * @param {number|string} id
   */
  async getUmkmDetail(id) {
    const response = await api.get(`/admin/umkms/${id}`)
    return response.data
  },

  /**
   * Create a new UMKM record with physical image upload (FormData).
   * @param {FormData} formData
   */
  async createUmkm(formData) {
    const response = await api.post('/admin/umkms', formData)
    return response.data
  },

  /**
   * Update an existing UMKM record with physical image upload (FormData).
   * @param {number|string} id
   * @param {FormData} formData
   */
  async updateUmkm(id, formData) {
    const response = await api.post(`/admin/umkms/${id}`, formData)
    return response.data
  },

  /**
   * Delete an UMKM record and its linked AI vector document.
   * @param {number|string} id
   */
  async deleteUmkm(id) {
    const response = await api.delete(`/admin/umkms/${id}`)
    return response.data
  },

  /**
   * Quick toggle active status of an UMKM.
   * @param {number|string} id
   * @param {boolean} isActive
   */
  async toggleStatus(id, isActive) {
    const response = await api.patch(`/admin/umkms/${id}/status`, {
      is_active: isActive,
    })
    return response.data
  },

  /**
   * Mark an UMKM as verified.
   * @param {number|string} id
   */
  async verifyUmkm(id) {
    const response = await api.patch(`/admin/umkms/${id}/verify`)
    return response.data
  },

  /**
   * Re-sync a single UMKM to the Python RAG Vector Store.
   * @param {number|string} id
   */
  async syncUmkmToAi(id) {
    const response = await api.post(`/admin/umkms/${id}/sync-ai`)
    return response.data
  },

  /**
   * Bulk sync all active UMKMs to the Python RAG Vector Store.
   */
  async syncAllToAi() {
    const response = await api.post('/admin/umkms/sync-all-to-rag')
    return response.data
  },
}

export default umkmAdminService
