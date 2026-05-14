import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { login as loginRequest } from '../api/auth.api'
import { setAuthToken } from '../api/axios'

const STORAGE_KEY = 'agenda-iesjandula-auth'

function readStoredSession() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSession = window.localStorage.getItem(STORAGE_KEY)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession)
  } catch {
    return null
  }
}

function writeStoredSession(session) {
  if (typeof window === 'undefined') {
    return
  }

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export const useAuthStore = defineStore('auth', () => {
  const storedSession = readStoredSession()
  const token = ref(storedSession?.token ?? '')
  const tokenType = ref(storedSession?.tokenType ?? 'Bearer')
  const user = ref(storedSession?.user ?? null)
  const rol = ref(storedSession?.user?.rol ?? '')
  const loading = ref(false)
  const error = ref('')

  if (storedSession?.token) {
    setAuthToken(storedSession.token, storedSession.tokenType)
  }

  const isAuthenticated = computed(() => Boolean(token.value))
  const displayName = computed(() => user.value?.nombre || user.value?.email || 'Usuario')
  const roleLabel = computed(() => rol.value || 'Sin rol')

  function hydrateSession(session) {
    token.value = session.token
    tokenType.value = session.tokenType || 'Bearer'
    user.value = session.user
    rol.value = session.user?.rol ?? ''
    setAuthToken(session.token, session.tokenType)
    writeStoredSession(session)
  }

  function logout() {
    token.value = ''
    tokenType.value = 'Bearer'
    user.value = null
    rol.value = ''
    error.value = ''
    setAuthToken()
    writeStoredSession(null)
  }

  async function login(email, password) {
    loading.value = true
    error.value = ''

    try {
      const response = await loginRequest({ email, password })
      hydrateSession({
        token: response.token,
        tokenType: response.tipoToken ?? 'Bearer',
        user: {
          email: response.email,
          nombre: response.nombre,
          rol: response.rol,
        },
      })
      return response
    } catch (requestError) {
      const message = requestError?.response?.data?.message || 'No se pudo iniciar sesión'
      error.value = message
      throw requestError
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    tokenType,
    user,
    rol,
    loading,
    error,
    isAuthenticated,
    displayName,
    roleLabel,
    login,
    logout,
    hydrateSession,
  }
})