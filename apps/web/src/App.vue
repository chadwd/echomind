<template>
  <v-app>
    <v-app-bar elevation="1" color="surface">
      <v-app-bar-title class="text-h5 font-weight-semibold">EchoMind</v-app-bar-title>
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
import { useValidator } from './composables/useValidator';
import InputPane from './components/InputPane.vue';
import ResultsPane from './components/ResultsPane.vue';

const { isValidating, step, results, runValidation } = useValidator();
</script>
