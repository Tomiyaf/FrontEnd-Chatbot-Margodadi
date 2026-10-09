import api from './api'

export const knowledgeBaseService = {
  /**
   * Get summary KPI statistics for Knowledge Base and Vector Store
   */
  async getStats() {
    const response = await api.get('/admin/knowledge-base/stats')
    return response.data
  },

  /**
   * Get paginated list of knowledge base documents
   * @param {Object} params - { domain, is_active, search, page, per_page }
   */
  async getDocuments(params = {}) {
    const response = await api.get('/admin/knowledge-base/documents', { params })
    return response.data
  },

  /**
   * Get single document with all its vector chunks
   * @param {number|string} id
   */
  async getDocument(id) {
    const response = await api.get(`/admin/knowledge-base/documents/${id}`)
    return response.data
  },

  /**
   * Create a new knowledge document with auto-indexing
   * @param {Object} data - { title, domain, source, validator, version, is_active, content, file }
   */
  async createDocument(data) {
    if (data.file) {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return
        formData.append(key, key === 'is_active' ? (value ? '1' : '0') : value)
      })

      const response = await api.post('/admin/knowledge-base/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    }

    const response = await api.post('/admin/knowledge-base/documents', data)
    return response.data
  },

  /**
   * Update knowledge document and optionally re-chunk
   * @param {number|string} id
   * @param {Object} data
   */
  async updateDocument(id, data) {
    const response = await api.put(`/admin/knowledge-base/documents/${id}`, data)
    return response.data
  },

  /**
   * Delete knowledge document and its chunks
   * @param {number|string} id
   */
  async deleteDocument(id) {
    const response = await api.delete(`/admin/knowledge-base/documents/${id}`)
    return response.data
  },

  /**
   * Re-index chunks for a specific document
   * @param {number|string} id
   */
  async reindexDocument(id) {
    const response = await api.post(`/admin/knowledge-base/documents/${id}/reindex`)
    return response.data
  },

  /**
   * Re-index all active knowledge documents
   */
  async reindexAll() {
    const response = await api.post('/admin/knowledge-base/reindex-all')
    return response.data
  },

  /**
   * Simulate semantic search retrieval
   * @param {Object} data - { query, top_k, domain }
   */
  async testRetrieval(data) {
    const response = await api.post('/admin/knowledge-base/test-retrieval', data)
    return response.data
  },

  /**
   * Update an individual chunk content
   * @param {number} chunkId
   * @param {string} content
   */
  async updateChunk(chunkId, content) {
    const response = await api.put(`/admin/knowledge-base/chunks/${chunkId}`, { content })
    return response.data
  },

  /**
   * Delete an individual chunk
   * @param {number} chunkId
   */
  async deleteChunk(chunkId) {
    const response = await api.delete(`/admin/knowledge-base/chunks/${chunkId}`)
    return response.data
  },
}

export default knowledgeBaseService
