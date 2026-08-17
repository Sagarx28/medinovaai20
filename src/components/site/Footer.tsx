import { Link } from "@tanstack/react-router";
import { Activity, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-gradient-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
              <Activity className="size-5" aria-hidden />
            </span>
            MediNova AI
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            An AI-powered health companion for understanding symptoms, reports and everyday wellness.
          </p>
        </div>
        <FooterCol
          title="Product"
          links={[
            { to: "/symptom-checker", label: "Symptom Checker" },
            { to: "/assistant", label: "AI Assistant" },
            { to: "/reports", label: "Report Analyzer" },
            { to: "/medicines", label: "Medicine Info" },
          ]}
        />
        <FooterCol
          title="Health"
          links={[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/health", label: "Tracking & Trends" },
            { to: "/doctor", label: "Doctor Prep" },
            { to: "/emergency", label: "Emergency" },
          ]}
        />
        <FooterCol
          title="Account"
          links={[
            { to: "/profile", label: "Health Profile" },
            { to: "/privacy", label: "Privacy & Data" },
            { to: "/login", label: "Log in" },
            { to: "/signup", label: "Create account" },
          ]}
        />
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between">
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            MediNova AI provides health information and decision-support assistance. It does not provide a definitive
            medical diagnosis and is not a substitute for professional medical care.
          </p>
          <p>© {new Date().getFullYear()} MediNova AI</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h3 className="font-display text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="transition-colors hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
