import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      vue(),
      vuetify({ autoImport: true }),
    ],
    assetsInclude: ['**/*.md'],
    server: {
      port: 5173,
      proxy: {
        '/api/llm': {
          target: env['ECHOMIND_LLM_BASE_URL'] ?? 'http://localhost:9999',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/llm/, ''),
          headers: {
            Authorization: `Bearer ${env['ECHOMIND_LLM_API_KEY'] ?? ''}`,
          },
        },
      },
    },
  };
});
