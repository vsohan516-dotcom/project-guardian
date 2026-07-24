import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { dispatchIncident } from "@/lib/police-dispatch";
import { toast } from "sonner";

export const Route = createFileRoute("/traffic")({
  head: () => ({
    meta: [
      { title: "Traffic Complaint — CyberTraffic Pro" },
      { name: "description", content: "Report traffic violations with vehicle details." },
      { property: "og:title", content: "Traffic Complaint" },
      { property: "og:description", content: "Report traffic violations." },
    ],
  }),
  component: TrafficPage,
});

function TrafficPage() {
  const [vehicle, setVehicle] = useState("");
  const [violation, setViolation] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicle.trim() || !violation.trim()) {
      toast.error("Vehicle number and violation type are required");
      return;
    }
    setBusy(true);
    const res = await dispatchIncident({
      type: "traffic",
      title: `${violation} — ${vehicle.toUpperCase()}`,
      description: `Location: ${location || "N/A"}\n\n${details}`,
      createdAt: new Date().toISOString(),
    });
    setBusy(false);
    if (res.ok) {
      toast.success(`Complaint filed. Ref: ${res.referenceId}`);
      setVehicle("");
      setViolation("");
      setLocation("");
      setDetails("");
    } else if (res.queued) toast.warning("Saved locally. Will retry when online.");
    else toast.error(res.error);
  }

  return (
    <AppShell title="Traffic Complaint">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="vehicle">Vehicle Number</Label>
          <Input
            id="vehicle"
            placeholder="e.g. MH12AB1234"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="violation">Violation Type</Label>
          <Input
            id="violation"
            placeholder="Signal jump / Wrong side / etc."
            value={violation}
            onChange={(e) => setViolation(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="details">Details</Label>
          <Textarea
            id="details"
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Submitting..." : "File Complaint"}
        </Button>
      </form>
    </AppShell>
  );
}
