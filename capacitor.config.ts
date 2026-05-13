import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mmmiles.admin',
  appName: 'MM Miles Admin',
  webDir: 'out',
  server: {
    url: 'https://adminpanel-beige.vercel.app',
    cleartext: true
  }
};

export default config;
