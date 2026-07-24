import { POLICE_DISPATCH_URL, isConfigured } from "./app-config";

export type IncidentPayload = {
  type: "traffic" | "crime" | "emergency" | "cyber";
  title: string;
  description: string;
  location?: { lat: number; lng: number } | null;
  reporterName?: string;
  reporterPhone?: string;
  attachments?: string[];
  createdAt: string;
};

export type DispatchResult =
  | { ok: true; referenceId: string }
  | { ok: false; error: string; queued: boolean };

const QUEUE_KEY = "ctp:pending-dispatch";

function loadQueue(): IncidentPayload[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as IncidentPayload[]) : [];
  } catch {
    return [];
  }
}

function saveQueue(items: IncidentPayload[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

export function getPendingCount(): number {
  return loadQueue().length;
}

/**
 * Send an incident to the configured police dispatch endpoint.
 * If not configured or offline, queue locally for later retry.
 */
export async function dispatchIncident(payload: IncidentPayload): Promise<DispatchResult> {
  if (!isConfigured(POLICE_DISPATCH_URL)) {
    const q = loadQueue();
    q.push(payload);
    saveQueue(q);
    return {
      ok: false,
      error: "Dispatch endpoint not configured. Saved locally.",
      queued: true,
    };
  }

  try {
    const res = await fetch(POLICE_DISPATCH_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const q = loadQueue();
      q.push(payload);
      saveQueue(q);
      return { ok: false, error: `HTTP ${res.status}`, queued: true };
    }
    const data = (await res.json().catch(() => ({}))) as { referenceId?: string };
    return { ok: true, referenceId: data.referenceId ?? crypto.randomUUID() };
  } catch (err) {
    const q = loadQueue();
    q.push(payload);
    saveQueue(q);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Network error",
      queued: true,
    };
  }
}

/** Retry all locally-queued dispatches. Returns number successfully sent. */
export async function flushQueue(): Promise<number> {
  if (!isConfigured(POLICE_DISPATCH_URL)) return 0;
  const q = loadQueue();
  if (q.length === 0) return 0;
  const remaining: IncidentPayload[] = [];
  let sent = 0;
  for (const item of q) {
    try {
      const res = await fetch(POLICE_DISPATCH_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) sent += 1;
      else remaining.push(item);
    } catch {
      remaining.push(item);
    }
  }
  saveQueue(remaining);
  return sent;
}
