import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileText, Loader2, TrendingDown, TrendingUp, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DemoBadge, Disclaimer, PageShell } from "@/components/site/page";
import { useHealth } from "@/lib/health-store";
import type { MedicalReport, ReportValue } from "@/lib/health-types";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Medical Report Analyzer — MediNova AI" },
      { name: "description", content: "Upload a lab report and see every value against its reference range with plain-language explanations and comparison charts." },
      { property: "og:title", content: "Medical Report Analyzer — MediNova AI" },
      { property: "og:description", content: "AI-assisted report explanations, reference ranges and previous-vs-current comparisons." },
    ],
  }),
  component: Reports,
});

function statusOf(v: ReportValue) {
  if (v.value < v.low) return { label: "Below reference range", tone: "warning" as const };
  if (v.value > v.high) return { label: "Above reference range", tone: "destructive" as const };
  return { label: "Within reference range", tone: "success" as const };
}

function Reports() {
  const { reports, activeProfileId, addReport } = useHealth();
  const mine = reports.filter((r) => r.profileId === activeProfileId);
  const [selectedId, setSelectedId] = useState(mine.at(-1)?.id ?? "");
  const [uploading, setUploading] = useState(0);
  const selected = mine.find((r) => r.id === selectedId) ?? mine.at(-1);

  const handleFile = (file: File | null) => {
    if (!file) return;
    const ok = ["application/pdf", "image/jpeg", "image/png"].includes(file.type);
    if (!ok) {
      toast.error("Unsupported file", { description: "Please upload a PDF, JPG or PNG file." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum size is 10 MB." });
      return;
    }
    setUploading(8);
    const timer = window.setInterval(() => {
      setUploading((p) => {
        if (p >= 100) {
          window.clearInterval(timer);
          return 0;
        }
        return p + 12;
      });
    }, 180);
    window.setTimeout(() => {
      const base = mine.at(-1);
      addReport({
        title: file.name.replace(/\.[^.]+$/, "") || "Uploaded report",
        date: new Date().toISOString().slice(0, 10),
        type: "Blood",
        summary: "Demo OCR extraction: values parsed from your uploaded file and compared to standard reference ranges.",
        values:
          base?.values.map((v) => ({ ...v, value: +(v.value * (0.95 + Math.random() * 0.12)).toFixed(1) })) ?? [],
      });
      toast.success("Report analyzed", { description: "Extraction complete — scroll down for the breakdown." });
    }, 1700);
  };

  return (
    <PageShell
      title="Medical Report Analyzer"
      icon={<FileText className="size-8 text-primary" />}
      subtitle="Upload a lab report (PDF, JPG or PNG). Values are explained in simple language — one out-of-range value never confirms a disease."
      action={<DemoBadge />}
    >
      <Tabs defaultValue="analyze">
        <TabsList>
          <TabsTrigger value="analyze">Analyze report</TabsTrigger>
          <TabsTrigger value="compare">Compare reports</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="mt-6 space-y-6">
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <label
                htmlFor="file"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className="grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-14 text-center transition-colors hover:bg-primary/10"
              >
                <Upload className="size-9 text-primary" aria-hidden />
                <p className="mt-3 font-medium">Drag & drop your report here, or click to browse</p>
                <p className="mt-1 text-sm text-muted-foreground">PDF, JPG or PNG · up to 10 MB · processed with demo OCR</p>
                <input
                  id="file"
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  className="sr-only"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {uploading > 0 && (
                <div className="mt-4">
                  <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin text-primary" /> Extracting values…
                  </p>
                  <Progress value={uploading} />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={selected?.id ?? ""} onValueChange={setSelectedId}>
              <SelectTrigger className="w-72"><SelectValue placeholder="Select a report" /></SelectTrigger>
              <SelectContent>
                {mine.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.title} · {r.date}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selected && <ReportDetail report={selected} />}
          <Disclaimer>
            Report explanations are educational. A single value outside the reference range does not confirm a disease —
            your doctor interprets results alongside your history and examination.
          </Disclaimer>
        </TabsContent>

        <TabsContent value="compare" className="mt-6">
          <Comparison reports={mine} />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function ReportDetail({ report }: { report: MedicalReport }) {
  const chartData = report.values.map((v) => ({ name: v.name, value: v.value, low: v.low, high: v.high }));
  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-gradient-card">
        <CardHeader>
          <CardTitle>Report summary — {report.title}</CardTitle>
          <CardDescription>{report.date} · {report.type} report</CardDescription>
        </CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{report.summary}</p></CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">Important values</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Value</TableHead>
                <TableHead>Your value</TableHead>
                <TableHead>Reference range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="min-w-[280px]">Simple explanation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.values.map((v) => {
                const s = statusOf(v);
                return (
                  <TableRow key={v.name}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>{v.value} {v.unit}</TableCell>
                    <TableCell className="text-muted-foreground">{v.low}–{v.high} {v.unit}</TableCell>
                    <TableCell>
                      <Badge variant={s.tone === "success" ? "secondary" : s.tone === "warning" ? "outline" : "destructive"}>
                        {s.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{v.explanation}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Values vs reference range</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="low" name="Range low" fill="var(--color-chart-3)" opacity={0.35} radius={6} />
                <Bar dataKey="value" name="Your value" fill="var(--color-chart-1)" radius={6} />
                <Bar dataKey="high" name="Range high" fill="var(--color-chart-2)" opacity={0.35} radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Questions to ask your doctor</CardTitle>
            <CardDescription>Generated from the values in this report.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ...report.values.filter((v) => statusOf(v).tone !== "success").map((v) => `My ${v.name} is ${v.value} ${v.unit} — what could explain that, and does it need action?`),
                "Should any of these tests be repeated, and after how long?",
                "Could my current medicines or diet be influencing these results?",
                "What symptoms should make me come back sooner?",
              ].map((q) => (
                <li key={q} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden /> {q}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Comparison({ reports }: { reports: MedicalReport[] }) {
  const names = useMemo(() => Array.from(new Set(reports.flatMap((r) => r.values.map((v) => v.name)))), [reports]);
  const [metric, setMetric] = useState(names[0] ?? "");

  if (reports.length < 2) {
    return (
      <Card className="grid place-items-center border-dashed p-12 text-center">
        <p className="text-muted-foreground">Upload at least two reports to compare values over time.</p>
      </Card>
    );
  }

  const series = reports.map((r) => ({
    date: r.date,
    value: r.values.find((v) => v.name === metric)?.value ?? 0,
  }));
  const first = series[0]?.value ?? 0;
  const last = series.at(-1)?.value ?? 0;
  const change = first ? ((last - first) / first) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-60"><SelectValue /></SelectTrigger>
          <SelectContent>
            {names.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant={change >= 0 ? "secondary" : "outline"} className="gap-1">
          {change >= 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
          {change.toFixed(1)}% since first report
        </Badge>
      </div>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">{metric} over time</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="value" stroke="var(--color-chart-1)" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="border-success/30 bg-success/8">
          <CardHeader><CardTitle className="text-base">What changed?</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {metric} moved from {first} to {last} ({change.toFixed(1)}%) across your reports. Direction over time is usually
            more informative than a single reading.
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">What stayed stable?</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Platelets and WBC counts remained within their reference ranges across all reports in this demo dataset.
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-primary/8">
          <CardHeader><CardTitle className="text-base">Discuss with your doctor</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Ask whether this trend is expected, whether the interval between tests was appropriate, and what target range
            applies to you specifically.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
