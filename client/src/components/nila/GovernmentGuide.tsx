import { useState } from "react";
import { ArrowDownRight, ArrowLeft, ArrowRight, ExternalLink, Info, ShieldCheck, Volume2 } from "lucide-react";
import { PM_VISHWAKARMA } from "@shared/scheme";
import { GUIDE_NARRATION_TEXT, stopTamilSpeech } from "@/lib/voice";

const steps = [
  {
    title: "அதிகாரப்பூர்வத் தளத்தைத் திறக்கவும்",
    body: "திட்ட விவரங்கள், பயன்கள், தகுதி மற்றும் தொழில் பட்டியலை அரசு தளத்தில் சரிபார்க்கலாம். இந்த இணைப்பு புதிய தாவலில் திறக்கும்.",
    action: "அதிகாரப்பூர்வ PM Vishwakarma தளத்தைத் திறக்கவும்",
    href: PM_VISHWAKARMA.officialUrl,
    narration: GUIDE_NARRATION_TEXT[0],
  },
  {
    title: "FAQ-இல் உங்கள் கேள்வியைப் பாருங்கள்",
    body: "பதிவு, தகுதி மற்றும் ஆவணங்கள் பற்றிய அதிகாரப்பூர்வ விளக்கத்திற்கு FAQ-ஐத் திறக்கவும். பக்கத்தின் அமைப்பு மாறியிருந்தால், அங்கே உள்ள வழிமுறையையே பின்பற்றுங்கள்.",
    action: "அதிகாரப்பூர்வ FAQ-ஐத் திறக்கவும்",
    href: PM_VISHWAKARMA.faqUrl,
    narration: GUIDE_NARRATION_TEXT[1],
  },
  {
    title: "தேவையான உதவியை அதிகாரப்பூர்வமாகப் பெறுங்கள்",
    body: "அதிகாரப்பூர்வ FAQ-ன் படி, அருகிலுள்ள பொது சேவை மையம் (CSC), MSME-DFO அல்லது மாவட்ட தொழில் மையத்தை (DIC) அணுகலாம். FAQ-ல் ஆதார், கைபேசி எண், வங்கி விவரம் மற்றும் ரேஷன் அட்டை/குடும்ப விவரங்கள் பதிவு தகவல்களாகக் குறிப்பிடப்பட்டுள்ளன.",
    action: "CSC / உதவி விவரங்களை FAQ-இல் பாருங்கள்",
    href: PM_VISHWAKARMA.faqUrl,
    narration: GUIDE_NARRATION_TEXT[2],
  },
  {
    title: "உங்கள் தனிப்பட்ட விவரங்களைப் பாதுகாக்கவும்",
    body: "ஆதார் எண், வங்கி விவரம், கடவுச்சொல் அல்லது OTP-ஐ Selvi-வில் ஒட்ட வேண்டாம். ‘CSC Login’ என்பது CSC பயனர்களுக்கானது; பொதுப் பயனராக அதைத் திறக்க வேண்டாம். Selvi எந்தப் படிவத்தையும் நிரப்பவோ சமர்ப்பிக்கவோ செய்யாது.",
    action: "அரசு வழிகாட்டிக்கு மீண்டும் செல்லுங்கள்",
    href: PM_VISHWAKARMA.officialUrl,
    narration: GUIDE_NARRATION_TEXT[3],
  },
] as const;

export function GovernmentGuide({ onBack, onSpeak, voiceStatus, onStopSpeaking }: {
  onBack: () => void;
  onSpeak: (text: string) => void;
  voiceStatus: string;
  onStopSpeaking: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  function changeStep(nextStep: number) {
    stopTamilSpeech();
    onStopSpeaking();
    setCurrentStep(Math.max(0, Math.min(steps.length - 1, nextStep)));
  }

  return (
    <div className="journey-card site-guide-card">
      <button type="button" className="back-button" onClick={onBack}>
        <ArrowLeft size={17} aria-hidden="true" /> Selvi-வுக்குத் திரும்பு
      </button>
      <div className="card-topline">
        <span className="eyebrow">அரசு இணையதள வழிகாட்டி</span>
        <span className="soft-badge">படி {currentStep + 1} / {steps.length}</span>
      </div>
      <div className="guide-progress" aria-label={`படி ${currentStep + 1} / ${steps.length}`}>
        <span style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
      </div>
      <section className="guide-step" aria-live="polite">
        <span className="eyebrow">அடுத்த செயல்</span>
        <h2>{step.title}</h2>
        <p>{step.body}</p>
      </section>
      <div className="guide-voice-control">
        <button type="button" className="voice-play-button" onClick={() => onSpeak(step.narration)}>
          <Volume2 size={18} aria-hidden="true" /> இந்தப் படியைக் கேளுங்கள்
        </button>
        {voiceStatus && <p className="voice-status" role="status" aria-live="polite">{voiceStatus}</p>}
      </div>
      {currentStep === 0 && (
        <div className="guide-arrow-hint">
          <ArrowDownRight size={36} aria-hidden="true" />
          <p>இந்தப் பொத்தானை அழுத்தினால் அரசு தளம் புதிய தாவலில் திறக்கும்.</p>
        </div>
      )}
      <a className={`official-link ${currentStep === 0 ? "guide-highlight-link" : ""}`} href={step.href} target="_blank" rel="noreferrer">
        <span>{step.action}</span><ExternalLink size={18} aria-hidden="true" />
      </a>
      {currentStep === 3 && (
        <div className="extension-callout">
          <ShieldCheck size={20} aria-hidden="true" />
          <div>
            <strong>அந்தத் தளத்திலேயே சுட்டி வேண்டுமா?</strong>
            <p>விருப்பமான Chrome உதவியைப் பதிவிறக்கலாம். பயனர் அழுத்திய பிறகே அது அதிகாரப்பூர்வ தளத்தில் தெரியும் பொத்தான் பெயர்களைப் பார்த்து அம்பைக் காட்டும்; உள்ளீடுகள் அல்லது OTP-ஐப் படிக்காது.</p>
            <a className="extension-download" href="/downloads/nila-page-guide.zip" download>விருப்ப Chrome உதவியைப் பதிவிறக்கவும் <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
        </div>
      )}
      <div className="guide-caution"><Info size={17} aria-hidden="true" /><span>இணையதள வடிவம் மாறலாம். அதிகாரப்பூர்வ வழிமுறையைச் சரிபார்த்து, எந்தச் செயலையும் நீங்களே தேர்ந்தெடுக்கவும்.</span></div>
      <div className="guide-navigation">
        <button type="button" className="back-button" onClick={() => changeStep(currentStep - 1)} disabled={currentStep === 0}>
          <ArrowLeft size={16} aria-hidden="true" /> முந்தைய படி
        </button>
        <button type="button" className="primary-button" onClick={() => changeStep(currentStep + 1)} disabled={currentStep === steps.length - 1}>
          அடுத்த படி <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
