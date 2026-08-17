import type { RiskLevel } from "./health-types";

export const EMERGENCY_PATTERNS = [
  "chest pain",
  "severe chest",
  "cannot breathe",
  "can't breathe",
  "breathing difficulty",
  "shortness of breath",
  "unconscious",
  "fainted",
  "slurred speech",
  "face drooping",
  "one side weakness",
  "severe bleeding",
  "blood vomit",
  "seizure",
  "suicid",
  "anaphyla",
  "swelling of throat",
  "saans nahi",
  "seene me dard",
];

export const HIGH_PATTERNS = [
  "high fever",
  "104",
  "103",
  "persistent vomiting",
  "dehydration",
  "severe pain",
  "blood in stool",
  "blurred vision",
  "confusion",
  "stiff neck",
];

export interface SymptomSignal {
  symptoms: string[];
  duration: string;
  severity: number;
  location: string;
  frequency: string;
}

export interface Concern {
  name: string;
  why: string;
  matching: string[];
  missing: string[];
  warning: string[];
}

export interface Analysis {
  risk: RiskLevel;
  riskReason: string;
  concerns: Concern[];
  plan: {
    doNow: string[];
    monitor: string[];
    avoid: string[];
    contactDoctorIf: string[];
    urgentIf: string[];
  };
}

const SYMPTOM_KEYWORDS: Record<string, string[]> = {
  fever: ["fever", "temperature", "bukhar"],
  headache: ["headache", "head pain", "sir dard", "migraine"],
  "body pain": ["body pain", "body ache", "badan dard", "muscle pain"],
  cough: ["cough", "khansi"],
  "sore throat": ["sore throat", "throat pain", "gale me dard"],
  "stomach pain": ["stomach", "abdominal", "pet dard", "tummy"],
  nausea: ["nausea", "nauseous", "vomit", "ulti", "jee michalna"],
  fatigue: ["tired", "fatigue", "weakness", "thakan", "kamzori"],
  dizziness: ["dizzy", "dizziness", "chakkar", "lightheaded"],
  "cold symptoms": ["runny nose", "sneez", "cold", "zukam", "congestion"],
  diarrhea: ["diarrhea", "loose motion", "dast"],
  "chest discomfort": ["chest", "seena"],
  "breathing difficulty": ["breath", "saans"],
  rash: ["rash", "itching", "khujli"],
  "back pain": ["back pain", "kamar dard"],
};

const CONCERN_LIBRARY: Record<string, Concern> = {
  viral: {
    name: "Common viral infection (e.g. viral fever / flu-like illness)",
    why: "Fever together with body pain, headache or throat irritation is commonly associated with self-limiting viral illnesses.",
    matching: [],
    missing: ["Measured temperature readings", "Recent exposure to someone unwell", "Vaccination history"],
    warning: ["Fever above 103°F / 39.4°C", "Fever lasting more than 3 days", "Breathing difficulty"],
  },
  tension: {
    name: "Tension-type headache",
    why: "Dull, pressure-like head pain linked with screen time, stress or poor sleep is often described in tension-type headaches.",
    matching: [],
    missing: ["Sleep pattern for the past week", "Eye-strain or vision changes", "Caffeine intake"],
    warning: ["Sudden 'worst ever' headache", "Headache with vomiting or vision loss", "Weakness on one side"],
  },
  dehydration: {
    name: "Dehydration or low fluid intake",
    why: "Fatigue, dizziness and headache can be associated with insufficient fluid or electrolyte intake.",
    matching: [],
    missing: ["Daily water intake", "Urine colour/frequency", "Recent heat exposure"],
    warning: ["Very little urine for 8+ hours", "Fainting", "Rapid heartbeat"],
  },
  gastro: {
    name: "Gastric irritation or gastroenteritis",
    why: "Stomach discomfort with nausea or loose stools is frequently associated with digestive infections or food irritation.",
    matching: [],
    missing: ["Recent food history", "Whether others are also unwell", "Stool frequency"],
    warning: ["Blood in stool or vomit", "Persistent vomiting", "Signs of dehydration"],
  },
  anemia: {
    name: "Low haemoglobin / nutritional deficiency pattern",
    why: "Ongoing tiredness and dizziness are sometimes associated with low haemoglobin, iron or vitamin D levels.",
    matching: [],
    missing: ["Recent blood test results", "Dietary intake", "Menstrual history if applicable"],
    warning: ["Breathlessness on mild activity", "Very pale skin", "Fainting"],
  },
  respiratory: {
    name: "Upper respiratory tract irritation",
    why: "Cough with throat irritation and congestion is often associated with upper respiratory infections or allergies.",
    matching: [],
    missing: ["Whether sputum is present", "Allergy history", "Smoke or dust exposure"],
    warning: ["Wheezing", "Chest tightness", "Coughing blood"],
  },
};

export function extractSignals(text: string, severity: number, duration: string): SymptomSignal {
  const t = text.toLowerCase();
  const symptoms = Object.entries(SYMPTOM_KEYWORDS)
    .filter(([, keys]) => keys.some((k) => t.includes(k)))
    .map(([name]) => name);
  const location = /head|sir/.test(t)
    ? "Head"
    : /stomach|pet|abdom/.test(t)
      ? "Abdomen"
      : /chest|seena/.test(t)
        ? "Chest"
        : /throat|gale/.test(t)
          ? "Throat"
          : "Generalised";
  return {
    symptoms: symptoms.length ? symptoms : ["General discomfort"],
    duration: duration || "Not specified",
    severity,
    location,
    frequency: /every day|daily|roz|constant/.test(t) ? "Continuous / daily" : "Intermittent",
  };
}

export function detectEmergency(text: string) {
  const t = text.toLowerCase();
  return EMERGENCY_PATTERNS.some((p) => t.includes(p));
}

export function analyzeSymptoms(text: string, severity: number, duration: string): Analysis {
  const t = text.toLowerCase();
  const signals = extractSignals(text, severity, duration);
  const emergency = detectEmergency(text);
  const high = HIGH_PATTERNS.some((p) => t.includes(p)) || severity >= 9;

  let risk: RiskLevel = "low";
  let riskReason =
    "The symptoms you described are commonly associated with mild, self-limiting conditions and you did not report warning signs.";
  if (emergency) {
    risk = "emergency";
    riskReason =
      "You reported symptoms that can indicate a potentially life-threatening condition. These need immediate professional assessment — this tool cannot evaluate them safely.";
  } else if (high) {
    risk = "high";
    riskReason =
      "Some of the symptoms you reported can require prompt medical evaluation, especially at the severity you described.";
  } else if (severity >= 7 || /week|days/.test(duration.toLowerCase())) {
    risk = "moderate";
    riskReason =
      "Your symptoms are either moderately intense or have lasted for a while, so a professional review is reasonable if they do not settle.";
  }

  const picked: Concern[] = [];
  const add = (key: string, matching: string[]) => {
    const base = CONCERN_LIBRARY[key];
    if (!base || picked.length >= 4) return;
    picked.push({ ...base, matching });
  };
  const has = (s: string) => signals.symptoms.includes(s);

  if (has("fever") || has("body pain") || has("sore throat")) add("viral", signals.symptoms.filter((s) => ["fever", "body pain", "sore throat", "headache", "cold symptoms"].includes(s)));
  if (has("headache")) add("tension", signals.symptoms.filter((s) => ["headache", "fatigue"].includes(s)));
  if (has("dizziness") || has("fatigue")) add("dehydration", signals.symptoms.filter((s) => ["dizziness", "fatigue", "headache"].includes(s)));
  if (has("stomach pain") || has("nausea") || has("diarrhea")) add("gastro", signals.symptoms.filter((s) => ["stomach pain", "nausea", "diarrhea"].includes(s)));
  if (has("fatigue")) add("anemia", signals.symptoms.filter((s) => ["fatigue", "dizziness"].includes(s)));
  if (has("cough") || has("cold symptoms")) add("respiratory", signals.symptoms.filter((s) => ["cough", "cold symptoms", "sore throat"].includes(s)));
  if (!picked.length) add("viral", signals.symptoms);

  return {
    risk,
    riskReason,
    concerns: picked,
    plan: {
      doNow: [
        "Rest and allow your body time to recover.",
        "Sip fluids regularly unless a doctor has advised you to restrict fluids.",
        "Keep a simple note of your temperature, symptoms and timings.",
        "Eat light, easily digestible meals if your appetite allows.",
      ],
      monitor: [
        "Whether the intensity increases over the next 24–48 hours.",
        "New symptoms such as breathlessness, vomiting, rash or confusion.",
        "Fluid intake and urine frequency.",
        "Temperature at regular intervals if you have a fever.",
      ],
      avoid: [
        "Self-medicating with antibiotics or someone else's prescription.",
        "Changing or stopping any prescribed medicine without your doctor's advice.",
        "Strenuous activity while symptoms are active.",
        "Relying on internet information instead of a professional review.",
      ],
      contactDoctorIf: [
        "Symptoms persist beyond 2–3 days or keep returning.",
        "Fever does not settle or keeps rising.",
        "You are pregnant, elderly, immunocompromised, or managing a chronic condition.",
        "Symptoms interfere with eating, drinking, sleeping or daily activity.",
      ],
      urgentIf: [
        "Chest pain, pressure or severe breathlessness.",
        "Fainting, confusion, or a seizure.",
        "Weakness on one side of the body, slurred speech or facial drooping.",
        "Uncontrolled bleeding, or vomiting/passing blood.",
        "Severe allergic reaction with swelling of the face, lips or throat.",
      ],
    },
  };
}

export const FOLLOW_UPS = [
  { id: "location", q: "Where exactly do you feel it most?", options: ["Head", "Chest", "Abdomen", "Throat", "All over"] },
  { id: "onset", q: "When did it start?", options: ["Today", "1–2 days ago", "About a week ago", "More than a week ago"] },
  { id: "pattern", q: "How would you describe the pattern?", options: ["Constant", "Comes and goes", "Worse at night", "Worse after meals"] },
  { id: "assoc", q: "Are any of these also present?", options: ["Vomiting", "Breathing difficulty", "Rash", "Dizziness", "None of these"] },
];

export interface Medicine {
  name: string;
  generic: string;
  uses: string;
  precautions: string;
  sideEffects: string;
  warnings: string;
  storage: string;
  interactions: string;
}

export const MEDICINES: Medicine[] = [
  {
    name: "Paracetamol",
    generic: "Acetaminophen",
    uses: "Commonly used for fever and mild to moderate pain.",
    precautions: "People with liver conditions or regular alcohol intake should speak to a doctor first.",
    sideEffects: "Usually well tolerated; nausea or rash are reported uncommonly.",
    warnings: "Exceeding the recommended daily dose can seriously harm the liver. Check other combination medicines for the same ingredient.",
    storage: "Store below 25°C, away from moisture and direct sunlight.",
    interactions: "May interact with warfarin and some anti-seizure medicines.",
  },
  {
    name: "Ibuprofen",
    generic: "Ibuprofen",
    uses: "Commonly used for pain, inflammation and fever.",
    precautions: "Usually taken with food. Caution advised in kidney disease, asthma, or stomach ulcers.",
    sideEffects: "Stomach discomfort, heartburn, nausea.",
    warnings: "Can increase risk of stomach bleeding and may affect kidney function; discuss with a doctor if used regularly.",
    storage: "Store in a cool, dry place.",
    interactions: "Notable interactions with blood thinners, other NSAIDs, and some blood pressure medicines.",
  },
  {
    name: "Cetirizine",
    generic: "Cetirizine hydrochloride",
    uses: "Commonly used for allergy symptoms such as sneezing, runny nose and itching.",
    precautions: "May cause drowsiness in some people; caution when driving.",
    sideEffects: "Drowsiness, dry mouth, headache.",
    warnings: "Dose adjustment may be needed in kidney impairment.",
    storage: "Store at room temperature.",
    interactions: "Sedation may increase with alcohol or other sedating medicines.",
  },
  {
    name: "Amoxicillin",
    generic: "Amoxicillin",
    uses: "A prescription antibiotic used for certain bacterial infections.",
    precautions: "Prescription only. Complete the course exactly as your doctor advises.",
    sideEffects: "Diarrhoea, nausea, rash.",
    warnings: "Should not be used by people with penicillin allergy. Antibiotics do not treat viral infections.",
    storage: "Store as instructed on the label; some suspensions need refrigeration.",
    interactions: "May interact with methotrexate and reduce effectiveness of some oral contraceptives.",
  },
  {
    name: "Metformin",
    generic: "Metformin hydrochloride",
    uses: "A prescription medicine used in the management of type 2 diabetes.",
    precautions: "Prescription only; kidney function is usually monitored.",
    sideEffects: "Stomach upset, nausea, metallic taste.",
    warnings: "Never start, stop or change the dose without your doctor's guidance.",
    storage: "Store at room temperature.",
    interactions: "Interactions reported with certain contrast dyes, diuretics and alcohol.",
  },
  {
    name: "Aspirin",
    generic: "Acetylsalicylic acid",
    uses: "Used for pain and fever, and in low doses for cardiovascular protection when prescribed.",
    precautions: "Not usually given to children. Caution in bleeding disorders and ulcers.",
    sideEffects: "Stomach irritation, easy bruising.",
    warnings: "Increases bleeding risk, particularly with other blood-thinning medicines.",
    storage: "Store in a dry place.",
    interactions: "Important interactions with warfarin, ibuprofen and other NSAIDs.",
  },
];

export type InteractionLevel = "none" | "potential" | "important";

export interface InteractionResult {
  pair: string;
  level: InteractionLevel;
  meaning: string;
  why: string;
  watchFor: string;
}

const INTERACTION_TABLE: Record<string, Omit<InteractionResult, "pair">> = {
  "aspirin|ibuprofen": {
    level: "important",
    meaning: "Two anti-inflammatory medicines taken together.",
    why: "Combining them is widely documented to increase the risk of stomach irritation and bleeding, and ibuprofen may reduce aspirin's heart-protective effect.",
    watchFor: "Black stools, stomach pain, vomiting blood, unusual bruising.",
  },
  "aspirin|paracetamol": {
    level: "potential",
    meaning: "Both are pain and fever medicines.",
    why: "Generally considered a low-concern combination, but overlapping use can mask symptoms and increase total dose exposure.",
    watchFor: "Stomach discomfort; avoid duplicating combination products.",
  },
  "ibuprofen|metformin": {
    level: "potential",
    meaning: "An anti-inflammatory taken alongside a diabetes medicine.",
    why: "Anti-inflammatory medicines can affect kidney function, which matters for metformin clearance.",
    watchFor: "Reduced urine output, swelling, unusual fatigue.",
  },
  "amoxicillin|paracetamol": {
    level: "none",
    meaning: "No major interaction found in the demo dataset.",
    why: "These are commonly used together under medical guidance.",
    watchFor: "Any new rash, which may indicate an allergic reaction.",
  },
  "cetirizine|paracetamol": {
    level: "none",
    meaning: "No major interaction found in the demo dataset.",
    why: "Commonly used together for cold and allergy symptoms.",
    watchFor: "Excess drowsiness.",
  },
};

export function checkInteractions(names: string[]): InteractionResult[] {
  const clean = names.map((n) => n.trim().toLowerCase()).filter(Boolean);
  const out: InteractionResult[] = [];
  for (let i = 0; i < clean.length; i++) {
    for (let j = i + 1; j < clean.length; j++) {
      const key = [clean[i], clean[j]].sort().join("|");
      const found = INTERACTION_TABLE[key];
      out.push(
        found
          ? { pair: `${clean[i]} + ${clean[j]}`, ...found }
          : {
              pair: `${clean[i]} + ${clean[j]}`,
              level: "none",
              meaning: "No major interaction found in the available demo dataset.",
              why: "This demo dataset is limited and does not cover every medicine combination.",
              watchFor: "Any new or unexpected symptom after starting a new medicine.",
            },
      );
    }
  }
  return out;
}

export interface TermExplanation {
  term: string;
  simple: string;
  meaning: string;
  whyMonitored: string;
  riskFactors: string[];
  tests: string[];
  questions: string[];
  kid: string;
}

export const TERMS: TermExplanation[] = [
  {
    term: "Hypertension",
    simple: "High blood pressure.",
    meaning: "Blood pushes against the artery walls with more force than usual over a sustained period.",
    whyMonitored: "Long-term raised pressure is associated with strain on the heart, kidneys, eyes and brain.",
    riskFactors: ["Family history", "High salt intake", "Low physical activity", "Excess weight", "Ongoing stress", "Smoking"],
    tests: ["Blood pressure measurement", "Kidney function tests", "Lipid profile", "ECG"],
    questions: ["What is my target blood pressure?", "How often should I measure it at home?", "Which lifestyle changes matter most for me?"],
    kid: "Your blood travels through tiny pipes. If it pushes too hard for a long time, the pipes get tired — so doctors keep an eye on it.",
  },
  {
    term: "CBC",
    simple: "A common blood test that counts the cells in your blood.",
    meaning: "Complete Blood Count measures red cells, white cells and platelets.",
    whyMonitored: "It gives a broad first look at infection, anaemia and clotting-related patterns.",
    riskFactors: ["Not applicable — this is a test, not a condition"],
    tests: ["Hemoglobin", "WBC count", "Platelet count", "RBC indices"],
    questions: ["Which values in my CBC need attention?", "Should this test be repeated?", "Do the results explain my symptoms?"],
    kid: "It's a blood check that counts the tiny helpers in your blood to see if everything looks normal.",
  },
  {
    term: "Anemia",
    simple: "Fewer healthy red blood cells or less haemoglobin than expected.",
    meaning: "Less oxygen is carried around the body, which can be associated with tiredness.",
    whyMonitored: "Finding the underlying cause matters more than the number alone.",
    riskFactors: ["Low iron intake", "Blood loss", "Some chronic conditions", "Vitamin B12 or folate deficiency"],
    tests: ["CBC", "Iron studies", "Vitamin B12", "Ferritin"],
    questions: ["What might be causing this?", "Do I need iron studies?", "How soon should I retest?"],
    kid: "Your blood carries oxygen like tiny delivery trucks. Anemia means there are fewer trucks, so you feel tired.",
  },
  {
    term: "Cholesterol",
    simple: "A fat-like substance in your blood.",
    meaning: "Some types are associated with build-up in blood vessels while others are considered protective.",
    whyMonitored: "Patterns over time help doctors estimate cardiovascular risk.",
    riskFactors: ["Diet high in saturated fat", "Low activity", "Genetics", "Smoking"],
    tests: ["Lipid profile", "HbA1c", "Blood pressure"],
    questions: ["What is my target LDL?", "Do I need medication or lifestyle changes first?", "When should I retest?"],
    kid: "It's a slippery stuff in your blood. Too much of the wrong kind can clog the pipes, so doctors measure it.",
  },
  {
    term: "Gastrointestinal",
    simple: "Related to the digestive system.",
    meaning: "Covers the stomach, intestines and connected organs that handle food.",
    whyMonitored: "Digestive symptoms often need context — timing, diet and duration.",
    riskFactors: ["Irregular eating", "Infections", "Certain medicines", "Stress"],
    tests: ["Stool tests", "Endoscopy when indicated", "Blood tests"],
    questions: ["Could my diet or medicines be involved?", "Do I need any tests?", "What warning signs should I watch for?"],
    kid: "It just means your tummy and food pipes — the parts that digest what you eat.",
  },
];

export const SIMPLE_TERMS: Record<string, string> = {
  hypertension: "high blood pressure",
  gastrointestinal: "digestive system",
  myocardial: "heart muscle",
  hyperglycemia: "high blood sugar",
  hypoglycemia: "low blood sugar",
  dyspnea: "difficulty breathing",
  pyrexia: "fever",
  edema: "swelling",
  analgesic: "pain reliever",
  antipyretic: "fever reducer",
  hemoglobin: "oxygen-carrying part of blood (hemoglobin)",
};

export function simplify(text: string) {
  let out = text;
  for (const [k, v] of Object.entries(SIMPLE_TERMS)) {
    out = out.replace(new RegExp(`\\b${k}\\b`, "gi"), v);
  }
  return out;
}

export type Language = "en" | "hi" | "hinglish";

export function assistantReply(question: string, lang: Language): string {
  const q = question.toLowerCase();
  if (detectEmergency(q)) {
    return lang === "hi"
      ? "🚨 आपने जो लक्षण बताए हैं वे आपातकालीन हो सकते हैं। कृपया तुरंत नज़दीकी आपातकालीन सेवा या डॉक्टर से संपर्क करें। मैं इस स्थिति का आकलन नहीं कर सकता।"
      : "🚨 What you described can indicate a medical emergency. Please contact emergency services or reach the nearest emergency department immediately. I can't safely assess this — please don't wait.";
  }
  const body = (() => {
    if (q.includes("tired") || q.includes("fatigue") || q.includes("thak"))
      return "Tiredness has many everyday causes — short or irregular sleep, low fluid intake, skipped meals, high stress, or low iron/vitamin D levels. Track your sleep and water for a week in the Health Tracking page. If tiredness lasts more than 2 weeks, worsens, or comes with breathlessness or dizziness, a doctor can check basics like a CBC, thyroid and vitamin levels.";
    if (q.includes("cbc"))
      return "CBC stands for Complete Blood Count. It measures red blood cells (oxygen delivery), white blood cells (immune defence) and platelets (clotting). Doctors use it as a broad first look — one value slightly outside range does not confirm a disease on its own.";
    if (q.includes("sleep"))
      return "Practical sleep habits that most guidelines agree on: keep a fixed wake-up time, get daylight in the morning, avoid caffeine after mid-afternoon, dim screens an hour before bed, and keep the room cool and dark. If you snore heavily or feel unrefreshed despite 7–8 hours, mention it to a doctor.";
    if (q.includes("doctor") && q.includes("ask"))
      return "Useful questions: What could be causing these symptoms? Are any tests needed? Could my current medicines be contributing? What should I monitor at home? What warning signs mean I should come back sooner? Open 'Prepare for Doctor' to auto-generate a summary you can carry.";
    if (q.includes("medicine") || q.includes("dawa"))
      return "I can share general information about a medicine — its common uses, precautions, side effects and general interaction notes — from the Medicines page. I can't recommend a prescription medicine or tell you to change a dose; that has to come from your doctor or pharmacist.";
    if (q.includes("report") || q.includes("value"))
      return "Upload or open a report in the Reports section and I'll break each value down: your value, the reference range, whether it sits inside it, and a plain-language explanation — plus questions worth asking your doctor.";
    return "Here's a general, educational take: describe the symptom, how long it has lasted, how intense it feels (1–10), and anything that makes it better or worse. The Symptom Checker walks through that step by step and ends with a 'What should I do now?' plan. For anything that is worsening, unusual for you, or worrying, a professional review is the right next step.";
  })();

  if (lang === "hi") return `${body}\n\n(यह जानकारी केवल शैक्षिक उद्देश्य के लिए है और डॉक्टर की सलाह का विकल्प नहीं है।)`;
  if (lang === "hinglish") return `${body}\n\n(Ye sirf general health information hai — doctor ki salah ka replacement nahi hai.)`;
  return `${body}\n\nThis is general health information, not a diagnosis.`;
}

export const RISK_META: Record<RiskLevel, { label: string; emoji: string; className: string }> = {
  low: { label: "Low risk", emoji: "🟢", className: "bg-success/15 text-success border-success/30" },
  moderate: { label: "Moderate risk", emoji: "🟡", className: "bg-warning/20 text-warning-foreground border-warning/40" },
  high: { label: "High risk", emoji: "🟠", className: "bg-warning/25 text-warning-foreground border-warning/50" },
  urgent: { label: "Urgent", emoji: "🔴", className: "bg-destructive/15 text-destructive border-destructive/30" },
  emergency: { label: "Possible emergency", emoji: "🚨", className: "bg-destructive text-destructive-foreground border-destructive" },
};

export function bmi(weightKg: number, heightCm: number) {
  const m = heightCm / 100;
  return +(weightKg / (m * m)).toFixed(1);
}

export function bmiCategory(value: number) {
  if (value < 18.5) return "Below typical range";
  if (value < 25) return "Within typical range";
  if (value < 30) return "Above typical range";
  return "Well above typical range";
}

export function bmr(weightKg: number, heightCm: number, age: number, gender: string) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(gender.toLowerCase().startsWith("f") ? base - 161 : base + 5);
}
