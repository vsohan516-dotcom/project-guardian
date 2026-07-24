/**
 * Runtime app config for CyberTraffic Pro.
 *
 * Every external endpoint (police dispatch, update feed) is READ from
 * environment / build-time config — never hardcoded to a real government
 * or police server. The user configures real URLs at deploy time.
 */

export const APP_VERSION = "1.0.0";
export const APP_BUILD = 1;

// Client-safe config via Vite env. Configure in .env or CI secrets.
// VITE_POLICE_DISPATCH_URL - HTTPS endpoint the app POSTs incident reports to.
// VITE_UPDATE_FEED_URL     - JSON feed describing the latest available version.
export const POLICE_DISPATCH_URL: string =
  (import.meta.env.VITE_POLICE_DISPATCH_URL as string | undefined) ?? "";

export const UPDATE_FEED_URL: string =
  (import.meta.env.VITE_UPDATE_FEED_URL as string | undefined) ?? "";

export function isConfigured(url: string): boolean {
  return typeof url === "string" && url.startsWith("http");
}
