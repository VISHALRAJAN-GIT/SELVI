import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, FileText, Info, Play, ShieldCheck, Sparkles, Volume2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { PM_VISHWAKARMA, evaluateProfile, type UserProfile } from "@shared/scheme";
import { getJourneySummary, journeyPrompts, parseAge, parseIncome, parseLocation, parseOccupation, type JourneyStep } from "@/lib/journey";
import { speakInLanguage, speakLanguageSample, speakTamilServiceGuide, startListening, startTamilListening, stopTamilSpeech, supportsSpeechRecognition, VOICE_TEST_TEXT } from "@/lib/voice";
import { AssistantNote, ChoiceGrid, GuideEntryButton, SelviHeader, OfficialLink, ProgressRail, SectionHeading, TrustStrip, VoiceButton } from "@/components/nila/NilaUI";
import { GovernmentGuide } from "@/components/nila/GovernmentGuide";
import { LanguagePicker, SplashScreen, StatePicker } from "@/components/nila/Onboarding";
import { ServiceDetail, ServiceDirectory } from "@/components/nila/ServiceDirectory";
import { CENSUS_LANGUAGE_SOURCE, getLocaleContent, type LocaleCode } from "@/lib/i18n";
import type { ServiceId } from "@/data/serviceCatalog";

const tamilFallback = {
  welcome: "நாம் ஒன்றாகப் பார்க்கலாம். உங்களுக்கு பொருந்தக்கூடிய அரசு உதவியைத் தேட சில எளிய கேள்விகள் கேட்கிறேன்.",
  age: "முதலில் உங்கள் வயதைச் சொல்லுங்கள். உதாரணம்: இருபத்தெட்டு.",
  location: "நீங்கள் தமிழ்நாட்டில் வசிக்கிறீர்களா?",
  income: "உங்கள் குடும்ப வருமானம் குறைவா அல்லது நடுத்தரமா என்று சொல்லுங்கள்.",
  occupation: "நீங்கள் செய்யும் தொழிலைச் சொல்லுங்கள். உதாரணம்: தையல்.",
  result: "நன்றி. உங்கள் பதில்களை வைத்து இந்த வழிகாட்டி உங்களுக்கு உதவுமா என்று பார்க்கலாம்.",
};

type ExplainResult = { summaryTamil: string; pointsTamil: string[]; checklistTamil: string[]; sourceTamil: string; usedAi: boolean };
type Mode = "splash" | "language" | "state" | "catalog" | "service" | "welcome" | "journey" | "explain" | "guide";

export default function Home() {
  const [mode, setMode] = useState<Mode>("splash");
  const [locale, setLocale] = useState<LocaleCode>("ta");
  const [stateName, setStateName] = useState("Tamil Nadu");
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null);
  const [explainReturnMode, setExplainReturnMode] = useState<"catalog" | "welcome" | "journey">("catalog");
  const [step, setStep] = useState<JourneyStep>("age");
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [inputText, setInputText] = useState("");
  const [status, setStatus] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("");
  const [listening, setListening] = useState(false);
  const [checkedDocuments, setCheckedDocuments] = useState<string[]>([]);
  const [explainText, setExplainText] = useState("");
  const [explainResult, setExplainResult] = useState<ExplainResult | null>(null);
  const explainTextRef = useRef("");
  const stopListening = useRef<(() => void) | null>(null);
  const speechSupported = useMemo(() => supportsSpeechRecognition(), []);
  const copy = getLocaleContent(locale);

  useEffect(() => {
    document.documentElement.lang = `${locale}-IN`;
  }, [locale]);

  const explainMutation = trpc.nila.explainThis.useMutation({
    onSuccess: (result, variables) => {
      if (variables.text !== explainTextRef.current) return;
      setExplainResult(result);
      setStatus("");
    },
    onError: (_error, variables) => {
      if (variables.text !== explainTextRef.current) return;
      setExplainResult({
        summaryTamil: "இப்போது இந்த உரையைப் புரிந்துகொள்ள முடியவில்லை. கீழே உள்ள பொதுவான பாதுகாப்பான படிகளைப் பாருங்கள்.",
        pointsTamil: [
          "அதிகாரப்பூர்வ அரசு இணையதளத்தில் அதே தகவலைச் சரிபார்க்கவும்.",
          "புரியாத இடத்தை அருகிலுள்ள பொது சேவை மையத்தில் கேளுங்கள்.",
          "OTP அல்லது ரகசிய குறியீட்டை யாரிடமும் பகிர வேண்டாம்.",
        ],
        checklistTamil: ["இந்த உரையின் நகலை அல்லது இணையதள முகவரியை எடுத்துச் செல்லுங்கள்."],
        sourceTamil: "இது உங்கள் உரைக்கான விளக்கம் அல்ல; பொதுவான பாதுகாப்பு வழிகாட்டி மட்டுமே.",
        usedAi: false,
      });
      setStatus("விளக்கத்தைப் பெற முடியவில்லை. உங்கள் உரை இங்கேயே உள்ளது. மீண்டும் முயற்சி செய்யலாம்.");
    },
  });

  const evaluation = getJourneySummary(profile);
  const stepNumber = step === "age" ? 1 : step === "location" ? 2 : step === "income" ? 3 : step === "occupation" ? 4 : 5;
  const prompt = step === "result" ? tamilFallback.result : journeyPrompts[step];

  function readTamil(text: string) {
    setVoiceStatus("");
    speakInLanguage(text, "ta", setVoiceStatus, "தமிழ் குரல் இந்தச் சாதனத்தில் இல்லை. உரையைப் படிக்கலாம்.");
  }

  function stopVoice() {
    stopListening.current?.();
    stopTamilSpeech();
    setListening(false);
    setVoiceStatus("");
  }

  function readSelectedLanguage(text: string) {
    setVoiceStatus("");
    speakInLanguage(text, locale, setVoiceStatus, copy.ui.speechUnavailable);
  }

  function readTamilServiceGuide(id: ServiceId) {
    setVoiceStatus("");
    speakTamilServiceGuide(id, setVoiceStatus, copy.ui.speechUnavailable);
  }

  function playLanguageSample(sampleLocale: LocaleCode) {
    setVoiceStatus("");
    speakLanguageSample(sampleLocale, setVoiceStatus, getLocaleContent(sampleLocale).ui.speechUnavailable);
  }

  function openGuide() {
    stopListening.current?.();
    stopTamilSpeech();
    setListening(false);
    setVoiceStatus("");
    setStatus("");
    setMode("guide");
  }

  function backFromGuide() {
    stopTamilSpeech();
    setVoiceStatus("");
    if (profile.occupation) {
      setMode("journey");
      setStep("result");
    } else {
      setMode("welcome");
    }
  }

  function reset() {
    stopListening.current?.();
    stopTamilSpeech();
    setMode("language");
    setStep("age");
    setProfile({});
    setInputText("");
    setStatus("");
    setVoiceStatus("");
    setListening(false);
    setCheckedDocuments([]);
    setExplainResult(null);
    setExplainText("");
    explainTextRef.current = "";
    explainMutation.reset();
  }

  function beginJourney() {
    setMode("journey");
    setStep("age");
    setStatus("");
  }

  function startDemo() {
    const demoProfile: UserProfile = { age: 28, state: "தமிழ்நாடு", incomeBand: "குறைவு", occupation: "தையல் / துணி வேலை" };
    setProfile(demoProfile);
    setMode("journey");
    setStep("result");
    setStatus("டெமோ பதில்கள் நிரப்பப்பட்டுள்ளன.");
    readTamil(tamilFallback.result);
  }

  function advanceWithProfile(nextProfile: Partial<UserProfile>, nextStep: JourneyStep) {
    setProfile(nextProfile);
    setInputText("");
    setStatus("");
    setVoiceStatus("");
    setStep(nextStep);
    if (nextStep !== "result") window.setTimeout(() => readTamil(tamilFallback[nextStep]), 100);
  }

  function applyAnswer(raw: string) {
    const text = raw.trim();
    if (!text) {
      setStatus("ஒரு பதிலைச் சொல்லுங்கள் அல்லது கீழே உள்ள தேர்வை அழுத்துங்கள்.");
      return;
    }
    if (step === "age") {
      const age = parseAge(text);
      if (!age || age < 1 || age > 120) {
        setStatus("வயதை எண்களாகவோ தமிழில் சொல்லாகவோ சொல்லுங்கள். உதாரணம்: இருபத்தெட்டு.");
        return;
      }
      advanceWithProfile({ ...profile, age }, "location");
      return;
    }
    if (step === "location") {
      advanceWithProfile({ ...profile, state: parseLocation(text) }, "income");
      return;
    }
    if (step === "income") {
      advanceWithProfile({ ...profile, incomeBand: parseIncome(text) }, "occupation");
      return;
    }
    if (step === "occupation") {
      const nextProfile = { ...profile, occupation: parseOccupation(text) } as UserProfile;
      setProfile(nextProfile);
      setInputText("");
      setStatus("");
      setVoiceStatus("");
      setStep("result");
      window.setTimeout(() => readTamil(tamilFallback.result), 100);
    }
  }

  function choose(value: string) {
    applyAnswer(value);
  }

  function toggleListening() {
    if (listening) {
      stopListening.current?.();
      setListening(false);
      setVoiceStatus("குரல் அறிதல் நிறுத்தப்பட்டது.");
      return;
    }
    setStatus("");
    setVoiceStatus("மைக்ரோஃபோன் அனுமதி கேட்கப்படலாம். தமிழில் பேசுங்கள்.");
    setListening(true);
    stopListening.current = startTamilListening({
      onText: text => {
        setInputText(text);
        if (mode === "welcome") {
          setMode("journey");
          setStep("age");
        }
        setListening(false);
        setVoiceStatus(`கேட்டது: “${text}”. சரிபார்த்து அடுத்ததை அழுத்துங்கள்.`);
      },
      onError: message => {
        setVoiceStatus(message);
        setListening(false);
      },
      onEnd: () => setListening(false),
    });
  }

  function listenForService(onText: (text: string) => void) {
    if (listening) {
      stopListening.current?.();
      setListening(false);
      setVoiceStatus("");
      return;
    }
    setVoiceStatus(copy.ui.voiceListening);
    setListening(true);
    stopListening.current = startListening(locale, {
      onText: text => {
        onText(text);
        setListening(false);
        setVoiceStatus(`${copy.ui.voiceRecognized}: “${text}”`);
      },
      onError: message => {
        setListening(false);
        setVoiceStatus(message);
      },
      onEnd: () => setListening(false),
    }, { unavailable: copy.ui.micUnavailable, retry: copy.ui.errorTryAgain });
  }

  function goBack() {
    if (step === "location") setStep("age");
    else if (step === "income") setStep("location");
    else if (step === "occupation") setStep("income");
    else if (step === "result") setStep("occupation");
    setStatus("");
  }

  function submitExplain(event: FormEvent) {
    event.preventDefault();
    if (!explainText.trim()) {
      setStatus("முதலில் விளக்க வேண்டிய உரையை ஒட்டுங்கள்.");
      return;
    }
    setExplainResult(null);
    setStatus("");
    explainMutation.mutate({ text: explainText.trim() });
  }

  function selectLanguage(nextLocale: LocaleCode) {
    stopVoice();
    setLocale(nextLocale);
    setStatus("");
    setMode("state");
  }

  function selectState(nextState: string) {
    stopVoice();
    setStateName(nextState);
    setMode("catalog");
  }

  function openLanguageSelection() {
    stopVoice();
    setStatus("");
    setMode("language");
  }

  function openStateSelection() {
    stopVoice();
    setStatus("");
    setMode("state");
  }

  function openService(id: ServiceId) {
    stopVoice();
    setSelectedService(id);
    setMode("service");
  }

  function returnToCatalog() {
    stopVoice();
    setMode("catalog");
  }

  function openPmvJourney() {
    stopVoice();
    setProfile({});
    setInputText("");
    setStatus("");
    setVoiceStatus("");
    setMode("welcome");
  }

  function openExplain() {
    setExplainReturnMode(mode === "welcome" || mode === "journey" ? mode : "catalog");
    stopVoice();
    setMode("explain");
    setStatus("");
  }

  const legacyMode = mode === "welcome" || mode === "journey" || mode === "guide" || mode === "explain";
  const pageCopy = mode === "welcome"
    ? { eyebrow: "முதல் முறையாக சேவையைப் பயன்படுத்துகிறீர்களா?", title: "PM விஸ்வகர்மா வழிகாட்டி.", description: "இந்தத் தனிப்பட்ட தமிழ்வழி உதவி, கைவினைத் தொழில் திட்டத்தைப் புரிந்துகொள்ள உதவும்." }
    : mode === "guide"
      ? { eyebrow: "அதிகாரப்பூர்வ மூலங்களுடன்", title: "அரசு இணைய வழிகாட்டி.", description: "அடுத்த படியை Selvi காட்டும். இணையதளத்தில் உள்ள பொத்தானைத் தேர்வு செய்வது நீங்கள்தான்." }
      : mode === "explain"
        ? { eyebrow: "குழப்பமான அரசு உரையா?", title: "அதை எளிய தமிழில் புரிந்துகொள்வோம்.", description: "அரசு இணையதளத்தில் உள்ள உரையை இங்கே ஒட்டுங்கள். முக்கியமானதை மட்டும் எளிமையாகச் சொல்கிறோம்." }
        : { eyebrow: "ஒரு கேள்வி மட்டும் — மெதுவாகப் போகலாம்", title: step === "result" ? "உங்கள் அடுத்த படி." : "ஒரு கேள்வி, மெதுவாக.", description: step === "result" ? "உங்கள் பதில்களை வைத்து அடுத்த படியைத் தயார் செய்துள்ளோம்." : "பேசலாம், தட்டச்சு செய்யலாம், அல்லது கீழே உள்ள பெரிய தேர்வை அழுத்தலாம்." };

  if (mode === "splash") {
    return <SplashScreen eyebrow={copy.ui.splashEyebrow} title={copy.ui.splashTitle} body={copy.ui.splashBody} startNow={copy.ui.startNow} onStart={() => setMode("language")} />;
  }

  return (
    <div className="nila-app">
      <SelviHeader
        onExplain={mode === "welcome" || mode === "journey" ? openExplain : undefined}
        onStartOver={legacyMode ? reset : undefined}
        startOverLabel={copy.ui.startNow}
        explainLabel={copy.ui.explainText}
        languageLabel={copy.ui.changeLanguage}
        brandLabel="Selvi home"
      />

      {mode === "language" && <main className="onboarding-page">
        <LanguagePicker
          title={copy.ui.chooseLanguage}
          description={copy.ui.languageHelp}
          priorityNote={copy.ui.languagePriority}
          priorityLabel={copy.ui.primaryLanguageTag}
          shareTemplate={copy.ui.languageShareLabel}
          sourceNote={copy.ui.languageSourceNote}
          sourceLabel={copy.ui.official}
          readAloudLabel={copy.ui.readAloud}
          selected={locale}
          onSelect={selectLanguage}
          onRead={playLanguageSample}
          censusSource={CENSUS_LANGUAGE_SOURCE}
        />
        {voiceStatus && <p className="voice-status onboarding-voice-status" role="status" aria-live="polite">{voiceStatus}</p>}
      </main>}

      {mode === "state" && <main className="onboarding-page">
        <StatePicker
          title={copy.ui.chooseState}
          description={copy.ui.stateHelp}
          tamilNaduLabel={copy.ui.tamilNadu}
          otherStateLabel={copy.ui.otherState}
          searchPlaceholder={copy.ui.findState}
          noResultsText={copy.ui.noStateResults}
          backLabel={copy.ui.back}
          locale={locale}
          selectedState={stateName}
          stateNames={copy.states}
          onBack={openLanguageSelection}
          onSelect={selectState}
        />
      </main>}

      {mode === "catalog" && <main className="catalog-page-shell">
        <ServiceDirectory
          locale={locale}
          stateName={stateName}
          stateLabel={copy.states[stateName] ?? stateName}
          copy={copy}
          listening={listening}
          speechSupported={speechSupported}
          voiceStatus={voiceStatus}
          onListen={listenForService}
          onSpeak={readSelectedLanguage}
          onService={openService}
          onState={openStateSelection}
          onLanguage={openLanguageSelection}
          onPmv={openPmvJourney}
          onExplain={openExplain}
        />
      </main>}

      {mode === "service" && selectedService && <main className="catalog-page-shell">
        <ServiceDetail
          id={selectedService}
          locale={locale}
          copy={copy}
          voiceStatus={voiceStatus}
          onBack={returnToCatalog}
          onSpeak={readSelectedLanguage}
          onSpeakServiceGuide={readTamilServiceGuide}
          onState={openStateSelection}
          onLanguage={openLanguageSelection}
        />
      </main>}

      {legacyMode && <main className="page-shell">
        <section className="intro-column" aria-labelledby="page-title">
          <div className="intro-kicker"><span className="kicker-dot" /> பாதுகாப்பான அரசு வழிகாட்டி</div>
          <h1 id="page-title">{pageCopy.title}</h1>
          <p className="intro-description">{pageCopy.description}</p>
          <div className="intro-quote"><Sparkles size={18} aria-hidden="true" /><span>“தொழில்நுட்பம் உங்களைப் புரிந்துகொள்ள வேண்டும்; நீங்கள் தொழில்நுட்பத்தைக் கற்றுக்கொள்ள வேண்டியதில்லை.”</span></div>
          <TrustStrip />
          <div className="intro-footer"><span>PM விஸ்வகர்மா · தமிழ்</span><span>தகவல் உதவி மட்டும்</span></div>
        </section>

        <section className="journey-column" aria-live="polite">
          {mode === "welcome" && <div className="journey-card welcome-card">
            <div className="card-topline"><span className="eyebrow">{pageCopy.eyebrow}</span><span className="soft-badge">5 நிமிட வழிகாட்டி</span></div>
            <AssistantNote onSpeak={() => readTamil(tamilFallback.welcome)}>{tamilFallback.welcome}</AssistantNote>
            <VoiceButton listening={listening} supported={speechSupported} onClick={toggleListening} onSpeak={() => readTamil(VOICE_TEST_TEXT)} speakLabel="குரலைச் சோதிக்கவும்" voiceStatus={voiceStatus} />
            {status && <p className="status-message" role="alert"><Info size={17} aria-hidden="true" />{status}</p>}
            <div className="or-divider"><span>அல்லது</span></div>
            <form className="text-entry" onSubmit={event => { event.preventDefault(); if (inputText.trim()) { beginJourney(); window.setTimeout(() => applyAnswer(inputText), 0); } }}>
              <label htmlFor="welcome-text">இங்கே தட்டச்சு செய்யலாம்</label>
              <div className="input-row"><input id="welcome-text" value={inputText} onChange={event => setInputText(event.target.value)} placeholder="எனக்கு உதவி வேண்டும்…" /><button className="round-submit" type="submit" aria-label="தொடருங்கள்"><ArrowRight size={20} aria-hidden="true" /></button></div>
            </form>
            <div className="welcome-actions"><button type="button" className="demo-button" onClick={startDemo}><Play size={15} fill="currentColor" aria-hidden="true" /> டெமோவைப் பார்க்க</button><span>உதாரண பதில்களுடன் உடனே பார்க்கலாம்</span></div>
            <GuideEntryButton onClick={openGuide} />
          </div>}

          {mode === "journey" && <div className="journey-card">
            {step !== "result" && <ProgressRail current={stepNumber} />}
            <div className="card-topline"><span className="eyebrow">{step === "result" ? "உங்கள் அடுத்த படி" : "நாம் ஒன்றாகப் பார்க்கலாம்"}</span><span className="scheme-mini">ஒரு திட்டம் மட்டும்</span></div>
            {step !== "result" && <AssistantNote onSpeak={() => readTamil(prompt)}>{prompt}</AssistantNote>}
            {step === "result" ? <ResultView profile={profile as UserProfile} evaluation={evaluation} checkedDocuments={checkedDocuments} setCheckedDocuments={setCheckedDocuments} onGuide={openGuide} /> : <QuestionView step={step} inputText={inputText} setInputText={setInputText} status={status} listening={listening} supported={speechSupported} voiceStatus={voiceStatus} onSpeak={() => readTamil(prompt)} onListen={toggleListening} onChoose={choose} onSubmit={applyAnswer} />}
            {status && <p className="status-message" role="alert"><Info size={17} aria-hidden="true" />{status}</p>}
            {step === "result" && voiceStatus && <p className="voice-status" role="status" aria-live="polite">{voiceStatus}</p>}
            <div className="journey-footer"><button type="button" className="back-button" onClick={step === "age" ? reset : goBack}><ArrowLeft size={17} aria-hidden="true" /> {step === "age" ? "முதல் பக்கம்" : "பின்னால்"}</button>{step === "result" && <button type="button" className="text-button" onClick={() => readTamil(tamilFallback.result)}><Volume2 size={17} aria-hidden="true" /> கேட்க</button>}</div>
          </div>}

          {mode === "explain" && <ExplainView explainText={explainText} setExplainText={value => { explainTextRef.current = value; setExplainText(value); setExplainResult(null); setStatus(""); }} result={explainResult} loading={explainMutation.isPending} status={status} voiceStatus={voiceStatus} onSpeak={() => readTamil("அரசு இணையதளத்தில் புரியாத உரை இருக்கிறதா? அதை இங்கே ஒட்டுங்கள். முக்கியமானதை எளிய தமிழில் சொல்கிறோம்.")} onSubmit={submitExplain} onBack={() => { setMode(explainReturnMode); setExplainResult(null); setStatus(""); setVoiceStatus(""); }} />}
          {mode === "guide" && <GovernmentGuide onBack={backFromGuide} onSpeak={readTamil} voiceStatus={voiceStatus} onStopSpeaking={() => setVoiceStatus("")} />}
        </section>
      </main>}
    </div>
  );
}

function QuestionView({ step, inputText, setInputText, status, listening, supported, voiceStatus, onSpeak, onListen, onChoose, onSubmit }: { step: Exclude<JourneyStep, "result">; inputText: string; setInputText: (value: string) => void; status: string; listening: boolean; supported: boolean; voiceStatus: string; onSpeak: () => void; onListen: () => void; onChoose: (value: string) => void; onSubmit: (value: string) => void }) {
  const choices = step === "location"
    ? [{ label: "ஆம், தமிழ்நாட்டில்", value: "தமிழ்நாடு", helper: "நான் தமிழ்நாட்டில் வசிக்கிறேன்" }, { label: "இல்லை / வேறு இடம்", value: "வேறு மாநிலம்", helper: "வேறு மாநிலத்தில் வசிக்கிறேன்" }]
    : step === "income"
      ? [{ label: "குறைவு", value: "குறைவு", helper: "வருமானம் குறைவாக உள்ளது" }, { label: "நடுத்தரம்", value: "நடுத்தரம்", helper: "வருமானம் நடுத்தரமாக உள்ளது" }, { label: "தெரியவில்லை", value: "தெரியவில்லை", helper: "பரவாயில்லை, மையத்தில் கேட்கலாம்" }]
      : step === "occupation"
        ? [{ label: "தையல் / துணி வேலை", value: "தையல் / துணி வேலை" }, { label: "மர வேலை / தச்சு", value: "மர வேலை / தச்சு" }, { label: "மற்ற கைவினைத் தொழில்", value: "மற்ற கைவினைத் தொழில்" }]
        : [];

  return <div className="question-view">
    <VoiceButton listening={listening} supported={supported} onClick={onListen} onSpeak={onSpeak} voiceStatus={voiceStatus} />
    <div className="or-divider"><span>அல்லது தேர்வு செய்யுங்கள்</span></div>
    {choices.length > 0 && <ChoiceGrid choices={choices} onChoose={onChoose} />}
    <form className="text-entry compact-entry" onSubmit={event => { event.preventDefault(); onSubmit(inputText); }}>
      <label htmlFor={`answer-${step}`}>உங்கள் பதில்</label>
      <div className="input-row"><input id={`answer-${step}`} value={inputText} onChange={event => setInputText(event.target.value)} placeholder={step === "age" ? "உதாரணம்: 28" : "இங்கே தட்டச்சு செய்யலாம்…"} /><button className="round-submit" type="submit" aria-label="அடுத்த கேள்விக்குச் செல்லுங்கள்"><ArrowRight size={20} aria-hidden="true" /></button></div>
    </form>
    {status && <span className="sr-only">{status}</span>}
  </div>;
}

function ResultView({ profile, evaluation, checkedDocuments, setCheckedDocuments, onGuide }: { profile: UserProfile; evaluation: ReturnType<typeof evaluateProfile> | null; checkedDocuments: string[]; setCheckedDocuments: (values: string[]) => void; onGuide: () => void }) {
  const likely = Boolean(evaluation?.likelyEligible);
  const toggleDocument = (document: string) => setCheckedDocuments(checkedDocuments.includes(document) ? checkedDocuments.filter(item => item !== document) : [...checkedDocuments, document]);
  return <div className="result-view">
    <div className={`result-banner ${likely ? "positive" : "needs-check"}`}><div className="result-icon"><ShieldCheck size={25} aria-hidden="true" /></div><div><span className="eyebrow">{likely ? "முதல் பார்வை முடிவு" : "மேலும் சரிபார்க்க வேண்டும்"}</span><h2>{likely ? "இந்தத் திட்டம் உங்களுக்கு பொருந்தக்கூடும்." : "இந்தத் திட்டத்தை மையத்தில் சரிபார்க்கலாம்."}</h2><p>{likely ? "உங்கள் பதில்கள் PM விஸ்வகர்மா திட்டத்தின் அடிப்படை வழிகாட்டுதலுடன் பொருந்துகின்றன." : "கவலை வேண்டாம். கீழே உள்ள தகவலை எடுத்துக் கொண்டு பொது சேவை மையத்தில் கேளுங்கள்."}</p></div></div>
    <div className="answer-summary"><span className="eyebrow">நீங்கள் சொன்னது</span><div><span>வயது <strong>{profile.age}</strong></span><span>இடம் <strong>{profile.state}</strong></span><span>வருமானம் <strong>{profile.incomeBand}</strong></span><span>தொழில் <strong>{profile.occupation}</strong></span></div></div>
    <section className="scheme-panel"><div className="scheme-title"><div className="scheme-symbol">✦</div><div><span className="eyebrow">சரிபார்க்கப்பட்ட வழிகாட்டி</span><h2>{PM_VISHWAKARMA.nameTamil}</h2><p>{PM_VISHWAKARMA.promiseTamil}</p></div></div><p className="scheme-purpose">{PM_VISHWAKARMA.purposeTamil}</p><div className="benefit-grid">{PM_VISHWAKARMA.benefitsTamil.map(benefit => <div className="benefit-item" key={benefit}><Check size={17} aria-hidden="true" /><span>{benefit}</span></div>)}</div></section>
    <section className="checklist-section"><SectionHeading eyebrow="கையில் எடுத்துச் செல்லுங்கள்" title="தேவையான ஆவணங்கள்" description="இவற்றில் உங்களிடம் இருப்பதை மெதுவாகத் தயார் செய்யலாம்." /><div className="document-list">{PM_VISHWAKARMA.documentsTamil.map(document => <label className={`document-item ${checkedDocuments.includes(document) ? "checked" : ""}`} key={document}><input type="checkbox" checked={checkedDocuments.includes(document)} onChange={() => toggleDocument(document)} /><span className="checkbox-mark"><Check size={15} aria-hidden="true" /></span><span>{document}</span></label>)}</div></section>
    <section className="steps-section"><SectionHeading eyebrow="அடுத்தது என்ன?" title="விண்ணப்பிக்கும் வழி" /><ol className="steps-list">{PM_VISHWAKARMA.applicationStepsTamil.map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol></section>
    <div className="source-note"><FileText size={18} aria-hidden="true" /><div><strong>மூலம்: {PM_VISHWAKARMA.sourceName}</strong><span>கடைசியாக சரிபார்த்த நாள்: {PM_VISHWAKARMA.lastVerified}. இது வழிகாட்டி மட்டும்; இறுதி முடிவை அரசு மையம் தெரிவிக்கும்.</span></div></div>
    <OfficialLink href={PM_VISHWAKARMA.officialUrl}>அதிகாரப்பூர்வ இணையதளத்திற்குச் செல்லுங்கள்</OfficialLink>
    <GuideEntryButton onClick={onGuide} />
  </div>;
}

function ExplainView({ explainText, setExplainText, result, loading, status, voiceStatus, onSpeak, onSubmit, onBack }: { explainText: string; setExplainText: (value: string) => void; result: ExplainResult | null; loading: boolean; status: string; voiceStatus: string; onSpeak: () => void; onSubmit: (event: FormEvent) => void; onBack: () => void }) {
  return (
    <div className="journey-card explain-card">
      <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" /> சேவைப் பட்டியலுக்குத் திரும்பு</button>
      <div className="card-topline"><span className="eyebrow">எளிய விளக்கம்</span><span className="soft-badge">தமிழில் மட்டும் · உங்கள் உரை சேமிக்கப்படாது</span></div>
      <AssistantNote onSpeak={onSpeak}>அரசு இணையதளத்தில் புரியாத உரை இருக்கிறதா? அதை இங்கே ஒட்டுங்கள். முக்கியமானதை எளிய தமிழில் சொல்கிறோம்.</AssistantNote>
      {voiceStatus && <p className="voice-status" role="status" aria-live="polite">{voiceStatus}</p>}
      <form className="explain-form" onSubmit={onSubmit}>
        <label htmlFor="explain-text">அரசு உரை</label>
        <textarea id="explain-text" maxLength={5000} value={explainText} onChange={event => setExplainText(event.target.value)} placeholder="உதாரணம்: இந்தத் திட்டத்திற்கு என்ன ஆவணங்கள் தேவை…" rows={7} disabled={loading} />
        <div className="form-actions"><span>{explainText.length} / 5000</span><button className="primary-button" type="submit" disabled={loading}>{loading ? "புரிந்துகொள்கிறோம்…" : "எளிய தமிழில் சொல்லுங்கள்"}<ArrowRight size={18} aria-hidden="true" /></button></div>
      </form>
      {status && <p className="status-message" role="alert"><Info size={17} aria-hidden="true" />{status}</p>}
      {result && <div className="explain-result">
        <div className="result-banner positive"><div className="result-icon"><Sparkles size={23} aria-hidden="true" /></div><div><span className="eyebrow">{result.usedAi ? "AI உதவியுடன் விளக்கம்" : "எளிய பாதுகாப்பான விளக்கம்"}</span><h2>{result.summaryTamil}</h2></div></div>
        <div className="explain-points">{result.pointsTamil.map(point => <p key={point}><Check size={17} aria-hidden="true" />{point}</p>)}</div>
        {result.checklistTamil.length > 0 && <div className="mini-checklist"><span className="eyebrow">நினைவில் வைத்துக்கொள்ளுங்கள்</span>{result.checklistTamil.map(item => <p key={item}><FileText size={16} aria-hidden="true" />{item}</p>)}</div>}
        <p className="source-note simple"><Info size={17} aria-hidden="true" />{result.sourceTamil}</p>
      </div>}
    </div>
  );
}
