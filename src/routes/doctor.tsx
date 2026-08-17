import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ClipboardList, Copy, Download, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DemoBadge, Disclaimer, PageShell } from "@/components/site/page";
import { useHealth } from "@/lib/health-store";

export const Route = createFileRoute("/doctor")({
  head: () => ({
    meta: [
      { title: "Prepare for Your Doctor Visit — MediNova AI" },
      { name: "description", content: "Turn your symptom journal, reports and medicines into a clear one-page summary plus smart questions to ask your doctor." },
      { property: "og:title", content: "Prepare for Your Doctor Visit — MediNova AI" },
      { property: "og:description", content: "Generate a consultation summary and question checklist from your recorded health data." },
    ],
  }),
  component: DoctorPrep,
});

const QUESTIONS = [
  "What could be causing these symptoms, and what would rule other causes out?",
  "Which tests do you recommend right now, and what will they tell us?",
  "Are any of my current medicines contributing to how I feel?",
  "What warning signs should make me come back urgently?",
  "How long should improvement take before I follow up?",
  "Are there lifestyle changes that would meaningfully help my case?",
  "Is there a lower-cost or generic alternative for anything you prescribe?",
];

function DoctorPrep() {
  const { symptoms, reports, activeProfile, activeProfileId, addTimeline } = useHealth();
  const [extra, setExtra] = useState("");
  const [checked, setChecked] = useState<string[]>([]);

  const mine = symptoms.filter((s) => s.profileId === activeProfileId);
  const myReports = reports.filter((r) => r.profileId === activeProfileId);

  const summary = useMemo(() => {
    const lines = [
      `PATIENT: ${activeProfile.name} · ${activeProfile.age}y · ${activeProfile.gender} · Blood group ${activeProfile.bloodGroup}`,
      `KNOWN CONDITIONS: ${activeProfile.conditions || "None reported"}`,
      `CURRENT MEDICATIONS: ${activeProfile.medications || "None reported"}`,
      `ALLERGIES: ${activeProfile.allergies || "None reported"}`,
      "",
      "MAIN CONCERN:",
      mine.length
        ? `${mine.at(-1)!.symptom} — recorded ${mine.length} time(s), latest severity ${mine.at(-1)!.severity}/10, duration ${mine.at(-1)!.duration}.`
        : "No symptoms recorded yet.",
      "",
      "SYMPTOM HISTORY:",
      ...(mine.length
        ? mine.map((s) => `• ${s.date} — ${s.symptom}, ${s.severity}/10, ${s.duration}${s.trigger ? `, possible trigger: ${s.trigger}` : ""}`)
        : ["• None recorded"]),
      "",
      "RECENT REPORTS:",
      ...(myReports.length ? myReports.map((r) => `• ${r.date} — ${r.title} (${r.type}): ${r.summary}`) : ["• None uploaded"]),
      "",
      "LIFESTYLE: " + (activeProfile.lifestyle || "Not specified"),
      extra ? `\nADDITIONAL NOTES:\n${extra}` : "",
      "",
      "Prepared with MediNova AI. This is a patient-recorded summary, not a diagnosis.",
    ];
    return lines.filter((l) => l !== undefined).join("\n");
  }, [activeProfile, mine, myReports, extra]);

  return (
    <PageShell
      title="Prepare for Your Doctor Visit"
      icon={<Stethoscope className="size-8 text-primary" />}
      subtitle="Walk in organised. MediNova turns everything you've recorded into a one-page summary and a question checklist."
      action={<DemoBadge />}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><ClipboardList className="size-4 text-primary" /> Consultation summary</CardTitle>
              <CardDescription>Auto-generated from your journal, reports and profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-xl border border-border/60 bg-muted/40 p-4 text-sm leading-relaxed">
                {summary}
              </pre>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    navigator.clipboard?.writeText(summary);
                    toast.success("Summary copied to clipboard");
                  }}
                >
                  <Copy className="mr-1 size-4" /> Copy summary
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([summary], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "medinova-doctor-summary.txt";
                    a.click();
                    URL.revokeObjectURL(url);
                    addTimeline({ date: new Date().toISOString().slice(0, 10), kind: "summary", title: "Doctor summary generated", detail: "Downloaded consultation summary" });
                    toast.success("Summary downloaded");
                  }}
                >
                  <Download className="mr-1 size-4" /> Download
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Anything else to mention?</CardTitle></CardHeader>
            <CardContent>
              <Label htmlFor="extra" className="sr-only">Additional notes</Label>
              <Textarea id="extra" rows={4} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Travel history, family history, new supplements, work stress…" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Smart questions to ask</CardTitle>
              <CardDescription>Tick the ones you want to remember.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {QUESTIONS.map((q) => {
                const on = checked.includes(q);
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setChecked(on ? checked.filter((x) => x !== q) : [...checked, q])}
                    className={`w-full rounded-xl border p-3 text-left text-sm transition-colors ${on ? "border-primary bg-primary/10" : "border-border/60 hover:bg-accent"}`}
                  >
                    <span className="mr-2">{on ? "✅" : "▫️"}</span>
                    {q}
                  </button>
                );
              })}
              <Separator className="my-2" />
              <Badge variant="secondary">{checked.length} selected</Badge>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Visit checklist</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Carry previous prescriptions and reports", "List every medicine and supplement with doses", "Note when symptoms started and what makes them worse", "Bring your insurance / hospital card", "Take someone with you if you may need support"].map((x) => (
                  <li key={x} className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />{x}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8"><Disclaimer /></div>
    </PageShell>
  );
}
