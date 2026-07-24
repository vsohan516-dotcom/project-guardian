import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { APP_VERSION, APP_BUILD } from "@/lib/app-config";
import { checkForUpdate, type UpdateStatus } from "@/lib/update-check";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CyberTraffic Pro" },
      { name: "description", content: "App settings and updates." },
      { property: "og:title", content: "Settings" },
      { property: "og:description", content: "App settings and updates." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [status, setStatus] = useState<UpdateStatus | null>(null);
  const [checking, setChecking] = useState(false);

  async function check() {
    setChecking(true);
    const s = await checkForUpdate();
    setStatus(s);
    setChecking(false);
    if (s.state === "up-to-date") toast.success("You have the latest version.");
    else if (s.state === "update-available") toast.info("A new version is available.");
    else toast.warning(s.reason);
  }

  return (
    <AppShell title="Settings">
      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">App Version</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {APP_VERSION} (build {APP_BUILD})
        </p>
        <Button className="mt-3 w-full" onClick={check} disabled={checking}>
          {checking ? "Checking..." : "Check for updates"}
        </Button>

        {status?.state === "update-available" && (
          <div className="mt-3 rounded-md border border-primary bg-primary/5 p-3">
            <p className="text-sm font-medium text-foreground">
              New version: {status.info.latestVersion}
            </p>
            {status.info.notes && (
              <p className="mt-1 text-xs text-muted-foreground">{status.info.notes}</p>
            )}
            <a
              href={status.info.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm font-medium text-primary underline"
            >
              Download update
            </a>
          </div>
        )}
      </section>

      <section className="mt-4 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">About</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          CyberTraffic Pro is a citizen safety and incident reporting app. All external
          endpoints (police dispatch, update feed) are configured via environment
          variables — no government API is hardcoded.
        </p>
      </section>
    </AppShell>
  );
}
