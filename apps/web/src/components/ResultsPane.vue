<template>
  <div class="h-100">

    <!-- Empty state -->
    <div
      v-if="!isValidating && !results"
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

    <!-- Loading state: custom animated step sequence -->
    <div
      v-else-if="isValidating"
      class="d-flex flex-column align-center justify-center h-100"
      style="min-height: 300px"
    >
      <!-- Breathing logo -->
      <img
        src="/logo-echomind.png"
        alt="EchoMind"
        class="loading-logo mb-10"
        style="height: 72px; width: auto; object-fit: contain;"
      />

      <!-- Animated step list -->
      <div class="step-list">
        <div
          v-for="(label, i) in loadingSteps"
          :key="i"
          class="step-row"
          :class="{
            'is-complete': step > i + 1,
            'is-active':   step === i + 1,
            'is-pending':  step < i + 1,
          }"
        >
          <!-- Indicator -->
          <div class="indicator-wrap">
            <!-- Complete -->
            <Transition name="check">
              <div v-if="step > i + 1" class="indicator indicator--complete">
                <v-icon icon="mdi-check" size="13" color="white" />
              </div>
            </Transition>

            <!-- Active -->
            <div v-if="step === i + 1" class="indicator indicator--active">
              <div class="pulse-ring" />
              <div class="pulse-ring pulse-ring--late" />
            </div>

            <!-- Pending -->
            <div v-if="step < i + 1" class="indicator indicator--pending" />
          </div>

          <!-- Label -->
          <span class="step-label text-body-2">{{ label }}</span>
        </div>
      </div>
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
import type { ValidationResult } from '@echomind/engine';
import SectionCard from './SectionCard.vue';

defineProps<{
  isValidating: boolean;
  step: number;
  results: ValidationResult | null;
}>();

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
  0%, 100% { transform: scale(1);    opacity: 0.72; }
  50%       { transform: scale(1.05); opacity: 1;    }
}

/* ─── Step list ──────────────────────────────────── */
.step-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: 0;
}

/* vertical connector line */
.step-list::before {
  content: '';
  position: absolute;
  left: 11px;     /* center of 24px indicator */
  top: 22px;
  bottom: 22px;
  width: 2px;
  background: rgb(var(--v-theme-outline-variant));
  border-radius: 1px;
}

.step-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
  position: relative;
  transition: opacity 0.3s ease;
}

.is-pending {
  opacity: 0.4;
}

/* ─── Indicators ─────────────────────────────────── */
.indicator-wrap {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  background: rgb(var(--v-theme-surface));
}

.indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.indicator--complete {
  width: 24px;
  height: 24px;
  background: rgb(var(--v-theme-success));
}

.indicator--active {
  width: 12px;
  height: 12px;
  background: rgb(var(--v-theme-primary));
  position: relative;
  margin: 6px;
}

.indicator--pending {
  width: 8px;
  height: 8px;
  background: rgb(var(--v-theme-outline));
  border-radius: 50%;
  margin: 8px;
}

/* ─── Pulse rings ────────────────────────────────── */
.pulse-ring {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 2px solid rgb(var(--v-theme-primary));
  animation: pulse-out 1.8s ease-out infinite;
}

.pulse-ring--late {
  animation-delay: 0.9s;
}

@keyframes pulse-out {
  0%   { transform: scale(1);   opacity: 0.8; }
  100% { transform: scale(3.2); opacity: 0;   }
}

/* ─── Check pop-in ───────────────────────────────── */
.check-enter-active {
  animation: check-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes check-pop {
  from { transform: scale(0) rotate(-20deg); opacity: 0; }
  to   { transform: scale(1) rotate(0deg);   opacity: 1; }
}

/* ─── Labels ─────────────────────────────────────── */
.step-label {
  color: rgb(var(--v-theme-on-surface-variant));
  transition: color 0.3s ease, font-weight 0.3s ease;
}

.is-complete .step-label {
  color: rgb(var(--v-theme-success));
}

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
