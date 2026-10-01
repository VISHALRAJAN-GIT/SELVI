export type ServiceScope = "india" | "tamil-nadu";

export type ServiceId =
  | "aadhaar"
  | "voter"
  | "passport"
  | "digilocker"
  | "instant-epan"
  | "tn-community-certificate"
  | "tn-income-certificate"
  | "tn-family-card";

export type LocaleServiceCopy = {
  name: string;
  category: string;
  goal: string;
  steps: string[];
  prepare: string[];
  safety: string[];
  scope: string;
};

export type ServiceSource = { title: string; url: string };

export type ServiceRecord = {
  id: ServiceId;
  scope: ServiceScope;
  nameEnglish: string;
  nameTamil: string;
  categoryTamil: string;
  goalTamil: string;
  stepsTamil: string[];
  prepareTamil: string[];
  safetyTamil: string[];
  scopeTamil: string;
  officialUrl: string;
  sources: ServiceSource[];
  lastVerified: string;
  hasVerifiedUsageMetric: boolean;
};

export const SERVICE_CATALOG: ServiceRecord[] = [
  {
    id: "aadhaar",
    scope: "india",
    nameEnglish: "Aadhaar services",
    nameTamil: "ஆதார் சேவைகள்",
    categoryTamil: "அடையாள ஆவணம்",
    goalTamil: "ஆதார் பதிவிறக்கம், முகவரி மாற்றம், விண்ணப்ப நிலை அல்லது அருகிலுள்ள மையத்தைக் கண்டறிதல்.",
    stepsTamil: [
      "UIDAI அதிகாரப்பூர்வ தளத்தைத் திறந்து உங்களுக்குத் தேவையான சேவையைத் தேர்ந்தெடுக்கவும்: Aadhaar பதிவிறக்கம், முகவரி மாற்றம், நிலைச் சரிபார்ப்பு அல்லது centre தேடல்.",
      "பதிவிறக்கத்திற்கு Aadhaar எண், Enrollment எண் அல்லது VID வழியைப் பயன்படுத்தவும். திரையில் கேட்கும் OTP பதிவு செய்யப்பட்ட மொபைலுக்கு வரும்.",
      "ஆன்லைனில் முகவரியை மட்டும் மாற்றலாம். myAadhaar-இல் உள்நுழைந்து ஏற்றுக்கொள்ளப்படும் முகவரி ஆதாரத்தைப் பதிவேற்றுங்கள்; மற்ற மாற்றங்களுக்கு UIDAI மையத்துக்குச் செல்ல வேண்டியிருக்கலாம்.",
      "சமர்ப்பித்த பிறகு கிடைக்கும் SRN/கோரிக்கை எண்ணை வைத்திருந்து UIDAI தளத்தின் Check Aadhaar Update Status வழியாக நிலையைப் பாருங்கள்.",
      "மையத்தில் செய்ய வேண்டிய சேவைக்கு UIDAI தளத்திலுள்ள Bhuvan Aadhaar இணைப்பில் அருகிலுள்ள மையம் அல்லது PIN குறியீட்டை வைத்து தேடுங்கள்.",
    ],
    prepareTamil: [
      "பதிவிறக்கத்திற்கு Aadhaar எண், Enrollment எண் அல்லது VID இவற்றில் ஒன்று.",
      "ஆன்லைன் சேவைக்கு பதிவு செய்யப்பட்ட மொபைலில் OTP பெறும் வசதி.",
      "முகவரி மாற்றத்திற்கு UIDAI ஏற்றுக்கொள்ளும் முகவரி ஆதாரம்; தேவையான ஆவணப் பட்டியலை அதிகாரப்பூர்வ தளத்தில் சரிபார்க்கவும்.",
    ],
    safetyTamil: [
      "OTP அல்லது PIN-ஐ யாரிடமும் பகிர வேண்டாம்; UIDAI அதிகாரப்பூர்வ தளத்தில் நீங்களே உள்ளிடுங்கள்.",
      "கோரிக்கை சமர்ப்பித்ததால் மாற்றம் உறுதி ஆகாது; UIDAI சரிபார்த்த பிறகே ஏற்கப்படும் அல்லது நிராகரிக்கப்படும்.",
      "மையத்தில் அசல் ஆவணங்களை scan செய்தபின் திரும்பப் பெற்றுக்கொள்ளுங்கள்.",
    ],
    scopeTamil: "இந்த வழிகாட்டி பதிவிறக்கம், முகவரி மாற்றம், நிலைச் சரிபார்ப்பு மற்றும் மையம் தேடுதலை மட்டுமே உள்ளடக்குகிறது. மொபைல் எண் அல்லது biometric மாற்றங்களுக்கு மையம் தேவைப்படலாம். ஆதார் புதிதாகப் பெறுதல், கட்டணம் அல்லது செயலாக்க நேரம் குறித்து இங்கு உறுதி அளிக்கப்படவில்லை.",
    officialUrl: "https://uidai.gov.in/",
    sources: [
      { title: "UIDAI — அதிகாரப்பூர்வ முகப்பு", url: "https://uidai.gov.in/" },
      { title: "Aadhaar Online Services — UIDAI FAQ", url: "https://uidai.gov.in/en/aadhaar-online-services" },
      { title: "Updating Data on Aadhaar — UIDAI", url: "https://uidai.gov.in/en/updating-data-on-aadhaar" },
      { title: "Your Aadhaar — UIDAI FAQ", url: "https://uidai.gov.in/en/your-aadhaar" },
    ],
    lastVerified: "2026-10-01",
    hasVerifiedUsageMetric: false,
  },
  {
    id: "voter",
    scope: "india",
    nameEnglish: "Voter and electoral-roll services",
    nameTamil: "வாக்காளர் பதிவு மற்றும் பட்டியல் சேவைகள்",
    categoryTamil: "வாக்காளர் சேவை",
    goalTamil: "புதிய வாக்காளர் பதிவு, பெயர்/முகவரி திருத்தம், வாக்காளர் பட்டியல் தேடல் அல்லது விண்ணப்ப நிலை.",
    stepsTamil: [
      "ECI அதிகாரப்பூர்வ குடிமக்கள் தளத்தைத் திறந்து முதலில் வாக்காளர் பட்டியலில் உங்கள் பெயரைத் தேடுங்கள்.",
      "புதிய பொதுப் பதிவுக்கு Form 6 தேர்வு செய்யுங்கள். ECI கூறும் தகுதி நிபந்தனைகள்—இந்தியக் குடியுரிமை, 18 வயது நிறைவு, அப்பகுதியில் வழக்கமான வசிப்பிடம் மற்றும் சட்டப்படி தகுதி நீக்கம் இல்லாமை—பொருந்துகிறதா பாருங்கள்.",
      "பெயரை நீக்க/எதிர்ப்பு தெரிவிக்க Form 7; முகவரி அல்லது பதிவுத் திருத்தம், மாற்று EPIC போன்றவற்றுக்கு Form 8-ஐத் தேர்வு செய்யுங்கள்.",
      "விண்ணப்பத்தின் நிலையை Track Application Status வழியாகப் பாருங்கள்; டிஜிட்டல் அடையாள அட்டைக்கு E-EPIC Download சேவையைப் பயன்படுத்தலாம்.",
      "உதவி தேவைப்பட்டால் அதிகாரப்பூர்வ 1950 எண்ணை அழைக்கவும் அல்லது உங்கள் பகுதி தேர்தல் அலுவலரை அணுகவும்.",
    ],
    prepareTamil: [
      "Form 6-க்கு வயது மற்றும் வசிப்பிடச் சான்று, சமீபத்திய புகைப்படம் போன்றவற்றை அதிகாரப்பூர்வ Form 6 வழிகாட்டியில் சரிபார்க்கவும்.",
      "Form 8-க்கு EPIC எண் மற்றும் மாற்றத்திற்கான ஆதாரத்தைத் தயாராக வைத்திருங்கள்.",
      "ஒரே நபர் ஒன்றுக்கு மேற்பட்ட இடங்களில் பதிவு செய்யப்படக்கூடாது; விண்ணப்பத்திற்கு முன் பெயரைத் தேடிச் சரிபார்க்கவும்.",
    ],
    safetyTamil: [
      "voters.eci.gov.in என்ற அதிகாரப்பூர்வ தளத்தை மட்டும் பயன்படுத்துங்கள்; OTP அல்லது கடவுச்சொல்லை யாரிடமும் பகிர வேண்டாம்.",
      "Form 6-இல் ஆதார் விவரம் தன்னார்வமானது; ஆதார் இல்லாததால் மட்டும் விண்ணப்பம் நிராகரிக்கப்படாது என ECI FAQ கூறுகிறது.",
      "பதிவு ஏற்கப்படுமா என்பதை உரிய தேர்தல் பதிவு அலுவலர் முடிவு செய்வார்; முடிவு அல்லது காலக்கெடு உறுதி அல்ல.",
    ],
    scopeTamil: "Form 6, Form 7, Form 8, பட்டியல் தேடல் மற்றும் e-EPIC போன்ற ECI குடிமக்கள் சேவைகளுக்கான வழிகாட்டி. படிவங்கள்/தகுதி விதிகள் மாறலாம்; தற்போதைய வழிமுறைகளை அதிகாரப்பூர்வ ECI பக்கத்தில் சரிபார்க்கவும்.",
    officialUrl: "https://voters.eci.gov.in/",
    sources: [
      { title: "Election Commission of India — Citizen Service Portal", url: "https://voters.eci.gov.in/" },
      { title: "How to Register to Vote — ECI", url: "https://www.eci.gov.in/faq/en/how-to-register/" },
      { title: "FAQs on Electoral Roll — ECI", url: "https://www.eci.gov.in/faq/2/12" },
      { title: "Form 6 Guidelines — ECI", url: "https://voters.eci.gov.in/guidelines/Form-6_en.pdf" },
    ],
    lastVerified: "2026-10-01",
    hasVerifiedUsageMetric: false,
  },
  {
    id: "passport",
    scope: "india",
    nameEnglish: "Passport application and tracking",
    nameTamil: "பாஸ்போர்ட் விண்ணப்பம் மற்றும் நிலை அறிதல்",
    categoryTamil: "பயணம் மற்றும் அடையாள ஆவணம்",
    goalTamil: "புதிய சாதாரண பாஸ்போர்ட், மீண்டும் வழங்குதல், சந்திப்பு முன்பதிவு அல்லது விண்ணப்ப நிலை.",
    stepsTamil: [
      "Passport Seva அதிகாரப்பூர்வ தளத்தில் கணக்கு பதிவு செய்து உள்நுழையுங்கள்.",
      "முதன்முறையாக விண்ணப்பித்தால் Fresh; ஏற்கெனவே பாஸ்போர்ட் இருந்தால் உங்கள் காரணத்துக்கேற்ற Re-issue என்பதைத் தேர்ந்தெடுங்கள்.",
      "உங்கள் விவரங்களை நிரப்பி, சமர்ப்பிக்கும் முன் கவனமாகச் சரிபாருங்கள். அதிகாரப்பூர்வ தளத்தின் Document Advisory-யில் உங்கள் நிலைக்கான ஆவணங்களைப் பாருங்கள்.",
      "விண்ணப்பித்த பின் கிடைக்கும் ARN-ஐ வைத்துக்கொண்டு, அதிகாரப்பூர்வ தளத்தில் கட்டணம் செலுத்தி PSK/POPSK சந்திப்பை முன்பதிவு செய்யுங்கள்.",
      "சந்திப்புக்கு தேவையான ஆவணங்களுடன் செல்லுங்கள்; அங்கு கிடைக்கும் File Number மற்றும் பிறந்த தேதியை வைத்து நிலையைத் தொடருங்கள்.",
    ],
    prepareTamil: [
      "மின்னஞ்சல் முகவரி, தற்போதைய வசிப்பிட முகவரி மற்றும் விண்ணப்பத்தில் கேட்கும் குடும்ப/அவசரத் தொடர்பு விவரங்கள்.",
      "உங்கள் விண்ணப்ப வகைக்கு Passport Seva-வின் Document Advisory-யில் பட்டியலிடப்பட்ட ஆவணங்கள்; இவை சூழலைப் பொறுத்து மாறும்.",
      "கட்டணத்தை அதிகாரப்பூர்வ Fee Calculator-ல் பார்த்து, ஆன்லைன் கட்டண முறையைத் தயாராக வைத்திருங்கள்.",
    ],
    safetyTamil: [
      "passportindia.gov.in என்ற அதிகாரப்பூர்வ தளத்திலேயே விண்ணப்பித்து பணம் செலுத்துங்கள்; போலி தளங்களைத் தவிர்க்கவும்.",
      "OTP அல்லது கடவுச்சொல்லை யாரிடமும் பகிர வேண்டாம்.",
      "விண்ணப்பத்தைச் சமர்ப்பித்த பின் விவரங்களை மாற்ற முடியாமல் இருக்கலாம்; சமர்ப்பிப்பதற்கு முன் சரிபார்க்கவும்.",
      "பாஸ்போர்ட் வழங்கப்படும் முடிவு அதிகாரிகளின் பரிசீலனைக்கு உட்பட்டது.",
    ],
    scopeTamil: "இந்த வழிகாட்டி இந்தியாவில் சாதாரண Fresh/Re-issue பாஸ்போர்ட்டுக்கானது. Tatkaal, சிறப்பு நிலைகள் மற்றும் வெளிநாட்டு மிஷன் விண்ணப்பங்கள் இதில் விரிவாக இல்லை. தற்போதைய ஆவண ஆலோசனை மற்றும் கட்டணத்தை அதிகாரப்பூர்வ தளத்தில் உறுதிசெய்யவும்.",
    officialUrl: "https://www.passportindia.gov.in/",
    sources: [
      { title: "Passport Seva — Ministry of External Affairs", url: "https://www.passportindia.gov.in/" },
      { title: "Process to Apply for Fresh/Reissue Passport", url: "https://www.passportindia.gov.in/psp/Apply" },
      { title: "Application Form FAQ — Passport Seva", url: "https://www.passportindia.gov.in/psp/FaqApplicationForm" },
      { title: "Steps to Check Application Status", url: "https://www.passportindia.gov.in/AppOnlineProject/pdf/Steps_to_Check_Application_Status.pdf" },
    ],
    lastVerified: "2026-10-01",
    hasVerifiedUsageMetric: false,
  },
  {
    id: "digilocker",
    scope: "india",
    nameEnglish: "DigiLocker documents",
    nameTamil: "டிஜிலாக்கரில் ஆவணங்களைப் பெறுதல்",
    categoryTamil: "மின்னணு ஆவணங்கள்",
    goalTamil: "அரசு அல்லது பிற வழங்குநரிடமிருந்து டிஜிட்டல் ஆவணங்களைப் பெறுதல், பார்க்குதல் அல்லது ஒப்புதலுடன் பகிர்தல்.",
    stepsTamil: [
      "DigiLocker அதிகாரப்பூர்வ தளத்தில் Login / Register தேர்ந்தெடுக்கவும்.",
      "உங்களுக்குச் சொந்தமான மொபைல் வழியாகப் பதிவு செய்து, உங்கள் எண்ணுக்கு வரும் OTP-ஐ நீங்களே உள்ளிட்டு பாதுகாப்பு PIN அமைக்கவும்.",
      "உள்நுழைந்த பின் Browse Documents-ல் தேவையான துறை/வழங்குநரையும் ஆவணத்தையும் தேடுங்கள்.",
      "வழங்குநரின் பதிவுடன் பொருந்தும் விவரங்களை மட்டும் உள்ளிடுங்கள். வழங்குநரிடம் ஆவணம் இருந்தால் அது Issued Documents பகுதியில் வரும்.",
      "பகிர்வதற்கு முன் பெறுநர் அந்த ஆவணத்தை ஏற்கிறாரா எனக் கேட்டு, DigiLocker காட்டும் ஒப்புதல் மற்றும் பகிர்வு முறையை கவனமாகப் பயன்படுத்துங்கள்.",
    ],
    prepareTamil: [
      "OTP பெறக்கூடிய, உங்களின் கட்டுப்பாட்டில் உள்ள மொபைல் எண்.",
      "தேவையான ஆவணத்தை வழங்கிய துறையின் பதிவுடன் பொருந்தும் தகவல்கள்.",
      "கணக்கிற்காக அமைக்கும் பாதுகாப்பு PIN; அதை யாரிடமும் பகிர வேண்டாம்.",
    ],
    safetyTamil: [
      "OTP மற்றும் பாதுகாப்பு PIN-ஐ யாரிடமும் சொல்லவோ அனுப்பவோ வேண்டாம்.",
      "ஆவணத்தைப் பெறவும் பகிரவும் முன் ஒப்புதல் திரையைப் படியுங்கள்; தேர்ந்தெடுத்த பெறுநருக்கே பகிருங்கள்.",
      "Issued Documents வழங்குநரிடமிருந்து நேரடியாக வரும்; நீங்களே பதிவேற்றிய கோப்பு அதே வகையான சான்று அல்ல.",
      "ஆவணத்தை நிறுவனம் ஏற்கிறதா என்பதை அந்த நிறுவனத்திடம் உறுதிப்படுத்தவும்.",
    ],
    scopeTamil: "பதிவு–சரிபார்ப்பு–ஆவணம் பெறுதல்–பகிர்தல் ஆகிய வழிகளைச் சுருக்குகிறது. குறிப்பிட்ட ஆவணம் கிடைப்பது அந்த வழங்குநரின் பதிவைப் பொறுத்தது. DigiLocker-இன் அதிகாரப்பூர்வ முகப்பு 70+ கோடி பதிவு செய்த பயனர்கள் மற்றும் 900+ கோடி வழங்கப்பட்ட ஆவணங்கள் எனக் காட்டியது; இது சேவையின் பயன்பாட்டு அளவு, இந்தப் பட்டியலுக்கான தரவரிசை அல்ல.",
    officialUrl: "https://www.digilocker.gov.in/",
    sources: [
      { title: "DigiLocker — official portal", url: "https://www.digilocker.gov.in/" },
      { title: "DigiLocker Frequently Asked Questions", url: "https://www.digilocker.gov.in/web/about/faq" },
      { title: "About DigiLocker", url: "https://www.digilocker.gov.in/web/about/about-digilocker" },
      { title: "DigiLocker Technology Overview", url: "https://www.digilocker.gov.in/web/technology" },
    ],
    lastVerified: "2026-10-01",
    hasVerifiedUsageMetric: true,
  },
  {
    id: "instant-epan",
    scope: "india",
    nameEnglish: "Instant e-PAN (if eligible)",
    nameTamil: "உடனடி மின்-PAN பெறுதல் அல்லது சரிபார்த்தல்",
    categoryTamil: "வரி அடையாள ஆவணம்",
    goalTamil: "தகுதி இருந்தால் Instant e-PAN விண்ணப்பித்தல்; ஏற்கெனவே PAN இருந்தால் அதன் நிலையைச் சரிபார்த்தல்.",
    stepsTamil: [
      "வருமானவரி துறையின் e-Filing அதிகாரப்பூர்வ தளத்தில் Instant e-PAN சேவையைத் திறக்கவும்.",
      "புதிய e-PAN விண்ணப்பத்திற்கு முதலில் தகுதியைப் பாருங்கள்: இது தகுதியுள்ள தனிநபருக்கானது; ஏற்கெனவே PAN ஒதுக்கப்பட்டிருந்தால் புதியதாக விண்ணப்பிக்க வேண்டாம்.",
      "Get New e-PAN தேர்ந்தெடுத்து அதிகாரப்பூர்வ திரையில் காட்டப்படும் வழிமுறைகளையும் ஆதார்/DigiLocker ஒப்புதலையும் படியுங்கள்.",
      "ஆதார் அல்லது VID, ஆதாருடன் இணைக்கப்பட்ட கைபேசிக்கு வரும் OTP மற்றும் திரையில் கேட்கும் தகவல்களை அதிகாரப்பூர்வ தளத்தில் நீங்களே உள்ளிடுங்கள்.",
      "Acknowledgement Number-ஐ வைத்திருந்து Check Status / Download e-PAN வழியாகத் தொடருங்கள். ஏற்கெனவே PAN இருந்தால் Verify PAN-ஐப் பயன்படுத்துங்கள்.",
    ],
    prepareTamil: [
      "புதிய e-PAN-க்கு செல்லுபடியாகும் ஆதார் மற்றும் அதனுடன் இணைக்கப்பட்டு உங்களால் அணுகக்கூடிய கைபேசி எண்.",
      "DigiLocker மூலம் சரிபார்க்க/பகிர வேண்டிய ஆவணங்களைத் தளத்தின் தற்போதைய வழிகாட்டியில் சரிபார்க்கவும்.",
      "Verify PAN-க்கு PAN எண், முழுப் பெயர், பிறந்த தேதி மற்றும் அணுகக்கூடிய கைபேசி எண்.",
    ],
    safetyTamil: [
      "OTP அல்லது DigiLocker PIN-ஐ யாரிடமும் பகிர வேண்டாம்; அதிகாரப்பூர்வ வருமானவரி தளத்தில் நீங்களே உள்ளிடுங்கள்.",
      "ஏற்கெனவே PAN இருந்தால் புதிய e-PAN கேட்க வேண்டாம்; Verify PAN சேவையைப் பாருங்கள்.",
      "தகுதி அல்லது PAN ஒதுக்கீடு உறுதி அல்ல; அதிகாரப்பூர்வ சரிபார்ப்புக்கு உட்பட்டது.",
    ],
    scopeTamil: "இந்த வழிகாட்டி தகுதியுள்ளவர்களுக்கான Instant e-PAN மற்றும் PAN சரிபார்ப்பு மட்டும். விண்ணப்பம் தகுதியின்மை/சரிபார்ப்புப் பிரச்சினையால் முடியாவிட்டால் அதிகாரப்பூர்வ வருமானவரி FAQ-ஐப் பின்பற்றுங்கள்; இணைப்புகளை மாற்றி அமைக்கும் இடைத்தரகர்களைத் தவிர்க்கவும்.",
    officialUrl: "https://www.incometax.gov.in/iec/foportal/",
    sources: [
      { title: "Income Tax Department e-Filing portal", url: "https://www.incometax.gov.in/iec/foportal/" },
      { title: "Instant e-PAN FAQ", url: "https://www.incometax.gov.in/iec/foportal/help/e-filing-generate-instant-e-pan-faq" },
      { title: "Instant e-PAN User Manual", url: "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/instant-e-pan/instant-UM" },
      { title: "Verify Your PAN User Manual", url: "https://www.incometax.gov.in/iec/foportal/help/how-to-verify-pan" },
    ],
    lastVerified: "2026-10-01",
    hasVerifiedUsageMetric: false,
  },
  {
    id: "tn-community-certificate",
    scope: "tamil-nadu",
    nameEnglish: "Tamil Nadu community certificate",
    nameTamil: "சமூகச் சான்றிதழ் விண்ணப்பம்",
    categoryTamil: "தமிழ்நாடு · வருவாய்த் துறை",
    goalTamil: "தமிழ்நாடு e-Sevai வழியாக REV-101 சமூகச் சான்றிதழுக்கு விண்ணப்பித்தல்.",
    stepsTamil: [
      "தமிழ்நாடு e-Sevai குடிமக்கள் தளத்தில் New User? SignUp here வழியாகப் பதிவு செய்து, உங்கள் பயனர் ஐடி/கடவுச்சொல்லால் உள்நுழையுங்கள்.",
      "Services → Department Wise → Revenue Department → REV-101 Community Certificate தேர்ந்தெடுத்து Proceed அழுத்துங்கள்.",
      "CAN (Citizen Access Number) இருந்தால் உங்கள் பதிவைத் தேர்ந்தெடுக்கவும். இல்லையெனில் தளத்தில் உள்ள CAN பதிவு வழியைப் பின்பற்றுங்கள்.",
      "திரையில் கேட்கும் விவரங்களைச் சரிபார்த்து நிரப்பி, தற்போதைய கோப்பு விதிகளுக்கேற்ப தேவையான ஆவணங்களைப் பதிவேற்றி சமர்ப்பிக்கவும்.",
      "கட்டணம் காட்டப்பட்டால் தொகையைச் சரிபார்த்து செலுத்தி, ரசீது/விண்ணப்ப எண்ணை வைத்திருந்து Check Status-ல் நிலையைப் பாருங்கள்.",
    ],
    prepareTamil: [
      "OTP பெறக்கூடிய கைபேசி எண் மற்றும் e-Sevai கணக்கு விவரங்கள்.",
      "அதிகாரப்பூர்வ FAQ-ல் கூறிய விண்ணப்பதாரரின் புகைப்படம், முகவரிச் சான்று, பொருந்தும் குடும்ப உறுப்பினரின் சமூகச் சான்றிதழ், சுய அறிவிப்பு போன்ற ஆவணங்களைச் சரிபார்க்கவும்.",
      "தகுதி மற்றும் விண்ணப்ப வகைக்கான தற்போதைய ஆவண/கோப்பு அளவு விதிகளை e-Sevai திரையில் உறுதிசெய்யவும்.",
    ],
    safetyTamil: [
      "tnesevai.tn.gov.in அதிகாரப்பூர்வ தளத்தில் மட்டுமே பதிவு செய்து ஆவணங்களைப் பதிவேற்றுங்கள்.",
      "OTP அல்லது கடவுச்சொல்லை யாரிடமும் சொல்ல வேண்டாம்; அதை அதிகாரப்பூர்வ புலத்தில் நீங்களே உள்ளிடுங்கள்.",
      "பழைய ஆபரேட்டர் கையேட்டின் திரை அமைப்பு மாறியிருக்கலாம்; தற்போதைய குடிமக்கள் தள அறிவுறுத்தலையே பின்பற்றுங்கள்.",
      "சான்றிதழ் வழங்கப்படும் முடிவை உறுதி செய்ய முடியாது; காட்டப்படும் கட்டணத்தைச் செலுத்தும் முன் சரிபார்க்கவும்.",
    ],
    scopeTamil: "இணையத்தில் குடிமக்கள் தாங்களே பதிவு செய்து விண்ணப்பிக்கலாம்; உதவி வேண்டுமானால் அரசு e-Sevai மையத்தை அணுகலாம். விரிவான சில படிகள் பழைய ஆபரேட்டர் கையேட்டில் இருந்து சரிபார்க்கப்பட்டதால், தற்போதைய திரை/பட்டியல் பெயர்கள் மாறியிருக்கலாம். உதவி எண்: 1800-425-6000.",
    officialUrl: "https://www.tnesevai.tn.gov.in/citizen/",
    sources: [
      { title: "e-Sevai Citizen Services — TNeGA", url: "https://www.tnesevai.tn.gov.in/citizen/" },
      { title: "Frequently Asked Questions — Tamil Nadu e-Sevai", url: "https://www.tnesevai.tn.gov.in/Pages/FAQ.aspx" },
      { title: "REV-101 Community Certificate Training Manual", url: "https://www.tnesevai.tn.gov.in/Pages/PPT/CSCOperator_REV-101_CommunityCertificate.pdf" },
      { title: "e-Sevai — Tamil Nadu IT Department", url: "https://it.tn.gov.in/en/TNEGA/e-Sevai" },
    ],
    lastVerified: "2026-10-01",
    hasVerifiedUsageMetric: false,
  },
  {
    id: "tn-income-certificate",
    scope: "tamil-nadu",
    nameEnglish: "Tamil Nadu income certificate",
    nameTamil: "வருமானச் சான்றிதழ் விண்ணப்பம்",
    categoryTamil: "தமிழ்நாடு · வருவாய்த் துறை",
    goalTamil: "தமிழ்நாடு e-Sevai வழியாக REV-103 வருமானச் சான்றிதழுக்கு விண்ணப்பித்தல்.",
    stepsTamil: [
      "தமிழ்நாடு e-Sevai குடிமக்கள் தளத்தில் புதிய பயனராகப் பதிவு செய்து உங்கள் கணக்கில் உள்நுழையுங்கள்; விரும்பினால் e-Sevai மையத்திலும் உதவி பெறலாம்.",
      "Services-ல் Revenue Department → REV-103 Income Certificate தேர்ந்தெடுத்து Proceed அழுத்துங்கள்.",
      "CAN இருந்தால் உங்கள் பதிவைத் தேர்ந்தெடுக்கவும்; இல்லையெனில் அதிகாரப்பூர்வ CAN பதிவு வழியைப் பின்பற்றுங்கள்.",
      "விண்ணப்பத்தில் கேட்கும் குடும்ப உறுப்பினர் மற்றும் வருமான விவரங்களை உண்மையாக நிரப்பி, தளத்தின் தற்போதைய ஆவணப் பட்டியலைப் பார்த்து கோப்புகளைப் பதிவேற்றுங்கள்.",
      "சமர்ப்பிக்கும் முன் தகவலைச் சரிபார்த்து, கட்டணம் காட்டப்பட்டால் தொகையை உறுதிப்படுத்துங்கள். ரசீது/விண்ணப்ப எண்ணை வைத்திருந்து Check Status-ல் நிலையைப் பாருங்கள்.",
    ],
    prepareTamil: [
      "e-Sevai கணக்கு/பதிவுக்குத் தேவையான பெயர், மாவட்டம், வட்டம், கைபேசி மற்றும் CAN தகவல்கள்.",
      "அதிகாரப்பூர்வ e-Sevai FAQ கூறும் புகைப்படம், முகவரிச் சான்று, குடும்ப/ஸ்மார்ட் அட்டை, சுய அறிவிப்பு, வருமான ஆதாரம் போன்றவை பொருந்துமா எனச் சரிபார்க்கவும்.",
      "விண்ணப்பதாரரின் நிலையைப் பொறுத்த ஆவணங்களை தளத்தில் காட்டும் தற்போதைய பட்டியலுடன் ஒப்பிடவும்; பழைய கையேடு முழுப் பட்டியலாக இருக்காமல் இருக்கலாம்.",
    ],
    safetyTamil: [
      "tnesevai.tn.gov.in என்ற அதிகாரப்பூர்வ தளத்தில் மட்டுமே விவரங்களை அளியுங்கள்; தேவையான ஆவணங்களை மட்டும் பதிவேற்றுங்கள்.",
      "OTP மற்றும் கடவுச்சொல்லை யாரிடமும் பகிர வேண்டாம்; விண்ணப்ப விவரங்களை அனுப்புவதற்கு முன் சரிபார்க்கவும்.",
      "பழைய ஆபரேட்டர் கையேட்டின் திரை/சேவைப் பெயர்கள் மாறியிருக்கலாம்; நேரடி தளத்தில் காட்டப்படும் அறிவுறுத்தலே முதன்மை.",
      "உதவி: 1800-425-6000 அல்லது tnesevaihelpdesk@tn.gov.in. விண்ணப்ப முடிவு உறுதி அல்ல.",
    ],
    scopeTamil: "REV-103 குடிமக்கள் இணையவழி விண்ணப்பம் மற்றும் விருப்ப e-Sevai மைய உதவிக்கான வழிகாட்டி. சில படிகள் பழைய ஆபரேட்டர் கையேட்டில் இருந்து உறுதிசெய்யப்பட்டதால் தற்போதைய பட்டியல்/திரை மாறியிருக்கலாம். தளத்தின் live வழிமுறைகள் மற்றும் ஆவணப் பட்டியலைப் பின்பற்றுங்கள்.",
    officialUrl: "https://www.tnesevai.tn.gov.in/citizen/",
    sources: [
      { title: "e-Sevai Citizen Services — Tamil Nadu e-Sevai", url: "https://www.tnesevai.tn.gov.in/citizen/" },
      { title: "Citizen Registration — Tamil Nadu e-Sevai", url: "https://www.tnesevai.tn.gov.in/Citizen/Registration.aspx" },
      { title: "Frequently Asked Questions — Tamil Nadu e-Sevai", url: "https://www.tnesevai.tn.gov.in/Pages/FAQ.aspx" },
      { title: "REV-103 Income Certificate Training Manual", url: "https://www.tnesevai.tn.gov.in/Pages/PPT/CSCOperator_REV-103_IncomeCertificate.pdf" },
    ],
    lastVerified: "2026-10-01",
    hasVerifiedUsageMetric: false,
  },
  {
    id: "tn-family-card",
    scope: "tamil-nadu",
    nameEnglish: "Tamil Nadu family-card and PDS services",
    nameTamil: "தமிழ்நாடு குடும்ப அட்டை சேவைகள்",
    categoryTamil: "தமிழ்நாடு · குடும்ப அட்டை / உணவு",
    goalTamil: "புதிய மின்னணு குடும்ப அட்டை, உறுப்பினர் அல்லது முகவரி மாற்றம், நிலை அறிதல் போன்ற சேவைகளை அணுகுதல்.",
    stepsTamil: [
      "தமிழ்நாடு PDS (TNPDS) அதிகாரப்பூர்வ தளத்தைத் திறக்கவும்.",
      "புதிய அட்டை வேண்டுமெனில் புதிய மின்னணு அட்டை விண்ணப்பிக்க என்பதைத் தேர்ந்தெடுக்கவும்; ஏற்கெனவே விண்ணப்பித்திருந்தால் விண்ணப்ப நிலை/மறுபரிசீலனை சேவையைத் தேர்ந்தெடுக்கவும்.",
      "ஏற்கெனவே உள்ள அட்டைக்கு உறுப்பினர் சேர்த்தல்/நீக்குதல், முகவரி அல்லது குடும்பத் தலைவர் மாற்றம் போன்றவற்றில் பொருத்தமான அட்டைச் சேவையைத் தேர்வு செய்யுங்கள்.",
      "தளத்தில் காட்டப்படும் தற்போதைய வழிமுறைகளைப் பின்பற்றி, விண்ணப்பம்/அட்டைச் சேவை நிலையை அதே அதிகாரப்பூர்வ தளத்தில் பாருங்கள்.",
      "தளத்தில் தேவையான சேவை தெரியாவிட்டால், அதிகாரப்பூர்வ e-Sevai மையத்தின் உதவியைப் பெறுங்கள்.",
    ],
    prepareTamil: [
      "முதலில் தேவை எது என்று தேர்வு செய்யுங்கள்: புதிய அட்டை, அட்டை மாற்றம், உறுப்பினர் மாற்றம் அல்லது நிலை அறிதல்.",
      "இந்த வழிகாட்டி ஆய்வில் பொது ஆவணப் பட்டியல் உறுதிப்படுத்தப்படவில்லை; படிவம் கேட்கும் தகவல்/ஆவணங்களை மட்டும் தயாரிக்கவும்.",
    ],
    safetyTamil: [
      "tnpds.gov.in என்ற அதிகாரப்பூர்வ தளத்தை அல்லது அரசு e-Sevai மையத்தை மட்டும் பயன்படுத்துங்கள்.",
      "OTP/கடவுச்சொல்லை யாரிடமும் பகிர வேண்டாம். உதவி எண்ணை அதிகாரப்பூர்வ தளத்திலிருந்து மீண்டும் சரிபார்க்கவும்.",
      "விண்ணப்பம் ஏற்கப்படும் அல்லது அட்டை வழங்கப்படும் என உறுதி இல்லை; அதிகாரப்பூர்வ நிலையைப் பாருங்கள்.",
    ],
    scopeTamil: "TNPDS முகப்பு மற்றும் அரசு e-Sevai சேவைப் பட்டியலில் காணப்பட்ட சேவைகள் இங்கே சுருக்கப்பட்டுள்ளன. விரிவான படிவ வழிமுறைகள் அல்லது பொதுவான ஆவணப் பட்டியல் அதிகாரப்பூர்வமாக உறுதிப்படுத்தப்படாததால் அவை ஊகிக்கப்படவில்லை.",
    officialUrl: "https://www.tnpds.gov.in/",
    sources: [
      { title: "Tamil Nadu Public Distribution System portal", url: "https://www.tnpds.gov.in/" },
      { title: "Public Distribution System — Tamil Nadu Civil Supplies", url: "https://tncsc.tn.gov.in/en/PDS.html" },
      { title: "e-Sevai — Tamil Nadu IT Department", url: "https://it.tn.gov.in/en/TNEGA/e-Sevai" },
    ],
    lastVerified: "2026-10-01",
    hasVerifiedUsageMetric: false,
  },
];

export function getServicesForState(stateName: string) {
  return SERVICE_CATALOG.filter(service => service.scope === "india" || (service.scope === "tamil-nadu" && stateName === "Tamil Nadu"));
}

export const OFFICIAL_MORE_SERVICES_URL = "https://www.india.gov.in/services/state";
export const OFFICIAL_STATES_DIRECTORY_URL = "https://igod.gov.in/sg/states";
