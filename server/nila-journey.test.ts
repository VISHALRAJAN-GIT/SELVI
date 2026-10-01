import { describe, expect, it } from "vitest";
import { getJourneySummary, parseAge, parseIncome, parseLocation, parseOccupation } from "../client/src/lib/journey";
import { evaluateProfile, type UserProfile } from "../shared/scheme";

describe("Tamil journey answer parsing", () => {
  it("parses Arabic and Tamil digits from spoken-style age answers", () => {
    expect(parseAge("எனக்கு 28 வயது")).toBe(28);
    expect(parseAge("எனக்கு ௨௮ வயது")).toBe(28);
    expect(parseAge("எனக்கு இருபத்தெட்டு வயது")).toBe(28);
    expect(parseAge("முப்பத்தி இரண்டு வயது")).toBe(32);
    expect(parseAge("பதினெட்டு")).toBe(18);
    expect(parseAge("தொண்ணூற்றெட்டு")).toBe(98);
    expect(parseAge("வயது தெரியவில்லை")).toBeUndefined();
  });

  it("recognizes Tamil Nadu and other-location answers", () => {
    expect(parseLocation("ஆம், தமிழ்நாட்டில் வசிக்கிறேன்")).toBe("தமிழ்நாடு");
    expect(parseLocation("இல்லை, வேறு மாநிலம்")).toBe("வேறு மாநிலம்");
  });

  it("does not silently label an unclear income answer as low", () => {
    expect(parseIncome("குறைவு")).toBe("குறைவு");
    expect(parseIncome("நடுத்தரம்")).toBe("நடுத்தரம்");
    expect(parseIncome("எனக்குத் தெரியவில்லை")).toBe("தெரியவில்லை");
    expect(parseIncome("பதில் சொல்ல விரும்பவில்லை")).toBe("தெரியவில்லை");
  });

  it("keeps a non-empty occupation and accepts the guided tailoring choice", () => {
    expect(parseOccupation("தையல் / துணி வேலை")).toBe("தையல் / துணி வேலை");
    expect(parseOccupation(" ")).toBe("மற்ற கைவினைத் தொழில்");
  });
});

describe("PM Vishwakarma first-pass guidance", () => {
  const profile: UserProfile = {
    age: 28,
    state: "தமிழ்நாடு",
    incomeBand: "குறைவு",
    occupation: "தையல் / துணி வேலை",
  };

  it("marks the guided adult Tamil Nadu tailoring example as a possible fit", () => {
    expect(evaluateProfile(profile)).toMatchObject({
      likelyEligible: true,
      ageEligible: true,
      locationEligible: true,
      occupationEligible: true,
      reasons: [],
    });
  });

  it("does not claim a match for underage, out-of-scope, or unmatched profiles", () => {
    expect(evaluateProfile({ ...profile, age: 17 }).likelyEligible).toBe(false);
    expect(evaluateProfile({ ...profile, state: "வேறு மாநிலம்" }).likelyEligible).toBe(false);
    expect(evaluateProfile({ ...profile, occupation: "அலுவலக வேலை" }).likelyEligible).toBe(false);
  });

  it("does not use the contextual income band as an eligibility criterion", () => {
    const results = (["குறைவு", "நடுத்தரம்", "தெரியவில்லை"] as const)
      .map(incomeBand => evaluateProfile({ ...profile, incomeBand }).likelyEligible);
    expect(results).toEqual([true, true, true]);
  });

  it("does not produce a result until all four guided answers exist", () => {
    expect(getJourneySummary({ age: 28, state: "தமிழ்நாடு", incomeBand: "குறைவு" })).toBeNull();
    expect(getJourneySummary(profile)?.likelyEligible).toBe(true);
  });
});
