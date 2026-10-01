import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getLanguageSamplePath, getTamilAudioPath, getTamilServiceGuideAudioPath, GUIDE_NARRATION_TEXT, VOICE_TEST_TEXT } from "../client/src/lib/voice";
import { SERVICE_CATALOG } from "../client/src/data/serviceCatalog";
import { LANGUAGE_CHOICES } from "../client/src/lib/i18n";

describe("bundled Tamil voice assets", () => {
  it("ships a greeting audio file for each language-choice card", () => {
    for (const language of LANGUAGE_CHOICES) {
      const audioPath = getLanguageSamplePath(language.code);
      expect(audioPath).toBe(`/audio/languages/${language.code}.mp3`);
      expect(existsSync(join(process.cwd(), "client/public", audioPath.slice(1)))).toBe(true);
    }
  });

  it("has a user-initiated voice test clip", () => {
    expect(getTamilAudioPath(VOICE_TEST_TEXT)).toBe("/audio/ta/voice-test.mp3");
  });

  it("maps every main guided question and explanation to a bundled clip", () => {
    expect(getTamilAudioPath("நாம் ஒன்றாகப் பார்க்கலாம். உங்களுக்கு பொருந்தக்கூடிய அரசு உதவியைத் தேட சில எளிய கேள்விகள் கேட்கிறேன்.")).toContain("welcome.mp3");
    expect(getTamilAudioPath("உங்கள் வயது எவ்வளவு? எண்களாகவோ தமிழில் சொல்லாகவோ சொல்லலாம்.")).toContain("age.mp3");
    expect(getTamilAudioPath("நீங்கள் தமிழ்நாட்டில் வசிக்கிறீர்களா?")).toContain("location.mp3");
    expect(getTamilAudioPath("இந்தக் கேள்வி திட்ட முடிவை மாற்றாது. உங்கள் குடும்ப வருமானம் குறைவா அல்லது நடுத்தரமா?")).toContain("income.mp3");
    expect(getTamilAudioPath("நீங்கள் எந்தத் தொழில் செய்கிறீர்கள்?")).toContain("occupation.mp3");
    expect(getTamilAudioPath("நன்றி. உங்கள் பதில்களை வைத்து இந்த வழிகாட்டி உங்களுக்கு உதவுமா என்று பார்க்கலாம்.")).toContain("result.mp3");
    expect(getTamilAudioPath("அரசு இணையதளத்தில் புரியாத உரை இருக்கிறதா? அதை இங்கே ஒட்டுங்கள். முக்கியமானதை எளிய தமிழில் சொல்கிறோம்.")).toContain("explain.mp3");
  });

  it("maps every official website guide step to its own narration clip", () => {
    expect(GUIDE_NARRATION_TEXT).toHaveLength(4);
    expect(getTamilAudioPath(GUIDE_NARRATION_TEXT[0])).toBe("/audio/ta/guide-1.mp3");
    expect(getTamilAudioPath(GUIDE_NARRATION_TEXT[1])).toBe("/audio/ta/guide-2.mp3");
    expect(getTamilAudioPath(GUIDE_NARRATION_TEXT[2])).toBe("/audio/ta/guide-3.mp3");
    expect(getTamilAudioPath(GUIDE_NARRATION_TEXT[3])).toBe("/audio/ta/guide-4.mp3");
  });

  it("ships a guaranteed Tamil narration file for every service guide", () => {
    for (const service of SERVICE_CATALOG) {
      const audioPath = getTamilServiceGuideAudioPath(service.id);
      expect(audioPath).toBe(`/audio/ta/services-${service.id}-guide.wav`);
      expect(existsSync(join(process.cwd(), "client/public", audioPath.slice(1)))).toBe(true);
    }
  });

  it("maps every Aadhaar slide to its exact Tamil narration file", () => {
    const aadhaar = SERVICE_CATALOG.find(service => service.id === "aadhaar")!;
    const slides = [...aadhaar.prepareTamil, ...aadhaar.stepsTamil, ...aadhaar.safetyTamil];
    expect(slides).toHaveLength(11);
    for (const text of slides) {
      const audioPath = getTamilAudioPath(text);
      expect(audioPath).toMatch(/^\/audio\/ta\/services-aadhaar-(prepare|step|safety)-[1-9][0-9]*\.wav$/);
      expect(existsSync(join(process.cwd(), "client/public", audioPath!.slice(1)))).toBe(true);
    }
  });
});
