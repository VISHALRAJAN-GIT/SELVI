import { isSupportedGovernmentUrl } from "./core";

declare const chrome: {
  tabs: {
    query: (query: { active: boolean; currentWindow: boolean }) => Promise<Array<{ id?: number; url?: string }>>;
    sendMessage: (tabId: number, message: { type: string; goal: string }) => Promise<{ ok: boolean; instructionTamil: string; noteTamil: string; targetLabel?: string }>;
  };
  scripting: { executeScript: (options: { target: { tabId: number }; files: string[] }) => Promise<unknown> };
};

const status = document.querySelector<HTMLElement>("#status");
const form = document.querySelector<HTMLFormElement>("#guide-form");
const goalInput = document.querySelector<HTMLInputElement>("#goal");
const runButton = document.querySelector<HTMLButtonElement>("#run-guide");

function showStatus(message: string, kind: "info" | "error" | "success" = "info") {
  if (!status) return;
  status.textContent = message;
  status.dataset.kind = kind;
}

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-task]")) {
  button.addEventListener("click", () => {
    if (goalInput) goalInput.value = button.dataset.task || "";
    goalInput?.focus();
  });
}

async function activeOfficialTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url || !isSupportedGovernmentUrl(tab.url)) {
    throw new Error("முதலில் https://pmvishwakarma.gov.in என்ற அதிகாரப்பூர்வ தளத்தைத் திறக்கவும்.");
  }
  return tab;
}

form?.addEventListener("submit", async event => {
  event.preventDefault();
  const goal = goalInput?.value.trim() || "";
  if (goal.length < 2) {
    showStatus("எதைச் செய்ய விரும்புகிறீர்கள் என்று சொல்லுங்கள்.", "error");
    return;
  }
  if (runButton) runButton.disabled = true;
  showStatus("தெரியும் இணைப்புகளை இந்தச் சாதனத்தில் மட்டும் பார்க்கிறோம்…");
  try {
    const tab = await activeOfficialTab();
    await chrome.scripting.executeScript({ target: { tabId: tab.id! }, files: ["dist/content.js"] });
    const result = await chrome.tabs.sendMessage(tab.id!, { type: "NILA_PAGE_GUIDE", goal });
    showStatus(result.instructionTamil, result.targetLabel ? "success" : "info");
  } catch (error) {
    showStatus(error instanceof Error ? error.message : "வழிகாட்டியைத் தொடங்க முடியவில்லை. மீண்டும் முயற்சி செய்யுங்கள்.", "error");
  } finally {
    if (runButton) runButton.disabled = false;
  }
});

void activeOfficialTab().then(
  () => showStatus("அதிகாரப்பூர்வ PM Vishwakarma தளம். உங்கள் கேள்வியைத் தேர்ந்தெடுக்கவும்.", "success"),
  () => showStatus("இந்த உதவி pmvishwakarma.gov.in தளத்தில் மட்டுமே இயங்கும்.", "error"),
);
