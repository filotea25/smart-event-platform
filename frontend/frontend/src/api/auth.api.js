import api from './axios'

export function login(credentials) {
  return api.post('/api/auth/login', credentials).then((response) => response.data)
}