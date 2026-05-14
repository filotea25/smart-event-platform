import api from './axios'

export function getTipos() {
  return api.get('/api/tipos').then((response) => response.data)
}

export function createTipo(payload) {
  return api.post('/api/tipos', payload).then((response) => response.data)
}

export function updateTipo(id, payload) {
  return api.put(`/api/tipos/${id}`, payload).then((response) => response.data)
}

export function deleteTipo(id) {
  return api.delete(`/api/tipos/${id}`).then((response) => response.data)
}