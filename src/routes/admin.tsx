import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoBadge, Disclaimer, PageShell } from "@/components/site/page";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Insights Dashboard — MediNova AI" },
      { name: "description", content: "Aggregated, anonymised demo analytics: feature usage, common symptom categories and triage distribution across MediNova AI." },
      { property: "og:title", content: "Admin Insights Dashboard — MediNova AI" },
      { property: "og:description", content: "Anonymised usage analytics and triage distribution for the MediNova AI demo." },
    ],
  }),
  component: Admin,
});

const USAGE = [
  { feature: "Symptom checker", uses: 1840 },
  { feature: "AI assistant", uses: 1520 },
  { feature: "Reports", uses: 910 },
  { feature: "Medicines", uses: 760 },
  { feature: "Doctor prep", uses: 430 },
  { feature: "Emergency", uses: 120 },
];

const TRIAGE = [
  { level: "Low", count: 1120 },
  { level: "Moderate", count: 640 },
  { level: "High", count: 210 },
  { level: "Urgent", count: 74 },
  { level: "Emergency", count: 18 },
];

function Admin() {
  return (
    <PageShell
      title="Admin Insights"
      icon={<BarChart3 className="size-8 text-primary" />}
      subtitle="Aggregated, anonymised usage patterns. No individual health records are visible here."
      action={<DemoBadge />}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[["Active demo users", "3,412"], ["Assessments run", "6,180"], ["Reports analysed", "910"], ["Avg. session", "6m 12s"]].map(([l, v]) => (
          <Card key={l} className="border-border/60 bg-gradient-card">
            <CardContent className="pt-6">
              <p className="font-display text-3xl font-bold">{v}</p>
              <p className="text-sm text-muted-foreground">{l}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Feature usage</CardTitle><CardDescription>Last 30 days</CardDescription></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={USAGE}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="feature" stroke="var(--color-muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Bar dataKey="uses" fill="var(--color-chart-1)" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Triage distribution</CardTitle><CardDescription>Risk levels returned by the assistant</CardDescription></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TRIAGE}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="level" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Bar dataKey="count" fill="var(--color-chart-2)" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8"><Disclaimer /></div>
    </PageShell>
  );
}
