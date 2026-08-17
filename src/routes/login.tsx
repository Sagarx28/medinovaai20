import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { HeartPulse } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHealth } from "@/lib/health-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — MediNova AI" },
      { name: "description", content: "Sign in to MediNova AI to access your health dashboard, symptom journal, reports and AI health assistant." },
      { property: "og:title", content: "Sign In — MediNova AI" },
      { property: "og:description", content: "Access your personalised MediNova AI health dashboard." },
    ],
  }),
  component: Login,
});

function Login() {
  const { signIn } = useHealth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@medinova.ai");
  const [password, setPassword] = useState("demo1234");

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center px-4 py-12">
      <Card className="border-border/60">
        <CardHeader className="text-center">
          <HeartPulse className="mx-auto size-9 text-primary" aria-hidden />
          <CardTitle className="font-display text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to continue to your health dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="em">Email</Label><Input id="em" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><Label htmlFor="pw">Password</Label><Input id="pw" type="password" className="mt-1.5" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <Button
            className="w-full"
            onClick={() => {
              if (!email.trim() || password.length < 6) { toast.error("Enter a valid email and a 6+ character password"); return; }
              signIn(email.split("@")[0] ?? "Friend");
              toast.success("Signed in — demo mode");
              navigate({ to: "/dashboard" });
            }}
          >
            Sign in
          </Button>
          <div className="flex justify-between text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
            <Link to="/signup" className="text-primary hover:underline">Create account</Link>
          </div>
          <p className="text-center text-xs text-muted-foreground">Demo mode — no real credentials are stored or verified.</p>
        </CardContent>
      </Card>
    </main>
  );
}
