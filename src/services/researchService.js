import api from './api'

export const researchService = {
  getPreview: async (period = 'MONTH') => {
    const response = await api.get('/admin/research/preview', {
      params: { period },
    })
    return response.data
  },

  exportCsv: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.period) queryParams.append('period', params.period)
    if (params.fields) {
      const fieldList = Array.isArray(params.fields) ? params.fields.join(',') : params.fields
      queryParams.append('fields', fieldList)
    }

    const response = await api.get(`/admin/research/export-csv?${queryParams.toString()}`, {
      responseType: 'blob',
    })

    // Trigger browser download
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    
    // Extract filename from header or fallback
    const disposition = response.headers['content-disposition']
    let filename = 'research_dataset_margodadi.csv'
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename=["']?([^"';]+)["']?/)
      if (match && match[1]) filename = match[1]
    }
    
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    return { success: true, filename }
  },
}

export default researchService
