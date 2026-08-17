import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, UserRound, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoBadge, Disclaimer, PageShell } from "@/components/site/page";
import { useHealth } from "@/lib/health-store";
import { bmi, bmiCategory, bmr } from "@/lib/health-ai";
import type { HealthProfile } from "@/lib/health-types";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Health Profile & Family Members — MediNova AI" },
      { name: "description", content: "Manage your health profile, body metrics, allergies, conditions and medications, and switch between family member profiles." },
      { property: "og:title", content: "Health Profile & Family Members — MediNova AI" },
      { property: "og:description", content: "Personal health profile, BMI and energy estimates, and family profile switching." },
    ],
  }),
  component: ProfilePage,
});

const EMPTY: Omit<HealthProfile, "id"> = {
  name: "", relation: "Family", age: 30, gender: "Female", heightCm: 165, weightKg: 60,
  bloodGroup: "O+", allergies: "", conditions: "", medications: "", lifestyle: "", emergencyContact: "",
};

function ProfilePage() {
  const { profiles, activeProfile, activeProfileId, set, updateProfile, addProfile } = useHealth();
  const [draft, setDraft] = useState<HealthProfile>(activeProfile);
  const [newP, setNewP] = useState(EMPTY);

  const value = bmi(draft.weightKg, draft.heightCm);

  return (
    <PageShell
      title="Health Profile"
      icon={<UserRound className="size-8 text-primary" />}
      subtitle="Accurate profile details make every MediNova insight more relevant to you."
      action={<DemoBadge />}
    >
      <Tabs defaultValue="me">
        <TabsList>
          <TabsTrigger value="me">My profile</TabsTrigger>
          <TabsTrigger value="family">Family profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="me" className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Edit details</CardTitle>
              <CardDescription>Stored locally on this device in demo mode.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
              <Field label="Relation" value={draft.relation} onChange={(v) => setDraft({ ...draft, relation: v })} />
              <Field label="Age" type="number" value={String(draft.age)} onChange={(v) => setDraft({ ...draft, age: Number(v) || 0 })} />
              <Field label="Gender" value={draft.gender} onChange={(v) => setDraft({ ...draft, gender: v })} />
              <Field label="Height (cm)" type="number" value={String(draft.heightCm)} onChange={(v) => setDraft({ ...draft, heightCm: Number(v) || 0 })} />
              <Field label="Weight (kg)" type="number" value={String(draft.weightKg)} onChange={(v) => setDraft({ ...draft, weightKg: Number(v) || 0 })} />
              <Field label="Blood group" value={draft.bloodGroup} onChange={(v) => setDraft({ ...draft, bloodGroup: v })} />
              <Field label="Emergency contact" value={draft.emergencyContact} onChange={(v) => setDraft({ ...draft, emergencyContact: v })} />
              <div className="sm:col-span-2">
                <Label htmlFor="al">Allergies</Label>
                <Textarea id="al" className="mt-1.5" rows={2} value={draft.allergies} onChange={(e) => setDraft({ ...draft, allergies: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="co">Existing conditions</Label>
                <Textarea id="co" className="mt-1.5" rows={2} value={draft.conditions} onChange={(e) => setDraft({ ...draft, conditions: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="me">Current medications</Label>
                <Textarea id="me" className="mt-1.5" rows={2} value={draft.medications} onChange={(e) => setDraft({ ...draft, medications: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="li">Lifestyle</Label>
                <Textarea id="li" className="mt-1.5" rows={2} value={draft.lifestyle} onChange={(e) => setDraft({ ...draft, lifestyle: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={() => { updateProfile(draft); toast.success("Profile updated"); }}>Save profile</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="border-border/60 bg-gradient-card">
              <CardHeader><CardTitle className="text-base">Body metrics</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-display text-3xl font-bold">{value}</p>
                  <p className="text-muted-foreground">BMI · {bmiCategory(value)}</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold">{bmr(draft.weightKg, draft.heightCm, draft.age, draft.gender)} kcal</p>
                  <p className="text-muted-foreground">Estimated resting energy per day</p>
                </div>
                <p className="text-xs text-muted-foreground">These are population-level estimates for education, not clinical measurements.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="family" className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Users className="size-4 text-primary" /> Profiles</CardTitle>
              <CardDescription>Switch the active profile to view their data across the app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {profiles.map((p) => (
                <div key={p.id} className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${p.id === activeProfileId ? "border-primary bg-primary/5" : "border-border/60"}`}>
                  <div>
                    <p className="font-medium">{p.name} {p.id === activeProfileId && <Badge variant="secondary" className="ml-2">Active</Badge>}</p>
                    <p className="text-xs text-muted-foreground">{p.relation} · {p.age}y · {p.gender} · {p.bloodGroup}</p>
                  </div>
                  <Button size="sm" variant={p.id === activeProfileId ? "secondary" : "outline"} onClick={() => { set("activeProfileId", p.id); setDraft(p); toast.success(`Switched to ${p.name}`); }}>
                    Switch
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Add a family member</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Field label="Name" value={newP.name} onChange={(v) => setNewP({ ...newP, name: v })} />
              <Field label="Relation" value={newP.relation} onChange={(v) => setNewP({ ...newP, relation: v })} />
              <Field label="Age" type="number" value={String(newP.age)} onChange={(v) => setNewP({ ...newP, age: Number(v) || 0 })} />
              <Field label="Gender" value={newP.gender} onChange={(v) => setNewP({ ...newP, gender: v })} />
              <Button
                className="w-full"
                onClick={() => {
                  if (!newP.name.trim()) { toast.error("Please enter a name"); return; }
                  addProfile(newP);
                  setNewP(EMPTY);
                  toast.success("Family profile added");
                }}
              >
                <Plus className="mr-1 size-4" /> Add profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8"><Disclaimer /></div>
    </PageShell>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  const id = label.replace(/\W/g, "-").toLowerCase();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} className="mt-1.5" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
