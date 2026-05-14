<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

import AppShell from '../components/layout/AppShell.vue'
import { createUsuario, deleteUsuario, getUsuarios, updateUsuario } from '../api/usuarios.api'

const roles = ['ADMIN', 'PROFESORADO']

const usuarios = ref([])
const loading = ref(false)
const submitting = ref(false)
const formError = ref('')
const fieldErrors = ref({})

const editingId = ref(null)

const form = reactive({
  email: '',
  nombre: '',
  password: '',
  rol: 'PROFESORADO',
})

const isEditMode = computed(() => editingId.value !== null)
const submitLabel = computed(() => {
  if (submitting.value) {
    return isEditMode.value ? 'Guardando...' : 'Creando...'
  }

  return isEditMode.value ? 'Guardar cambios' : 'Crear usuario'
})

function normalizeCollection(response) {
  if (Array.isArray(response)) {
    return response
  }

  return response?.content ?? response?.data ?? []
}

function resetForm() {
  form.email = ''
  form.nombre = ''
  form.password = ''
  form.rol = 'PROFESORADO'
  editingId.value = null
  fieldErrors.value = {}
  formError.value = ''
}

function startEdit(usuario) {
  editingId.value = usuario.id
  form.email = usuario.email ?? ''
  form.nombre = usuario.nombre ?? ''
  form.password = ''
  form.rol = usuario.rol ?? 'PROFESORADO'
  fieldErrors.value = {}
  formError.value = ''
}

function toPayload() {
  const basePayload = {
    email: form.email.trim(),
    nombre: form.nombre.trim(),
    rol: form.rol,
  }

  if (!isEditMode.value) {
    return {
      ...basePayload,
      password: form.password,
    }
  }

  return basePayload
}

async function loadUsuarios() {
  loading.value = true
  formError.value = ''

  try {
    const response = await getUsuarios()
    usuarios.value = normalizeCollection(response)
  } catch (requestError) {
    formError.value = requestError?.response?.data?.message || 'No se pudieron cargar los usuarios.'
    usuarios.value = []
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  submitting.value = true
  fieldErrors.value = {}
  formError.value = ''

  try {
    if (isEditMode.value) {
      await updateUsuario(editingId.value, toPayload())
    } else {
      await createUsuario(toPayload())
    }

    await loadUsuarios()
    resetForm()
  } catch (requestError) {
    const responseData = requestError?.response?.data
    fieldErrors.value = responseData?.fieldErrors ?? {}
    formError.value = responseData?.message || 'No se pudo guardar el usuario.'
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id) {
  const confirmed = window.confirm('¿Seguro que quieres eliminar este usuario?')

  if (!confirmed) {
    return
  }

  try {
    await deleteUsuario(id)

    if (editingId.value === id) {
      resetForm()
    }

    await loadUsuarios()
  } catch (requestError) {
    formError.value = requestError?.response?.data?.message || 'No se pudo eliminar el usuario.'
  }
}

onMounted(loadUsuarios)
</script>

<template>
  <AppShell
    title="Administrar usuarios"
    eyebrow="Admin"
    subtitle="Gestión de usuarios con alta, edición y borrado. La contraseña solo se usa en creación."
  >
    <section class="panel usuarios-form-panel">
      <div class="usuarios-form-panel__header">
        <h2>{{ isEditMode ? 'Editar usuario' : 'Nuevo usuario' }}</h2>
        <button v-if="isEditMode" class="btn btn--ghost" type="button" @click="resetForm">
          Cancelar edición
        </button>
      </div>

      <p v-if="formError" class="usuarios-form-panel__error" role="alert">{{ formError }}</p>

      <form class="usuarios-form" @submit.prevent="handleSubmit">
        <label class="usuarios-form__field">
          <span>Email *</span>
          <input v-model="form.email" class="input" type="email" required autocomplete="email" />
          <small v-if="fieldErrors.email" class="usuarios-form__field-error">{{ fieldErrors.email }}</small>
        </label>

        <label class="usuarios-form__field">
          <span>Nombre *</span>
          <input v-model="form.nombre" class="input" type="text" maxlength="100" required />
          <small v-if="fieldErrors.nombre" class="usuarios-form__field-error">{{ fieldErrors.nombre }}</small>
        </label>

        <label v-if="!isEditMode" class="usuarios-form__field">
          <span>Password *</span>
          <input
            v-model="form.password"
            class="input"
            type="password"
            minlength="8"
            autocomplete="new-password"
            required
          />
          <small v-if="fieldErrors.password" class="usuarios-form__field-error">{{ fieldErrors.password }}</small>
        </label>

        <label class="usuarios-form__field">
          <span>Rol *</span>
          <select v-model="form.rol" class="select" required>
            <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
          </select>
          <small v-if="fieldErrors.rol" class="usuarios-form__field-error">{{ fieldErrors.rol }}</small>
        </label>

        <div class="usuarios-form__actions">
          <button class="btn btn--primary" type="submit" :disabled="submitting">{{ submitLabel }}</button>
        </div>
      </form>
    </section>

    <section class="panel usuarios-list-panel">
      <header class="usuarios-list-panel__header">
        <h2>Listado de usuarios</h2>
        <button class="btn btn--ghost" type="button" @click="loadUsuarios" :disabled="loading">
          {{ loading ? 'Actualizando...' : 'Actualizar' }}
        </button>
      </header>

      <p v-if="loading" class="muted">Cargando usuarios...</p>
      <p v-else-if="usuarios.length === 0" class="muted">No hay usuarios registrados todavía.</p>

      <div v-else class="usuarios-table-wrap table-wrap">
        <table class="table usuarios-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id">
              <td>{{ usuario.email }}</td>
              <td>{{ usuario.nombre }}</td>
              <td>
                <span :class="usuario.rol === 'ADMIN' ? 'usuarios-table__badge usuarios-table__badge--admin' : 'usuarios-table__badge'">
                  {{ usuario.rol }}
                </span>
              </td>
              <td>
                <div class="usuarios-table__actions">
                  <button class="btn btn--ghost" type="button" @click="startEdit(usuario)">Editar</button>
                  <button class="btn btn--ghost usuarios-table__delete" type="button" @click="handleDelete(usuario.id)">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </AppShell>
</template>

<style scoped>
.usuarios-form-panel,
.usuarios-list-panel {
  padding: 28px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.usuarios-form-panel {
  display: grid;
  gap: 20px;
}

.usuarios-form-panel__header,
.usuarios-list-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.usuarios-form-panel__header h2,
.usuarios-list-panel__header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.usuarios-form-panel__error {
  margin: 0;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.usuarios-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.usuarios-form__field {
  display: grid;
  gap: 8px;
  color: var(--muted);
  font-weight: 500;
}

.usuarios-form__field span {
  color: var(--text);
  font-size: 0.9rem;
}

.usuarios-form__field-error {
  color: #dc2626;
  font-size: 0.85rem;
}

.usuarios-form__actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.usuarios-table-wrap {
  margin-top: 20px;
}

.usuarios-table__actions {
  display: flex;
  gap: 8px;
}

.usuarios-table__badge {
  display: inline-flex;
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--bg-soft);
  color: var(--muted);
}

.usuarios-table__badge--admin {
  background: #dff8ed;
  color: #047857;
}

.usuarios-table__delete {
  border-color: #fecaca;
  color: #dc2626;
  background: #fef2f2;
}

.usuarios-table__delete:hover {
  background: #fee2e2;
}

@media (max-width: 900px) {
  .usuarios-form,
  .usuarios-form__actions,
  .usuarios-form-panel__header,
  .usuarios-list-panel__header,
  .usuarios-table__actions {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .usuarios-form {
    gap: 12px;
  }

  .usuarios-form__actions button,
  .usuarios-form-panel__header button,
  .usuarios-list-panel__header button,
  .usuarios-table__actions button {
    width: 100%;
  }
}
</style>
