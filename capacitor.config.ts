import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glambook.app',
  appName: 'GlamBook',
  webDir: 'dist',
  server: { androidScheme: 'https' }
};

export default config;
