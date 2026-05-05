<template>
  <v-app>
    <v-app-bar elevation="0" color="surface" border="b">
      <template #prepend>
        <v-btn
          :icon="showConfig ? 'mdi-arrow-collapse-left' : 'mdi-arrow-expand-right'"
          variant="text"
          size="small"
          class="ml-2"
          @click="showConfig = !showConfig"
        />
        <img
          src="/logo-echomind.png"
          alt="EchoMind"
          style="
            display: block;
            height: 40px;
            width: 40px;
            object-fit: cover;
            object-position: left top;
            border-radius: 8px;
            margin-left: 8px;
            background: transparent;
          "
        />
      </template>
      <v-app-bar-title class="text-subtitle-1 font-weight-bold" style="letter-spacing: 0.5px; color: rgb(var(--v-theme-on-surface));">
        EchoMind
      </v-app-bar-title>
      <template #append>
        <v-btn
          :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="text"
          class="mr-2"
          @click="toggleTheme"
        />
      </template>
    </v-app-bar>

    <v-main style="background: rgb(var(--v-theme-surface))">
      <v-container fluid class="pa-4" style="height: calc(100vh - 64px)">
        <v-row style="height: 100%" no-gutters class="ga-4">

          <!-- Config pane (collapsible) -->
          <Transition name="config">
            <v-col v-if="showConfig" style="max-width: 280px; flex: 0 0 280px; min-width: 0;">
              <InputPane
                :is-validating="isValidating"
                @validate="runValidation"
              />
            </v-col>
          </Transition>

          <!-- PRD reference pane -->
          <v-col style="max-width: 340px; flex: 0 0 340px; min-width: 0;">
            <PrdPane />
          </v-col>

          <!-- Results pane — flex-grow fills remaining width -->
          <v-col style="min-width: 0; overflow-y: auto; height: 100%;">
            <ResultsPane
              :is-validating="isValidating"
              :step="step"
              :results="results"
            />
          </v-col>

        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTheme } from 'vuetify';
import { useValidator } from './composables/useValidator';
import InputPane from './components/InputPane.vue';
import PrdPane from './components/PrdPane.vue';
import ResultsPane from './components/ResultsPane.vue';

const { isValidating, step, results, runValidation } = useValidator();

const showConfig = ref(true);

const theme = useTheme();
const isDark = computed(() => theme.global.name.value === 'dark');
function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark';
}
</script>

<style>
.config-enter-active,
.config-leave-active {
  transition: opacity 0.2s ease, max-width 0.25s ease;
  overflow: hidden;
}
.config-enter-from,
.config-leave-to {
  opacity: 0;
  max-width: 0 !important;
}
</style>
