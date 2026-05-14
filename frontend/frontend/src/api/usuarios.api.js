import api from './axios'

export function getUsuarios() {
  return api.get('/api/usuarios').then((response) => response.data)
}

export function createUsuario(payload) {
  return api.post('/api/usuarios', payload).then((response) => response.data)
}

export function updateUsuario(id, payload) {
  return api.put(`/api/usuarios/${id}`, payload).then((response) => response.data)
}

export function deleteUsuario(id) {
  return api.delete(`/api/usuarios/${id}`).then((response) => response.data)
}