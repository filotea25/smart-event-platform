<script setup>
import AppShell from '../components/layout/AppShell.vue'

defineProps({
  id: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <AppShell
    title="Editar evento"
    eyebrow="Eventos"
    subtitle="Pantalla base para editar un evento existente."
  >
    <section class="panel placeholder">
      <p class="eyebrow">Formulario</p>
      <h2>Editar evento {{ id }}</h2>
      <p class="muted">Aquí irá el formulario de edición conectado a la API de eventos.</p>
    </section>
  </AppShell>
</template>

<style scoped>
.placeholder {
  padding: 24px;
  min-height: 280px;
}

.placeholder h2 {
  margin: 0 0 10px;
}
</style>