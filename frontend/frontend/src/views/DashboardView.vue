<script setup>
import { computed, onMounted, ref } from 'vue'
import { CalendarDays, CheckCircle2, Clock3, RefreshCw, Users } from 'lucide-vue-next'

import AppShell from '../components/layout/AppShell.vue'
import { getEventos } from '../api/eventos.api'
import { getUsuarios } from '../api/usuarios.api'

const loading = ref(true)
const error = ref('')
const eventos = ref([])
const usuarios = ref([])
const usersError = ref('')

const statCards = computed(() => {
  const total = eventos.value.length
  const pendientes = eventos.value.filter((evento) => isPendingStatus(evento.estado)).length
  const completados = eventos.value.filter((evento) => isCompletedStatus(evento.estado)).length
  const usersValue = usersError.value ? '-' : String(usuarios.value.length)

  return [
    {
      key: 'total',
      label: 'Total eventos',
      value: total,
      note: 'Eventos disponibles en Agenda IES Jandula',
      icon: CalendarDays,
      tone: 'info',
    },
    {
      key: 'pendientes',
      label: 'Eventos pendientes',
      value: pendientes,
      note: 'Pendientes de ejecucion o publicacion',
      icon: Clock3,
      tone: 'warning',
    },
    {
      key: 'completados',
      label: 'Eventos completados',
      value: completados,
      note: 'Cerrados o finalizados',
      icon: CheckCircle2,
      tone: 'success',
    },
    {
      key: 'usuarios',
      label: 'Usuarios registrados',
      value: usersValue,
      note: usersError.value || 'Usuarios cargados desde /api/usuarios',
      icon: Users,
      tone: usersError.value ? 'danger' : 'info',
    },
  ]
})

const upcomingEventos = computed(() => {
  const now = new Date()

  return eventos.value
    .filter((evento) => {
      const eventDate = parseDate(evento.fechaInicio)
      return eventDate && eventDate >= now
    })
    .sort((a, b) => parseDate(a.fechaInicio) - parseDate(b.fechaInicio))
    .slice(0, 6)
})

const hasUpcomingEventos = computed(() => upcomingEventos.value.length > 0)

function normalizeCollection(response) {
  if (Array.isArray(response)) {
    return response
  }

  return response?.content ?? response?.data ?? []
}

function normalizeEvento(evento) {
  return {
    id: evento.id ?? evento.eventoId,
    titulo: evento.titulo ?? evento.nombre ?? evento.title ?? 'Sin titulo',
    tipo: evento.tipoNombre ?? evento.tipo?.nombre ?? evento.tipo?.descripcion ?? evento.tipo ?? '-',
    lugar: evento.lugar ?? evento.ubicacion ?? evento.location ?? '-',
    fechaInicio: evento.fechaInicio ?? evento.fecha_inicio ?? evento.startDate ?? '',
    estado: String(evento.estado ?? evento.estadoEvento ?? '').toUpperCase(),
  }
}

function parseDate(value) {
  if (!value) {
    return null
  }

  const parsed = new Date(String(value).replace(' ', 'T'))
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDate(value) {
  const parsed = parseDate(value)

  if (!parsed) {
    return '-'
  }

  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed)
}

function isPendingStatus(status) {
  const normalized = String(status || '').toUpperCase()
  return ['PENDIENTE', 'PROGRAMADO', 'POR_APROBAR', 'BORRADOR'].includes(normalized)
}

function isCompletedStatus(status) {
  const normalized = String(status || '').toUpperCase()
  return ['COMPLETADO', 'FINALIZADO', 'CERRADO'].includes(normalized)
}

function statusLabel(status) {
  const normalized = String(status || '').toUpperCase()

  if (isPendingStatus(normalized)) {
    return 'Pendiente'
  }

  if (isCompletedStatus(normalized)) {
    return 'Completado'
  }

  if (normalized === 'CANCELADO') {
    return 'Cancelado'
  }

  return normalized || 'Sin estado'
}

function statusClass(status) {
  const normalized = String(status || '').toUpperCase()

  if (isPendingStatus(normalized)) {
    return 'dashboard-table__status--warning'
  }

  if (isCompletedStatus(normalized)) {
    return 'dashboard-table__status--success'
  }

  if (normalized === 'CANCELADO') {
    return 'dashboard-table__status--danger'
  }

  return 'dashboard-table__status--neutral'
}

async function loadDashboardData() {
  loading.value = true
  error.value = ''
  usersError.value = ''

  const [eventosResult, usuariosResult] = await Promise.allSettled([getEventos(), getUsuarios()])

  if (eventosResult.status === 'fulfilled') {
    eventos.value = normalizeCollection(eventosResult.value).map(normalizeEvento)
  } else {
    const message = eventosResult.reason?.response?.data?.message
    error.value = message || 'No se pudieron cargar los eventos del dashboard.'
    eventos.value = []
  }

  if (usuariosResult.status === 'fulfilled') {
    usuarios.value = normalizeCollection(usuariosResult.value)
  } else {
    usuarios.value = []
    usersError.value =
      usuariosResult.reason?.response?.status === 403
        ? 'Sin permisos para ver usuarios'
        : usuariosResult.reason?.response?.data?.message || 'No se pudo cargar usuarios'
  }

  loading.value = false
}

onMounted(loadDashboardData)
</script>

<template>
  <AppShell
    title="Dashboard"
    eyebrow="Vision general"
    subtitle="Panel operativo conectado al backend Spring Boot para supervisar actividad, estado y proximos eventos."
  >
    <template #actions>
      <button class="btn btn--ghost dashboard-action" type="button" :disabled="loading" @click="loadDashboardData">
        <RefreshCw :size="18" :class="{ 'is-spinning': loading }" />
        Actualizar
      </button>
    </template>

    <section class="dashboard-grid" aria-live="polite">
      <article
        v-for="(card, index) in statCards"
        :key="card.key"
        class="dashboard-card panel"
        :class="[`dashboard-card--${card.tone}`]"
        :style="{ animationDelay: `${index * 60}ms` }"
      >
        <div class="dashboard-card__icon-wrap">
          <component :is="card.icon" :size="20" />
        </div>
        <p class="dashboard-card__label">{{ card.label }}</p>
        <strong class="dashboard-card__value" v-if="!loading">{{ card.value }}</strong>
        <div v-else class="skeleton skeleton--stat" aria-hidden="true"></div>
        <p class="dashboard-card__note muted">{{ card.note }}</p>
      </article>
    </section>

    <section v-if="error" class="dashboard-error panel" role="alert">
      <p>{{ error }}</p>
      <button class="btn btn--ghost" type="button" @click="loadDashboardData">Reintentar</button>
    </section>

    <section class="panel dashboard-table-panel reveal-up" :style="{ animationDelay: '220ms' }">
      <header class="dashboard-table-panel__header">
        <div>
          <p class="eyebrow">Agenda activa</p>
          <h2 class="dashboard-table-panel__title">Proximos eventos</h2>
          <p class="muted">Ordenados por fecha de inicio y sincronizados con la API REST.</p>
        </div>
      </header>

      <div class="table-wrap">
        <table class="table dashboard-table" v-if="!loading && hasUpcomingEventos">
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Tipo</th>
              <th>Fecha inicio</th>
              <th>Lugar</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="evento in upcomingEventos" :key="evento.id">
              <td>{{ evento.titulo }}</td>
              <td>{{ evento.tipo }}</td>
              <td>{{ formatDate(evento.fechaInicio) }}</td>
              <td>{{ evento.lugar }}</td>
              <td>
                <span class="dashboard-table__status" :class="statusClass(evento.estado)">
                  {{ statusLabel(evento.estado) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else-if="loading" class="dashboard-skeleton-table" aria-hidden="true">
          <div class="skeleton skeleton--row" v-for="row in 5" :key="`skeleton-row-${row}`"></div>
        </div>

        <div v-else class="dashboard-empty">
          <CalendarDays :size="18" />
          <span>No hay proximos eventos para mostrar.</span>
        </div>
      </div>
    </section>
  </AppShell>
</template>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.dashboard-card {
  padding: 24px;
  display: grid;
  gap: 12px;
  border-radius: 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.dashboard-card:hover {
  border-color: var(--primary);
  box-shadow: 0 8px 20px rgba(97, 214, 167, 0.12);
}

.dashboard-card__icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #dff8ed;
  color: var(--primary);
}

.dashboard-card--warning .dashboard-card__icon-wrap {
  background: #fef3c7;
  color: var(--warning);
}

.dashboard-card--danger .dashboard-card__icon-wrap {
  background: #fee2e2;
  color: var(--danger);
}

.dashboard-card__label {
  margin: 0;
  font-size: 0.75rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.dashboard-card__value {
  font-size: 2rem;
  line-height: 1;
  letter-spacing: -0.04em;
  font-weight: 600;
  color: var(--text);
}

.dashboard-card__note {
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
}

.dashboard-action {
  min-width: 120px;
  gap: 8px;
}

.is-spinning {
  animation: spin 1s linear infinite;
}

.dashboard-error {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-radius: 12px;
  border: 1px solid #fee2e2;
  background: #fef2f2;
}

.dashboard-error p {
  margin: 0;
  color: #dc2626;
  font-size: 0.95rem;
}

.dashboard-table-panel {
  padding: 28px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
}

.dashboard-table-panel__header {
  margin-bottom: 20px;
}

.dashboard-table-panel__title {
  margin: 0 0 6px;
  font-size: 1.4rem;
  font-weight: 600;
}

.dashboard-table-panel__header p {
  margin: 0;
}

.dashboard-table {
  min-width: 600px;
}

.dashboard-table__status {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid transparent;
}

.dashboard-table__status--success {
  color: #166534;
  border-color: #bbf7d0;
  background: #dcfce7;
}

.dashboard-table__status--warning {
  color: #92400e;
  border-color: #fcd34d;
  background: #fef3c7;
}

.dashboard-table__status--danger {
  color: #991b1b;
  border-color: #fecaca;
  background: #fee2e2;
}

.dashboard-table__status--neutral {
  color: #4b5563;
  border-color: #e6f0eb;
  background: var(--bg-soft);
}

.dashboard-skeleton-table {
  display: grid;
  gap: 12px;
  padding: 8px 0;
}

.skeleton {
  position: relative;
  overflow: hidden;
  background: var(--bg-soft);
  border-radius: 8px;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 45%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.4s infinite;
}

.skeleton--stat {
  width: 55%;
  height: 32px;
  border-radius: 8px;
}

.skeleton--row {
  width: 100%;
  height: 50px;
  border-radius: 8px;
}

.dashboard-empty {
  min-height: 140px;
  border: 1px dashed var(--border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--muted);
  flex-direction: column;
}

.reveal-up {
  opacity: 0;
  transform: translateY(16px);
  animation: revealUp 0.5s ease forwards;
}

@keyframes shimmer {
  to {
    transform: translateX(100%);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes revealUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 820px) {
  .dashboard-error {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard-error .btn {
    width: 100%;
  }

  .dashboard-table-panel {
    padding: 20px;
  }
}
</style>