import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import App from './App.vue';

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  defaults: {
    VBtn: { style: 'text-transform: none; letter-spacing: 0;' },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary:                    '#7A4F81',
          'on-primary':               '#FFFFFF',
          'primary-container':        '#FDD6FF',
          'on-primary-container':     '#603768',
          secondary:                  '#6B596C',
          'on-secondary':             '#FFFFFF',
          'secondary-container':      '#F3DBF2',
          error:                      '#BA1A1A',
          'on-error':                 '#FFFFFF',
          'error-container':          '#FFDAD6',
          background:                 '#FFF7FA',
          'on-background':            '#1F1A1F',
          surface:                    '#FFF7FA',
          'on-surface':               '#1F1A1F',
          'surface-variant':          '#ECDFE9',
          'on-surface-variant':       '#4D444C',
          outline:                    '#7E747D',
          'outline-variant':          '#CFC3CD',
          'inverse-surface':          '#342F34',
          'inverse-on-surface':       '#F9EEF5',
          'inverse-primary':          '#E9B5EF',
          'surface-container-lowest': '#FFFFFF',
          'surface-container-low':    '#FCF1F8',
          'surface-container':        '#F6EBF2',
          'surface-container-high':   '#F0E5EC',
          'surface-container-highest':'#EAE0E7',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary:                    '#E9B5EF',
          'on-primary':               '#472150',
          'primary-container':        '#603768',
          'on-primary-container':     '#FDD6FF',
          secondary:                  '#D6C0D6',
          'on-secondary':             '#3B2B3C',
          'secondary-container':      '#524153',
          error:                      '#FFB4AB',
          'on-error':                 '#690005',
          'error-container':          '#93000A',
          background:                 '#171217',
          'on-background':            '#EAE0E7',
          surface:                    '#171217',
          'on-surface':               '#EAE0E7',
          'surface-variant':          '#4D444C',
          'on-surface-variant':       '#CFC3CD',
          outline:                    '#988D97',
          'outline-variant':          '#4D444C',
          'inverse-surface':          '#EAE0E7',
          'inverse-on-surface':       '#342F34',
          'inverse-primary':          '#7A4F81',
          'surface-container-lowest': '#110D11',
          'surface-container-low':    '#1F1A1F',
          'surface-container':        '#231E23',
          'surface-container-high':   '#2E282E',
          'surface-container-highest':'#393338',
        },
      },
    },
  },
});

createApp(App).use(vuetify).mount('#app');
