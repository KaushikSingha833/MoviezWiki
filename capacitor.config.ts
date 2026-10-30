import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.moviezwiki.app",
  appName: "MoviezWiki",
  webDir: "public",
  server: {
    url: "https://moviez-wiki.vercel.app",
    cleartext: true,
    androidScheme: "https"
  },
  android: {
    backgroundColor: "#050505",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;
