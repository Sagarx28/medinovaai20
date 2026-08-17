import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  Bell,
  Globe,
  Menu,
  Moon,
  Stethoscope,
  Sun,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHealth } from "@/lib/health-store";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/symptom-checker", label: "Symptom Checker" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/reports", label: "Reports" },
  { to: "/medicines", label: "Medicines" },
  { to: "/health", label: "Health" },
  { to: "/doctor", label: "Doctor Prep" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, set, language, notifications, signedIn, userName, signOut } = useHealth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6" aria-label="Main">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-glow">
            <Activity className="size-5" aria-hidden />
          </span>
          <span>
            Medi<span className="text-gradient">Nova</span> AI
          </span>
        </Link>

        <div className="ml-4 hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === l.to && "bg-accent text-accent-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <Button asChild variant="destructive" size="sm" className="hidden sm:inline-flex">
            <Link to="/emergency">Emergency</Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Language">
                <Globe className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              {(["en", "hi", "hinglish"] as const).map((l) => (
                <DropdownMenuItem key={l} onClick={() => set("language", l)}>
                  {l === "en" ? "🇬🇧 English" : l === "hi" ? "🇮🇳 हिंदी" : "💬 Hinglish"}
                  {language === l && <span className="ml-auto text-primary">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="size-4" />
                {unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" aria-hidden />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications <Badge variant="secondary">{unread} new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.detail}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => set("theme", theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
                <User className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{signedIn ? userName : "Guest (demo)"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Health profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/privacy">Privacy & data</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin">Admin dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {signedIn ? (
                <DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link to="/login">Log in</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 lg:hidden">
          <div className="grid gap-1 pt-2">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/emergency"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10"
            >
              <Stethoscope className="mr-2 inline size-4" />
              Emergency
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
