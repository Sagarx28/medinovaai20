import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  Bot,
  CheckCircle2,
  Eye,
  Loader2,
  Mic,
  PhoneCall,
  RotateCcw,
  Save,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { DemoBadge, Disclaimer, PageShell } from "@/components/site/page";
import { analyzeSymptoms, detectEmergency, extractSignals, FOLLOW_UPS, RISK_META, type Analysis } from "@/lib/health-ai";
import { useHealth } from "@/lib/health-store";

export const Route = createFileRoute("/symptom-checker")({
  head: () => ({
    meta: [
      { title: "AI Symptom Checker — MediNova AI" },
      { name: "description", content: "Describe your symptoms naturally, answer smart follow-up questions and get a risk triage plus a clear what-to-do-next plan." },
      { property: "og:title", content: "AI Symptom Checker — MediNova AI" },
      { property: "og:description", content: "Step-by-step AI symptom assessment with risk triage and safe next steps." },
    ],
  }),
  component: SymptomChecker,
});

const EXAMPLES = [
  "I have fever, headache and body pain since yesterday.",
  "Mujhe do din se sir dard aur thakan ho rahi hai.",
  "Stomach pain since last night and I'm feeling nauseous.",
];

function SymptomChecker() {
  const { addSymptom, language } = useHealth();
  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState("2 days");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [listening, setListening] = useState(false);

  const emergency = detectEmergency(text);
  const signals = text ? extractSignals(text, severity, duration) : null;

  const runAnalysis = () => {
    setLoading(true);
    setStep(2);
    window.setTimeout(() => {
      setAnalysis(analyzeSymptoms(text, severity, duration));
      setLoading(false);
    }, 1400);
  };

  const voice = () => {
    setListening(true);
    window.setTimeout(() => {
      setListening(false);
      setText((t) => (t ? t : "I have stomach pain since last night and I'm feeling nauseous."));
      toast.success("Voice captured (demo)", { description: "Speech was transcribed into the symptom box." });
    }, 1600);
  };

  const reset = () => {
    setStep(0);
    setText("");
    setAnalysis(null);
    setAnswers({});
  };

  return (
    <PageShell
      title="AI Symptom Checker"
      icon={<Stethoscope className="size-8 text-primary" />}
      subtitle="Describe how you feel in your own words — English, हिंदी or Hinglish. The assistant asks follow-up questions before showing anything."
      action={<DemoBadge />}
    >
      <Progress value={((step + 1) / 3) * 100} className="mb-8" />

      {emergency && step < 2 && <EmergencyBanner />}

      {step === 0 && (
        <Card className="border-border/60 bg-gradient-card">
          <CardHeader>
            <CardTitle>Step 1 · Tell us what you're feeling</CardTitle>
            <CardDescription>Include what hurts, when it started and anything that makes it better or worse.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="relative">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                placeholder="e.g. I have fever, headache and body pain since yesterday…"
                aria-label="Describe your symptoms"
              />
              <Button
                type="button"
                variant={listening ? "destructive" : "secondary"}
                size="sm"
                className="absolute bottom-3 right-3"
                onClick={voice}
              >
                {listening ? <Loader2 className="mr-1 size-4 animate-spin" /> : <Mic className="mr-1 size-4" />}
                {listening ? "Listening…" : "Voice input"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((e) => (
                <Button key={e} variant="outline" size="sm" onClick={() => setText(e)}>
                  {e.length > 46 ? `${e.slice(0, 46)}…` : e}
                </Button>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Overall severity: {severity}/10</Label>
                <Slider className="mt-3" value={[severity]} min={1} max={10} step={1} onValueChange={(v) => setSeverity(v[0] ?? 5)} />
              </div>
              <div>
                <Label htmlFor="dur">How long has this lasted?</Label>
                <Input id="dur" className="mt-2" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
            </div>

            {signals && text.length > 4 && (
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <p className="text-sm font-semibold">What the assistant understood</p>
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <p>Symptoms: <span className="text-foreground">{signals.symptoms.join(", ")}</span></p>
                  <p>Location: <span className="text-foreground">{signals.location}</span></p>
                  <p>Duration: <span className="text-foreground">{signals.duration}</span></p>
                  <p>Frequency: <span className="text-foreground">{signals.frequency}</span></p>
                </div>
              </div>
            )}

            <Button disabled={text.trim().length < 4} onClick={() => setStep(1)} size="lg">
              Continue to follow-up questions <ArrowRight className="ml-1 size-4" />
            </Button>
            <p className="text-xs text-muted-foreground">Language: {language === "hi" ? "हिंदी" : language === "hinglish" ? "Hinglish" : "English"} · change it in the navbar.</p>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Step 2 · A few follow-up questions</CardTitle>
            <CardDescription>These help narrow things down. There is no diagnosis at this stage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {FOLLOW_UPS.map((f) => (
              <div key={f.id}>
                <p className="mb-2 font-medium">{f.q}</p>
                <div className="flex flex-wrap gap-2">
                  {f.options.map((o) => (
                    <Button
                      key={o}
                      size="sm"
                      variant={answers[f.id] === o ? "default" : "outline"}
                      onClick={() => setAnswers((a) => ({ ...a, [f.id]: o }))}
                    >
                      {o}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <p className="mb-2 font-medium">Rate your pain or discomfort from 1–10</p>
              <Slider value={[severity]} min={1} max={10} step={1} onValueChange={(v) => setSeverity(v[0] ?? 5)} />
              <p className="mt-2 text-sm text-muted-foreground">Current: {severity}/10</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={runAnalysis} size="lg">
                <Bot className="mr-1 size-4" /> Analyze my symptoms
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {loading && (
            <Card className="border-border/60">
              <CardContent className="space-y-4 pt-6">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin text-primary" /> AI is reviewing your symptoms, duration and answers…
                </p>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          )}

          {analysis && (
            <>
              {analysis.risk === "emergency" && <EmergencyBanner />}

              <Card className={`border ${RISK_META[analysis.risk].className}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {RISK_META[analysis.risk].emoji} Smart Risk Triage — {RISK_META[analysis.risk].label}
                  </CardTitle>
                  <CardDescription className="text-current/80">Why did the AI assign this risk level?</CardDescription>
                </CardHeader>
                <CardContent><p className="text-sm">{analysis.riskReason}</p></CardContent>
              </Card>

              <section>
                <h2 className="font-display text-2xl font-bold">Possible health concerns</h2>
                <p className="mt-1 text-muted-foreground">
                  Your symptoms may be associated with the following. These are possibilities to discuss — not confirmed conditions.
                </p>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  {analysis.concerns.map((c) => (
                    <Card key={c.name} className="border-border/60 bg-gradient-card">
                      <CardHeader>
                        <CardTitle className="text-base">{c.name}</CardTitle>
                        <CardDescription>{c.why}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium">Matching symptoms</p>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {(c.matching.length ? c.matching : ["General discomfort"]).map((m) => (
                              <Badge key={m} variant="secondary">{m}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Missing information</p>
                          <ul className="mt-1 list-inside list-disc text-muted-foreground">
                            {c.missing.map((m) => <li key={m}>{m}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-destructive">Important warning signs</p>
                          <ul className="mt-1 list-inside list-disc text-muted-foreground">
                            {c.warning.map((m) => <li key={m}>{m}</li>)}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold">What should I do now?</h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <PlanCard title="Do now" icon={CheckCircle2} tone="success" items={analysis.plan.doNow} />
                  <PlanCard title="Monitor" icon={Eye} tone="primary" items={analysis.plan.monitor} />
                  <PlanCard title="Avoid" icon={Ban} tone="muted" items={analysis.plan.avoid} />
                  <PlanCard title="Contact a doctor if" icon={PhoneCall} tone="warning" items={analysis.plan.contactDoctorIf} />
                  <PlanCard title="Seek urgent medical care if" icon={AlertTriangle} tone="destructive" items={analysis.plan.urgentIf} />
                </div>
              </section>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    addSymptom({
                      date: new Date().toISOString().slice(0, 10),
                      symptom: extractSignals(text, severity, duration).symptoms[0] ?? "Symptom",
                      severity,
                      duration,
                      notes: text,
                    });
                    toast.success("Saved to your symptom journal");
                  }}
                >
                  <Save className="mr-1 size-4" /> Save to Symptom Journal
                </Button>
                <Button asChild variant="secondary"><Link to="/doctor">Prepare for doctor visit</Link></Button>
                <Button asChild variant="outline"><Link to="/health">Track health trend</Link></Button>
                <Button variant="ghost" onClick={reset}><RotateCcw className="mr-1 size-4" /> Start over</Button>
              </div>

              <Disclaimer />
            </>
          )}
        </div>
      )}
    </PageShell>
  );
}

function EmergencyBanner() {
  return (
    <Card className="mb-6 border-destructive bg-destructive text-destructive-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🚨 Possible medical emergency</CardTitle>
        <CardDescription className="text-destructive-foreground/90">
          You described symptoms that can be life-threatening. Please seek immediate professional emergency medical care —
          do not wait for an AI assessment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="secondary"><Link to="/emergency">Open Emergency Mode</Link></Button>
      </CardContent>
    </Card>
  );
}

const TONES: Record<string, string> = {
  success: "border-success/30 bg-success/8",
  primary: "border-primary/30 bg-primary/8",
  muted: "border-border bg-muted/40",
  warning: "border-warning/40 bg-warning/10",
  destructive: "border-destructive/35 bg-destructive/8",
};

function PlanCard({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string;
  items: string[];
  icon: typeof CheckCircle2;
  tone: keyof typeof TONES;
}) {
  return (
    <Card className={TONES[tone]}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="size-4" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {items.map((i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-current opacity-50" aria-hidden />
              {i}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
