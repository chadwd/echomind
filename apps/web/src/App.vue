<template>
  <v-app>
    <v-app-bar elevation="1" color="surface">
      <v-app-bar-title class="text-h5 font-weight-semibold">EchoMind</v-app-bar-title>
    </v-app-bar>

    <v-main style="background: rgb(var(--v-theme-surface))">
      <v-container fluid class="pa-6" style="height: 100%">
        <v-row style="height: 100%" no-gutters class="ga-8">
          <!-- Input pane — 360px fixed, filled by Plan 05 -->
          <v-col style="max-width: 360px; flex: 0 0 360px;">
            <div class="text-body-2 text-medium-emphasis">Input pane (Plan 05)</div>
          </v-col>
          <!-- Results pane — fills remaining width, filled by Plan 05 -->
          <v-col>
            <div class="text-body-2 text-medium-emphasis">Results pane (Plan 05)</div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// Components wired in Plan 05
</script>
