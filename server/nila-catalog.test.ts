import { describe, expect, it } from "vitest";
import { SERVICE_CATALOG, getServicesForState, OFFICIAL_MORE_SERVICES_URL, OFFICIAL_STATES_DIRECTORY_URL } from "../client/src/data/serviceCatalog";
import { CENSUS_LANGUAGE_SOURCE, INDIA_STATES, LANGUAGE_CHOICES, LOCALE_CONTENT, type LocaleCode } from "../client/src/lib/i18n";

const locales: LocaleCode[] = ["ta", "hi", "bn", "mr", "te"];

 describe("Selvi's beginner-first service directory", () => {
  it("keeps the initial catalog at eight curated guides with official HTTPS entry and source links", () => {
    expect(SERVICE_CATALOG).toHaveLength(8);
    expect(new Set(SERVICE_CATALOG.map(service => service.id)).size).toBe(8);
    for (const service of SERVICE_CATALOG) {
      expect(service.officialUrl).toMatch(/^https:\/\//);
      expect(service.officialUrl).toMatch(/\.gov\.in\//);
      expect(service.sources.length).toBeGreaterThanOrEqual(2);
      expect(service.sources.every(source => source.url.startsWith("https://"))).toBe(true);
      expect(service.lastVerified).toBe("2026-10-01");
      expect(service.stepsTamil.length).toBeGreaterThanOrEqual(3);
      expect(service.prepareTamil.length).toBeGreaterThan(0);
      expect(service.safetyTamil.length).toBeGreaterThan(0);
    }
    expect(OFFICIAL_MORE_SERVICES_URL).toBe("https://www.india.gov.in/services/state");
    expect(OFFICIAL_STATES_DIRECTORY_URL).toBe("https://igod.gov.in/sg/states");
    expect(CENSUS_LANGUAGE_SOURCE).toMatch(/^https:\/\//);
  });

  it("always offers India-wide guides and only offers Tamil Nadu local guides in Tamil Nadu", () => {
    const tamilNaduIds = getServicesForState("Tamil Nadu").map(service => service.id);
    const otherState = getServicesForState("Maharashtra");
    expect(tamilNaduIds).toHaveLength(8);
    expect(otherState).toHaveLength(5);
    expect(otherState.every(service => service.scope === "india")).toBe(true);
    expect(tamilNaduIds).toContain("tn-community-certificate");
    expect(tamilNaduIds).toContain("tn-income-certificate");
    expect(tamilNaduIds).toContain("tn-family-card");
  });

  it("has all 36 states and Union Territories in each enabled locale", () => {
    expect(INDIA_STATES).toHaveLength(36);
    for (const locale of locales) {
      expect(Object.keys(LOCALE_CONTENT[locale].states)).toHaveLength(36);
      expect(LOCALE_CONTENT[locale].states["Tamil Nadu"]).toBeTruthy();
    }
  });

  it("uses Tamil first but keeps Census language shares in descending order for the other choices", () => {
    expect(LANGUAGE_CHOICES[0]).toMatchObject({ code: "ta", preferredFirst: true, censusRank: 5 });
    expect(LANGUAGE_CHOICES.slice(1).map(language => language.censusRank)).toEqual([1, 2, 3, 4]);
    expect(LANGUAGE_CHOICES.map(language => language.code)).toEqual(["ta", "hi", "bn", "mr", "te"]);
  });

  it("keeps identical UI keys and service/item counts across all five localizations", () => {
    const expectedUiKeys = Object.keys(LOCALE_CONTENT.ta.ui).sort();
    const serviceIds = SERVICE_CATALOG.map(service => service.id).sort();
    for (const locale of locales) {
      expect(Object.keys(LOCALE_CONTENT[locale].ui).sort()).toEqual(expectedUiKeys);
      expect(Object.keys(LOCALE_CONTENT[locale].services).sort()).toEqual(serviceIds);
      for (const service of SERVICE_CATALOG) {
        const translated = LOCALE_CONTENT[locale].services[service.id];
        expect(translated.name.trim().length).toBeGreaterThan(1);
        expect(translated.steps).toHaveLength(service.stepsTamil.length);
        expect(translated.prepare).toHaveLength(service.prepareTamil.length);
        expect(translated.safety).toHaveLength(service.safetyTamil.length);
        expect(translated.scope.trim().length).toBeGreaterThan(1);
      }
    }
  });
});
