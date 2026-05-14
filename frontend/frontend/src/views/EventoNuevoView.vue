<script setup>
import AppShell from '../components/layout/AppShell.vue'
</script>

<template>
  <AppShell
    title="Nuevo evento"
    eyebrow="Eventos"
    subtitle="Pantalla base para crear un nuevo evento dentro del calendario académico."
  >
    <section class="panel placeholder">
      <p class="eyebrow">Formulario</p>
      <h2>Crear evento</h2>
      <p class="muted">Aquí irá el formulario de alta conectado a la API de eventos.</p>
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