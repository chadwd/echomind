<template>
  <div class="h-100">

    <!-- Empty state -->
    <div
      v-if="!isValidating && !results && !error"
      class="d-flex flex-column align-center justify-center h-100 text-center empty-state"
      style="min-height: 300px"
    >
      <img
        src="/logo-echomind.png"
        alt="EchoMind"
        style="height: 144px; width: auto; object-fit: contain; opacity: 0.7; margin-bottom: 16px;"
      />
      <div class="text-h6 font-weight-semibold mb-2">Ready when you are.</div>
      <div class="text-body-2 text-medium-emphasis">
        See this PRD through the GM's eyes — fit, friction, open questions, and what to tighten up.
      </div>
    </div>

    <!-- Loading state: modal card with horizontal steps -->
    <div
      v-else-if="isValidating"
      class="d-flex align-center justify-center h-100"
      style="min-height: 300px"
    >
      <v-card elevation="6" rounded="xl" class="loading-card d-flex flex-column align-center pa-12" style="width: 100%; max-width: 680px; min-height: 400px; justify-content: center;">

        <!-- Breathing logo -->
        <img
          src="/logo-echomind.png"
          alt="EchoMind"
          class="loading-logo mb-6"
          style="height: 88px; width: auto; object-fit: contain;"
        />

        <div class="text-h6 font-weight-semibold mb-1 text-center">Analyzing your PRD</div>
        <div class="text-body-2 text-medium-emphasis mb-10 text-center">The GM is weighing in&hellip;</div>

        <!-- Horizontal step sequence -->
        <div class="steps-h">
          <template v-for="(label, i) in loadingSteps" :key="i">

            <!-- Step -->
            <div
              class="step-item"
              :class="{
                'is-complete': step > i + 1,
                'is-active':   step === i + 1,
                'is-pending':  step < i + 1,
              }"
            >
              <!-- Indicator -->
              <div class="indicator-wrap">
                <Transition name="check">
                  <div v-if="step > i + 1" class="indicator indicator--complete">
                    <v-icon icon="mdi-check" size="14" color="white" />
                  </div>
                </Transition>
                <div v-if="step === i + 1" class="indicator indicator--active">
                  <div class="pulse-ring" />
                  <div class="pulse-ring pulse-ring--late" />
                </div>
                <div v-if="step < i + 1" class="indicator indicator--pending" />
              </div>

              <!-- Label -->
              <div class="step-label text-caption text-center mt-3">{{ label }}</div>
            </div>

            <!-- Connector between steps -->
            <div v-if="i < loadingSteps.length - 1" class="connector-h" :class="{ 'connector-h--done': step > i + 1 }" />

          </template>
        </div>

      </v-card>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="d-flex align-center justify-center h-100 empty-state"
      style="min-height: 300px"
    >
      <v-alert
        type="error"
        variant="tonal"
        rounded="lg"
        class="w-100"
        :icon="errorIcon"
        style="max-width: 680px;"
      >
        <template #title>
          <span class="text-subtitle-1 font-weight-bold">{{ errorHeading }}</span>
        </template>
        {{ errorBody }}
        <template #append>
          <v-btn
            variant="text"
            color="error"
            size="small"
            @click="$emit('retry')"
          >
            Try again
          </v-btn>
        </template>
      </v-alert>
    </div>

    <!-- Results: vertical report feed, sections stagger in -->
    <TransitionGroup
      v-else-if="results"
      name="card"
      tag="div"
      class="d-flex flex-column ga-5"
    >
      <SectionCard
        v-for="(section, index) in sections"
        :key="section.key"
        :title="section.title"
        :icon="section.icon"
        :color="section.color"
        :items="results[section.key]"
        :style="{ '--stagger': `${index * 120}ms` }"
      />
    </TransitionGroup>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ValidationResult, GatewayErrorKind } from '@echomind/engine';
import SectionCard from './SectionCard.vue';

const props = defineProps<{
  isValidating: boolean;
  step: number;
  results: ValidationResult | null;
  error: string | null;
  errorKind: GatewayErrorKind | null;
}>();

defineEmits<{ retry: [] }>();

const errorHeading = computed(() => {
  switch (props.errorKind) {
    case 'timeout':    return 'The gateway took too long';
    case 'auth':       return 'Access denied';
    case 'rate_limit': return 'Too many requests';
    default:           return 'Something went wrong';
  }
});

const errorBody = computed(() => {
  switch (props.errorKind) {
    case 'timeout':    return 'The validator didn\'t get a response in time. Check your connection and try again.';
    case 'auth':       return 'Your gateway credentials may have expired. Contact your ACV admin if this continues.';
    case 'rate_limit': return 'The gateway is rate-limited right now. Wait a moment and try again.';
    default:           return 'The validator hit an unexpected error. Try again — if it keeps happening, check the engine logs.';
  }
});

const errorIcon = computed(() => {
  switch (props.errorKind) {
    case 'timeout':    return 'mdi-timer-off-outline';
    case 'auth':       return 'mdi-lock-outline';
    case 'rate_limit': return 'mdi-speedometer-slow';
    default:           return 'mdi-alert-circle-outline';
  }
});

const loadingSteps = [
  'Reading GM\'s profile',
  'Scanning the PRD',
  'Forming a take',
  'Composing insights',
];

const sections: Array<{
  key: keyof ValidationResult;
  title: string;
  icon: string;
  color: string;
}> = [
  { key: 'fit',         title: 'Fit',         icon: 'mdi-check-bold',       color: 'success' },
  { key: 'friction',    title: 'Friction',    icon: 'mdi-alert',            color: 'error'   },
  { key: 'questions',   title: 'Questions',   icon: 'mdi-comment-question', color: 'info'    },
  { key: 'refinements', title: 'Refinements', icon: 'mdi-pencil',           color: 'primary' },
];
</script>

<style scoped>
/* ─── Loading logo ───────────────────────────────── */
.loading-logo {
  animation: logo-breathe 2.6s ease-in-out infinite;
}

@keyframes logo-breathe {
  0%, 100% { transform: scale(1);    opacity: 0.75; }
  50%       { transform: scale(1.05); opacity: 1;    }
}

/* ─── Horizontal step track ──────────────────────── */
.steps-h {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 120px;
  transition: opacity 0.3s ease;
}

.step-item.is-pending {
  opacity: 0.35;
}

.connector-h {
  flex: 1;
  height: 2px;
  background: rgb(var(--v-theme-outline-variant));
  margin-top: 13px; /* vertically aligns with center of 28px indicator */
  border-radius: 1px;
  transition: background 0.4s ease;
}

.connector-h--done {
  background: rgb(var(--v-theme-success));
}

/* ─── Indicators ─────────────────────────────────── */
.indicator-wrap {
  width: 28px;
  height: 28px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.indicator--complete {
  width: 28px;
  height: 28px;
  background: rgb(var(--v-theme-success));
}

.indicator--active {
  width: 14px;
  height: 14px;
  background: rgb(var(--v-theme-primary));
  position: relative;
}

.indicator--pending {
  width: 10px;
  height: 10px;
  background: rgb(var(--v-theme-outline-variant));
  border-radius: 50%;
}

/* ─── Pulse rings ────────────────────────────────── */
.pulse-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgb(var(--v-theme-primary));
  animation: pulse-out 1.8s ease-out infinite;
}

.pulse-ring--late {
  animation-delay: 0.9s;
}

@keyframes pulse-out {
  0%   { transform: scale(1);   opacity: 0.75; }
  100% { transform: scale(3.4); opacity: 0;    }
}

/* ─── Check pop-in ───────────────────────────────── */
.check-enter-active {
  animation: check-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes check-pop {
  from { transform: scale(0) rotate(-20deg); opacity: 0; }
  to   { transform: scale(1) rotate(0deg);   opacity: 1; }
}

/* ─── Step labels ────────────────────────────────── */
.step-label {
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1.4;
  transition: color 0.3s ease;
}

.is-complete .step-label { color: rgb(var(--v-theme-success)); }

.is-active .step-label {
  color: rgb(var(--v-theme-on-surface));
  font-weight: 600;
  animation: label-pulse 2.2s ease-in-out infinite;
}

@keyframes label-pulse {
  0%, 100% { opacity: 0.8; }
  50%       { opacity: 1;   }
}

/* ─── Results stagger ────────────────────────────── */
.card-enter-active {
  animation: card-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--stagger, 0ms);
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0);    }
}

/* ─── Empty state ────────────────────────────────── */
.empty-state {
  animation: fade-in 0.6s ease both;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
}

/* ─── Reduced motion ─────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .loading-logo,
  .pulse-ring,
  .is-active .step-label,
  .card-enter-active,
  .empty-state,
  .check-enter-active { animation: none; }
}
</style>
