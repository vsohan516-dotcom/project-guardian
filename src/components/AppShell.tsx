import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home, Siren, FileWarning, Car, Bell, Settings } from "lucide-react";

type NavItem = {
  to: "/" | "/emergency" | "/report" | "/traffic" | "/notifications" | "/settings";
  label: string;
  icon: typeof Home;
};

const NAV: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/emergency", label: "SOS", icon: Siren },
  { to: "/report", label: "Report", icon: FileWarning },
  { to: "/traffic", label: "Traffic", icon: Car },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-card">
        <ul className="mx-auto flex max-w-2xl items-stretch justify-between">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex flex-col items-center gap-1 py-2 text-[11px] text-muted-foreground transition-colors"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: to === "/" }}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
