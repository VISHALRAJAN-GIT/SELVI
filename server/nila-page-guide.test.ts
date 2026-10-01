import { describe, expect, it } from "vitest";
import { getPageGuideSuggestion, isSupportedGovernmentUrl } from "../extension/nila-page-guide/core";

describe("Selvi page-guide extension", () => {
  it("accepts only HTTPS on the official PM Vishwakarma host", () => {
    expect(isSupportedGovernmentUrl("https://pmvishwakarma.gov.in/Home/FAQ")).toBe(true);
    expect(isSupportedGovernmentUrl("https://www.pmvishwakarma.gov.in/")).toBe(true);
    expect(isSupportedGovernmentUrl("http://pmvishwakarma.gov.in/")).toBe(false);
    expect(isSupportedGovernmentUrl("https://pmvishwakarma.gov.in.example.com/")).toBe(false);
    expect(isSupportedGovernmentUrl("https://unrelated.gov.in/")).toBe(false);
  });

  it("points an eligibility request to the visible eligibility control", () => {
    const suggestion = getPageGuideSuggestion("தகுதி விதிகளைப் பார்க்க", ["Scheme Benefits", "Eligibility Criteria", "CSC Login"]);
    expect(suggestion.targetLabel).toBe("Eligibility Criteria");
    expect(suggestion.outcome).toBe("match");
  });

  it("routes a new-registration request to FAQ and excludes CSC-only login", () => {
    const suggestion = getPageGuideSuggestion("புதிய பதிவு செய்ய வேண்டும்", ["Applicant/Beneficiary Login", "FAQ", "CSC Login"]);
    expect(suggestion.targetLabel).toBe("FAQ");
    expect(suggestion.outcome).toBe("registration-safety");
    expect(suggestion.noteTamil).toContain("CSC Login");
  });

  it("points a status request to applicant login, not CSC login", () => {
    const suggestion = getPageGuideSuggestion("விண்ணப்ப நிலையைப் பார்க்க", ["Applicant/Beneficiary Login", "CSC Login"]);
    expect(suggestion.targetLabel).toBe("Applicant/Beneficiary Login");
  });

  it("does not guess when a requested control is not visible", () => {
    const suggestion = getPageGuideSuggestion("தகுதி விதிகளைப் பார்க்க", ["Applicant/Beneficiary Login", "CSC Login"]);
    expect(suggestion.targetLabel).toBeUndefined();
    expect(suggestion.outcome).toBe("no-match");
  });
});
