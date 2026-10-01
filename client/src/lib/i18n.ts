import localeSource from "../data/localeSource.ta.json";
import translatedLocales from "../data/localeCopy.generated.json";
import { SERVICE_CATALOG, type LocaleServiceCopy, type ServiceId } from "@/data/serviceCatalog";

export type LocaleCode = "ta" | "hi" | "bn" | "mr" | "te";
export type UiKey = keyof typeof localeSource.ui;
export type UiCopy = Record<UiKey, string>;
export type LocaleContent = {
  ui: UiCopy;
  states: Record<string, string>;
  services: Record<ServiceId, LocaleServiceCopy>;
};

export const LANGUAGE_CHOICES: Array<{
  code: LocaleCode;
  englishName: string;
  nativeName: string;
  censusRank: number;
  speakerShare: string;
  preferredFirst?: boolean;
}> = [
  { code: "ta", englishName: "Tamil", nativeName: "தமிழ்", censusRank: 5, speakerShare: "5.70%", preferredFirst: true },
  { code: "hi", englishName: "Hindi", nativeName: "हिन्दी", censusRank: 1, speakerShare: "43.63%" },
  { code: "bn", englishName: "Bengali", nativeName: "বাংলা", censusRank: 2, speakerShare: "8.03%" },
  { code: "mr", englishName: "Marathi", nativeName: "मराठी", censusRank: 3, speakerShare: "6.86%" },
  { code: "te", englishName: "Telugu", nativeName: "తెలుగు", censusRank: 4, speakerShare: "6.70%" },
];

export const CENSUS_LANGUAGE_SOURCE = "https://censusindia.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf";

export const INDIA_STATES = localeSource.states.map(state => ({
  englishName: state.english,
  tamilName: state.tamil,
}));

const tamilServices = Object.fromEntries(
  SERVICE_CATALOG.map(service => [service.id, {
    name: service.nameTamil,
    category: service.categoryTamil,
    goal: service.goalTamil,
    steps: service.stepsTamil,
    prepare: service.prepareTamil,
    safety: service.safetyTamil,
    scope: service.scopeTamil,
  }]),
) as Record<ServiceId, LocaleServiceCopy>;

type GeneratedLocale = {
  ui: UiCopy;
  states: Record<string, string>;
  services: Record<ServiceId, LocaleServiceCopy>;
};

const generated = translatedLocales as Record<Exclude<LocaleCode, "ta">, GeneratedLocale>;

export const LOCALE_CONTENT: Record<LocaleCode, LocaleContent> = {
  ta: {
    ui: localeSource.ui,
    states: Object.fromEntries(localeSource.states.map(state => [state.english, state.tamil])),
    services: tamilServices,
  },
  hi: generated.hi,
  bn: generated.bn,
  mr: generated.mr,
  te: generated.te,
};

export function getLocaleContent(locale: LocaleCode) {
  return LOCALE_CONTENT[locale];
}
