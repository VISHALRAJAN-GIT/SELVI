import { ArrowRight, Check, ExternalLink, Headphones, HelpCircle, LockKeyhole, Mic, RotateCcw, Volume2 } from "lucide-react";
import type { ReactNode } from "react";

export function SelviHeader({ onStartOver, onExplain, onLanguage, startOverLabel = "மீண்டும் தொடங்கு", explainLabel = "இதை விளக்குங்கள்", languageLabel = "மொழியை மாற்றுங்கள்", brandLabel = "Selvi முகப்புப் பக்கம்" }: {
  onStartOver?: () => void;
  onExplain?: () => void;
  onLanguage?: () => void;
  startOverLabel?: string;
  explainLabel?: string;
  languageLabel?: string;
  brandLabel?: string;
}) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label={brandLabel}>
        <img src="/nila-icon.png" alt="" className="brand-mark" />
        <span>
          <strong>NILA</strong>
        </span>
      </a>
      <div className="header-actions">
        {onLanguage && <button className="text-button" type="button" onClick={onLanguage}>{languageLabel}</button>}
        {onExplain && <button className="text-button" type="button" onClick={onExplain}>
          <HelpCircle size={17} aria-hidden="true" />
          {explainLabel}
        </button>}
        {onStartOver && <button className="quiet-button" type="button" onClick={onStartOver} aria-label={startOverLabel}>
          <RotateCcw size={17} aria-hidden="true" />
          <span className="desktop-only">{startOverLabel}</span>
        </button>}
      </div>
    </header>
  );
}

export function VoiceButton({
  listening,
  supported,
  onClick,
  onSpeak,
  voiceStatus,
  speakLabel = "கேள்வியை கேளுங்கள்",
  micLabel = "பேசவும்",
  listeningLabel = "கேட்கிறோம்…",
  micAriaLabel = "தமிழில் பேச மைக்ரோஃபோனைத் திறக்கவும்",
  listeningAriaLabel = "குரலை கேட்கிறோம். நிறுத்த அழுத்தவும்",
  supportedMessage = "மைக் பொத்தானை அழுத்தி தமிழில் பேசுங்கள்; கேட்ட பதிலைச் சரிபார்த்து தொடரலாம்.",
  unsupportedMessage = "குரல் உள்ளீடு இந்த browser-ல் இல்லை; கீழே தட்டச்சு செய்யலாம்.",
  privacyMessage = "குரல் அறிதலை உங்கள் browser வழங்குகிறது. Selvi-வில் குரல் கோப்பு சேமிக்கப்படாது.",
}: {
  listening: boolean;
  supported: boolean;
  onClick: () => void;
  onSpeak: () => void;
  voiceStatus: string;
  speakLabel?: string;
  micLabel?: string;
  listeningLabel?: string;
  micAriaLabel?: string;
  listeningAriaLabel?: string;
  supportedMessage?: string;
  unsupportedMessage?: string;
  privacyMessage?: string;
}) {
  return (
    <div className="voice-area">
      <div className="voice-actions">
        <button
          type="button"
          className={`voice-button ${listening ? "is-listening" : ""}`}
          onClick={onClick}
          aria-pressed={listening}
          aria-label={listening ? listeningAriaLabel : micAriaLabel}
        >
          <span className="voice-halo" aria-hidden="true" />
          <Mic size={42} strokeWidth={2.1} aria-hidden="true" />
          <span>{listening ? listeningLabel : micLabel}</span>
        </button>
        <button type="button" className="voice-play-button" onClick={onSpeak}>
          <Volume2 size={18} aria-hidden="true" /> {speakLabel}
        </button>
      </div>
      <p className="voice-caption">
        {supported ? supportedMessage : unsupportedMessage}
      </p>
      <p className="voice-privacy">{privacyMessage}</p>
      {voiceStatus && <p className="voice-status" role="status" aria-live="polite">{voiceStatus}</p>}
    </div>
  );
}

export function ProgressRail({ current, total = 5 }: { current: number; total?: number }) {
  return (
    <div className="progress-wrap" aria-label={`படி ${current} / ${total}`}>
      <div className="progress-copy"><span>உங்கள் பயணம்</span><strong>படி {current} / {total}</strong></div>
      <div className="progress-track" aria-hidden="true"><span style={{ width: `${Math.min(100, (current / total) * 100)}%` }} /></div>
    </div>
  );
}

export function ChoiceGrid({ choices, onChoose }: { choices: Array<{ label: string; value: string; helper?: string }>; onChoose: (value: string) => void }) {
  return (
    <div className="choice-grid">
      {choices.map(choice => (
        <button type="button" className="choice-button" key={choice.value} onClick={() => onChoose(choice.value)}>
          <span>{choice.label}</span>
          {choice.helper && <small>{choice.helper}</small>}
        </button>
      ))}
    </div>
  );
}

export function AssistantNote({ children, onSpeak }: { children: ReactNode; onSpeak?: () => void }) {
  return (
    <div className="assistant-note" role="status" aria-live="polite">
      <div className="assistant-avatar" aria-hidden="true"><img src="/nila-icon.png" alt="" /></div>
      <div className="assistant-copy"><span className="eyebrow">NILA சொல்கிறது</span><p>{children}</p></div>
      {onSpeak && <button type="button" className="icon-button" onClick={onSpeak} aria-label="வழிகாட்டி உரையைப் படித்துக் கேளுங்கள்"><Volume2 size={19} aria-hidden="true" /></button>}
    </div>
  );
}

export function TrustStrip() {
  return (
    <div className="trust-strip">
      <span><LockKeyhole size={16} aria-hidden="true" /> தனியுரிமை முதலில்</span>
      <span><Check size={16} aria-hidden="true" /> அரசு மூலத்துடன் சரிபார்க்கப்பட்டது</span>
      <span><Headphones size={16} aria-hidden="true" /> கேட்கவும் அல்லது படிக்கவும்</span>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

export function OfficialLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="official-link" href={href} target="_blank" rel="noreferrer"><span>{children}</span><ExternalLink size={18} aria-hidden="true" /></a>;
}

export function GuideEntryButton({ onClick, children = "அரசு இணையதளத்தில் படிப்படியாகச் செல்லுங்கள்" }: { onClick: () => void; children?: ReactNode }) {
  return <button type="button" className="guide-entry-button" onClick={onClick}><span>{children}</span><ArrowRight size={18} aria-hidden="true" /></button>;
}
