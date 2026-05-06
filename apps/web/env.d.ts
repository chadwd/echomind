/// <reference types="vite/client" />

// CSS-only side-effect imports — no type declarations exist for these packages.
// Declaring them as modules suppresses TS2882 while keeping strict mode enabled.
declare module 'vuetify/styles' {}
declare module '@mdi/font/css/materialdesignicons.css' {}
