import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  Brain,
  ClipboardList,
  FileText,
  HeartPulse,
  Languages,
  Lock,
  MessageSquareHeart,
  Pill,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import heroImage from "@/assets/hero-health.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Disclaimer } from "@/components/site/page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediNova AI — Your AI-Powered Personal Health Companion" },
      {
        name: "description",
        content:
          "Understand symptoms, simplify medical reports, track health trends and prepare for your doctor visit with MediNova AI's decision-support assistant.",
      },
      { property: "og:title", content: "MediNova AI — Your AI-Powered Personal Health Companion" },
      {
        property: "og:description",
        content:
          "AI symptom guidance, medical report explanations, medicine information and health tracking in one premium healthcare workspace.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Stethoscope, title: "AI Symptom Checker", desc: "Describe symptoms naturally; get follow-up questions, possible concerns and a safety triage.", to: "/symptom-checker" },
  { icon: FileText, title: "Report Analyzer", desc: "Upload a lab report and see each value against its reference range in plain language.", to: "/reports" },
  { icon: Bot, title: "AI Health Assistant", desc: "Ask health questions in English, Hindi or Hinglish and get educational answers.", to: "/assistant" },
  { icon: Pill, title: "Medicine & Interactions", desc: "General medicine information plus a multi-medicine interaction checker.", to: "/medicines" },
  { icon: TrendingUp, title: "Trends & Journal", desc: "Track symptoms, sleep, water, steps and weight — and spot patterns early.", to: "/health" },
  { icon: ClipboardList, title: "Doctor Visit Prep", desc: "Auto-generate a structured summary and smart questions for your appointment.", to: "/doctor" },
] as const;

const STEPS = [
  { n: "01", title: "Tell us how you feel", desc: "Type or speak your symptoms in your own words — English, Hindi or Hinglish." },
  { n: "02", title: "Answer smart follow-ups", desc: "The assistant asks about location, onset, severity and associated symptoms." },
  { n: "03", title: "See possible concerns", desc: "Multiple possibilities with matching symptoms, missing info and warning signs." },
  { n: "04", title: "Know what to do next", desc: "A clear Do Now / Monitor / Avoid / Contact a doctor plan, plus doctor-visit prep." },
];

const TESTIMONIALS = [
  { name: "Ananya S.", role: "Postgraduate student", quote: "I finally understood my blood report without googling every term at midnight. The 'questions to ask your doctor' list was genuinely useful." },
  { name: "Rakesh M.", role: "Caregiver for parents", quote: "Separate family profiles keep my mother's records clean and my own separate. The reminder list keeps checkups from slipping." },
  { name: "Dr. Neha K.", role: "General physician", quote: "Patients arrive with a structured timeline instead of vague memories. It makes the consultation far more efficient." },
];

function Landing() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="pointer-events-none absolute -left-32 top-10 size-96 rounded-full bg-primary/15 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-24 top-40 size-80 rounded-full bg-chart-2/20 blur-3xl" aria-hidden />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge variant="outline" className="border-primary/30 bg-background/70 text-primary">
              <Sparkles className="mr-1.5 size-3.5" /> AI healthcare decision support
            </Badge>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
              Your <span className="text-gradient">AI-Powered</span> Personal Health Companion
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Understand your symptoms, simplify medical reports, monitor your health and prepare better for your next
              doctor visit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-glow">
                <Link to="/symptom-checker">
                  <Stethoscope className="mr-1" /> Check My Symptoms
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/assistant">
                  <Bot className="mr-1" /> Talk to AI Assistant
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/reports">
                  <FileText className="mr-1" /> Analyze Medical Report
                </Link>
              </Button>
            </div>
            <div className="mt-8 max-w-xl">
              <Disclaimer />
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Illustration of an AI health dashboard with heart-rate waveform and health metric cards"
              width={1280}
              height={960}
              className="w-full rounded-3xl border border-border/60 shadow-soft"
            />
            <Card className="absolute -bottom-6 left-2 w-56 animate-float border-border/60 bg-card/90 backdrop-blur sm:left-6">
              <CardContent className="flex items-center gap-3 p-4">
                <span className="grid size-10 place-items-center rounded-xl bg-success/15 text-success">
                  <HeartPulse className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Wellness score</p>
                  <p className="font-display text-xl font-bold">78 / 100</p>
                </div>
              </CardContent>
            </Card>
            <Card className="absolute -top-4 right-2 hidden w-56 animate-float border-border/60 bg-card/90 backdrop-blur sm:block">
              <CardContent className="flex items-center gap-3 p-4">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Brain className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Triage</p>
                  <p className="text-sm font-semibold">🟢 Low risk today</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHead
          eyebrow="Capabilities"
          title="One workspace for everyday health questions"
          sub="Every feature is designed to explain, never to diagnose."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.title} to={f.to} className="group">
              <Card className="h-full border-border/60 bg-gradient-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-soft">
                <CardHeader>
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/12 text-primary">
                    <f.icon className="size-5" aria-hidden />
                  </span>
                  <CardTitle className="mt-3 text-lg">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHead eyebrow="How it works" title="From a sentence to a safe next step" />
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {STEPS.map((s) => (
              <Card key={s.n} className="border-border/60">
                <CardHeader>
                  <span className="font-display text-3xl font-bold text-primary/35">{s.n}</span>
                  <CardTitle className="mt-2 text-base">{s.title}</CardTitle>
                  <CardDescription>{s.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety + Privacy */}
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <Card className="border-destructive/25 bg-destructive/5">
          <CardHeader>
            <span className="grid size-11 place-items-center rounded-xl bg-destructive/15 text-destructive">
              <ShieldAlert className="size-5" />
            </span>
            <CardTitle className="mt-3">Safety first</CardTitle>
            <CardDescription>Built with guardrails, not guesses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm text-muted-foreground">
            {[
              "Never claims a confirmed diagnosis — only possible associations.",
              "Detects potential red-flag symptoms and switches to Emergency Mode.",
              "Never suggests starting, stopping or changing prescription medicine.",
              "Always ends with warning signs and when to seek professional care.",
            ].map((x) => (
              <p key={x} className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden /> {x}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/25 bg-primary/5">
          <CardHeader>
            <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
              <Lock className="size-5" />
            </span>
            <CardTitle className="mt-3">Privacy by design</CardTitle>
            <CardDescription>Health data is sensitive data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm text-muted-foreground">
            {[
              "In this demo build, your entries stay in your own browser storage.",
              "A Privacy Center lets you view, export or delete everything.",
              "Family profiles keep each person's records fully separate.",
              "Production deployments use protected routes and server-side AI calls only.",
            ].map((x) => (
              <p key={x} className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {x}
              </p>
            ))}
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link to="/privacy">Open Privacy Center</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* AI capabilities strip */}
      <section className="border-y border-border bg-gradient-soft">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 md:grid-cols-3">
          {[
            { icon: Languages, title: "Trilingual", desc: "English, हिंदी and Hinglish across every major AI feature." },
            { icon: Activity, title: "Trend intelligence", desc: "Detects rising symptom severity and changing report values." },
            { icon: MessageSquareHeart, title: "Health literacy mode", desc: "Swaps medical jargon for plain, human language instantly." },
          ].map((c) => (
            <div key={c.title} className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                <c.icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHead eyebrow="Testimonials" title="Built for people who want clarity" sub="Illustrative demo testimonials." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="border-border/60 bg-gradient-card">
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed text-muted-foreground">“{t.quote}”</p>
                <div className="mt-5">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <SectionHead eyebrow="FAQ" title="Questions people ask us" />
        <Accordion type="single" collapsible className="mt-8">
          {[
            ["Does MediNova AI diagnose illnesses?", "No. It offers educational information and decision support — possible associations, questions to ask, and when to seek care. A confirmed diagnosis can only come from a qualified healthcare professional."],
            ["What happens if I describe a dangerous symptom?", "The assistant detects potential red flags such as severe chest pain or breathing difficulty and immediately switches to Emergency Mode instead of continuing a long conversation."],
            ["Can it tell me which medicine to take?", "It shares general information about medicines and possible interactions, but it never prescribes, and never tells you to start, stop or change a prescribed medicine."],
            ["Which languages are supported?", "English, Hindi and Hinglish. You can switch the language from the navbar and all major AI features respond accordingly."],
            ["Is my data private?", "In this demo build everything stays in your browser. The Privacy Center lets you export or delete symptoms, reports, conversations or the whole account at any time."],
          ].map(([q, a]) => (
            <AccordionItem key={q} value={q as string}>
              <AccordionTrigger className="text-left">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl bg-gradient-hero px-8 py-14 text-center text-primary-foreground shadow-glow">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Start understanding your health today</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">
            Set up a health profile in under a minute and explore the full demo experience — no external accounts needed.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/signup">Create free account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent">
              <Link to="/dashboard">Explore the dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}
