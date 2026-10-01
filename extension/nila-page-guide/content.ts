import { getPageGuideSuggestion, isSupportedGovernmentUrl, normalizePageLabel } from "./core";

declare const chrome: {
  runtime: {
    onMessage: {
      addListener: (listener: (message: { type?: string; goal?: string }, sender: unknown, sendResponse: (response: { ok: boolean; instructionTamil: string; noteTamil: string; targetLabel?: string }) => void) => boolean | void) => void;
    };
  };
};

const GLOBAL_KEY = "__NILA_PAGE_GUIDE_LISTENER__";
const HOST_ID = "nila-page-guide-overlay";
let activeOverlay: { host: HTMLElement; controller: AbortController } | null = null;

type Candidate = { element: HTMLElement; label: string };

function visibleNavigationCandidates(): Candidate[] {
  return [...document.querySelectorAll<HTMLElement>("a, button, [role='button']")]
    .filter(element => {
      if (element.closest(`#${HOST_ID}`) || element.closest("input, textarea, select, [contenteditable='true']")) return false;
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
    })
    .map(element => ({
      element,
      // Only visible/accessibility labels for links and buttons are inspected; hrefs and form values are never read.
      label: (element.getAttribute("aria-label") || element.innerText || element.getAttribute("title") || "").replace(/\s+/g, " ").trim().slice(0, 120),
    }))
    .filter(candidate => candidate.label.length > 0)
    .slice(0, 100);
}

function removeExistingOverlay() {
  if (activeOverlay) {
    activeOverlay.controller.abort();
    activeOverlay.host.remove();
    activeOverlay = null;
  } else {
    document.getElementById(HOST_ID)?.remove();
  }
}

function showGuide(suggestion: ReturnType<typeof getPageGuideSuggestion>, target?: HTMLElement) {
  removeExistingOverlay();
  const host = document.createElement("div");
  const controller = new AbortController();
  host.id = HOST_ID;
  host.setAttribute("data-nila-guide", "true");
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none";
  activeOverlay = { host, controller };
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `
    :host{all:initial}.panel{position:fixed;top:14px;right:14px;z-index:2;max-width:min(370px,calc(100vw - 28px));box-sizing:border-box;padding:16px 18px;border-radius:16px;background:#111111;color:#fff;font:15px/1.55 system-ui,sans-serif;box-shadow:0 14px 42px #11111166;pointer-events:auto}.panel strong{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#fff0a6}.panel p{margin:8px 0;color:#fff}.panel .note{font-size:12px;color:#fff9bf}.close{float:right;border:0;border-radius:8px;padding:6px 9px;background:#fff;color:#111111;font:700 12px system-ui,sans-serif;cursor:pointer}.arrow-layer{position:fixed;inset:0;width:100vw;height:100vh;overflow:visible;pointer-events:none}.target-box{fill:#fff0a655;stroke:#f2c200;stroke-width:4;rx:10}.arrow-path{fill:none;stroke:#f2c200;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 2px 4px #0005)}
  `;
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.setAttribute("role", "status");
  panel.setAttribute("aria-live", "polite");
  const close = document.createElement("button");
  close.className = "close";
  close.type = "button";
  close.textContent = "மூடு";
  close.addEventListener("click", removeExistingOverlay);
  const heading = document.createElement("strong");
  heading.textContent = "Selvi — அடுத்த படி";
  const instruction = document.createElement("p");
  instruction.textContent = suggestion.instructionTamil;
  const note = document.createElement("p");
  note.className = "note";
  note.textContent = suggestion.noteTamil;
  panel.append(close, heading, instruction, note);
  shadow.append(style, panel);

  if (target) {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.classList.add("arrow-layer");
    svg.setAttribute("aria-hidden", "true");
    const defs = document.createElementNS(svgNamespace, "defs");
    const marker = document.createElementNS(svgNamespace, "marker");
    marker.setAttribute("id", "nila-arrow-head");
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "8");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "8");
    marker.setAttribute("markerHeight", "8");
    marker.setAttribute("orient", "auto-start-reverse");
    const arrowHead = document.createElementNS(svgNamespace, "path");
    arrowHead.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
    arrowHead.setAttribute("fill", "#f2c200");
    marker.append(arrowHead);
    defs.append(marker);
    const box = document.createElementNS(svgNamespace, "rect");
    box.classList.add("target-box");
    const path = document.createElementNS(svgNamespace, "path");
    path.classList.add("arrow-path");
    path.setAttribute("marker-end", "url(#nila-arrow-head)");
    svg.append(defs, box, path);
    shadow.append(svg);

    const drawArrow = () => {
      if (!target?.isConnected) return;
      svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
      const rect = target.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      box.setAttribute("x", String(rect.left - 5));
      box.setAttribute("y", String(rect.top - 5));
      box.setAttribute("width", String(rect.width + 10));
      box.setAttribute("height", String(rect.height + 10));
      const startX = panelRect.left + panelRect.width / 2;
      const startY = panelRect.bottom;
      const endX = rect.left + rect.width / 2;
      const endY = rect.top + rect.height / 2;
      const bendY = Math.max(startY + 24, Math.min(endY - 24, startY + (endY - startY) * 0.45));
      path.setAttribute("d", `M ${startX} ${startY} C ${startX} ${bendY}, ${endX} ${bendY}, ${endX} ${endY}`);
    };
    requestAnimationFrame(drawArrow);
    window.addEventListener("scroll", drawArrow, { passive: true, signal: controller.signal });
    window.addEventListener("resize", drawArrow, { signal: controller.signal });
  }

  document.documentElement.append(host);
}

if (!(window as Window & { [GLOBAL_KEY]?: boolean })[GLOBAL_KEY]) {
  (window as Window & { [GLOBAL_KEY]?: boolean })[GLOBAL_KEY] = true;
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type !== "NILA_PAGE_GUIDE" || typeof message.goal !== "string") return;
    if (!isSupportedGovernmentUrl(window.location.href)) {
      sendResponse({ ok: false, instructionTamil: "இந்த உதவி PM Vishwakarma அதிகாரப்பூர்வ தளத்தில் மட்டுமே இயங்கும்.", noteTamil: "வேறு பக்கத்தை அணுகவில்லை." });
      return;
    }
    const candidates = visibleNavigationCandidates();
    const suggestion = getPageGuideSuggestion(message.goal, candidates.map(candidate => candidate.label));
    const target = suggestion.targetLabel
      ? candidates.find(candidate => normalizePageLabel(candidate.label) === normalizePageLabel(suggestion.targetLabel!))?.element
      : undefined;
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    showGuide(suggestion, target);
    sendResponse({ ok: true, instructionTamil: suggestion.instructionTamil, noteTamil: suggestion.noteTamil, ...(suggestion.targetLabel ? { targetLabel: suggestion.targetLabel } : {}) });
  });
}
