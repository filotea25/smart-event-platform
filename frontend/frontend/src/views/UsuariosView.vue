<script setup>
import AppShell from '../components/layout/AppShell.vue'
</script>

<template>
  <AppShell
    title="Usuarios"
    eyebrow="Administración"
    subtitle="Base visual para gestionar profesores, administradores o el rol que soporte tu backend."
  >
    <section class="panel placeholder">
      <p class="eyebrow">Próximo bloque</p>
      <h2>Usuarios del sistema</h2>
      <p class="muted">
        Aquí podrás consultar perfiles, roles y estado de acceso con acciones de edición.
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