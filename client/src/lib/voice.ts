import type { LocaleCode } from "@/lib/i18n";
import type { ServiceId } from "@/data/serviceCatalog";

type SpeechRecognitionResultEventLike = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type VoiceStatusHandler = (message: string) => void;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export const VOICE_TEST_TEXT = "வணக்கம். நான் நைலா. குரல் இப்போது தெளிவாகக் கேட்கிறது. தொடங்க பேசவும் அல்லது தட்டச்சு செய்யவும்.";

export const GUIDE_NARRATION_TEXT = [
  "முதலில் அதிகாரப்பூர்வ PM Vishwakarma இணையதளத்தைத் திறக்கவும். திட்டப் பயன்கள், தகுதி, உங்கள் தொழில் ஆகியவற்றைப் பாருங்கள்.",
  "அதிகாரப்பூர்வ அடிக்கடி கேட்கப்படும் கேள்விகள் பகுதியில் பதிவு, தகுதி, ஆவணங்கள் பற்றிய விளக்கத்தைப் பாருங்கள்.",
  "மேலும் உதவி தேவைப்பட்டால், அருகிலுள்ள பொது சேவை மையம் அல்லது மாவட்ட தொழில் மையத்தை அணுகலாம். உங்கள் ஆவணங்களை அரசு மையத்திடம் மட்டும் காட்டுங்கள்.",
  "உங்கள் ஆதார் எண், வங்கி விவரம், கடவுச்சொல் அல்லது OTP-ஐ Selvi-வில் பகிர வேண்டாம். பொது பயனராக CSC Login-ஐத் திறக்க வேண்டாம். Selvi எந்தப் படிவத்தையும் நிரப்பவோ சமர்ப்பிக்கவோ செய்யாது.",
] as const;

const tamilAudioClips = new Map<string, string>([
  [VOICE_TEST_TEXT, "/audio/ta/voice-test.mp3"],
  [GUIDE_NARRATION_TEXT[0], "/audio/ta/guide-1.mp3"],
  [GUIDE_NARRATION_TEXT[1], "/audio/ta/guide-2.mp3"],
  [GUIDE_NARRATION_TEXT[2], "/audio/ta/guide-3.mp3"],
  [GUIDE_NARRATION_TEXT[3], "/audio/ta/guide-4.mp3"],
  ["நாம் ஒன்றாகப் பார்க்கலாம். உங்களுக்கு பொருந்தக்கூடிய அரசு உதவியைத் தேட சில எளிய கேள்விகள் கேட்கிறேன்.", "/audio/ta/welcome.mp3"],
  ["முதலில் உங்கள் வயதைச் சொல்லுங்கள். உதாரணம்: இருபத்தெட்டு.", "/audio/ta/age.mp3"],
  ["உங்கள் வயது எவ்வளவு? எண்களாகவோ தமிழில் சொல்லாகவோ சொல்லலாம்.", "/audio/ta/age.mp3"],
  ["நீங்கள் தமிழ்நாட்டில் வசிக்கிறீர்களா?", "/audio/ta/location.mp3"],
  ["உங்கள் குடும்ப வருமானம் குறைவா அல்லது நடுத்தரமா என்று சொல்லுங்கள்.", "/audio/ta/income.mp3"],
  ["இந்தக் கேள்வி திட்ட முடிவை மாற்றாது. உங்கள் குடும்ப வருமானம் குறைவா அல்லது நடுத்தரமா?", "/audio/ta/income.mp3"],
  ["நீங்கள் செய்யும் தொழிலைச் சொல்லுங்கள். உதாரணம்: தையல்.", "/audio/ta/occupation.mp3"],
  ["நீங்கள் எந்தத் தொழில் செய்கிறீர்கள்?", "/audio/ta/occupation.mp3"],
  ["நன்றி. உங்கள் பதில்களை வைத்து இந்த வழிகாட்டி உங்களுக்கு உதவுமா என்று பார்க்கலாம்.", "/audio/ta/result.mp3"],
  ["அரசு இணையதளத்தில் புரியாத உரை இருக்கிறதா? அதை இங்கே ஒட்டுங்கள். முக்கியமானதை எளிய தமிழில் சொல்கிறோம்.", "/audio/ta/explain.mp3"],
  ["அரசு உரையை இங்கே ஒட்டுங்கள். முக்கியமானதை எளிய தமிழில் சொல்கிறோம்.", "/audio/ta/explain.mp3"],
]);

const tamilServiceSlideAudio = new Map<string, string>([
  ["பதிவிறக்கத்திற்கு Aadhaar எண், Enrollment எண் அல்லது VID இவற்றில் ஒன்று.", "/audio/ta/services-aadhaar-prepare-1.wav"],
  ["ஆன்லைன் சேவைக்கு பதிவு செய்யப்பட்ட மொபைலில் OTP பெறும் வசதி.", "/audio/ta/services-aadhaar-prepare-2.wav"],
  ["முகவரி மாற்றத்திற்கு UIDAI ஏற்றுக்கொள்ளும் முகவரி ஆதாரம்; தேவையான ஆவணப் பட்டியலை அதிகாரப்பூர்வ தளத்தில் சரிபார்க்கவும்.", "/audio/ta/services-aadhaar-prepare-3.wav"],
  ["UIDAI அதிகாரப்பூர்வ தளத்தைத் திறந்து உங்களுக்குத் தேவையான சேவையைத் தேர்ந்தெடுக்கவும்: Aadhaar பதிவிறக்கம், முகவரி மாற்றம், நிலைச் சரிபார்ப்பு அல்லது centre தேடல்.", "/audio/ta/services-aadhaar-step-1.wav"],
  ["பதிவிறக்கத்திற்கு Aadhaar எண், Enrollment எண் அல்லது VID வழியைப் பயன்படுத்தவும். திரையில் கேட்கும் OTP பதிவு செய்யப்பட்ட மொபைலுக்கு வரும்.", "/audio/ta/services-aadhaar-step-2.wav"],
  ["ஆன்லைனில் முகவரியை மட்டும் மாற்றலாம். myAadhaar-இல் உள்நுழைந்து ஏற்றுக்கொள்ளப்படும் முகவரி ஆதாரத்தைப் பதிவேற்றுங்கள்; மற்ற மாற்றங்களுக்கு UIDAI மையத்துக்குச் செல்ல வேண்டியிருக்கலாம்.", "/audio/ta/services-aadhaar-step-3.wav"],
  ["சமர்ப்பித்த பிறகு கிடைக்கும் SRN/கோரிக்கை எண்ணை வைத்திருந்து UIDAI தளத்தின் Check Aadhaar Update Status வழியாக நிலையைப் பாருங்கள்.", "/audio/ta/services-aadhaar-step-4.wav"],
  ["மையத்தில் செய்ய வேண்டிய சேவைக்கு UIDAI தளத்திலுள்ள Bhuvan Aadhaar இணைப்பில் அருகிலுள்ள மையம் அல்லது PIN குறியீட்டை வைத்து தேடுங்கள்.", "/audio/ta/services-aadhaar-step-5.wav"],
  ["OTP அல்லது PIN-ஐ யாரிடமும் பகிர வேண்டாம்; UIDAI அதிகாரப்பூர்வ தளத்தில் நீங்களே உள்ளிடுங்கள்.", "/audio/ta/services-aadhaar-safety-1.wav"],
  ["கோரிக்கை சமர்ப்பித்ததால் மாற்றம் உறுதி ஆகாது; UIDAI சரிபார்த்த பிறகே ஏற்கப்படும் அல்லது நிராகரிக்கப்படும்.", "/audio/ta/services-aadhaar-safety-2.wav"],
  ["மையத்தில் அசல் ஆவணங்களை scan செய்தபின் திரும்பப் பெற்றுக்கொள்ளுங்கள்.", "/audio/ta/services-aadhaar-safety-3.wav"],
]);

const languageSamples: Record<LocaleCode, { path: string; text: string; tag: string }> = {
  ta: { path: "/audio/languages/ta.mp3", text: "வணக்கம். தமிழில் தொடர, இந்தப் பட்டனை அழுத்துங்கள்.", tag: "ta-IN" },
  hi: { path: "/audio/languages/hi.mp3", text: "नमस्ते। हिंदी में आगे बढ़ने के लिए, इस बटन को दबाएँ।", tag: "hi-IN" },
  bn: { path: "/audio/languages/bn.mp3", text: "নমস্কার। বাংলায় এগোতে, এই বোতামটি চাপুন।", tag: "bn-IN" },
  mr: { path: "/audio/languages/mr.mp3", text: "नमस्कार. मराठीत पुढे जाण्यासाठी, हे बटण दाबा.", tag: "mr-IN" },
  te: { path: "/audio/languages/te.mp3", text: "నమస్కారం. తెలుగులో కొనసాగడానికి, ఈ బటన్‌ను నొక్కండి.", tag: "te-IN" },
};

const tamilServiceGuideAudio: Record<ServiceId, string> = {
  aadhaar: "/audio/ta/services-aadhaar-guide.wav",
  voter: "/audio/ta/services-voter-guide.wav",
  passport: "/audio/ta/services-passport-guide.wav",
  digilocker: "/audio/ta/services-digilocker-guide.wav",
  "instant-epan": "/audio/ta/services-instant-epan-guide.wav",
  "tn-community-certificate": "/audio/ta/services-tn-community-certificate-guide.wav",
  "tn-income-certificate": "/audio/ta/services-tn-income-certificate-guide.wav",
  "tn-family-card": "/audio/ta/services-tn-family-card-guide.wav",
};

const languageTags: Record<LocaleCode, string> = { ta: "ta-IN", hi: "hi-IN", bn: "bn-IN", mr: "mr-IN", te: "te-IN" };
const playingStatus: Record<LocaleCode, string> = {
  ta: "நைலாவின் குரல் ஒலிக்கிறது.",
  hi: "नाइला की आवाज़ चल रही है।",
  bn: "নাইলার কণ্ঠ বাজছে।",
  mr: "नायलाचा आवाज सुरू आहे.",
  te: "నైలా స్వరం వినిపిస్తోంది.",
};
const finishedStatus: Record<LocaleCode, string> = {
  ta: "குரல் முடிந்தது.",
  hi: "आवाज़ पूरी हुई।",
  bn: "কণ্ঠস্বর শেষ হয়েছে।",
  mr: "आवाज पूर्ण झाला.",
  te: "స్వరం పూర్తయింది.",
};
let activeAudio: HTMLAudioElement | null = null;

export function getTamilAudioPath(text: string) {
  return tamilAudioClips.get(text) ?? tamilServiceSlideAudio.get(text);
}

export function getLanguageSamplePath(locale: LocaleCode) {
  return languageSamples[locale].path;
}

export function getTamilServiceGuideAudioPath(id: ServiceId) {
  return tamilServiceGuideAudio[id];
}

export function speakTamilServiceGuide(id: ServiceId, onStatus?: VoiceStatusHandler, unavailableText?: string) {
  if (typeof window === "undefined") {
    onStatus?.(unavailableText ?? "குரலை இயக்க முடியவில்லை. உரையைப் படிக்கலாம்.");
    return false;
  }
  stopTamilSpeech();
  playBundledAudio(tamilServiceGuideAudio[id], VOICE_TEST_TEXT, "ta", onStatus, unavailableText);
  return true;
}

export function supportsSpeechRecognition() {
  if (typeof window === "undefined") return false;
  const secure = window.isSecureContext || window.location.hostname === "localhost";
  return secure && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function availableVoice(locale: LocaleCode) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
  const prefix = localeTags[locale];
  return window.speechSynthesis.getVoices().find(voice => voice.lang.toLowerCase().replace("_", "-").startsWith(prefix.toLowerCase()));
}

const localeTags: Record<LocaleCode, string> = { ta: "ta", hi: "hi", bn: "bn", mr: "mr", te: "te" };

function speakWithBrowserVoice(text: string, locale: LocaleCode, onStatus?: VoiceStatusHandler, unavailableText?: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onStatus?.(unavailableText ?? "குரலை இயக்க முடியவில்லை. உரையைப் படிக்கலாம்.");
    return false;
  }
  const voice = availableVoice(locale);
  const utterance = new SpeechSynthesisUtterance(text);
  // Browser voice lists can be empty until the asynchronous `voiceschanged`
  // event fires. Still enqueue the utterance with the requested language;
  // browsers can choose a system voice even when no exact locale match is
  // exposed through getVoices(). Refusing to speak here made every catalog
  // card and non-bundled guide line appear broken on those devices.
  utterance.lang = voice?.lang || languageTags[locale];
  if (voice) utterance.voice = voice;
  // Keep guided narration comfortably clear, but avoid the slow 0.88x pace
  // that made a long service guide feel delayed in the other languages.
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.onstart = () => onStatus?.(playingStatus[locale]);
  utterance.onend = () => onStatus?.(finishedStatus[locale]);
  utterance.onerror = () => onStatus?.(unavailableText ?? "குரலை இயக்க முடியவில்லை. உரையைப் படிக்கலாம்.");
  window.speechSynthesis.cancel();
  window.speechSynthesis.resume();
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopTamilSpeech() {
  if (typeof window === "undefined") return;
  activeAudio?.pause();
  if (activeAudio) activeAudio.currentTime = 0;
  activeAudio = null;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function playBundledAudio(path: string, fallbackText: string, locale: LocaleCode, onStatus?: VoiceStatusHandler, unavailableText?: string) {
  const audio = new Audio(new URL(path, document.baseURI).toString());
  audio.preload = "auto";
  activeAudio = audio;
  let hasFallenBack = false;
  audio.onplay = () => onStatus?.(playingStatus[locale]);
  audio.onended = () => {
    if (activeAudio === audio) activeAudio = null;
    onStatus?.(finishedStatus[locale]);
  };
  const fallback = () => {
    if (hasFallenBack) return;
    hasFallenBack = true;
    if (activeAudio === audio) activeAudio = null;
    speakWithBrowserVoice(fallbackText, locale, onStatus, unavailableText);
  };
  audio.onerror = fallback;
  void audio.play().catch(fallback);
}

export function speakLanguageSample(locale: LocaleCode, onStatus?: VoiceStatusHandler, unavailableText?: string) {
  if (typeof window === "undefined") {
    onStatus?.(unavailableText ?? "குரலை இயக்க முடியவில்லை. உரையைப் படிக்கலாம்.");
    return false;
  }
  stopTamilSpeech();
  const sample = languageSamples[locale];
  playBundledAudio(sample.path, sample.text, locale, onStatus, unavailableText);
  return true;
}

export function speakInLanguage(text: string, locale: LocaleCode, onStatus?: VoiceStatusHandler, unavailableText?: string) {
  if (typeof window === "undefined") {
    onStatus?.(unavailableText ?? "குரலை இயக்க முடியவில்லை. உரையைப் படிக்கலாம்.");
    return false;
  }
  stopTamilSpeech();
  const audioPath = locale === "ta" ? getTamilAudioPath(text) : undefined;
  if (audioPath) {
    playBundledAudio(audioPath, text, locale, onStatus, unavailableText);
    return true;
  }
  return speakWithBrowserVoice(text, locale, onStatus, unavailableText);
}

export function speakTamil(text: string, onStatus?: VoiceStatusHandler) {
  return speakInLanguage(text, "ta", onStatus);
}

export function startListening(locale: LocaleCode, {
  onText,
  onError,
  onEnd,
}: {
  onText: (text: string) => void;
  onError: (message: string) => void;
  onEnd: () => void;
}, messages: { unavailable: string; retry: string }) {
  const Constructor = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;
  const secure = typeof window !== "undefined" && (window.isSecureContext || window.location.hostname === "localhost");
  if (!Constructor || !secure) {
    onError(messages.unavailable);
    onEnd();
    return () => undefined;
  }

  try {
    const recognition = new Constructor();
    let receivedText = false;
    let reportedError = false;
    recognition.lang = languageTags[locale];
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = event => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        receivedText = true;
        onText(transcript);
      }
    };
    recognition.onerror = () => {
      reportedError = true;
      onError(messages.retry);
    };
    recognition.onend = () => {
      if (!receivedText && !reportedError) onError(messages.retry);
      onEnd();
    };
    recognition.start();
    return () => {
      try {
        recognition.stop();
      } catch {
        // The browser may already have ended the recognition session.
      }
    };
  } catch {
    onError(messages.unavailable);
    onEnd();
    return () => undefined;
  }
}

export function startTamilListening(handlers: { onText: (text: string) => void; onError: (message: string) => void; onEnd: () => void }) {
  return startListening("ta", handlers, {
    unavailable: "இந்த browser-ல் குரல் உள்ளீடு கிடைக்கவில்லை. கீழே தட்டச்சு செய்யலாம்.",
    retry: "குரலைப் புரிந்துகொள்ள முடியவில்லை. மீண்டும் முயற்சி செய்யலாம் அல்லது தட்டச்சு செய்யலாம்.",
  });
}
