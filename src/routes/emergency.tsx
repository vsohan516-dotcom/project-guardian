import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Siren, Phone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { dispatchIncident } from "@/lib/police-dispatch";
import { toast } from "sonner";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency SOS — CyberTraffic Pro" },
      { name: "description", content: "Send emergency alert with your location." },
      { property: "og:title", content: "Emergency SOS" },
      { property: "og:description", content: "Send emergency alert with location." },
    ],
  }),
  component: EmergencyPage,
});

const HOTLINES = [
  { label: "Police", number: "100" },
  { label: "Ambulance", number: "108" },
  { label: "Fire", number: "101" },
  { label: "Women Helpline", number: "1091" },
  { label: "Cyber Crime", number: "1930" },
];

function EmergencyPage() {
  const [sending, setSending] = useState(false);

  async function sendSOS() {
    setSending(true);
    let location: { lat: number; lng: number } | null = null;
    try {
      location = await new Promise((resolve) => {
        if (!("geolocation" in navigator)) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => resolve(null),
          { timeout: 5000 },
        );
      });
    } catch {
      location = null;
    }

    const res = await dispatchIncident({
      type: "emergency",
      title: "SOS Alert",
      description: "User triggered emergency SOS from mobile app.",
      location,
      createdAt: new Date().toISOString(),
    });
    setSending(false);
    if (res.ok) toast.success(`SOS sent. Ref: ${res.referenceId}`);
    else if (res.queued) toast.warning("Saved locally. Will retry when online.");
    else toast.error(res.error);
  }

  return (
    <AppShell title="Emergency SOS">
      <div className="rounded-xl border bg-destructive/10 p-4 text-center">
        <Siren className="mx-auto h-12 w-12 text-destructive" aria-hidden />
        <p className="mt-2 text-sm text-foreground">
          Tap the button below to send an SOS with your current location to authorities.
        </p>
        <Button
          size="lg"
          variant="destructive"
          className="mt-4 h-16 w-full text-lg"
          onClick={sendSOS}
          disabled={sending}
        >
          {sending ? "Sending..." : "SEND SOS NOW"}
        </Button>
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-foreground">Quick Dial</h2>
        <ul className="space-y-2">
          {HOTLINES.map((h) => (
            <li key={h.number}>
              <a
                href={`tel:${h.number}`}
                className="flex items-center justify-between rounded-lg border bg-card p-3"
              >
                <span className="text-sm font-medium text-foreground">{h.label}</span>
                <span className="flex items-center gap-1 text-sm text-primary">
                  <Phone className="h-4 w-4" aria-hidden /> {h.number}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
