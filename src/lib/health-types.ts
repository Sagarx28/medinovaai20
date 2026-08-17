export type RiskLevel = "low" | "moderate" | "high" | "urgent" | "emergency";

export interface HealthProfile {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  medications: string;
  lifestyle: string;
  emergencyContact: string;
}

export interface SymptomEntry {
  id: string;
  profileId: string;
  date: string;
  symptom: string;
  severity: number;
  duration: string;
  trigger?: string;
  notes?: string;
}

export interface ReportValue {
  name: string;
  value: number;
  unit: string;
  low: number;
  high: number;
  explanation: string;
}

export interface MedicalReport {
  id: string;
  profileId: string;
  title: string;
  date: string;
  type: string;
  values: ReportValue[];
  summary: string;
}

export interface Reminder {
  id: string;
  profileId: string;
  title: string;
  category: string;
  date: string;
  done: boolean;
}

export interface HealthGoal {
  id: string;
  profileId: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  streak: number;
}

export interface Metric {
  date: string;
  weightKg: number;
  sleepHrs: number;
  waterL: number;
  steps: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  feedback?: "up" | "down";
}

export interface TimelineItem {
  id: string;
  date: string;
  kind: "symptom" | "report" | "ai" | "summary" | "reminder";
  title: string;
  detail: string;
}
