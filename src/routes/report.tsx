import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { dispatchIncident, type IncidentPayload } from "@/lib/police-dispatch";
import { toast } from "sonner";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report Incident — CyberTraffic Pro" },
      { name: "description", content: "File a report to authorities." },
      { property: "og:title", content: "Report Incident" },
      { property: "og:description", content: "File a report to authorities." },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const [type, setType] = useState<IncidentPayload["type"]>("crime");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill title and description");
      return;
    }
    setSubmitting(true);
    const res = await dispatchIncident({
      type,
      title: title.trim(),
      description: description.trim(),
      reporterName: name.trim() || undefined,
      reporterPhone: phone.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
    setSubmitting(false);
    if (res.ok) {
      toast.success(`Report sent. Ref: ${res.referenceId}`);
      setTitle("");
      setDescription("");
    } else if (res.queued) {
      toast.warning("Saved locally. Will retry when online.");
    } else {
      toast.error(res.error);
    }
  }

  return (
    <AppShell title="Report Incident">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="type">Category</Label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as IncidentPayload["type"])}
            className="mt-1 w-full rounded-md border bg-background p-2 text-sm"
          >
            <option value="crime">Crime</option>
            <option value="cyber">Cyber Crime</option>
            <option value="traffic">Traffic Violation</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="name">Your Name (optional)</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </AppShell>
  );
}
