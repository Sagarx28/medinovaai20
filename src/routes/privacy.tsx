import { createFileRoute } from "@tanstack/react-router";
import { Download, Lock, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclaimer, PageShell } from "@/components/site/page";
import { useHealth } from "@/lib/health-store";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Center — Your Health Data Control | MediNova AI" },
      { name: "description", content: "See exactly what MediNova AI stores, export your health data as JSON, and delete everything from this device at any time." },
      { property: "og:title", content: "Privacy Center — MediNova AI" },
      { property: "og:description", content: "Transparent data practices, one-click export and full deletion control." },
    ],
  }),
  component: Privacy,
});

const PRINCIPLES = [
  { title: "Local-first in demo mode", body: "All your entries stay in this browser's local storage. Nothing is sent to a medical server." },
  { title: "No selling, ever", body: "Your health data is never sold, rented or shared with advertisers or insurers." },
  { title: "You can leave clean", body: "One click erases every symptom, report, goal and conversation from this device." },
  { title: "Explainability by default", body: "Every AI output shows what it matched on, so you are never asked to trust a black box." },
];

function Privacy() {
  const state = useHealth();

  return (
    <PageShell
      title="Privacy Center"
      icon={<ShieldCheck className="size-8 text-primary" />}
      subtitle="Health data is deeply personal. You stay in control of every record MediNova holds."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <Card key={p.title} className="border-border/60">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Lock className="size-4 text-primary" /> {p.title}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{p.body}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-border/60">
        <CardHeader>
          <CardTitle className="text-base">What is stored</CardTitle>
          <CardDescription>A live count of everything currently saved on this device.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Profiles", state.profiles.length],
            ["Symptoms", state.symptoms.length],
            ["Reports", state.reports.length],
            ["Goals", state.goals.length],
            ["Reminders", state.reminders.length],
            ["Chat messages", state.chat.length],
          ].map(([label, n]) => (
            <div key={String(label)} className="rounded-xl border border-border/60 p-4">
              <p className="font-display text-2xl font-bold">{n as number}</p>
              <p className="text-xs text-muted-foreground">{label as string}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6 border-border/60">
        <CardHeader><CardTitle className="text-base">Your controls</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              const blob = new Blob([JSON.stringify({ profiles: state.profiles, symptoms: state.symptoms, reports: state.reports, goals: state.goals, reminders: state.reminders, timeline: state.timeline }, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "medinova-my-data.json";
              a.click();
              URL.revokeObjectURL(url);
              toast.success("Data exported");
            }}
          >
            <Download className="mr-1 size-4" /> Export my data (JSON)
          </Button>
          <Button variant="destructive" onClick={() => { state.reset(); toast.success("All health data cleared from this device"); }}>
            <Trash2 className="mr-1 size-4" /> Delete all my data
          </Button>
        </CardContent>
      </Card>

      <div className="mt-8"><Disclaimer /></div>
    </PageShell>
  );
}
