import { createFileRoute, Link } from "@tanstack/react-router";
import { Siren, FileWarning, Car, Bell, Shield, Settings as SettingsIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CyberTraffic Pro — Citizen Safety App" },
      {
        name: "description",
        content:
          "Report incidents, contact emergency services, and stay informed about traffic and cyber safety.",
      },
      { property: "og:title", content: "CyberTraffic Pro" },
      { property: "og:description", content: "Citizen safety and incident reporting." },
    ],
  }),
  component: Home,
});

const TILES = [
  { to: "/emergency", label: "Emergency SOS", icon: Siren, tone: "bg-destructive text-destructive-foreground" },
  { to: "/report", label: "Report Incident", icon: FileWarning, tone: "bg-primary text-primary-foreground" },
  { to: "/traffic", label: "Traffic Complaint", icon: Car, tone: "bg-secondary text-secondary-foreground" },
  { to: "/notifications", label: "Alerts & Updates", icon: Bell, tone: "bg-accent text-accent-foreground" },
  { to: "/settings", label: "App Settings", icon: SettingsIcon, tone: "bg-muted text-foreground" },
] as const;

function Home() {
  return (
    <AppShell title="CyberTraffic Pro">
      <div className="mb-4 flex items-center gap-3 rounded-lg border bg-card p-4">
        <Shield className="h-8 w-8 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-medium text-foreground">Citizen Safety Portal</p>
          <p className="text-xs text-muted-foreground">
            Report, track, and stay informed.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {TILES.map(({ to, label, icon: Icon, tone }) => (
          <Link
            key={to}
            to={to}
            className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-xl p-4 shadow-sm transition-transform active:scale-95 ${tone}`}
          >
            <Icon className="h-8 w-8" aria-hidden />
            <span className="text-center text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
