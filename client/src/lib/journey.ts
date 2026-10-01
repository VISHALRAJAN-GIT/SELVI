import { evaluateProfile, type IncomeBand, type UserProfile } from "@shared/scheme";

export type JourneyStep = "age" | "location" | "income" | "occupation" | "result";

export const journeyPrompts: Record<Exclude<JourneyStep, "result">, string> = {
  age: "உங்கள் வயது எவ்வளவு? எண்களாகவோ தமிழில் சொல்லாகவோ சொல்லலாம்.",
  location: "நீங்கள் தமிழ்நாட்டில் வசிக்கிறீர்களா?",
  income: "இந்தக் கேள்வி திட்ட முடிவை மாற்றாது. உங்கள் குடும்ப வருமானம் குறைவா அல்லது நடுத்தரமா?",
  occupation: "நீங்கள் எந்தத் தொழில் செய்கிறீர்கள்?",
};

const tamilNumberWords = new Map<string, number>(Object.entries({
  பூஜ்ஜியம்: 0,
  சுழியம்: 0,
  ஒன்று: 1,
  ஒன்னு: 1,
  ஒரு: 1,
  இரண்டு: 2,
  ரெண்டு: 2,
  மூன்று: 3,
  மூணு: 3,
  நான்கு: 4,
  நாலு: 4,
  ஐந்து: 5,
  அஞ்சு: 5,
  ஆறு: 6,
  ஏழு: 7,
  எட்டு: 8,
  ஒன்பது: 9,
  பத்து: 10,
  பதினொன்று: 11,
  பன்னிரண்டு: 12,
  பதின்மூன்று: 13,
  பதினான்கு: 14,
  பதினைந்து: 15,
  பதினாறு: 16,
  பதினேழு: 17,
  பதினெட்டு: 18,
  பத்தொன்பது: 19,
  இருபது: 20,
  முப்பது: 30,
  நாற்பது: 40,
  ஐம்பது: 50,
  அறுபது: 60,
  எழுபது: 70,
  எண்பது: 80,
  தொண்ணூறு: 90,
  நூறு: 100,
}));

const tamilUnits = [
  { words: ["ஒன்று", "ஒண்ணு"], suffix: "த்தொன்று", separatedSuffix: "த்தொன்று" },
  { words: ["இரண்டு", "ரெண்டு"], suffix: "த்திரண்டு", separatedSuffix: "த்திரண்டு" },
  { words: ["மூன்று", "மூணு"], suffix: "த்துமூன்று", separatedSuffix: "த்துமூன்று" },
  { words: ["நான்கு", "நாலு"], suffix: "த்திநான்கு", separatedSuffix: "த்திநான்கு" },
  { words: ["ஐந்து", "அஞ்சு"], suffix: "த்தைந்து", separatedSuffix: "த்தைந்து" },
  { words: ["ஆறு"], suffix: "த்தாறு", separatedSuffix: "த்தாறு" },
  { words: ["ஏழு"], suffix: "த்தேழு", separatedSuffix: "த்தேழு" },
  { words: ["எட்டு"], suffix: "த்தெட்டு", separatedSuffix: "த்தெட்டு" },
  { words: ["ஒன்பது"], suffix: "த்தொன்பது", separatedSuffix: "த்தொன்பது" },
] as const;

const compoundTens = [
  { value: 20, joinedPrefix: "இருப", separatedPrefix: "இருபத்தி" },
  { value: 30, joinedPrefix: "முப்ப", separatedPrefix: "முப்பத்தி" },
  { value: 40, joinedPrefix: "நாற்ப", separatedPrefix: "நாற்பத்தி" },
  { value: 50, joinedPrefix: "ஐம்ப", separatedPrefix: "ஐம்பத்தி" },
  { value: 60, joinedPrefix: "அறுப", separatedPrefix: "அறுபத்தி" },
  { value: 70, joinedPrefix: "எழுப", separatedPrefix: "எழுபத்தி" },
  { value: 80, joinedPrefix: "எண்ப", separatedPrefix: "எண்பத்தி" },
] as const;

for (const tens of compoundTens) {
  for (let index = 0; index < tamilUnits.length; index += 1) {
    const unit = tamilUnits[index];
    const value = tens.value + index + 1;
    tamilNumberWords.set(`${tens.joinedPrefix}${unit.suffix}`, value);
    for (const word of unit.words) tamilNumberWords.set(`${tens.separatedPrefix}${word}`, value);
  }
}

const ninetiesEndings = ["ற்றொன்று", "ற்றிரண்டு", "ற்றுமூன்று", "ற்றிநான்கு", "த்தைந்து", "ற்றாறு", "ற்றேழு", "ற்றெட்டு", "ற்றொன்பது"];
for (let index = 0; index < ninetiesEndings.length; index += 1) {
  tamilNumberWords.set(`தொண்ணூ${ninetiesEndings[index]}`, 91 + index);
}
for (const [index, unit] of tamilUnits.entries()) {
  for (const word of unit.words) tamilNumberWords.set(`தொண்ணூற்றி${word}`, 91 + index);
}

// Tamil speech recognizers may return a spoken age as a word rather than digits.
// Match the longest number word first so a compound such as "இருபத்தெட்டு" wins.
const orderedTamilNumberWords = [...tamilNumberWords.entries()].sort(([left], [right]) => right.length - left.length);

export function parseAge(text: string) {
  const tamilDigits = text.replace(/[௦-௯]/g, digit => String("௦௧௨௩௪௫௬௭௮௯".indexOf(digit)));
  const digitMatch = tamilDigits.match(/\d{1,3}/);
  if (digitMatch) return Number(digitMatch[0]);

  const normalized = text
    .toLowerCase()
    .replace(/எனக்கு|எனது|என்|வயது|வயசு|ஆண்டுகள்?|வருடங்கள்?|இருக்கிறது|ஆகிறது|நான்/g, "")
    .replace(/[^\p{L}\p{M}\p{N}]/gu, "");
  const match = orderedTamilNumberWords.find(([word]) => normalized.includes(word));
  return match ? match[1] : undefined;
}

export function parseLocation(text: string) {
  const normalized = text.toLowerCase();
  return normalized.includes("தமிழ்நாடு") || normalized.includes("tamil nadu") || normalized.includes("ஆம்") || normalized.includes("yes") ? "தமிழ்நாடு" : "வேறு மாநிலம்";
}

export function parseIncome(text: string): IncomeBand {
  const normalized = text.toLowerCase();
  if (normalized.includes("தெரிய") || normalized.includes("don't") || normalized.includes("unknown")) return "தெரியவில்லை";
  if (normalized.includes("நடுத்தர") || normalized.includes("middle") || normalized.includes("medium")) return "நடுத்தரம்";
  if (normalized.includes("குறைவு") || normalized.includes("குறைந்த") || normalized.includes("low")) return "குறைவு";
  return "தெரியவில்லை";
}

export function parseOccupation(text: string) {
  return text.trim() || "மற்ற கைவினைத் தொழில்";
}

export function getJourneySummary(profile: Partial<UserProfile>) {
  if (!profile.age || !profile.state || !profile.incomeBand || !profile.occupation) return null;
  return evaluateProfile(profile as UserProfile);
}
