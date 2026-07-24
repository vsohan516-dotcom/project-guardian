import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor config for CyberTraffic Pro Android build.
 *
 * webDir is the folder Capacitor copies into the Android assets.
 * TanStack Start builds static client assets under `.output/public`.
 * The GitHub Actions workflow copies those into `www/` before `cap sync`,
 * so keep webDir = "www".
 */
const config: CapacitorConfig = {
  appId: "com.cybertraffic.pro",
  appName: "CyberTraffic Pro",
  webDir: "www",
  server: {
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
