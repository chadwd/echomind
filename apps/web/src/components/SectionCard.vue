<template>
  <v-card variant="elevated" :elevation="2" rounded="lg" class="h-100">
    <v-card-title class="text-h6 d-flex align-center ga-2 pt-4 px-4">
      <v-icon :icon="icon" size="20" />
      {{ title }}
    </v-card-title>
    <v-card-text class="pt-2">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="text-body-2 py-2"
        :class="{ 'border-t': i > 0 }"
        style="border-color: rgba(0,0,0,0.08); white-space: normal; word-break: break-word;"
      >
        {{ item }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
  items: string[];
}>();
</script>
