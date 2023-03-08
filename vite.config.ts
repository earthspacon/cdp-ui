import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react({ babel: { plugins: ['effector/babel-plugin'] } }),
    viteTsconfigPaths(),
    checker({ typescript: true }),
  ],
});
