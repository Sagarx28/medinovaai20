import type {
  HealthGoal,
  HealthProfile,
  MedicalReport,
  Metric,
  Reminder,
  SymptomEntry,
  TimelineItem,
} from "./health-types";

export const DEMO_PROFILES: HealthProfile[] = [
  {
    id: "p1",
    name: "Rishabh",
    relation: "Me",
    age: 24,
    gender: "Male",
    heightCm: 176,
    weightKg: 72,
    bloodGroup: "O+",
    allergies: "Dust, Penicillin",
    conditions: "None reported",
    medications: "Vitamin D3 (weekly)",
    lifestyle: "Moderately active, 6h sleep, vegetarian",
    emergencyContact: "+91 98xxx xxx21 (Family)",
  },
  {
    id: "p2",
    name: "Mother",
    relation: "Parent",
    age: 52,
    gender: "Female",
    heightCm: 158,
    weightKg: 66,
    bloodGroup: "B+",
    allergies: "None reported",
    conditions: "Hypertension (under doctor's care)",
    medications: "As prescribed by physician",
    lifestyle: "Light activity, 7h sleep",
    emergencyContact: "+91 98xxx xxx21 (Family)",
  },
];

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
};

export const DEMO_SYMPTOMS: SymptomEntry[] = [
  { id: "s1", profileId: "p1", date: day(6), symptom: "Headache", severity: 4, duration: "3 hours", trigger: "Screen time", notes: "Eased after rest" },
  { id: "s2", profileId: "p1", date: day(5), symptom: "Headache", severity: 6, duration: "5 hours", trigger: "Poor sleep" },
  { id: "s3", profileId: "p1", date: day(3), symptom: "Headache", severity: 7, duration: "6 hours", trigger: "Skipped meals" },
  { id: "s4", profileId: "p1", date: day(2), symptom: "Fatigue", severity: 5, duration: "All day" },
  { id: "s5", profileId: "p1", date: day(1), symptom: "Headache", severity: 5, duration: "2 hours" },
  { id: "s6", profileId: "p2", date: day(4), symptom: "Dizziness", severity: 3, duration: "30 min" },
];

export const DEMO_REPORTS: MedicalReport[] = [
  {
    id: "r1",
    profileId: "p1",
    title: "Complete Blood Count (CBC)",
    date: day(160),
    type: "Blood",
    summary: "Most values within reference range. Hemoglobin slightly below range.",
    values: [
      { name: "Hemoglobin", value: 11.8, unit: "g/dL", low: 13, high: 17, explanation: "Hemoglobin carries oxygen in your blood. Lower values are often discussed in relation to anaemia." },
      { name: "WBC", value: 7.2, unit: "10^3/µL", low: 4, high: 11, explanation: "White blood cells are part of your immune defence." },
      { name: "Platelets", value: 240, unit: "10^3/µL", low: 150, high: 410, explanation: "Platelets help blood clot." },
      { name: "Vitamin D", value: 18, unit: "ng/mL", low: 30, high: 100, explanation: "Vitamin D supports bone and muscle health." },
    ],
  },
  {
    id: "r2",
    profileId: "p1",
    title: "Complete Blood Count (CBC)",
    date: day(45),
    type: "Blood",
    summary: "Hemoglobin improved compared to the previous report. Vitamin D still below range.",
    values: [
      { name: "Hemoglobin", value: 12.6, unit: "g/dL", low: 13, high: 17, explanation: "Hemoglobin carries oxygen in your blood." },
      { name: "WBC", value: 6.8, unit: "10^3/µL", low: 4, high: 11, explanation: "White blood cells are part of your immune defence." },
      { name: "Platelets", value: 255, unit: "10^3/µL", low: 150, high: 410, explanation: "Platelets help blood clot." },
      { name: "Vitamin D", value: 24, unit: "ng/mL", low: 30, high: 100, explanation: "Vitamin D supports bone and muscle health." },
    ],
  },
  {
    id: "r3",
    profileId: "p1",
    title: "Complete Blood Count (CBC)",
    date: day(5),
    type: "Blood",
    summary: "Hemoglobin now within range. Vitamin D approaching reference range.",
    values: [
      { name: "Hemoglobin", value: 13.4, unit: "g/dL", low: 13, high: 17, explanation: "Hemoglobin carries oxygen in your blood." },
      { name: "WBC", value: 7.0, unit: "10^3/µL", low: 4, high: 11, explanation: "White blood cells are part of your immune defence." },
      { name: "Platelets", value: 262, unit: "10^3/µL", low: 150, high: 410, explanation: "Platelets help blood clot." },
      { name: "Vitamin D", value: 28, unit: "ng/mL", low: 30, high: 100, explanation: "Vitamin D supports bone and muscle health." },
    ],
  },
];

export const DEMO_METRICS: Metric[] = Array.from({ length: 14 }).map((_, i) => {
  const idx = 13 - i;
  return {
    date: day(idx),
    weightKg: 73.4 - i * 0.1,
    sleepHrs: 7.4 - Math.sin(i / 2) * 1.1,
    waterL: 2.2 + Math.cos(i / 3) * 0.6,
    steps: 5200 + Math.round(Math.sin(i / 2) * 2200) + i * 60,
  };
});

export const DEMO_GOALS: HealthGoal[] = [
  { id: "g1", profileId: "p1", title: "Sleep 8 hours", target: 8, current: 6.8, unit: "hrs", streak: 4 },
  { id: "g2", profileId: "p1", title: "Drink 3L water", target: 3, current: 2.4, unit: "L", streak: 9 },
  { id: "g3", profileId: "p1", title: "Walk 8,000 steps", target: 8000, current: 6400, unit: "steps", streak: 3 },
];

export const DEMO_REMINDERS: Reminder[] = [
  { id: "rm1", profileId: "p1", title: "Annual full body checkup", category: "Checkup", date: day(-12), done: false },
  { id: "rm2", profileId: "p1", title: "Dental cleaning", category: "Dental", date: day(-30), done: false },
  { id: "rm3", profileId: "p1", title: "Eye checkup", category: "Eye", date: day(-58), done: false },
  { id: "rm4", profileId: "p1", title: "Vitamin D3 weekly dose", category: "Medicine", date: day(-2), done: false },
];

export const DEMO_TIMELINE: TimelineItem[] = [
  { id: "t1", date: day(6), kind: "symptom", title: "Symptom recorded", detail: "Headache · 4/10" },
  { id: "t2", date: day(5), kind: "report", title: "Blood report uploaded", detail: "Complete Blood Count" },
  { id: "t3", date: day(5), kind: "ai", title: "AI report explanation", detail: "Hemoglobin now within reference range" },
  { id: "t4", date: day(3), kind: "symptom", title: "Symptom recorded", detail: "Headache · 7/10" },
  { id: "t5", date: day(2), kind: "summary", title: "Doctor summary generated", detail: "Shared PDF prepared for consultation" },
  { id: "t6", date: day(1), kind: "reminder", title: "Reminder created", detail: "Annual full body checkup" },
];

export const HEALTH_SCORE = {
  total: 78,
  breakdown: [
    { label: "Sleep", value: 64 },
    { label: "Nutrition", value: 74 },
    { label: "Activity", value: 71 },
    { label: "Hydration", value: 82 },
    { label: "Stress / Wellness", value: 80 },
    { label: "Preventive Care", value: 92 },
  ],
};
