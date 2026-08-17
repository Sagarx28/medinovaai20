import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, HeartPulse, Phone, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Disclaimer, PageShell } from "@/components/site/page";
import { useHealth } from "@/lib/health-store";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency Mode — Red Flags & Immediate Steps | MediNova AI" },
      { name: "description", content: "Recognise emergency red-flag symptoms, see immediate first-response steps and reach emergency numbers and your emergency contact fast." },
      { property: "og:title", content: "Emergency Mode — MediNova AI" },
      { property: "og:description", content: "Red-flag symptom list, first-response steps and emergency contacts." },
    ],
  }),
  component: Emergency,
});

const RED_FLAGS = [
  "Crushing or pressing chest pain, especially spreading to arm, jaw or back",
  "Sudden difficulty breathing or gasping for air",
  "Face drooping, arm weakness or slurred speech (possible stroke)",
  "Sudden severe headache described as the worst ever",
  "Uncontrolled bleeding that does not stop with pressure",
  "Loss of consciousness, seizure or unresponsiveness",
  "Severe allergic reaction: swelling of lips, tongue or throat",
  "Persistent vomiting with confusion or severe dehydration",
  "Sudden loss of vision, or severe abdominal pain with rigidity",
  "Thoughts of harming yourself or others",
];

const STEPS = [
  { title: "Chest pain", body: ["Stop all activity and sit down, leaning slightly forward.", "Loosen tight clothing and keep the person calm.", "Call emergency services immediately — do not drive yourself.", "If prescribed by a doctor previously, follow their standing instruction.", "Stay with the person and be ready to describe when the pain started."] },
  { title: "Difficulty breathing", body: ["Sit upright — do not lie flat.", "Move to fresh air and remove tight clothing.", "Use a prescribed inhaler if one has been given by a doctor.", "Call emergency services if breathing does not ease quickly.", "Note lip or fingertip colour changes for the responders."] },
  { title: "Possible stroke (FAST)", body: ["Face: ask them to smile — is one side drooping?", "Arms: can they raise both arms and keep them up?", "Speech: is speech slurred or strange?", "Time: note the exact time symptoms started and call emergency services now.", "Do not give food, drink or medicine."] },
  { title: "Severe bleeding", body: ["Apply firm continuous pressure with a clean cloth.", "Do not remove a soaked cloth — add another on top.", "Raise the injured area above heart level if possible.", "Keep the person warm and lying down.", "Call emergency services."] },
  { title: "Severe allergic reaction", body: ["Use a prescribed adrenaline auto-injector immediately if available.", "Call emergency services even if symptoms improve.", "Lie the person flat with legs raised unless breathing is hard.", "Remove the trigger if it is obvious and safe to do so."] },
  { title: "Fainting or unresponsiveness", body: ["Check for breathing and response.", "If breathing, place in the recovery position on their side.", "If not breathing, call emergency services and start CPR if trained.", "Do not put anything in the mouth during a seizure — protect the head."] },
];

const NUMBERS = [
  { label: "All-in-one emergency (India)", value: "112" },
  { label: "Ambulance (India)", value: "108" },
  { label: "Fire", value: "101" },
  { label: "Police", value: "100" },
  { label: "Mental health helpline (Tele-MANAS)", value: "14416" },
];

function Emergency() {
  const { activeProfile } = useHealth();

  return (
    <PageShell
      title="Emergency Mode"
      icon={<ShieldAlert className="size-8 text-destructive" />}
      subtitle="If this is a life-threatening situation, call emergency services first. This page is guidance, not treatment."
      action={<Badge variant="destructive">URGENT GUIDANCE</Badge>}
    >
      <Card className="mb-6 border-destructive bg-destructive/10">
        <CardContent className="flex flex-wrap items-center gap-4 pt-6">
          <AlertTriangle className="size-8 shrink-0 text-destructive" aria-hidden />
          <div className="min-w-[240px] flex-1">
            <p className="font-display text-lg font-semibold text-destructive">Call emergency services now if any red flag applies</p>
            <p className="text-sm text-muted-foreground">MediNova AI cannot assess an emergency. A trained responder must.</p>
          </div>
          <Button asChild variant="destructive" size="lg">
            <a href="tel:112"><Phone className="mr-2 size-4" /> Call 112</a>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><HeartPulse className="size-4 text-destructive" /> Red-flag symptoms</CardTitle>
              <CardDescription>Any single one of these warrants immediate emergency care.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                {RED_FLAGS.map((r) => (
                  <li key={r} className="flex gap-2 rounded-lg border border-destructive/25 bg-destructive/5 p-3">
                    <span aria-hidden>🚨</span>{r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Immediate steps while help arrives</CardTitle>
              <CardDescription>General first-response guidance — never a replacement for trained care.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {STEPS.map((s) => (
                  <AccordionItem key={s.title} value={s.title}>
                    <AccordionTrigger>{s.title}</AccordionTrigger>
                    <AccordionContent>
                      <ol className="ml-4 list-decimal space-y-1.5 text-sm text-muted-foreground">
                        {s.body.map((b) => <li key={b}>{b}</li>)}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Emergency numbers</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {NUMBERS.map((n) => (
                <a key={n.value} href={`tel:${n.value}`} className="flex items-center justify-between rounded-xl border border-border/60 p-3 text-sm transition-colors hover:bg-accent">
                  <span>{n.label}</span>
                  <span className="font-display text-lg font-semibold text-primary">{n.value}</span>
                </a>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Your emergency card</CardTitle></CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {activeProfile.name}</p>
              <p><span className="text-muted-foreground">Age / Gender:</span> {activeProfile.age} · {activeProfile.gender}</p>
              <p><span className="text-muted-foreground">Blood group:</span> {activeProfile.bloodGroup}</p>
              <p><span className="text-muted-foreground">Allergies:</span> {activeProfile.allergies || "None reported"}</p>
              <p><span className="text-muted-foreground">Conditions:</span> {activeProfile.conditions || "None reported"}</p>
              <p><span className="text-muted-foreground">Medications:</span> {activeProfile.medications || "None reported"}</p>
              <p><span className="text-muted-foreground">Emergency contact:</span> {activeProfile.emergencyContact}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8"><Disclaimer>In an emergency, always contact professional emergency services. MediNova AI provides educational guidance only and cannot assess or treat an emergency.</Disclaimer></div>
    </PageShell>
  );
}
