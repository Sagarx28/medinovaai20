import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { HeartPulse } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHealth } from "@/lib/health-store";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Your Account — MediNova AI" },
      { name: "description", content: "Create a MediNova AI account to track symptoms, understand reports, check medicines and prepare for doctor visits." },
      { property: "og:title", content: "Create Your Account — MediNova AI" },
      { property: "og:description", content: "Start your personalised health decision-support workspace." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const { signIn } = useHealth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center px-4 py-12">
      <Card className="border-border/60">
        <CardHeader className="text-center">
          <HeartPulse className="mx-auto size-9 text-primary" aria-hidden />
          <CardTitle className="font-display text-2xl">Create your account</CardTitle>
          <CardDescription>Health guidance you can actually understand.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="nm">Full name</Label><Input id="nm" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label htmlFor="em">Email</Label><Input id="em" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><Label htmlFor="pw">Password</Label><Input id="pw" type="password" className="mt-1.5" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <Button
            className="w-full"
            onClick={() => {
              if (!name.trim() || !email.includes("@") || password.length < 6) { toast.error("Please complete all fields (password 6+ characters)"); return; }
              signIn(name);
              toast.success("Account created — demo mode");
              navigate({ to: "/dashboard" });
            }}
          >
            Create account
          </Button>
          <p className="text-center text-sm">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-xs text-muted-foreground">Demo mode — no real credentials are stored or verified.</p>
        </CardContent>
      </Card>
    </main>
  );
}
