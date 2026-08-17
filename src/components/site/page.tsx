import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export function PageShell({
  title,
  subtitle,
  icon,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 font-display text-3xl font-bold sm:text-4xl">
            {icon}
            {title}
          </h1>
          {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </main>
  );
}

export function DemoBadge() {
  return (
    <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
      DEMO DATA
    </Badge>
  );
}

export function Disclaimer({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-sm text-muted-foreground">
      <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <p>
        {children ??
          "MediNova AI provides health information and decision-support assistance. It does not provide a definitive medical diagnosis and is not a substitute for professional medical care."}
      </p>
    </div>
  );
}
