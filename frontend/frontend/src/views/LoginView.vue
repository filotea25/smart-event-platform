<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const localError = ref('')

async function handleSubmit() {
  localError.value = ''

  try {
    await authStore.login(form.email, form.password)

    await router.push('/eventos')
  } catch {
    localError.value = authStore.error || 'Revisa tus credenciales'
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-page__hero surface">
      <div class="login-page__badge">Agenda IES Jándula</div>
      <div class="login-page__hero-copy">
        <p class="eyebrow">Acceso privado</p>
        <h1 class="login-page__title">Inicia sesión para gestionar eventos con JWT.</h1>
        <p class="login-page__subtitle">
          Un acceso limpio y responsive para entrar al panel de administración y trabajar con tu
          backend Spring Boot.
        </p>
      </div>

      <div class="login-page__highlights">
        <article class="login-page__highlight panel">
          <span class="login-page__highlight-title">Autenticación</span>
          <span class="muted">Token JWT, sesión persistente y redirección automática.</span>
        </article>
        <article class="login-page__highlight panel">
          <span class="login-page__highlight-title">API conectada</span>
          <span class="muted">Login contra <code>/api/auth/login</code> y consumo REST listo.</span>
        </article>
      </div>
    </section>

    <section class="login-page__card surface">
      <div class="login-page__card-header">
        <p class="eyebrow">Acceso seguro</p>
        <h2 class="login-page__card-title">Iniciar sesión</h2>
        <p class="muted">Usa tu email corporativo y la contraseña registrada en el sistema.</p>
      </div>

      <form class="login-page__form" @submit.prevent="handleSubmit">
        <label class="login-page__field">
          <span>Email</span>
          <input
            v-model="form.email"
            class="input"
            type="email"
            placeholder="profesor@iesjandula.es"
            autocomplete="email"
            required
          />
        </label>

        <label class="login-page__field">
          <span>Contraseña</span>
          <input
            v-model="form.password"
            class="input"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </label>

        <p v-if="localError" class="login-page__error" role="alert">{{ localError }}</p>

        <button class="btn btn--primary login-page__submit" type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 32px;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(380px, 0.8fr);
  gap: 48px;
  align-items: center;
  background: var(--bg);
}

.login-page__hero,
.login-page__card {
  border-radius: 12px;
}

.login-page__hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  padding: 40px;
}

.login-page__badge {
  width: fit-content;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-soft);
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 600;
}

.login-page__hero-copy {
  display: grid;
  gap: 16px;
  max-width: 52ch;
}

.login-page__title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.15;
  letter-spacing: -0.04em;
  font-weight: 600;
  color: var(--text);
}

.login-page__subtitle {
  margin: 0;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.6;
}

.login-page__highlights {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 8px;
}

.login-page__highlight {
  padding: 16px;
  display: grid;
  gap: 8px;
  background: var(--bg-soft);
  border-radius: 10px;
  border: 1px solid var(--border);
}

.login-page__highlight-title {
  font-weight: 600;
  color: var(--text);
  font-size: 0.9rem;
}

.login-page__highlight-title + span {
  color: var(--muted);
  font-size: 0.85rem;
  line-height: 1.4;
}

.login-page__card {
  padding: 32px;
  display: grid;
  gap: 24px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.login-page__card-header {
  display: grid;
  gap: 6px;
}

.login-page__card-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text);
}

.login-page__card-header p {
  margin: 0;
}

.login-page__form {
  display: grid;
  gap: 16px;
}

.login-page__field {
  display: grid;
  gap: 8px;
  color: var(--muted);
  font-weight: 500;
  font-size: 0.9rem;
}

.login-page__field span {
  color: var(--text);
}

.login-page__error {
  margin: 0;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.9rem;
}

.login-page__submit {
  width: 100%;
  margin-top: 4px;
}

@media (max-width: 1100px) {
  .login-page {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .login-page__hero,
  .login-page__card {
    min-height: auto;
  }
}

@media (max-width: 720px) {
  .login-page {
    padding: 20px;
    gap: 24px;
  }

  .login-page__hero,
  .login-page__card {
    padding: 24px;
  }

  .login-page__highlights {
    grid-template-columns: 1fr;
  }
}
</style>