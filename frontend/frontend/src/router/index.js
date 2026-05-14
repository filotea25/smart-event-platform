import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/eventos',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      public: true,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
    },
  },
  {
    path: '/eventos',
    name: 'eventos',
    component: () => import('../views/EventosView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Eventos',
    },
  },
  {
    path: '/eventos/nuevo',
    name: 'evento-nuevo',
    component: () => import('../views/EventoFormView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Nuevo evento',
    },
  },
  {
    path: '/eventos/:id/editar',
    name: 'evento-editar',
    component: () => import('../views/EventoFormView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Editar evento',
    },
    props: true,
  },
  {
    path: '/admin/tipos',
    name: 'admin-tipos',
    component: () => import('../views/AdminTiposView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN'],
      title: 'Tipos',
    },
  },
  {
    path: '/admin/usuarios',
    name: 'admin-usuarios',
    component: () => import('../views/AdminUsuariosView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN'],
      title: 'Usuarios',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiredRoles = to.matched.flatMap((record) => record.meta.roles ?? [])

  if (requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(authStore.rol)) {
    return { name: 'eventos' }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'eventos' }
  }

  return true
})

export default router