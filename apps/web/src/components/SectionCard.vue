<template>
  <v-card variant="elevated" :elevation="2" rounded="lg" class="h-100">
    <v-card-title class="text-h6 d-flex align-center ga-2 pt-4 px-4">
      <v-icon :icon="icon" size="20" />
      {{ title }}
    </v-card-title>
    <v-card-text>
      <v-list density="compact" lines="two">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :title="item"
          class="text-body-2 px-0"
        />
      </v-list>
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
