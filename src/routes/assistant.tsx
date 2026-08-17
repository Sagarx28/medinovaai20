import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Loader2, Mic, Send, Sparkles, ThumbsDown, ThumbsUp, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoBadge, Disclaimer, PageShell } from "@/components/site/page";
import { assistantReply, simplify, TERMS } from "@/lib/health-ai";
import { useHealth } from "@/lib/health-store";
import type { ChatMessage } from "@/lib/health-types";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Health Assistant — MediNova AI" },
      { name: "description", content: "Ask health questions in English, Hindi or Hinglish and get clear educational answers, medical term explanations and doctor-visit guidance." },
      { property: "og:title", content: "AI Health Assistant — MediNova AI" },
      { property: "og:description", content: "A trilingual AI health assistant for symptoms, reports, medicines and everyday wellness questions." },
    ],
  }),
  component: Assistant,
});

const QUICK_PROMPTS = [
  "Analyze my symptoms",
  "Explain my report",
  "Explain medical term: CBC",
  "Medicine information",
  "Health tips for better sleep",
  "What should I ask my doctor?",
];

function Assistant() {
  const { chat, set, language, simpleMode } = useHealth();
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = (value: string) => {
    const q = value.trim();
    if (!q) return;
    const userMsg: ChatMessage = { id: Math.random().toString(36).slice(2), role: "user", content: q };
    const next = [...chat, userMsg];
    set("chat", next);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      const raw = assistantReply(q, language);
      const content = simpleMode ? simplify(raw) : raw;
      set("chat", [...next, { id: Math.random().toString(36).slice(2), role: "assistant", content }]);
      setThinking(false);
    }, 1100);
  };

  const rate = (id: string, feedback: "up" | "down") => {
    set("chat", chat.map((m) => (m.id === id ? { ...m, feedback } : m)));
    toast.success(feedback === "up" ? "Thanks — glad it helped" : "Thanks — we'll use this to improve");
  };

  return (
    <PageShell
      title="AI Health Assistant"
      icon={<Bot className="size-8 text-primary" />}
      subtitle="Ask about symptoms, reports, medical terms or everyday wellness. Answers are educational, never a diagnosis."
      action={<DemoBadge />}
    >
      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="terms">Medical term explainer</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]">
          <Card className="flex min-h-[520px] flex-col border-border/60">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-primary" /> MediNova Assistant
              </CardTitle>
              <Badge variant="secondary">
                {language === "hi" ? "हिंदी" : language === "hinglish" ? "Hinglish" : "English"}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {chat.length === 0 && (
                  <div className="grid h-full place-items-center rounded-2xl border border-dashed border-border p-8 text-center">
                    <div>
                      <Bot className="mx-auto size-10 text-primary/60" />
                      <p className="mt-3 font-medium">Ask your first health question</p>
                      <p className="mt-1 text-sm text-muted-foreground">Try “Why am I feeling tired?” or “What does CBC mean?”</p>
                    </div>
                  </div>
                )}
                {chat.map((m) => (
                  <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground"
                          : "max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-muted/50 px-4 py-3 text-sm"
                      }
                    >
                      <p className="whitespace-pre-line">{m.content}</p>
                      {m.role === "assistant" && (
                        <div className="mt-3 flex items-center gap-2 border-t border-border/60 pt-2">
                          <span className="text-xs text-muted-foreground">Was this helpful?</span>
                          <Button size="icon" variant={m.feedback === "up" ? "default" : "ghost"} className="size-7" onClick={() => rate(m.id, "up")} aria-label="Helpful">
                            <ThumbsUp className="size-3.5" />
                          </Button>
                          <Button size="icon" variant={m.feedback === "down" ? "destructive" : "ghost"} className="size-7" onClick={() => rate(m.id, "down")} aria-label="Not helpful">
                            <ThumbsDown className="size-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="size-7 ml-auto" aria-label="Read aloud" onClick={() => toast("Voice response is simulated in demo mode")}>
                            <Volume2 className="size-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin text-primary" /> MediNova is thinking…
                  </div>
                )}
              </div>

              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about your health…" aria-label="Message" />
                <Button type="button" variant="outline" size="icon" aria-label="Voice input" onClick={() => { setInput("Why am I feeling tired lately?"); toast.success("Voice captured (demo)"); }}>
                  <Mic className="size-4" />
                </Button>
                <Button type="submit" size="icon" aria-label="Send"><Send className="size-4" /></Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Quick prompts</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((p) => (
                  <Button key={p} size="sm" variant="outline" onClick={() => send(p)}>{p}</Button>
                ))}
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Health literacy mode</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="simple">Simple Health Mode</Label>
                  <Switch id="simple" checked={simpleMode} onCheckedChange={(v) => set("simpleMode", v)} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Replaces medical jargon with everyday words — e.g. hypertension → high blood pressure.
                </p>
              </CardContent>
            </Card>
            <Disclaimer />
          </div>
        </TabsContent>

        <TabsContent value="terms" className="mt-6">
          <TermExplainer />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function TermExplainer() {
  const [query, setQuery] = useState("Hypertension");
  const [kid, setKid] = useState(false);
  const term = TERMS.find((t) => t.term.toLowerCase() === query.trim().toLowerCase());

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Explain a medical term</CardTitle>
          <CardDescription>Try Hypertension, CBC, Anemia, Cholesterol or Gastrointestinal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter a term" aria-label="Medical term" />
          <div className="flex flex-wrap gap-2">
            {TERMS.map((t) => (
              <Button key={t.term} size="sm" variant="outline" onClick={() => setQuery(t.term)}>{t.term}</Button>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/60 p-3">
            <Label htmlFor="kid">Explain Like I'm 10</Label>
            <Switch id="kid" checked={kid} onCheckedChange={setKid} />
          </div>
        </CardContent>
      </Card>

      {term ? (
        <Card className="border-border/60 bg-gradient-card">
          <CardHeader>
            <CardTitle>{term.term}</CardTitle>
            <CardDescription className="text-base text-foreground">{kid ? term.kid : term.simple}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Block title="What it means" body={term.meaning} />
            <Block title="Why doctors monitor it" body={term.whyMonitored} />
            <List title="Common risk factors" items={term.riskFactors} />
            <List title="Common tests" items={term.tests} />
            <div className="sm:col-span-2">
              <List title="Questions you can ask your doctor" items={term.questions} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="grid place-items-center border-dashed p-10 text-center">
          <div>
            <p className="font-medium">No explanation found for “{query}”</p>
            <p className="mt-1 text-sm text-muted-foreground">This demo dictionary covers a curated set of common terms.</p>
          </div>
        </Card>
      )}
    </div>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}
