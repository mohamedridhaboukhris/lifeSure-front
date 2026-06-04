/*import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lifesure.app',
  appName: 'LifeSure',
  webDir: 'www/browser'
};

export default config;*/










import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lifesure.app',
  appName: 'LifeSure',
  webDir: 'www/browser',
  server: {
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;