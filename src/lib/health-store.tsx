import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEMO_GOALS,
  DEMO_METRICS,
  DEMO_PROFILES,
  DEMO_REMINDERS,
  DEMO_REPORTS,
  DEMO_SYMPTOMS,
  DEMO_TIMELINE,
} from "./health-data";
import type {
  ChatMessage,
  HealthGoal,
  HealthProfile,
  MedicalReport,
  Metric,
  Reminder,
  SymptomEntry,
  TimelineItem,
} from "./health-types";
import type { Language } from "./health-ai";

const KEY = "medinova-state-v1";

interface State {
  signedIn: boolean;
  userName: string;
  profiles: HealthProfile[];
  activeProfileId: string;
  symptoms: SymptomEntry[];
  reports: MedicalReport[];
  goals: HealthGoal[];
  reminders: Reminder[];
  metrics: Metric[];
  timeline: TimelineItem[];
  chat: ChatMessage[];
  language: Language;
  simpleMode: boolean;
  theme: "light" | "dark";
  notifications: { id: string; title: string; detail: string; read: boolean }[];
}

const initialState: State = {
  signedIn: false,
  userName: "Rishabh",
  profiles: DEMO_PROFILES,
  activeProfileId: "p1",
  symptoms: DEMO_SYMPTOMS,
  reports: DEMO_REPORTS,
  goals: DEMO_GOALS,
  reminders: DEMO_REMINDERS,
  metrics: DEMO_METRICS,
  timeline: DEMO_TIMELINE,
  chat: [],
  language: "en",
  simpleMode: false,
  theme: "light",
  notifications: [
    { id: "n1", title: "Report analysis ready", detail: "Your CBC report explanation is available.", read: false },
    { id: "n2", title: "Preventive reminder", detail: "Annual full body checkup is due in 12 days.", read: false },
    { id: "n3", title: "Goal streak", detail: "9-day hydration streak — nice consistency!", read: true },
  ],
};

interface Ctx extends State {
  set: <K extends keyof State>(key: K, value: State[K]) => void;
  activeProfile: HealthProfile;
  addSymptom: (entry: Omit<SymptomEntry, "id" | "profileId">) => void;
  addReport: (report: Omit<MedicalReport, "id" | "profileId">) => void;
  addTimeline: (item: Omit<TimelineItem, "id">) => void;
  addGoal: (goal: Omit<HealthGoal, "id" | "profileId">) => void;
  addReminder: (r: Omit<Reminder, "id" | "profileId">) => void;
  removeReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  addProfile: (p: Omit<HealthProfile, "id">) => void;
  updateProfile: (p: HealthProfile) => void;
  reset: () => void;
  signIn: (name: string) => void;
  signOut: () => void;
}

const HealthContext = createContext<Ctx | null>(null);
const uid = () => Math.random().toString(36).slice(2, 10);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as Partial<State>) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state]);

  const set = useCallback(<K extends keyof State>(key: K, value: State[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  }, []);

  const value = useMemo<Ctx>(() => {
    const activeProfile = state.profiles.find((p) => p.id === state.activeProfileId) ?? state.profiles[0]!;
    return {
      ...state,
      set,
      activeProfile,
      addSymptom: (entry) =>
        setState((s) => ({
          ...s,
          symptoms: [...s.symptoms, { ...entry, id: uid(), profileId: s.activeProfileId }],
          timeline: [
            ...s.timeline,
            { id: uid(), date: entry.date, kind: "symptom", title: "Symptom recorded", detail: `${entry.symptom} · ${entry.severity}/10` },
          ],
        })),
      addReport: (report) =>
        setState((s) => ({
          ...s,
          reports: [...s.reports, { ...report, id: uid(), profileId: s.activeProfileId }],
          timeline: [...s.timeline, { id: uid(), date: report.date, kind: "report", title: "Report uploaded", detail: report.title }],
        })),
      addTimeline: (item) => setState((s) => ({ ...s, timeline: [...s.timeline, { ...item, id: uid() }] })),
      addGoal: (goal) => setState((s) => ({ ...s, goals: [...s.goals, { ...goal, id: uid(), profileId: s.activeProfileId }] })),
      addReminder: (r) => setState((s) => ({ ...s, reminders: [...s.reminders, { ...r, id: uid(), profileId: s.activeProfileId }] })),
      removeReminder: (id) => setState((s) => ({ ...s, reminders: s.reminders.filter((r) => r.id !== id) })),
      toggleReminder: (id) =>
        setState((s) => ({ ...s, reminders: s.reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r)) })),
      addProfile: (p) => setState((s) => ({ ...s, profiles: [...s.profiles, { ...p, id: uid() }] })),
      updateProfile: (p) => setState((s) => ({ ...s, profiles: s.profiles.map((x) => (x.id === p.id ? p : x)) })),
      reset: () => setState({ ...initialState, signedIn: state.signedIn, theme: state.theme }),
      signIn: (name) => setState((s) => ({ ...s, signedIn: true, userName: name || s.userName })),
      signOut: () => setState((s) => ({ ...s, signedIn: false })),
    };
  }, [state, set]);

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth() {
  const ctx = useContext(HealthContext);
  if (!ctx) throw new Error("useHealth must be used within HealthProvider");
  return ctx;
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}
