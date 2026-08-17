import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  Bell,
  CalendarClock,
  Droplets,
  Footprints,
  Moon,
  Plus,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DemoBadge, Disclaimer, PageShell } from "@/components/site/page";
import { useHealth } from "@/lib/health-store";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "Health Tracking, Journal & Trends — MediNova AI" },
      { name: "description", content: "Log symptoms, track sleep, water, steps and weight, set health goals, manage preventive reminders and view your personal health timeline." },
      { property: "og:title", content: "Health Tracking, Journal & Trends — MediNova AI" },
      { property: "og:description", content: "Symptom journal, wellness tracking charts, goals, reminders and a filterable health timeline." },
    ],
  }),
  component: Health,
});

function Health() {
  return (
    <PageShell
      title="Health Tracking & Trends"
      icon={<TrendingUp className="size-8 text-primary" />}
      subtitle="Your journal, wellness metrics, goals, reminders and timeline — all scoped to the active profile."
      action={<DemoBadge />}
    >
      <Tabs defaultValue="journal">
        <TabsList className="flex-wrap">
          <TabsTrigger value="journal">Symptom Journal</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="mt-6"><Journal /></TabsContent>
        <TabsContent value="trends" className="mt-6"><Trends /></TabsContent>
        <TabsContent value="tracking" className="mt-6"><Tracking /></TabsContent>
        <TabsContent value="goals" className="mt-6"><Goals /></TabsContent>
        <TabsContent value="reminders" className="mt-6"><Reminders /></TabsContent>
        <TabsContent value="timeline" className="mt-6"><Timeline /></TabsContent>
      </Tabs>

      <div className="mt-8"><Disclaimer /></div>
    </PageShell>
  );
}

function Journal() {
  const { symptoms, activeProfileId, addSymptom } = useHealth();
  const mine = symptoms.filter((s) => s.profileId === activeProfileId);
  const [form, setForm] = useState({ symptom: "", date: new Date().toISOString().slice(0, 10), severity: 5, duration: "", trigger: "", notes: "" });

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">Record a symptom</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="sym">Symptom</Label><Input id="sym" className="mt-1.5" value={form.symptom} onChange={(e) => setForm({ ...form, symptom: e.target.value })} placeholder="Headache" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="d">Date</Label><Input id="d" type="date" className="mt-1.5" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div><Label htmlFor="dur">Duration</Label><Input id="dur" className="mt-1.5" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="3 hours" /></div>
          </div>
          <div>
            <Label>Severity: {form.severity}/10</Label>
            <Slider className="mt-3" value={[form.severity]} min={1} max={10} step={1} onValueChange={(v) => setForm({ ...form, severity: v[0] ?? 5 })} />
          </div>
          <div><Label htmlFor="tr">Possible trigger</Label><Input id="tr" className="mt-1.5" value={form.trigger} onChange={(e) => setForm({ ...form, trigger: e.target.value })} placeholder="Screen time" /></div>
          <div><Label htmlFor="nt">Notes</Label><Input id="nt" className="mt-1.5" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <Button
            className="w-full"
            onClick={() => {
              if (!form.symptom.trim()) { toast.error("Please enter a symptom"); return; }
              addSymptom({ ...form, duration: form.duration || "Not specified" });
              setForm({ ...form, symptom: "", duration: "", trigger: "", notes: "" });
              toast.success("Saved to your journal");
            }}
          >
            <Plus className="mr-1 size-4" /> Add entry
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Severity over time</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mine.map((s) => ({ date: s.date.slice(5), severity: s.severity }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis domain={[0, 10]} stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="severity" stroke="var(--color-chart-1)" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Timeline of entries</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {mine.length === 0 && <p className="text-sm text-muted-foreground">No entries yet — add your first symptom on the left.</p>}
            {[...mine].reverse().map((s) => (
              <div key={s.id} className="flex items-start justify-between gap-4 rounded-xl border border-border/60 p-3">
                <div>
                  <p className="font-medium">{s.symptom}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.date} · {s.duration}{s.trigger ? ` · trigger: ${s.trigger}` : ""}
                  </p>
                  {s.notes && <p className="mt-1 text-sm text-muted-foreground">{s.notes}</p>}
                </div>
                <Badge variant={s.severity >= 7 ? "destructive" : "secondary"}>{s.severity}/10</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Trends() {
  const { symptoms, activeProfileId, metrics } = useHealth();
  const mine = symptoms.filter((s) => s.profileId === activeProfileId);
  const rising = mine.length > 2 && (mine.at(-1)?.severity ?? 0) > (mine[0]?.severity ?? 0);
  const avgSleep = metrics.reduce((a, m) => a + m.sleepHrs, 0) / (metrics.length || 1);

  return (
    <div className="space-y-5">
      <Card className="border-warning/40 bg-warning/10">
        <CardHeader>
          <CardTitle className="text-base">Health trend detected</CardTitle>
          <CardDescription className="text-current/80">Patterns found in your recorded data — not a diagnosis.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-3">
          <TrendItem
            title="Symptom severity"
            change={rising ? "Increasing" : "Stable"}
            note={rising ? "Your recorded symptom severity appears to be increasing over recent entries. Consider discussing this pattern with a healthcare professional." : "No consistent increase detected in your recent entries."}
          />
          <TrendItem title="Sleep" change={`${avgSleep.toFixed(1)} hrs average`} note="Sleep below your 8-hour goal on most nights this fortnight. Short sleep is commonly linked with headaches and fatigue." />
          <TrendItem title="Hydration" change="Improving" note="Water intake trended upward this week — a helpful direction to maintain." />
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">Symptom severity vs sleep</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.map((m, i) => ({ date: m.date.slice(5), sleep: +m.sleepHrs.toFixed(1), severity: mine[i]?.severity ?? null }))}>
              <defs>
                <linearGradient id="sl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="sleep" name="Sleep (hrs)" stroke="var(--color-chart-2)" fill="url(#sl)" strokeWidth={2} />
              <Line type="monotone" dataKey="severity" name="Severity" stroke="var(--color-chart-5)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">What you can monitor</CardTitle></CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              "Whether headaches cluster on low-sleep days.",
              "Total daily water intake versus your 3 L goal.",
              "Whether severity keeps rising over the next week.",
              "Any new symptoms appearing alongside existing ones.",
            ].map((x) => <li key={x} className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />{x}</li>)}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function TrendItem({ title, change, note }: { title: string; change: string; note: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/50 p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 font-display text-lg">{change}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

function Tracking() {
  const { metrics } = useHealth();
  const data = metrics.map((m) => ({ ...m, date: m.date.slice(5), sleepHrs: +m.sleepHrs.toFixed(1), waterL: +m.waterL.toFixed(1), weightKg: +m.weightKg.toFixed(1) }));
  const cards = [
    { key: "sleepHrs", label: "Sleep (hrs)", icon: Moon, color: "var(--color-chart-1)" },
    { key: "waterL", label: "Water (L)", icon: Droplets, color: "var(--color-chart-2)" },
    { key: "steps", label: "Steps", icon: Footprints, color: "var(--color-chart-3)" },
    { key: "weightKg", label: "Weight (kg)", icon: Activity, color: "var(--color-chart-4)" },
  ] as const;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {cards.map((c) => (
        <Card key={c.key} className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><c.icon className="size-4 text-primary" /> {c.label}</CardTitle>
            <CardDescription>Last 14 days · manually tracked</CardDescription>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} domain={c.key === "weightKg" ? ["dataMin - 2", "dataMax + 2"] : [0, "auto"]} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Bar dataKey={c.key} fill={c.color} radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Goals() {
  const { goals, activeProfileId, addGoal } = useHealth();
  const mine = goals.filter((g) => g.profileId === activeProfileId);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("8");
  const [unit, setUnit] = useState("hrs");

  return (
    <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
      <Card className="border-border/60">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Target className="size-4 text-primary" /> Create a goal</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="gt">Goal</Label><Input id="gt" className="mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Better sleep" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="tg">Target</Label><Input id="tg" className="mt-1.5" value={target} onChange={(e) => setTarget(e.target.value)} /></div>
            <div>
              <Label>Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["hrs", "L", "steps", "kg", "days"].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              if (!title.trim()) { toast.error("Please name your goal"); return; }
              addGoal({ title, target: Number(target) || 1, current: 0, unit, streak: 0 });
              setTitle("");
              toast.success("Goal added — small steps count");
            }}
          >
            <Plus className="mr-1 size-4" /> Add goal
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        {mine.map((g) => {
          const pct = Math.min(100, (g.current / g.target) * 100);
          return (
            <Card key={g.id} className="border-border/60 bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-base">{g.title}</CardTitle>
                <CardDescription>{g.current} / {g.target} {g.unit}</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={pct} />
                <div className="mt-3 flex items-center justify-between text-sm">
                  <Badge variant="secondary">🔥 {g.streak}-day streak</Badge>
                  <span className="text-muted-foreground">{pct.toFixed(0)}% this week</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {pct > 70 ? "You're close — consistency matters more than perfection." : "Every small step counts. Try one tiny improvement today."}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Reminders() {
  const { reminders, activeProfileId, addReminder, removeReminder, toggleReminder } = useHealth();
  const mine = reminders.filter((r) => r.profileId === activeProfileId);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Checkup");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
      <Card className="border-border/60">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bell className="size-4 text-primary" /> New reminder</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="rt">Title</Label><Input id="rt" className="mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Dental checkup" /></div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Appointment", "Checkup", "Dental", "Eye", "Vaccination", "Screening", "Medicine", "Hydration", "Exercise", "Sleep"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div><Label htmlFor="rd">Date</Label><Input id="rd" type="date" className="mt-1.5" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <Button
            className="w-full"
            onClick={() => {
              if (!title.trim()) { toast.error("Please add a title"); return; }
              addReminder({ title, category, date, done: false });
              setTitle("");
              toast.success("Reminder created");
            }}
          >
            <Plus className="mr-1 size-4" /> Create reminder
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CalendarClock className="size-4 text-primary" /> Your reminders</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {mine.length === 0 && <p className="text-sm text-muted-foreground">No reminders yet.</p>}
          {mine.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/60 p-3">
              <div>
                <p className={r.done ? "font-medium line-through opacity-60" : "font-medium"}>{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.category} · {r.date}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toggleReminder(r.id)}>{r.done ? "Undo" : "Done"}</Button>
                <Button size="icon" variant="ghost" aria-label="Delete reminder" onClick={() => { removeReminder(r.id); toast.success("Reminder deleted"); }}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

const KIND_META: Record<string, { icon: string; label: string }> = {
  symptom: { icon: "🩺", label: "Symptoms" },
  report: { icon: "📄", label: "Reports" },
  ai: { icon: "🤖", label: "AI conversations" },
  summary: { icon: "👨‍⚕️", label: "Doctor summaries" },
  reminder: { icon: "🔔", label: "Reminders" },
};

function Timeline() {
  const { timeline } = useHealth();
  const [filter, setFilter] = useState("all");
  const items = [...timeline].reverse().filter((t) => filter === "all" || t.kind === filter);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All</Button>
        {Object.entries(KIND_META).map(([k, m]) => (
          <Button key={k} size="sm" variant={filter === k ? "default" : "outline"} onClick={() => setFilter(k)}>
            {m.icon} {m.label}
          </Button>
        ))}
      </div>

      <Card className="border-border/60">
        <CardContent className="pt-6">
          <ol className="relative space-y-6 border-l border-border pl-6">
            {items.map((t) => (
              <li key={t.id}>
                <span className="absolute -left-[9px] grid size-[18px] place-items-center rounded-full bg-primary text-[10px] text-primary-foreground" aria-hidden>
                  {KIND_META[t.kind]?.icon ?? "•"}
                </span>
                <p className="text-xs text-muted-foreground">{t.date}</p>
                <p className="font-medium">{t.title}</p>
                <p className="text-sm text-muted-foreground">{t.detail}</p>
              </li>
            ))}
            {items.length === 0 && <p className="text-sm text-muted-foreground">Nothing recorded for this filter yet.</p>}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
