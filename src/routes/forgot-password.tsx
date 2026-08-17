import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Your Password — MediNova AI" },
      { name: "description", content: "Request a password reset link for your MediNova AI account and regain access to your health workspace." },
      { property: "og:title", content: "Reset Your Password — MediNova AI" },
      { property: "og:description", content: "Request a MediNova AI password reset link." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center px-4 py-12">
      <Card className="border-border/60">
        <CardHeader className="text-center">
          <KeyRound className="mx-auto size-9 text-primary" aria-hidden />
          <CardTitle className="font-display text-2xl">Reset password</CardTitle>
          <CardDescription>We'll send a reset link to your email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <p className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
              If an account exists for <strong>{email}</strong>, a reset link is on its way. (Demo mode — no email is actually sent.)
            </p>
          ) : (
            <>
              <div><Label htmlFor="em">Email</Label><Input id="em" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <Button
                className="w-full"
                onClick={() => {
                  if (!email.includes("@")) { toast.error("Enter a valid email"); return; }
                  setSent(true);
                  toast.success("Reset link sent (demo)");
                }}
              >
                Send reset link
              </Button>
            </>
          )}
          <p className="text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
