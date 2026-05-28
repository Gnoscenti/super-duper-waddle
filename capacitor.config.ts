import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agentos.listingcopy',
  appName: 'AgentOS Listing Copy',
  webDir: 'out',
  server: {
    // Use this for local dev with live reload
    // url: 'http://192.168.1.x:3000',
    // cleartext: true,
  },
  android: {
    buildOptions: {},
  },
  ios: {
    scheme: 'AgentOSListingCopy',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a2e',
      showSpinner: true,
      spinnerColor: '#6366f1',
    },
    StatusBar: {
      style: 'DARK',
    },
  },
};

export default config;
