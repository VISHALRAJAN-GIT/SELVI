export type IncomeBand = "குறைவு" | "நடுத்தரம்" | "தெரியவில்லை";

export type UserProfile = {
  age: number;
  state: string;
  // Context only: this is not used by the controlled PM Vishwakarma eligibility rules.
  incomeBand: IncomeBand;
  occupation: string;
};

export type SchemeRecord = {
  slug: string;
  nameTamil: string;
  nameEnglish: string;
  promiseTamil: string;
  purposeTamil: string;
  whoItHelpsTamil: string;
  minimumAge: number;
  allowedStates: string[];
  tradeKeywords: string[];
  tradeOptionsTamil: string[];
  benefitsTamil: string[];
  documentsTamil: string[];
  applicationStepsTamil: string[];
  officialUrl: string;
  faqUrl: string;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
};

export const PM_VISHWAKARMA: SchemeRecord = {
  slug: "pm-vishwakarma",
  nameTamil: "பிரதம மந்திரி விஸ்வகர்மா திட்டம்",
  nameEnglish: "PM Vishwakarma",
  promiseTamil: "கைவினைத் தொழில் செய்பவர்களுக்கு பயிற்சி, கருவி உதவி, கடன் வழிகாட்டுதல்.",
  purposeTamil: "கைகளாலும் கருவிகளாலும் பாரம்பரியத் தொழில் செய்யும் கைவினைஞர்களுக்கு உதவும் மத்திய அரசு திட்டம்.",
  whoItHelpsTamil: "தையல், மர வேலை, மண்பாண்டம் போன்ற 18 பாரம்பரியத் தொழில்களில் சுயதொழில் செய்பவர்கள்.",
  minimumAge: 18,
  allowedStates: ["தமிழ்நாடு", "Tamil Nadu", "இந்தியா", "India"],
  tradeKeywords: ["தையல்", "tailor", "சிற்ப", "மர வேலை", "carpenter", "கொல்லர்", "blacksmith", "மண்பாண்ட", "potter", "செருப்பு", "cobbler", "கூடை", "நெசவு", "கைத்தறி", "தச்சு"],
  tradeOptionsTamil: ["தையல் / துணி வேலை", "மர வேலை / தச்சு", "மண்பாண்டம்", "செருப்பு வேலை", "மற்ற கைவினைத் தொழில்"],
  benefitsTamil: [
    "தொழில் திறன் சரிபார்ப்பு மற்றும் பயிற்சி வாய்ப்பு",
    "கருவி வாங்க உதவித்தொகை கிடைக்கலாம்",
    "குறைந்த வட்டி கடன் வழிகாட்டுதல் கிடைக்கலாம்",
    "சான்றிதழ் மற்றும் அடையாள அட்டை பெறும் வாய்ப்பு",
  ],
  documentsTamil: ["ஆதார் அட்டை", "கைபேசி எண்", "வங்கி கணக்கு விவரம்", "ரேஷன் அட்டை / குடும்ப விவரங்கள்"],
  applicationStepsTamil: [
    "அருகிலுள்ள பொது சேவை மையத்திற்குச் செல்லுங்கள்.",
    "உங்கள் தொழில் மற்றும் குடும்ப விவரங்களைச் சொல்லுங்கள்.",
    "தேவையான ஆவணங்களை மைய அலுவலரிடம் காட்டுங்கள்.",
    "பதிவு முடிந்த பிறகு கிடைக்கும் ரசீதை பாதுகாப்பாக வைத்துக் கொள்ளுங்கள்.",
  ],
  officialUrl: "https://pmvishwakarma.gov.in/",
  faqUrl: "https://pmvishwakarma.gov.in/Home/FAQ",
  sourceName: "PM Vishwakarma — அரசு FAQ",
  sourceUrl: "https://pmvishwakarma.gov.in/Home/FAQ",
  lastVerified: "2026-10-01",
};

export function evaluateProfile(profile: UserProfile) {
  // Income is collected as context only; the curated PM Vishwakarma first-pass
  // check uses the minimum age, supported location, and listed trade.
  const reasons: string[] = [];
  const ageEligible = profile.age >= PM_VISHWAKARMA.minimumAge;
  const locationEligible = PM_VISHWAKARMA.allowedStates.some(value => profile.state.toLowerCase().includes(value.toLowerCase()));
  const occupationEligible = PM_VISHWAKARMA.tradeKeywords.some(value => profile.occupation.toLowerCase().includes(value.toLowerCase()));

  if (!ageEligible) reasons.push("இந்தத் திட்டத்திற்கு 18 வயது அல்லது அதற்கு மேல் இருக்க வேண்டும்.");
  if (!locationEligible) reasons.push("இந்த வழிகாட்டி தற்போது தமிழ்நாட்டிற்காக அமைக்கப்பட்டுள்ளது.");
  if (!occupationEligible) reasons.push("உங்கள் தொழில் இந்தத் திட்டத்தின் கைவினைத் தொழில் பட்டியலில் இருக்கிறதா என்பதை மையத்தில் சரிபார்க்க வேண்டும்.");

  return {
    likelyEligible: ageEligible && locationEligible && occupationEligible,
    ageEligible,
    locationEligible,
    occupationEligible,
    reasons,
  };
}
