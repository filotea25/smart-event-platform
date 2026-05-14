<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  note: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <article class="stat-card panel">
    <p class="stat-card__label">{{ label }}</p>
    <strong class="stat-card__value">{{ value }}</strong>
    <p v-if="note" class="stat-card__note muted">{{ note }}</p>
  </article>
</template>

<style scoped>
.stat-card {
  padding: 20px;
  display: grid;
  gap: 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.stat-card__label {
  margin: 0;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  font-weight: 600;
}

.stat-card__value {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  letter-spacing: -0.04em;
  font-weight: 600;
}

.stat-card__note {
  margin: 0;
  line-height: 1.4;
  font-size: 0.85rem;
}
</style>