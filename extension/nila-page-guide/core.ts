export type PageGuideSuggestion = {
  targetLabel?: string;
  instructionTamil: string;
  noteTamil: string;
  outcome: "match" | "no-match" | "registration-safety";
};

export function isSupportedGovernmentUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    return url.protocol === "https:" && ["pmvishwakarma.gov.in", "www.pmvishwakarma.gov.in"].includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function normalizePageLabel(value: string) {
  return value.toLocaleLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
}

function findLabel(labels: string[], phrases: string[], excluded: string[] = []) {
  const matches = labels.filter(label => {
    const normalized = normalizePageLabel(label);
    return normalized && !excluded.some(term => normalized.includes(normalizePageLabel(term))) && phrases.some(phrase => normalized.includes(normalizePageLabel(phrase)));
  });
  const unique = [...new Set(matches)];
  return unique.length === 1 ? unique[0] : undefined;
}

function isNewRegistrationRequest(goal: string) {
  return /register|registration|apply|application|enrol|enroll|பதிவு|விண்ணப்ப|சேர்க்கை/i.test(goal)
    && !/status|track|நிலை|தடம்|ஏற்கனவே/i.test(goal);
}

export function getPageGuideSuggestion(goal: string, visibleLabels: string[]): PageGuideSuggestion {
  const cleanGoal = goal.trim();
  const labels = visibleLabels.map(label => label.trim()).filter(label => label.length > 0 && label.length <= 120);
  const safeLabels = labels.filter(label => !/\bcsc\s*login\b|csc உள்நுழைவு/i.test(label));

  if (isNewRegistrationRequest(cleanGoal)) {
    const faq = findLabel(safeLabels, ["faq", "frequently asked questions", "அடிக்கடி கேட்கப்படும் கேள்வி"]);
    return {
      ...(faq ? { targetLabel: faq } : {}),
      instructionTamil: faq
        ? `புதிய பதிவுக்கு முதலில் “${faq}”-இல் அதிகாரப்பூர்வ வழிமுறையைப் பாருங்கள்.`
        : "புதிய பதிவின் தற்போதைய வழிமுறையை அதிகாரப்பூர்வ FAQ-இல் உறுதிசெய்யுங்கள்.",
      noteTamil: "‘CSC Login’ என்பது CSC பயனர்களுக்கானது; பொதுப் பயனராக அதைப் பயன்படுத்த வேண்டாம். Selvi எந்தப் படிவத்தையும் நிரப்பவோ சமர்ப்பிக்கவோ செய்யாது.",
      outcome: "registration-safety",
    };
  }

  const intentRules: Array<{ match: RegExp; phrases: string[]; instruction: string }> = [
    { match: /eligib|தகுதி/i, phrases: ["eligibility criteria", "eligibility", "தகுதி"], instruction: "தகுதி விதிகளைப் பார்க்க" },
    { match: /benefit|scheme details|உதவி|பயன்|பலன்|திட்ட விவரம்/i, phrases: ["scheme benefits", "benefits", "scheme details", "திட்டப் பயன்", "பயன்கள்"], instruction: "திட்டப் பயன்களைப் பார்க்க" },
    { match: /faq|question|கேள்வி|வினா/i, phrases: ["faq", "frequently asked questions", "அடிக்கடி கேட்கப்படும் கேள்வி"], instruction: "அதிகாரப்பூர்வ FAQ-ஐப் பார்க்க" },
    { match: /status|track|நிலை|நிலவரம்/i, phrases: ["applicant/beneficiary login", "beneficiary login", "application status", "status"], instruction: "விண்ணப்ப நிலை அல்லது பயனாளர் உள்நுழைவு" },
  ];

  for (const rule of intentRules) {
    if (!rule.match.test(cleanGoal)) continue;
    const targetLabel = findLabel(safeLabels, rule.phrases);
    return targetLabel
      ? { targetLabel, instructionTamil: `${rule.instruction} — “${targetLabel}” என்பதைத் திறக்கலாம்.`, noteTamil: "இது ஒரு சுட்டி மட்டுமே; இணையதளத்தில் அடுத்த செயலை நீங்களே தேர்ந்தெடுக்கவும்.", outcome: "match" }
      : { instructionTamil: "இந்தப் பக்கத்தில் பொருத்தமான தெரியும் இணைப்பைக் கண்டுபிடிக்க முடியவில்லை. அதிகாரப்பூர்வ FAQ-ஐத் திறந்து பார்க்கவும்.", noteTamil: "இணையதள வடிவம் மாறியிருக்கலாம்; Selvi எந்தத் தகவலையும் சமர்ப்பிக்கவில்லை.", outcome: "no-match" };
  }

  const goalTokens = normalizePageLabel(cleanGoal).split(" ").filter(token => token.length >= 2);
  const scores = safeLabels.map(label => ({ label, score: goalTokens.filter(token => normalizePageLabel(label).includes(token)).length })).filter(item => item.score > 0).sort((a, b) => b.score - a.score);
  if (scores.length > 0 && (scores.length === 1 || scores[0].score > scores[1].score)) {
    return { targetLabel: scores[0].label, instructionTamil: `உங்கள் கேள்வியுடன் பொருந்தக்கூடிய இணைப்பு: “${scores[0].label}”.`, noteTamil: "இது சாதனத்தில் மட்டுமே செய்யப்பட்ட சொல்-பொருத்தம்; உறுதியாகத் தெரியாவிட்டால் அதிகாரப்பூர்வ FAQ-ஐப் பாருங்கள்.", outcome: "match" };
  }
  return { instructionTamil: "எந்த இணைப்பைத் தேர்வு செய்வது என்று உறுதியாகத் தெரியவில்லை. உங்கள் நோக்கத்தைச் சுருக்கமாக மாற்றி முயற்சி செய்யுங்கள் அல்லது அதிகாரப்பூர்வ FAQ-ஐப் பாருங்கள்.", noteTamil: "எந்த இணைப்பையும் Selvi தானாகத் திறக்காது.", outcome: "no-match" };
}
