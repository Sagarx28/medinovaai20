import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bot,
  CalendarClock,
  FileText,
  HeartPulse,
  Pill,
  Scale,
  Siren,
  Stethoscope,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DemoBadge, Disclaimer, PageShell } from "@/components/site/page";
import { greeting, useHealth } from "@/lib/health-store";
import { HEALTH_SCORE } from "@/lib/health-data";
import { bmi, bmiCategory } from "@/lib/health-ai";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Health Dashboard — MediNova AI" },
      { name: "description", content: "Your wellness score, recent symptoms, reports, trends, goals and reminders in one personalised health dashboard." },
      { property: "og:title", content: "Health Dashboard — MediNova AI" },
      { property: "og:description", content: "A personalised health workspace with wellness score, trends, goals and reminders." },
    ],
  }),
  component: Dashboard,
});

const QUICK = [
  { to: "/symptom-checker", label: "Check Symptoms", icon: Stethoscope },
  { to: "/assistant", label: "Ask AI", icon: Bot },
  { to: "/reports", label: "Analyze Report", icon: FileText },
  { to: "/medicines", label: "Medicine Info", icon: Pill },
  { to: "/health", label: "Health Trends", icon: TrendingUp },
  { to: "/doctor", label: "Prepare for Doctor", icon: UserRound },
  { to: "/profile", label: "Health Score", icon: HeartPulse },
  { to: "/emergency", label: "Emergency", icon: Siren },
] as const;

function Dashboard() {
  const { userName, profiles, activeProfileId, set, activeProfile, symptoms, reports, goals, reminders, metrics, timeline } =
    useHealth();

  const mySymptoms = symptoms.filter((s) => s.profileId === activeProfileId).slice(-5).reverse();
  const myReports = reports.filter((r) => r.profileId === activeProfileId).slice(-3).reverse();
  const myGoals = goals.filter((g) => g.profileId === activeProfileId);
  const myReminders = reminders.filter((r) => r.profileId === activeProfileId && !r.done).slice(0, 4);
  const bmiValue = bmi(activeProfile.weightKg, activeProfile.heightCm);

  const severityData = symptoms
    .filter((s) => s.profileId === activeProfileId)
    .map((s) => ({ date: s.date.slice(5), severity: s.severity }));

  return (
    <PageShell
      title={`${greeting()}, ${userName} 👋`}
      subtitle="Here's a snapshot of your health workspace. Everything below is a wellness estimate, not a diagnosis."
      action={
        <div className="flex items-center gap-2">
          <DemoBadge />
          <Select value={activeProfileId} onValueChange={(v) => set("activeProfileId", v)}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {profiles.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.relation === "Me" ? "My Health" : `Family · ${p.name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 bg-gradient-card">
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="size-5 text-primary" /> AI Health & Wellness Score
              </CardTitle>
              <CardDescription>A wellness estimate from your logged habits — not a medical diagnosis.</CardDescription>
            </div>
            <div className="text-right">
              <p className="font-display text-4xl font-bold text-gradient">{HEALTH_SCORE.total}</p>
              <p className="text-xs text-muted-foreground">out of 100</p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {HEALTH_SCORE.breakdown.map((b) => (
              <div key={b.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-muted-foreground">{b.label}</span>
                  <span className="font-semibold">{b.value}</span>
                </div>
                <Progress value={b.value} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Scale className="size-4 text-primary" /> BMI estimate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-bold">{bmiValue}</p>
            <p className="mt-1 text-sm text-muted-foreground">{bmiCategory(bmiValue)}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              Based on {activeProfile.heightCm} cm and {activeProfile.weightKg} kg. BMI is a rough screening estimate and
              does not account for muscle mass or body composition.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link to="/profile">Open calculators</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK.map((q) => (
          <Button key={q.to} asChild variant="outline" className="h-auto justify-start gap-3 py-4">
            <Link to={q.to}>
              <q.icon className="size-4 text-primary" />
              {q.label}
            </Link>
          </Button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Symptom severity trend</CardTitle>
            <CardDescription>Recorded severity over your recent journal entries.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={severityData}>
                <defs>
                  <linearGradient id="sev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="severity" stroke="var(--color-chart-1)" fill="url(#sev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Recent symptoms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mySymptoms.length === 0 && <p className="text-sm text-muted-foreground">No symptoms recorded yet.</p>}
            {mySymptoms.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{s.symptom}</p>
                  <p className="text-xs text-muted-foreground">{s.date} · {s.duration}</p>
                </div>
                <Badge variant={s.severity >= 7 ? "destructive" : "secondary"}>{s.severity}/10</Badge>
              </div>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/health">Open symptom journal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Recent reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myReports.map((r) => (
              <div key={r.id} className="rounded-xl border border-border/60 p-3">
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.date} · {r.values.length} values</p>
              </div>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/reports">Open reports</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="size-4 text-primary" /> Active goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myGoals.map((g) => (
              <div key={g.id}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span>{g.title}</span>
                  <span className="text-muted-foreground">
                    {g.current}/{g.target} {g.unit}
                  </span>
                </div>
                <Progress value={Math.min(100, (g.current / g.target) * 100)} />
                <p className="mt-1 text-xs text-muted-foreground">🔥 {g.streak}-day streak — keep going at your own pace.</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="size-4 text-primary" /> Upcoming reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myReminders.map((r) => (
              <div key={r.id} className="rounded-xl border border-border/60 p-3">
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.category} · {r.date}</p>
              </div>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/health">Manage reminders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Sleep & hydration (14 days)</CardTitle>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.map((m) => ({ ...m, date: m.date.slice(5) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="sleepHrs" name="Sleep (hrs)" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="waterL" name="Water (L)" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Recent activity timeline</CardTitle>
            <CardDescription>Your personal health timeline.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeline.slice(-5).reverse().map((t) => (
              <div key={t.id} className="flex gap-3">
                <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
                <div>
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.date} · {t.detail}</p>
                </div>
              </div>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/health">View full timeline</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Disclaimer />
      </div>
    </PageShell>
  );
}
