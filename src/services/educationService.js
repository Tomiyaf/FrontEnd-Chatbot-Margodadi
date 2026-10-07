import api from './api'

export const educationService = {
  getSessions: async (params = {}) => {
    const response = await api.get('/admin/education/sessions', { params })
    return response.data
  },

  getTopics: async () => {
    const response = await api.get('/admin/education/topics')
    return response.data
  },
}

export default educationService
