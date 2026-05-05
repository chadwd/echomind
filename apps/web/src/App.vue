<template>
  <v-app>
    <v-app-bar elevation="0" color="surface" border="b">
      <template #prepend>
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
            margin-left: 16px;
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
      <v-container fluid class="pa-6" style="height: calc(100vh - 64px)">
        <v-row style="height: 100%" no-gutters class="ga-8">
          <!-- Input pane — 360px fixed width (UI-SPEC) -->
          <v-col style="max-width: 360px; flex: 0 0 360px;">
            <InputPane
              :is-validating="isValidating"
              @validate="runValidation"
            />
          </v-col>

          <!-- Results pane — flex-grow fills remaining width -->
          <v-col>
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
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { useValidator } from './composables/useValidator';
import InputPane from './components/InputPane.vue';
import ResultsPane from './components/ResultsPane.vue';

const { isValidating, step, results, runValidation } = useValidator();

const theme = useTheme();
const isDark = computed(() => theme.global.name.value === 'dark');
function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark';
}
</script>
