import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../_core/llm", () => ({ invokeLLM: vi.fn() }));

import { invokeLLM } from "../_core/llm";
import { explainGovernmentText } from "./nila";

const mockInvokeLLM = vi.mocked(invokeLLM);

beforeEach(() => {
  vi.stubEnv("MANUS_API_URL", "https://api.example.test");
  vi.stubEnv("MANUS_API_KEY", "test-key");
  mockInvokeLLM.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

function validResponse(content: unknown) {
  return { choices: [{ message: { content } }] } as never;
}

describe("Explain This", () => {
  it("returns a deterministic safe fallback when managed AI is not configured", async () => {
    vi.stubEnv("MANUS_API_URL", "");
    const result = await explainGovernmentText("சேவை மையத்தில் விண்ணப்பிக்கவும்");

    expect(result.usedAi).toBe(false);
    expect(result.summaryTamil).toContain("அரசு திட்டம்");
    expect(mockInvokeLLM).not.toHaveBeenCalled();
  });

  it("returns only a bounded, validated Tamil response from managed AI", async () => {
    mockInvokeLLM.mockResolvedValue(validResponse(JSON.stringify({
      summaryTamil: "மையத்தில் விண்ணப்பிக்கவும்.",
      pointsTamil: ["ஆவணங்களை எடுத்துச் செல்லுங்கள்."],
      checklistTamil: ["ஆவணங்களைத் தயார் செய்யுங்கள்."],
    })));

    const result = await explainGovernmentText("விண்ணப்ப வழிமுறை");

    expect(result).toMatchObject({
      summaryTamil: "மையத்தில் விண்ணப்பிக்கவும்.",
      pointsTamil: ["ஆவணங்களை எடுத்துச் செல்லுங்கள்."],
      checklistTamil: ["ஆவணங்களைத் தயார் செய்யுங்கள்."],
      usedAi: true,
    });
    expect(result.sourceTamil).toContain("அதிகாரப்பூர்வ");
  });

  it("uses the safe fallback for malformed model output and clips oversized input", async () => {
    mockInvokeLLM.mockResolvedValue(validResponse(JSON.stringify({
      summaryTamil: "",
      pointsTamil: [],
      checklistTamil: [],
    })));
    const oversizedText = "x".repeat(6000);

    const result = await explainGovernmentText(oversizedText);

    expect(result.usedAi).toBe(false);
    const request = mockInvokeLLM.mock.calls[0][0];
    const userMessage = request.messages.find(message => message.role === "user");
    expect(JSON.stringify(userMessage).length).toBeLessThan(5200);
  });

  it("recovers when the managed model call throws", async () => {
    mockInvokeLLM.mockRejectedValue(new Error("temporary outage"));

    const result = await explainGovernmentText("வழிகாட்டி உரை");

    expect(result.usedAi).toBe(false);
    expect(result.summaryTamil).toContain("எளிமையாக");
  });
});
