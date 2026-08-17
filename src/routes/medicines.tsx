import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Pill, Plus, Search, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoBadge, Disclaimer, PageShell } from "@/components/site/page";
import { checkInteractions, MEDICINES, type InteractionLevel } from "@/lib/health-ai";

export const Route = createFileRoute("/medicines")({
  head: () => ({
    meta: [
      { title: "Medicine Information & Interaction Checker — MediNova AI" },
      { name: "description", content: "Search general medicine information — uses, precautions, side effects and storage — and check possible interactions between multiple medicines." },
      { property: "og:title", content: "Medicine Information & Interaction Checker — MediNova AI" },
      { property: "og:description", content: "General medicine information and a multi-medicine interaction checker with clear safety guidance." },
    ],
  }),
  component: Medicines,
});

const LEVEL_META: Record<InteractionLevel, { label: string; className: string }> = {
  none: { label: "🟢 No major interaction found in available data", className: "border-success/30 bg-success/8" },
  potential: { label: "🟡 Potential interaction", className: "border-warning/40 bg-warning/10" },
  important: { label: "🔴 Important interaction warning", className: "border-destructive/40 bg-destructive/8" },
};

function Medicines() {
  const [query, setQuery] = useState("");
  const results = MEDICINES.filter(
    (m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.generic.toLowerCase().includes(query.toLowerCase()),
  );
  const [list, setList] = useState<string[]>(["Aspirin", "Ibuprofen"]);
  const [entry, setEntry] = useState("");
  const interactions = list.length > 1 ? checkInteractions(list) : [];

  return (
    <PageShell
      title="Medicines & Interactions"
      icon={<Pill className="size-8 text-primary" />}
      subtitle="General, educational medicine information. MediNova AI never prescribes and never advises stopping or changing a prescribed medicine."
      action={<DemoBadge />}
    >
      <Tabs defaultValue="search">
        <TabsList>
          <TabsTrigger value="search">Medicine information</TabsTrigger>
          <TabsTrigger value="interactions">Interaction checker</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-6 space-y-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              className="pl-9"
              placeholder="Search by medicine or generic name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search medicines"
            />
          </div>

          {results.length === 0 && (
            <Card className="grid place-items-center border-dashed p-12 text-center">
              <div>
                <p className="font-medium">No medicine found for “{query}”</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This demo dataset covers a small curated list. Your pharmacist can answer anything outside it.
                </p>
              </div>
            </Card>
          )}

          <div className="grid gap-5 lg:grid-cols-2">
            {results.map((m) => (
              <Card key={m.name} className="border-border/60 bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3">
                    {m.name}
                    <Badge variant="secondary">{m.generic}</Badge>
                  </CardTitle>
                  <CardDescription>{m.uses}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
                  <Field label="General precautions" value={m.precautions} />
                  <Field label="Common side effects" value={m.sideEffects} />
                  <Field label="Important warnings" value={m.warnings} />
                  <Field label="Storage" value={m.storage} />
                  <div className="sm:col-span-2">
                    <Field label="General interaction information" value={m.interactions} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Disclaimer>
            This information is general and educational. It is not a prescription, and it does not replace advice from your
            doctor or pharmacist. Never start, stop or change a prescribed medicine on your own.
          </Disclaimer>
        </TabsContent>

        <TabsContent value="interactions" className="mt-6 space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Enter the medicines you take</CardTitle>
              <CardDescription>Add two or more to check for possible interactions in the demo dataset.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (entry.trim()) setList((l) => [...l, entry.trim()]);
                  setEntry("");
                }}
              >
                <Input value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="e.g. Paracetamol" aria-label="Medicine name" />
                <Button type="submit"><Plus className="mr-1 size-4" /> Add</Button>
              </form>
              <div className="flex flex-wrap gap-2">
                {list.map((m, i) => (
                  <Badge key={`${m}-${i}`} variant="outline" className="gap-1.5 py-1.5">
                    {m}
                    <button onClick={() => setList((l) => l.filter((_, idx) => idx !== i))} aria-label={`Remove ${m}`}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            {interactions.map((i) => (
              <Card key={i.pair} className={LEVEL_META[i.level].className}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base capitalize">
                    {i.level === "important" ? <AlertTriangle className="size-4" /> : <ShieldCheck className="size-4" />}
                    {i.pair}
                  </CardTitle>
                  <CardDescription>{LEVEL_META[i.level].label}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">What it means: </span>{i.meaning}</p>
                  <p><span className="font-medium text-foreground">Why it may matter: </span>{i.why}</p>
                  <p><span className="font-medium text-foreground">Warning signs to watch for: </span>{i.watchFor}</p>
                  <p className="pt-1 text-xs">Always confirm with your doctor or pharmacist before acting on interaction information.</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Disclaimer>
            This checker uses a limited demo dataset and cannot cover every combination. Absence of a warning here does not
            mean a combination is safe — your pharmacist has access to complete interaction databases.
          </Disclaimer>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  );
}
