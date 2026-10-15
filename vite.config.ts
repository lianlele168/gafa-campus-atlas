import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],build:{chunkSizeWarningLimit:1200,rollupOptions:{output:{manualChunks:{'three-engine':['three','@react-three/fiber','@react-three/drei']}}}}});
