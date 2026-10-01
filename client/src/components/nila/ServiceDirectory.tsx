import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpenText, ExternalLink, FileText, Globe2, MapPin, Mic, Search, ShieldAlert, Volume2 } from "lucide-react";
import { SERVICE_CATALOG, getServicesForState, OFFICIAL_MORE_SERVICES_URL, OFFICIAL_STATES_DIRECTORY_URL, type ServiceId, type ServiceRecord } from "@/data/serviceCatalog";
import { getLocaleContent, type LocaleCode } from "@/lib/i18n";
import { getTamilAudioPath } from "@/lib/voice";
import { OfficialLink, SectionHeading } from "@/components/nila/NilaUI";

type GuideSlide = { kind: "prepare" | "step" | "safety"; text: string };

export function ServiceDirectory({ locale, stateName, stateLabel, copy, onService, onState, onLanguage, onPmv, onExplain, onSpeak, listening, speechSupported, voiceStatus, onListen }: {
  locale: LocaleCode;
  stateName: string;
  stateLabel: string;
  copy: ReturnType<typeof getLocaleContent>;
  onService: (id: ServiceId) => void;
  onState: () => void;
  onLanguage: () => void;
  onPmv: () => void;
  onExplain: () => void;
  onSpeak: (text: string) => void;
  listening: boolean;
  speechSupported: boolean;
  voiceStatus: string;
  onListen: (onText: (text: string) => void) => void;
}) {
  const [query, setQuery] = useState("");
  const localState = stateName === "Tamil Nadu";
  const services = useMemo(() => getServicesForState(stateName).filter(service => {
    const localized = copy.services[service.id];
    const haystack = `${localized.name} ${localized.category} ${localized.goal} ${service.nameEnglish} ${service.nameTamil}`.toLocaleLowerCase();
    return haystack.includes(query.trim().toLocaleLowerCase());
  }), [copy, stateName, query]);
  const national = services.filter(service => service.scope === "india");
  const local = services.filter(service => service.scope === "tamil-nadu");

  return (
    <div className="service-directory">
      <div className="directory-topbar">
        <div><span className="eyebrow">{stateLabel}</span><h1>{copy.ui.catalogTitle}</h1><p>{copy.ui.catalogHelp}</p></div>
        <div className="directory-shortcuts">
          <button type="button" className="choice-button small-choice" onClick={onLanguage}>{copy.ui.changeLanguage}</button>
          <button type="button" className="choice-button small-choice" onClick={onState}>{copy.ui.changeState}</button>
        </div>
      </div>
      <div className="service-search-row"><label className="service-search"><Search size={19} aria-hidden="true" /><span className="sr-only">{copy.ui.searchService}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={copy.ui.searchService} /></label><button type="button" className={`search-voice-button ${listening ? "active" : ""}`} onClick={() => onListen(setQuery)} disabled={!speechSupported} aria-pressed={listening}><Mic size={19} aria-hidden="true" /><span>{listening ? copy.ui.voiceListening : copy.ui.speak}</span></button></div>
      <p className="directory-voice-hint" role="status" aria-live="polite">{voiceStatus || (speechSupported ? copy.ui.voicePrivacy : copy.ui.micUnavailable)}</p>
      <div className="catalog-caveat"><BookOpenText size={19} aria-hidden="true" /><div><p>{copy.ui.starterCatalog}</p><p>{copy.ui.notPopularityRank}</p></div></div>
      {!localState && <div className="catalog-caveat region-note"><MapPin size={19} aria-hidden="true" /><div><p>{copy.ui.otherStateNote}</p><a href={OFFICIAL_STATES_DIRECTORY_URL} target="_blank" rel="noreferrer">{copy.ui.moreStateServices}<ExternalLink size={14} aria-hidden="true" /></a></div></div>}
      <ServiceGroup title={copy.ui.nationalService} icon={<Globe2 size={19} aria-hidden="true" />} services={national} locale={locale} copy={copy} onService={onService} onSpeak={onSpeak} />
      {localState && <ServiceGroup title={copy.ui.stateService} icon={<MapPin size={19} aria-hidden="true" />} services={local} locale={locale} copy={copy} onService={onService} onSpeak={onSpeak} />}
      {services.length === 0 && <div className="no-results"><Search size={22} aria-hidden="true" /><p>{copy.ui.noServicesFound}</p></div>}
      {localState && locale === "ta" && <div className="legacy-guide-grid">
        <button type="button" className="legacy-guide-card" onClick={onPmv}><span className="legacy-card-icon">✦</span><span><strong>{copy.ui.pmVishwakarma}</strong><small>{copy.ui.tamilOnly}</small></span><ArrowRight size={18} aria-hidden="true" /></button>
        <button type="button" className="legacy-guide-card" onClick={onExplain}><span className="legacy-card-icon"><FileText size={19} aria-hidden="true" /></span><span><strong>{copy.ui.explainText}</strong><small>{copy.ui.tamilOnly}</small></span><ArrowRight size={18} aria-hidden="true" /></button>
      </div>}
      <div className="more-services-card">
        <div><span className="eyebrow">{copy.ui.official}</span><h2>{copy.ui.moreStateServices}</h2><p>{copy.ui.starterCatalog}</p></div>
        <a href={OFFICIAL_MORE_SERVICES_URL} target="_blank" rel="noreferrer" className="more-service-link">India.gov.in <ExternalLink size={17} aria-hidden="true" /></a>
      </div>
    </div>
  );
}

function ServiceGroup({ title, icon, services, locale, copy, onService, onSpeak }: {
  title: string;
  icon: React.ReactNode;
  services: ServiceRecord[];
  locale: LocaleCode;
  copy: ReturnType<typeof getLocaleContent>;
  onService: (id: ServiceId) => void;
  onSpeak: (text: string) => void;
}) {
  if (!services.length) return null;
  return <section className="service-group" aria-label={title}>
    <div className="service-group-heading">{icon}<h2>{title}</h2></div>
    <div className="service-grid">
      {services.map(service => {
        const text = copy.services[service.id];
        return <article className="service-card" key={service.id}>
          <div className="service-card-head"><span className="service-card-icon"><BadgeCheck size={19} aria-hidden="true" /></span><span className="service-scope-label">{service.scope === "india" ? copy.ui.nationalService : copy.ui.stateService}</span></div>
          <div className="service-card-copy" lang={locale}><span className="service-category">{text.category}</span><h2>{text.name}</h2><p>{text.goal}</p></div>
          <div className="service-card-actions"><button type="button" className="service-guide-button" onClick={() => onService(service.id)}>{copy.ui.openGuide}<ArrowRight size={17} aria-hidden="true" /></button><button type="button" className="icon-button service-speak-button" onClick={() => onSpeak(`${text.name}. ${text.goal}`)} aria-label={`${copy.ui.readAloud}: ${text.name}`}><Volume2 size={18} aria-hidden="true" /></button></div>
        </article>;
      })}
    </div>
  </section>;
}

export function ServiceDetail({ id, locale, copy, voiceStatus, onBack, onSpeak, onSpeakServiceGuide, onState, onLanguage }: {
  id: ServiceId;
  locale: LocaleCode;
  copy: ReturnType<typeof getLocaleContent>;
  voiceStatus: string;
  onBack: () => void;
  onSpeak: (text: string) => void;
  onSpeakServiceGuide: (id: ServiceId) => void;
  onState: () => void;
  onLanguage: () => void;
}) {
  const service = SERVICE_CATALOG.find(item => item.id === id)!;
  const text = copy.services[id];
  const slides = useMemo<GuideSlide[]>(() => [
    ...text.prepare.map(item => ({ kind: "prepare" as const, text: item })),
    ...text.steps.map(item => ({ kind: "step" as const, text: item })),
    ...text.safety.map(item => ({ kind: "safety" as const, text: item })),
  ], [text]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide] ?? slides[0];

  useEffect(() => {
    setCurrentSlide(0);
  }, [id, locale]);

  useEffect(() => {
    if (!slide?.text) return;
    const timer = window.setTimeout(() => {
      if (locale === "ta" && currentSlide === 0 && !getTamilAudioPath(slide.text)) onSpeakServiceGuide(id);
      else onSpeak(slide.text);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [id, locale, currentSlide, slide?.text]);

  const moveSlide = (delta: number) => setCurrentSlide(index => Math.max(0, Math.min(slides.length - 1, index + delta)));
  const sectionLabel = slide.kind === "prepare" ? copy.ui.prepare : slide.kind === "safety" ? copy.ui.safety : copy.ui.steps;

  return <article className="service-detail" lang={locale}>
    <div className="service-detail-actions"><button type="button" className="back-button" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" />{copy.ui.newSearch}</button><div><button type="button" className="quiet-button" onClick={onLanguage}>{copy.ui.changeLanguage}</button><button type="button" className="quiet-button" onClick={onState}>{copy.ui.changeState}</button></div></div>
    <div className="service-detail-title"><span className="service-category">{text.category}</span><h1>{text.name}</h1><p>{text.goal}</p><p className="guide-auto-note">{copy.ui.readAloud} · {locale.toUpperCase()}</p>{locale === "ta" && <button type="button" className="voice-play-button tamil-full-guide-button" onClick={() => onSpeakServiceGuide(id)}><Volume2 size={18} aria-hidden="true" />முழு தமிழ் வழிகாட்டியைக் கேளுங்கள்</button>}{voiceStatus && <p className="voice-status" role="status" aria-live="polite">{voiceStatus}</p>}</div>
    <div className="translation-caveat"><ShieldAlert size={19} aria-hidden="true" /><p>{copy.ui.translationNote}</p></div>
    <section className="guide-section service-slide-guide" aria-label={copy.ui.steps}>
      <div className="service-slide-heading"><SectionHeading eyebrow={sectionLabel} title={copy.ui.steps} /><span className="service-slide-count">{currentSlide + 1} / {slides.length}</span></div>
      <div className="service-slide-progress" aria-hidden="true"><span style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} /></div>
      <article className="service-slide" aria-live="polite">
        <span className="service-slide-number">{currentSlide + 1}</span>
        <p>{slide.text}</p>
        <button type="button" className="voice-play-button" onClick={() => onSpeak(slide.text)}><Volume2 size={18} aria-hidden="true" />{copy.ui.readAloud}</button>
      </article>
      <div className="service-slide-navigation">
        <button type="button" className="back-button" onClick={() => moveSlide(-1)} disabled={currentSlide === 0}><ArrowLeft size={17} aria-hidden="true" /> Back</button>
        <button type="button" className="primary-button" onClick={() => moveSlide(1)} disabled={currentSlide === slides.length - 1}>Next <ArrowRight size={17} aria-hidden="true" /></button>
      </div>
    </section>
    <p className="scope-note"><FileText size={17} aria-hidden="true" />{text.scope}</p>
    <div className="official-source-heading"><strong>{copy.ui.sources}</strong><span>{copy.ui.lastChecked}: {service.lastVerified}</span></div>
    <ul className="source-links">{service.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={15} aria-hidden="true" /></a></li>)}</ul>
    <p className="official-site-warning">{copy.ui.officialSiteWarning}</p>
    <OfficialLink href={service.officialUrl}>{copy.ui.openOfficial}</OfficialLink>
  </article>;
}
