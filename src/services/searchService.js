import api from './api'

export const searchService = {
  /**
   * Search across public services and UMKMs for homepage search bar.
   * @param {string} query
   * @param {number} [limit=6]
   * @returns {Promise<Object>}
   */
  async globalSearch(query, limit = 6) {
    if (!query || !query.trim()) return null
    const response = await api.get('/search', {
      params: { q: query.trim(), limit },
    })
    return response.data
  },
}

export default searchService
