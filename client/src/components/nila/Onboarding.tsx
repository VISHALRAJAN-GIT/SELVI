import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, MapPin, Volume2 } from "lucide-react";
import { LANGUAGE_CHOICES, type LocaleCode } from "@/lib/i18n";

export function SplashScreen({ eyebrow, title, body, startNow, onStart }: {
  eyebrow: string;
  title: string;
  body: string;
  startNow: string;
  onStart: () => void;
}) {
  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(onStart, reduceMotion ? 350 : 1500);
    return () => window.clearTimeout(timer);
  }, [onStart]);

  return (
    <main className="onboarding-shell splash-shell" aria-label="Selvi welcome">
      <section className="onboarding-card splash-card" aria-live="polite">
        <img src="/nila-icon.png" alt="" className="splash-mark" />
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="splash-description">{body}</p>
        <div className="loading-dots" role="status" aria-label={eyebrow}><span /><span /><span /></div>
        <button type="button" className="primary-button onboarding-primary" onClick={onStart}>{startNow}<ArrowRight size={19} aria-hidden="true" /></button>
      </section>
    </main>
  );
}

export function LanguagePicker({ title, description, priorityNote, priorityLabel, shareTemplate, sourceNote, readAloudLabel, sourceLabel, selected, onSelect, onRead, censusSource }: {
  title: string;
  description: string;
  priorityNote: string;
  priorityLabel: string;
  shareTemplate: string;
  sourceNote: string;
  readAloudLabel: string;
  sourceLabel: string;
  selected: LocaleCode;
  onSelect: (locale: LocaleCode) => void;
  onRead: (locale: LocaleCode) => void;
  censusSource: string;
}) {
  return (
    <section className="onboarding-card" aria-labelledby="language-title">
      <div className="onboarding-kicker">1 / 2</div>
      <h1 id="language-title">{title}</h1>
      <p className="onboarding-description">{description}</p>
      <p className="priority-note">{priorityNote}</p>
      <div className="language-grid">
        {LANGUAGE_CHOICES.map(language => (
          <div className={`language-choice ${selected === language.code ? "selected" : ""} ${language.preferredFirst ? "language-featured" : ""}`} key={language.code}>
            <button type="button" className="language-main" onClick={() => onSelect(language.code)} aria-pressed={selected === language.code}>
              <span className="language-script" lang={language.code}>{language.nativeName}</span>
              <span className="language-meta"><strong>{language.englishName}</strong><small>{language.preferredFirst ? priorityLabel : shareTemplate.replace("{share}", language.speakerShare)}</small></span>
              {selected === language.code && <Check size={20} aria-label="Selected" />}
            </button>
            <button type="button" className="language-speak" onClick={() => onRead(language.code)} aria-label={`${readAloudLabel}: ${language.englishName}`}>
              <Volume2 size={18} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <p className="small-source-note">{sourceNote} <a href={censusSource} target="_blank" rel="noreferrer">{sourceLabel}</a>.</p>
    </section>
  );
}

export function StatePicker({ title, description, tamilNaduLabel, otherStateLabel, searchPlaceholder, noResultsText, backLabel, locale, selectedState, stateNames, onBack, onSelect }: {
  title: string;
  description: string;
  tamilNaduLabel: string;
  otherStateLabel: string;
  searchPlaceholder: string;
  noResultsText: string;
  backLabel: string;
  locale: LocaleCode;
  selectedState: string;
  stateNames: Record<string, string>;
  onBack: () => void;
  onSelect: (stateEnglishName: string) => void;
}) {
  const [showOther, setShowOther] = useState(false);
  const [query, setQuery] = useState("");
  const allStates = useMemo(() => Object.keys(stateNames).filter(name => name !== "Tamil Nadu"), [stateNames]);
  const matches = allStates.filter(name => `${name} ${stateNames[name]}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  return (
    <section className="onboarding-card" aria-labelledby="state-title">
      <button type="button" className="back-button onboarding-back" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" />{backLabel}</button>
      <div className="onboarding-kicker">2 / 2</div>
      <h1 id="state-title">{title}</h1>
      <p className="onboarding-description">{description}</p>
      <button type="button" className={`state-feature ${selectedState === "Tamil Nadu" ? "selected" : ""}`} onClick={() => onSelect("Tamil Nadu")} aria-pressed={selectedState === "Tamil Nadu"}>
        <span className="state-icon"><MapPin size={22} aria-hidden="true" /></span>
        <span><strong>{tamilNaduLabel}</strong><small>Tamil Nadu</small></span>
        <ArrowRight size={19} aria-hidden="true" />
      </button>
      <button type="button" className="other-state-toggle" onClick={() => setShowOther(value => !value)} aria-expanded={showOther}>
        <span>{otherStateLabel}</span><ArrowRight size={18} aria-hidden="true" className={showOther ? "rotate-down" : ""} />
      </button>
      {showOther && (
        <div className="state-chooser">
          <label className="sr-only" htmlFor="state-search">{searchPlaceholder}</label>
          <input id="state-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={searchPlaceholder} />
          <div className="state-grid" role="group" aria-label={title}>
            {matches.map(name => (
              <button type="button" className={`state-option ${selectedState === name ? "selected" : ""}`} key={name} onClick={() => onSelect(name)}>
                <span lang={locale}>{stateNames[name]}</span><small>{name}</small>
              </button>
            ))}
            {matches.length === 0 && <p className="empty-state">{noResultsText}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
