<template>
  <v-card variant="outlined" rounded="lg" class="pa-6 h-100">
    <v-card-title class="text-h6 font-weight-semibold pa-0 mb-6">
      Configure
    </v-card-title>

    <div class="d-flex flex-column ga-4">
      <!-- Persona selector (D-14: real VSelect, disabled, single GM item) -->
      <v-select
        :model-value="'General Manager'"
        :items="['General Manager']"
        label="Persona"
        prepend-inner-icon="mdi-account"
        disabled
        variant="outlined"
        density="comfortable"
      />

      <!-- PRD display (D-14: disabled text field showing demo PRD title) -->
      <v-text-field
        model-value="ACV MAX Auctions Integration"
        label="PRD"
        prepend-inner-icon="mdi-file-document"
        disabled
        variant="outlined"
        density="comfortable"
      />

      <!-- Validate button — the sole active CTA (UI-SPEC: full-width, large, primary fill) -->
      <v-btn
        color="primary"
        size="large"
        block
        :loading="isValidating"
        @click="$emit('validate')"
      >
        Validate
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  isValidating: boolean;
}>();

defineEmits<{
  (e: 'validate'): void;
}>();
</script>
