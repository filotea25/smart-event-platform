<script setup>
import AppShell from '../components/layout/AppShell.vue'
</script>

<template>
  <AppShell
    title="Tipos"
    eyebrow="Catálogo"
    subtitle="Pantalla base para administrar los tipos de evento desde la API REST."
  >
    <section class="panel placeholder">
      <p class="eyebrow">Próximo bloque</p>
      <h2>Tipos de evento</h2>
      <p class="muted">
        Aquí podrás listar, crear, editar y borrar tipos con validación desde el backend.
      </p>
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