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
      <v-container fluid class="pa-4 layout-container">
        <v-row class="layout-row ga-4" no-gutters>

          <!-- Config pane (collapsible) -->
          <Transition name="config">
            <v-col v-if="showConfig" class="pane-config">
              <InputPane
                :is-validating="isValidating"
                @validate="runValidation"
              />
            </v-col>
          </Transition>

          <!-- PRD reference pane (hidden on mobile) -->
          <v-col class="pane-prd">
            <PrdPane />
          </v-col>

          <!-- Results pane — flex-grow fills remaining width -->
          <v-col class="pane-results">
            <ResultsPane
              :is-validating="isValidating"
              :step="step"
              :results="results"
              :error="error"
              :error-kind="errorKind"
              @retry="runValidation"
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

const { isValidating, step, results, error, errorKind, runValidation } = useValidator();

const showConfig = ref(true);

const theme = useTheme();
const isDark = computed(() => theme.global.name.value === 'dark');
function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark';
}
</script>

<style>
/* ─── Desktop layout (960px+): three-column fixed widths ─── */
.layout-container {
  height: calc(100vh - 64px);
}

.layout-row {
  height: 100%;
}

.pane-config {
  max-width: 280px;
  flex: 0 0 280px;
  min-width: 0;
}

.pane-prd {
  max-width: 464px;
  flex: 0 0 464px;
  min-width: 0;
  height: 100%;
  overflow: hidden;
}

.pane-results {
  min-width: 0;
  overflow-y: auto;
  height: 100%;
}

/* ─── Config collapse animation ─── */
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

/* ─── Mobile (< 960px): stack vertically, hide PRD pane ─── */
@media (max-width: 959px) {
  .layout-container {
    height: auto;
    min-height: calc(100vh - 64px);
  }

  .layout-row {
    height: auto;
    flex-direction: column;
  }

  .pane-config {
    max-width: 100% !important;
    flex: 0 0 auto !important;
    width: 100%;
  }

  .pane-prd {
    display: none;
  }

  .pane-results {
    max-width: 100% !important;
    flex: 1 1 auto !important;
    height: auto;
    overflow-y: visible;
    min-height: 300px;
  }
}
</style>
