import { APP_BUILD, APP_VERSION, UPDATE_FEED_URL, isConfigured } from "./app-config";

export type UpdateInfo = {
  latestVersion: string;
  latestBuild: number;
  downloadUrl: string;
  notes?: string;
  mandatory?: boolean;
};

export type UpdateStatus =
  | { state: "unknown"; reason: string }
  | { state: "up-to-date"; current: string }
  | { state: "update-available"; current: string; info: UpdateInfo };

export async function checkForUpdate(): Promise<UpdateStatus> {
  if (!isConfigured(UPDATE_FEED_URL)) {
    return { state: "unknown", reason: "Update feed not configured" };
  }
  try {
    const res = await fetch(UPDATE_FEED_URL, { cache: "no-store" });
    if (!res.ok) return { state: "unknown", reason: `HTTP ${res.status}` };
    const info = (await res.json()) as UpdateInfo;
    if (
      typeof info?.latestBuild === "number" &&
      info.latestBuild > APP_BUILD &&
      typeof info.downloadUrl === "string"
    ) {
      return { state: "update-available", current: APP_VERSION, info };
    }
    return { state: "up-to-date", current: APP_VERSION };
  } catch (err) {
    return {
      state: "unknown",
      reason: err instanceof Error ? err.message : "Network error",
    };
  }
}
