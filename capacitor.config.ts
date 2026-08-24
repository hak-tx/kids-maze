import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.haktx.kidsmaze',
  appName: 'Kids Maze',
  webDir: 'dist',
  // Production: load bundled assets from dist/ (no live-reload server.url).
  // cleartext is mainly for Android HTTP; left false for App Store builds.
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
};

export default config;
