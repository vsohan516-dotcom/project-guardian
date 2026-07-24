import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Bell } from "lucide-react";
import { getPendingCount, flushQueue } from "@/lib/police-dispatch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Alerts — CyberTraffic Pro" },
      { name: "description", content: "Local alerts and queued reports." },
      { property: "og:title", content: "Alerts" },
      { property: "og:description", content: "Local alerts and queued reports." },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  const [pending, setPending] = useState(0);
  const [flushing, setFlushing] = useState(false);

  useEffect(() => {
    setPending(getPendingCount());
  }, []);

  async function retry() {
    setFlushing(true);
    const n = await flushQueue();
    setFlushing(false);
    setPending(getPendingCount());
    if (n > 0) toast.success(`Sent ${n} pending report(s)`);
    else toast.info("Nothing sent. Check your connection or config.");
  }

  return (
    <AppShell title="Alerts">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-primary" aria-hidden />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Pending reports</p>
            <p className="text-xs text-muted-foreground">
              {pending} report(s) waiting to be sent.
            </p>
          </div>
        </div>
        <Button
          className="mt-3 w-full"
          onClick={retry}
          disabled={flushing || pending === 0}
        >
          {flushing ? "Retrying..." : "Retry now"}
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Push alerts require a configured notification service.
      </p>
    </AppShell>
  );
}
