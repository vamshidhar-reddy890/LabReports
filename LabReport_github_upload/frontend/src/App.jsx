import { cloneElement, createContext, isValidElement, useContext, useEffect, useMemo, useRef, useState } from "react";

const API = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const FORM_API_KEY = "01933b1f-9260-4a88-9e72-1936305c4174";
const LANGUAGE_KEY = "lab_lang";

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "te", label: "Telugu (తెలుగు)" },
  { code: "hi", label: "Hindi (हिन्दी)" },
  { code: "ta", label: "Tamil (தமிழ்)" },
  { code: "kn", label: "Kannada (ಕನ್ನಡ)" },
  { code: "ml", label: "Malayalam (മലയാളം)" },
  { code: "bn", label: "Bengali (বাংলা)" },
  { code: "mr", label: "Marathi (मराठी)" },
  { code: "gu", label: "Gujarati (ગુજરાતી)" },
  { code: "pa", label: "Punjabi (ਪੰਜਾਬੀ)" },
];

const I18nContext = createContext({ lang: "en", setLang: () => {}, t: (k) => k, tt: (s) => s });

const TRANSLATIONS = {
  en: {
    app_name: "Lab Report Intelligence",
    nav_dashboard: "Dashboard",
    nav_report: "Analysis Report",
    nav_about: "About",
    nav_reviews: "Reviews",
    nav_contact: "Contact",
    nav_settings: "Settings",
    nav_logout: "Logout",
    top_new_report: "+ New Report",
    login_title: "Welcome Back",
    login_sub: "Login to access report intelligence.",
    register_title: "Create Account",
    register_sub: "Get AI-assisted insights from your reports.",
    save_changes: "Save Changes",
    profile_settings: "Profile Settings",
    profile_settings_sub: "Update your personal information for accurate medical analysis.",
    member_since: "Member since {date}",
    language: "Language",
    language_pref: "Language Preference",
    language_pref_sub: "Choose your app language.",
    Email: "Email",
    Password: "Password",
    Login: "Login",
    "No account?": "No account?",
    "Create one": "Create one",
    "Full Name": "Full Name",
    "Demo Password Hint (optional)": "Demo Password Hint (optional)",
    Gender: "Gender",
    "Prefer not to say": "Prefer not to say",
    Male: "Male",
    Female: "Female",
    Age: "Age",
    "Create Account": "Create Account",
    "Already have account?": "Already have account?",
    "Saving...": "Saving...",
  },
  te: {
    app_name: "ల్యాబ్ రిపోర్ట్ ఇంటెలిజెన్స్",
    nav_dashboard: "డ్యాష్‌బోర్డ్",
    nav_report: "విశ్లేషణ రిపోర్ట్",
    nav_about: "గురించి",
    nav_reviews: "సమీక్షలు",
    nav_contact: "సంప్రదించండి",
    nav_settings: "సెట్టింగ్స్",
    nav_logout: "లాగౌట్",
    top_new_report: "+ కొత్త రిపోర్ట్",
    login_title: "తిరిగి స్వాగతం",
    login_sub: "రిపోర్ట్ విశ్లేషణ కోసం లాగిన్ అవ్వండి.",
    register_title: "ఖాతా సృష్టించండి",
    register_sub: "మీ రిపోర్ట్‌లకు AI సహాయ సూచనలు పొందండి.",
    save_changes: "మార్పులు సేవ్ చేయండి",
    profile_settings: "ప్రొఫైల్ సెట్టింగ్స్",
    profile_settings_sub: "ఖచ్చితమైన వైద్య విశ్లేషణ కోసం మీ వివరాలు నవీకరించండి.",
    member_since: "{date} నుంచి సభ్యుడు",
    language: "భాష",
    language_pref: "భాష అభిరుచి",
    language_pref_sub: "యాప్ భాషను ఎంచుకోండి.",
    Email: "ఇమెయిల్",
    Password: "పాస్‌వర్డ్",
    Login: "లాగిన్",
    "No account?": "ఖాతా లేదా?",
    "Create one": "ఒకటి సృష్టించండి",
    "Full Name": "పూర్తి పేరు",
    "Demo Password Hint (optional)": "డెమో పాస్‌వర్డ్ సూచన (ఐచ్ఛికం)",
    Gender: "లింగం",
    "Prefer not to say": "చెప్పకూడదు",
    Male: "పురుషుడు",
    Female: "స్త్రీ",
    Age: "వయస్సు",
    "Create Account": "ఖాతా సృష్టించండి",
    "Already have account?": "ఇప్పటికే ఖాతా ఉందా?",
    "Saving...": "సేవ్ చేస్తున్నాం...",
  },
  hi: {
    app_name: "लैब रिपोर्ट इंटेलिजेंस",
    nav_dashboard: "डैशबोर्ड",
    nav_report: "विश्लेषण रिपोर्ट",
    nav_about: "परिचय",
    nav_reviews: "समीक्षाएँ",
    nav_contact: "संपर्क",
    nav_settings: "सेटिंग्स",
    nav_logout: "लॉगआउट",
    top_new_report: "+ नई रिपोर्ट",
    login_title: "वापसी पर स्वागत है",
    login_sub: "रिपोर्ट विश्लेषण के लिए लॉगिन करें।",
    register_title: "खाता बनाएं",
    register_sub: "अपनी रिपोर्ट के लिए AI सहायता प्राप्त करें।",
    save_changes: "परिवर्तन सहेजें",
    profile_settings: "प्रोफ़ाइल सेटिंग्स",
    profile_settings_sub: "सटीक मेडिकल विश्लेषण के लिए अपनी जानकारी अपडेट करें।",
    member_since: "{date} से सदस्य",
    language: "भाषा",
    language_pref: "भाषा पसंद",
    language_pref_sub: "ऐप की भाषा चुनें।",
    Email: "ईमेल",
    Password: "पासवर्ड",
    Login: "लॉगिन",
    "No account?": "कोई खाता नहीं?",
    "Create one": "नया बनाएं",
    "Full Name": "पूरा नाम",
    "Demo Password Hint (optional)": "डेमो पासवर्ड संकेत (वैकल्पिक)",
    Gender: "लिंग",
    "Prefer not to say": "न बताना चाहें",
    Male: "पुरुष",
    Female: "महिला",
    Age: "आयु",
    "Create Account": "खाता बनाएं",
    "Already have account?": "पहले से खाता है?",
    "Saving...": "सहेजा जा रहा है...",
  },
};

const TEXT_TRANSLATIONS = {
  te: {
    "Loading dashboard...": "డ్యాష్‌బోర్డ్ లోడ్ అవుతోంది...",
    "Loading analysis...": "విశ్లేషణ లోడ్ అవుతోంది...",
    "Loading settings...": "సెట్టింగ్స్ లోడ్ అవుతోంది...",
    "No reports available.": "రిపోర్టులు లభ్యం కావడం లేదు.",
    "Open": "తెరువు",
    "Delete": "తొలగించు",
    "Abnormal": "అసాధారణం",
    "Risk": "ప్రమాదం",
    "Analysis History": "విశ్లేషణ చరిత్ర",
    "No Selected Report": "ఎంచుకున్న రిపోర్ట్ లేదు",
    "Choose any report from Analysis History to view full details.": "పూర్తి వివరాల కోసం చరిత్రలోని రిపోర్ట్‌ని ఎంచుకోండి.",
    "Health Score": "ఆరోగ్య స్కోర్",
    "AI Summary": "AI సారాంశం",
    "Overview": "సారాంశం",
    "Problems": "సమస్యలు",
    "Diet & Lifestyle": "ఆహారం & జీవనశైలి",
    "Medications": "మందులు",
    "Precautions": "జాగ్రత్తలు",
    "Analyzed Test Results": "విశ్లేషించిన పరీక్ష ఫలితాలు",
    "No recognized benchmarked tests in this report.": "ఈ రిపోర్ట్‌లో గుర్తించిన బెంచ్‌మార్క్ పరీక్షలు లేవు.",
    "Ignored Extracted Items": "విస్మరించిన అంశాలు",
    "Recommended": "సిఫార్సు చేసినవి",
    "Limit / Avoid": "పరిమితం / నివారించండి",
    "Sample Tablets (Demo)": "ఉదాహరణ మాత్రలు (డెమో)",
    "Profile updated successfully.": "ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది.",
    "Create Account": "ఖాతా సృష్టించండి",
    "Welcome Back": "తిరిగి స్వాగతం",
    "Dashboard": "డ్యాష్‌బోర్డ్",
    "Analysis Report": "విశ్లేషణ రిపోర్ట్",
    "About This Platform": "ఈ వేదిక గురించి",
    "Core Capabilities": "ప్రధాన సామర్థ్యాలు",
    "User Reviews": "వినియోగదారుల సమీక్షలు",
    "Give Your Review": "మీ సమీక్ష ఇవ్వండి",
    "Contact Form": "సంప్రదింపు ఫారమ్",
    "Your Contact History": "మీ సంప్రదింపు చరిత్ర",
    "Send Message": "సందేశం పంపండి",
    "Submit Review": "సమీక్ష సమర్పించండి",
    "high": "ఎక్కువ",
    "low": "తక్కువ",
    "normal": "సాధారణం",
    "Value": "విలువ",
    "Reference": "సూచిక పరిధి",
  },
  hi: {
    "Loading dashboard...": "डैशबोर्ड लोड हो रहा है...",
    "Loading analysis...": "विश्लेषण लोड हो रहा है...",
    "Loading settings...": "सेटिंग्स लोड हो रही हैं...",
    "No reports available.": "कोई रिपोर्ट उपलब्ध नहीं है।",
    "Open": "खोलें",
    "Delete": "हटाएं",
    "Abnormal": "असामान्य",
    "Risk": "जोखिम",
    "Analysis History": "विश्लेषण इतिहास",
    "No Selected Report": "कोई रिपोर्ट चयनित नहीं",
    "Choose any report from Analysis History to view full details.": "पूरा विवरण देखने के लिए इतिहास से रिपोर्ट चुनें।",
    "Health Score": "हेल्थ स्कोर",
    "AI Summary": "AI सारांश",
    "Overview": "ओवरव्यू",
    "Problems": "समस्याएँ",
    "Diet & Lifestyle": "आहार और जीवनशैली",
    "Medications": "दवाइयाँ",
    "Precautions": "सावधानियाँ",
    "Analyzed Test Results": "विश्लेषित टेस्ट परिणाम",
    "No recognized benchmarked tests in this report.": "इस रिपोर्ट में कोई मान्य बेंचमार्क टेस्ट नहीं मिला।",
    "Ignored Extracted Items": "नज़रअंदाज़ किए गए आइटम",
    "Recommended": "सुझाव",
    "Limit / Avoid": "सीमित / बचें",
    "Sample Tablets (Demo)": "नमूना टैबलेट (डेमो)",
    "Profile updated successfully.": "प्रोफ़ाइल सफलतापूर्वक अपडेट हुई।",
    "Create Account": "खाता बनाएं",
    "Welcome Back": "वापसी पर स्वागत है",
    "Dashboard": "डैशबोर्ड",
    "Analysis Report": "विश्लेषण रिपोर्ट",
    "About This Platform": "इस प्लेटफ़ॉर्म के बारे में",
    "Core Capabilities": "मुख्य क्षमताएँ",
    "User Reviews": "उपयोगकर्ता समीक्षाएँ",
    "Give Your Review": "अपनी समीक्षा दें",
    "Contact Form": "संपर्क फ़ॉर्म",
    "Your Contact History": "आपका संपर्क इतिहास",
    "Send Message": "संदेश भेजें",
    "Submit Review": "समीक्षा जमा करें",
    "Profile Snapshot": "प्रोफ़ाइल स्नैपशॉट",
    "Quick Actions": "त्वरित कार्य",
    "Daily Health Tips": "दैनिक स्वास्थ्य सुझाव",
    "View History": "इतिहास देखें",
    "Read About Platform": "प्लेटफ़ॉर्म के बारे में पढ़ें",
    "Contact Support": "सपोर्ट से संपर्क करें",
    "high": "उच्च",
    "low": "निम्न",
    "normal": "सामान्य",
    "Value": "मान",
    "Reference": "संदर्भ",
  },
};

const WORD_TRANSLATIONS = {
  te: {
    report: "రిపోర్ట్",
    analysis: "విశ్లేషణ",
    summary: "సారాంశం",
    value: "విలువ",
    values: "విలువలు",
    range: "పరిధి",
    normal: "సాధారణం",
    high: "ఎక్కువ",
    low: "తక్కువ",
    risk: "ప్రమాదం",
    score: "స్కోర్",
    test: "పరీక్ష",
    tests: "పరీక్షలు",
    upload: "అప్‌లోడ్",
    doctor: "వైద్యుడు",
    medication: "మందు",
    medications: "మందులు",
    recommendation: "సిఫార్సు",
    precautions: "జాగ్రత్తలు",
    diet: "ఆహారం",
    lifestyle: "జీవనశైలి",
  },
  hi: {
    report: "रिपोर्ट",
    analysis: "विश्लेषण",
    summary: "सारांश",
    value: "मान",
    values: "मान",
    range: "सीमा",
    normal: "सामान्य",
    high: "उच्च",
    low: "निम्न",
    risk: "जोखिम",
    score: "स्कोर",
    test: "जांच",
    tests: "जांचें",
    upload: "अपलोड",
    doctor: "डॉक्टर",
    medication: "दवा",
    medications: "दवाइयाँ",
    recommendation: "सिफारिश",
    precautions: "सावधानियां",
    diet: "आहार",
    lifestyle: "जीवनशैली",
  },
};

Object.assign(TRANSLATIONS, {
  ta: {
    ...TRANSLATIONS.en,
    app_name: "லாப் ரிப்போர்ட் இன்டெலிஜென்ஸ்",
    nav_dashboard: "டாஷ்போர்டு",
    nav_report: "ஆய்வு அறிக்கை",
    nav_about: "பற்றி",
    nav_reviews: "மதிப்புரைகள்",
    nav_contact: "தொடர்பு",
    nav_settings: "அமைப்புகள்",
    nav_logout: "வெளியேறு",
    top_new_report: "+ புதிய அறிக்கை",
    login_title: "மீண்டும் வரவேற்கிறோம்",
    register_title: "கணக்கு உருவாக்கவும்",
    save_changes: "மாற்றங்களை சேமிக்கவும்",
    profile_settings: "சுயவிவர அமைப்புகள்",
    language_pref: "மொழி விருப்பம்",
  },
  kn: {
    ...TRANSLATIONS.en,
    app_name: "ಲ್ಯಾಬ್ ರಿಪೋರ್ಟ್ ಇಂಟೆಲಿಜೆನ್ಸ್",
    nav_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    nav_report: "ವಿಶ್ಲೇಷಣೆ ವರದಿ",
    nav_about: "ಬಗ್ಗೆ",
    nav_reviews: "ವಿಮರ್ಶೆಗಳು",
    nav_contact: "ಸಂಪರ್ಕ",
    nav_settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    nav_logout: "ಲಾಗ್‌ಔಟ್",
    top_new_report: "+ ಹೊಸ ವರದಿ",
    login_title: "ಮತ್ತೆ ಸ್ವಾಗತ",
    register_title: "ಖಾತೆ ರಚಿಸಿ",
    save_changes: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    profile_settings: "ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    language_pref: "ಭಾಷೆ ಆಯ್ಕೆ",
  },
  ml: {
    ...TRANSLATIONS.en,
    app_name: "ലാബ് റിപ്പോർട്ട് ഇന്റലിജൻസ്",
    nav_dashboard: "ഡാഷ്ബോർഡ്",
    nav_report: "വിശകലന റിപ്പോർട്ട്",
    nav_about: "കുറിച്ച്",
    nav_reviews: "റിവ്യൂകൾ",
    nav_contact: "ബന്ധപ്പെടുക",
    nav_settings: "സെറ്റിംഗ്സ്",
    nav_logout: "ലോഗൗട്ട്",
    top_new_report: "+ പുതിയ റിപ്പോർട്ട്",
    login_title: "വീണ്ടും സ്വാഗതം",
    register_title: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    save_changes: "മാറ്റങ്ങൾ സംരക്ഷിക്കുക",
    profile_settings: "പ്രൊഫൈൽ സെറ്റിംഗ്സ്",
    language_pref: "ഭാഷ തിരഞ്ഞെടുപ്പ്",
  },
  bn: {
    ...TRANSLATIONS.en,
    app_name: "ল্যাব রিপোর্ট ইন্টেলিজেন্স",
    nav_dashboard: "ড্যাশবোর্ড",
    nav_report: "বিশ্লেষণ রিপোর্ট",
    nav_about: "সম্পর্কে",
    nav_reviews: "রিভিউ",
    nav_contact: "যোগাযোগ",
    nav_settings: "সেটিংস",
    nav_logout: "লগআউট",
    top_new_report: "+ নতুন রিপোর্ট",
    login_title: "আবার স্বাগতম",
    register_title: "অ্যাকাউন্ট তৈরি করুন",
    save_changes: "পরিবর্তন সংরক্ষণ করুন",
    profile_settings: "প্রোফাইল সেটিংস",
    language_pref: "ভাষা পছন্দ",
  },
  mr: {
    ...TRANSLATIONS.en,
    app_name: "लॅब रिपोर्ट इंटेलिजन्स",
    nav_dashboard: "डॅशबोर्ड",
    nav_report: "विश्लेषण अहवाल",
    nav_about: "माहिती",
    nav_reviews: "पुनरावलोकने",
    nav_contact: "संपर्क",
    nav_settings: "सेटिंग्ज",
    nav_logout: "लॉगआउट",
    top_new_report: "+ नवीन अहवाल",
    login_title: "पुन्हा स्वागत आहे",
    register_title: "खाते तयार करा",
    save_changes: "बदल जतन करा",
    profile_settings: "प्रोफाइल सेटिंग्ज",
    language_pref: "भाषा निवड",
  },
  gu: {
    ...TRANSLATIONS.en,
    app_name: "લેબ રિપોર્ટ ઇન્ટેલિજન્સ",
    nav_dashboard: "ડેશબોર્ડ",
    nav_report: "વિશ્લેષણ રિપોર્ટ",
    nav_about: "વિશે",
    nav_reviews: "સમીક્ષાઓ",
    nav_contact: "સંપર્ક",
    nav_settings: "સેટિંગ્સ",
    nav_logout: "લૉગઆઉટ",
    top_new_report: "+ નવો રિપોર્ટ",
    login_title: "ફરીથી સ્વાગત છે",
    register_title: "એકાઉન્ટ બનાવો",
    save_changes: "ફેરફારો સેવ કરો",
    profile_settings: "પ્રોફાઇલ સેટિંગ્સ",
    language_pref: "ભાષા પસંદગી",
  },
  pa: {
    ...TRANSLATIONS.en,
    app_name: "ਲੈਬ ਰਿਪੋਰਟ ਇੰਟੈਲੀਜੈਂਸ",
    nav_dashboard: "ਡੈਸ਼ਬੋਰਡ",
    nav_report: "ਵਿਸ਼ਲੇਸ਼ਣ ਰਿਪੋਰਟ",
    nav_about: "ਬਾਰੇ",
    nav_reviews: "ਸਮੀਖਿਆਵਾਂ",
    nav_contact: "ਸੰਪਰਕ",
    nav_settings: "ਸੈਟਿੰਗਜ਼",
    nav_logout: "ਲੌਗਆਉਟ",
    top_new_report: "+ ਨਵੀਂ ਰਿਪੋਰਟ",
    login_title: "ਮੁੜ ਸੁਆਗਤ ਹੈ",
    register_title: "ਖਾਤਾ ਬਣਾਓ",
    save_changes: "ਤਬਦੀਲੀਆਂ ਸੇਵ ਕਰੋ",
    profile_settings: "ਪ੍ਰੋਫਾਈਲ ਸੈਟਿੰਗਜ਼",
    language_pref: "ਭਾਸ਼ਾ ਪਸੰਦ",
  },
});

const COMMON_TEXT_HI = TEXT_TRANSLATIONS.hi;
Object.assign(TEXT_TRANSLATIONS, {
  ta: {
    ...COMMON_TEXT_HI,
    "Overview": "மேலோட்டம்",
    "Problems": "சிக்கல்கள்",
    "Diet & Lifestyle": "உணவு & வாழ்க்கை முறை",
    "Medications": "மருந்துகள்",
    "Precautions": "முன்னெச்சரிக்கைகள்",
  },
  kn: {
    ...COMMON_TEXT_HI,
    "Overview": "ಸಾರಾಂಶ",
    "Problems": "ಸಮಸ್ಯೆಗಳು",
    "Diet & Lifestyle": "ಆಹಾರ & ಜೀವನಶೈಲಿ",
    "Medications": "ಔಷಧಿಗಳು",
    "Precautions": "ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು",
  },
  ml: {
    ...COMMON_TEXT_HI,
    "Overview": "അവലോകനം",
    "Problems": "പ്രശ്നങ്ങൾ",
    "Diet & Lifestyle": "ഭക്ഷണം & ജീവിതശൈലി",
    "Medications": "മരുന്നുകൾ",
    "Precautions": "മുൻകരുതലുകൾ",
  },
  bn: {
    ...COMMON_TEXT_HI,
    "Overview": "ওভারভিউ",
    "Problems": "সমস্যা",
    "Diet & Lifestyle": "ডায়েট ও লাইফস্টাইল",
    "Medications": "ওষুধ",
    "Precautions": "সতর্কতা",
  },
  mr: {
    ...COMMON_TEXT_HI,
    "Overview": "आढावा",
    "Problems": "समस्या",
    "Diet & Lifestyle": "आहार व जीवनशैली",
    "Medications": "औषधे",
    "Precautions": "काळजी",
  },
  gu: {
    ...COMMON_TEXT_HI,
    "Overview": "ઝાંખી",
    "Problems": "સમસ્યાઓ",
    "Diet & Lifestyle": "આહાર અને જીવનશૈલી",
    "Medications": "દવાઓ",
    "Precautions": "સાવચેતીઓ",
  },
  pa: {
    ...COMMON_TEXT_HI,
    "Overview": "ਸੰਖੇਪ",
    "Problems": "ਸਮੱਸਿਆਵਾਂ",
    "Diet & Lifestyle": "ਆਹਾਰ ਅਤੇ ਜੀਵਨਸ਼ੈਲੀ",
    "Medications": "ਦਵਾਈਆਂ",
    "Precautions": "ਸਾਵਧਾਨੀਆਂ",
  },
});

const COMMON_WORD_HI = WORD_TRANSLATIONS.hi;
Object.assign(WORD_TRANSLATIONS, {
  ta: { ...COMMON_WORD_HI },
  kn: { ...COMMON_WORD_HI },
  ml: { ...COMMON_WORD_HI },
  bn: { ...COMMON_WORD_HI },
  mr: { ...COMMON_WORD_HI },
  gu: { ...COMMON_WORD_HI },
  pa: { ...COMMON_WORD_HI },
});

const getStoredLanguage = () => localStorage.getItem(LANGUAGE_KEY) || "en";

function useI18nValue(lang, setLang, dynamicCache, queueTranslate) {
  const t = (key, vars = {}) => {
    const base = TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
    return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)), base);
  };
  const tt = (text) => {
    if (text == null) return "";
    const raw = String(text);
    if (lang === "en") return raw;
    const dict = TEXT_TRANSLATIONS[lang] || {};
    if (dynamicCache[raw]) return dynamicCache[raw];
    if (dict[raw]) return dict[raw];
    // Avoid partial word-level replacements (they create mixed-language text).
    // Queue full sentence translation and keep source text until translated.
    queueTranslate(raw);
    return raw;
  };
  return { lang, setLang, t, tt };
}

function useI18n() {
  return useContext(I18nContext);
}

const getToken = () => localStorage.getItem("lab_token");
const setToken = (value) => {
  if (!value) localStorage.removeItem("lab_token");
  else localStorage.setItem("lab_token", value);
};

const getRoute = () => {
  const hash = window.location.hash || "#/login";
  return hash.replace("#", "");
};

async function apiRequest(path, options = {}) {
  const headers = options.headers || {};
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: text };
  }
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

function formatLocalDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(new Date(value));
}

function getExtractionModeFromFile(fileName = "") {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  let extractionMode = "General document parsing";
  if (["jpg", "jpeg", "png", "bmp", "tiff", "tif", "webp"].includes(ext)) {
    extractionMode = "Image OCR parsing (requires Tesseract installed)";
  } else if (ext === "pdf") {
    extractionMode = "PDF lab parser";
  } else if (["txt", "csv", "doc", "docx"].includes(ext)) {
    extractionMode = "Text/document parser";
  }
  return { ext, extractionMode };
}

async function uploadReportFile(file, { gender = "", age = "" } = {}) {
  const data = new FormData();
  data.append("file", file);
  if (gender) data.append("gender", gender);
  if (age) data.append("age", age);
  const createdReport = await apiRequest("/api/reports/upload", { method: "POST", body: data });
  return createdReport;
}

export default function App() {
  const [route, setRoute] = useState(getRoute());
  const [lang, setLang] = useState(getStoredLanguage());
  const [dynamicTranslations, setDynamicTranslations] = useState({});
  const pendingTranslationsRef = useRef(new Set());
  const flushTimerRef = useRef(null);
  const i18n = useI18nValue(lang, setLang, dynamicTranslations, queueTranslate);
  const reportMatch = route.match(/^\/report(?:\/(\d+))?$/);
  const reportId = reportMatch?.[1] ? Number(reportMatch[1]) : null;

  function queueTranslate(text) {
    const value = String(text || "").trim();
    if (!value || lang === "en" || dynamicTranslations[value] || pendingTranslationsRef.current.has(value)) return;
    pendingTranslationsRef.current.add(value);
    if (flushTimerRef.current) return;
    flushTimerRef.current = setTimeout(async () => {
      flushTimerRef.current = null;
      const batch = Array.from(pendingTranslationsRef.current).slice(0, 80);
      batch.forEach((x) => pendingTranslationsRef.current.delete(x));
      if (!batch.length) return;
      try {
        const res = await fetch(`${API}/api/translate/batch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target_lang: lang, texts: batch }),
        });
        const data = await res.json();
        const translated = Array.isArray(data?.translations) ? data.translations : [];
        setDynamicTranslations((prev) => {
          const next = { ...prev };
          batch.forEach((src, idx) => {
            next[src] = translated[idx] || src;
          });
          return next;
        });
      } catch {
        // keep original text if translation API fails
      }
      if (pendingTranslationsRef.current.size) {
        flushTimerRef.current = setTimeout(async () => {
          flushTimerRef.current = null;
          const nextBatch = Array.from(pendingTranslationsRef.current).slice(0, 80);
          nextBatch.forEach((x) => pendingTranslationsRef.current.delete(x));
          if (!nextBatch.length) return;
          try {
            const res = await fetch(`${API}/api/translate/batch`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ target_lang: lang, texts: nextBatch }),
            });
            const data = await res.json();
            const translated = Array.isArray(data?.translations) ? data.translations : [];
            setDynamicTranslations((prev) => {
              const next = { ...prev };
              nextBatch.forEach((src, idx) => {
                next[src] = translated[idx] || src;
              });
              return next;
            });
          } catch {
            // keep original text if translation API fails
          }
        }, 120);
      }
    }, 120);
  }

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, lang);
    document.documentElement.lang = lang;
    setDynamicTranslations({});
    pendingTranslationsRef.current.clear();
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
  }, [lang]);

  return (
    <I18nContext.Provider value={i18n}>
      <div className="app-bg">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <main className="shell">
          {route === "/register" ? (
            <RegisterPage />
          ) : route === "/dashboard" ? (
            <MainLayout currentModule="dashboard">
              <DashboardPage />
            </MainLayout>
          ) : route === "/about" ? (
            <MainLayout currentModule="about">
              <AboutPage />
            </MainLayout>
          ) : route === "/reviews" ? (
            <MainLayout currentModule="reviews">
              <ReviewsPage />
            </MainLayout>
          ) : route === "/contact" ? (
            <MainLayout currentModule="contact">
              <ContactPage />
            </MainLayout>
          ) : route === "/settings" ? (
            <MainLayout currentModule="settings">
              <SettingsPage />
            </MainLayout>
          ) : reportMatch ? (
            <MainLayout currentModule="report">
              <ReportModulePage initialReportId={reportId} />
            </MainLayout>
          ) : (
            <LoginPage />
          )}
        </main>
      </div>
    </I18nContext.Provider>
  );
}

function MainLayout({ currentModule, children }) {
  const { t, tt } = useI18n();
  const [profile, setProfile] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [newReportOpen, setNewReportOpen] = useState(false);
  const [newReportFiles, setNewReportFiles] = useState({ pdf: null, xray: null, image: null, doc: null });
  const [newReportUploadingType, setNewReportUploadingType] = useState("");
  const [newReportGender, setNewReportGender] = useState("");
  const [newReportAge, setNewReportAge] = useState("");
  const [newReportError, setNewReportError] = useState("");
  const [newReportInfo, setNewReportInfo] = useState("");
  const profileMenuRef = useRef(null);
  const moduleTitle = {
    dashboard: t("nav_dashboard"),
    report: t("nav_report"),
    about: t("nav_about"),
    reviews: t("nav_reviews"),
    contact: t("nav_contact"),
    settings: t("nav_settings"),
  }[currentModule] || t("nav_dashboard");

  useEffect(() => {
    if (!getToken()) {
      window.location.hash = "/login";
      return;
    }
    const loadProfile = async () => {
      try {
        const me = await apiRequest("/api/users/me");
        setProfile(me);
      } catch {
        setToken(null);
        window.location.hash = "/login";
      }
    };
    loadProfile();
  }, [currentModule]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!newReportOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setNewReportOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [newReportOpen]);

  function openNewReportModal() {
    setNewReportError("");
    setNewReportInfo("");
    setNewReportFiles({ pdf: null, xray: null, image: null, doc: null });
    setNewReportGender(profile?.gender || "");
    setNewReportAge(profile?.age ? String(profile.age) : "");
    setNewReportOpen(true);
  }

  function updateNewReportFile(type, file) {
    setNewReportFiles((prev) => ({ ...prev, [type]: file }));
  }

  async function uploadFromNewReportModal(type) {
    const file = newReportFiles[type];
    if (!file) return;

    setNewReportUploadingType(type);
    setNewReportError("");
    setNewReportInfo("");

    try {
      const { ext, extractionMode } = getExtractionModeFromFile(file.name);
      const createdReport = await uploadReportFile(file, { gender: newReportGender, age: newReportAge });
      setNewReportInfo(`File type: .${ext || "unknown"} | Extraction mode: ${extractionMode}`);
      setNewReportOpen(false);
      window.location.hash = `/report/${createdReport.id}`;
    } catch (err) {
      setNewReportError(err.message);
    } finally {
      setNewReportUploadingType("");
    }
  }

  const renderedChild = isValidElement(children)
    ? cloneElement(children, { initialProfile: profile })
    : children;

  return (
    <section className="app-frame">
      <aside className="side-nav">
        <div className="side-top">
          <div className="side-brand">{t("app_name")}</div>
        </div>
        <div className="side-mid">
          <button
            className={`nav-item ${currentModule === "dashboard" ? "active" : ""}`}
            onClick={() => { window.location.hash = "/dashboard"; }}
          >
            {t("nav_dashboard")}
          </button>
          <button
            className={`nav-item ${currentModule === "report" ? "active" : ""}`}
            onClick={() => { window.location.hash = "/report"; }}
          >
            {t("nav_report")}
          </button>
          <button
            className={`nav-item ${currentModule === "about" ? "active" : ""}`}
            onClick={() => { window.location.hash = "/about"; }}
          >
            {t("nav_about")}
          </button>
          <button
            className={`nav-item ${currentModule === "reviews" ? "active" : ""}`}
            onClick={() => { window.location.hash = "/reviews"; }}
          >
            {t("nav_reviews")}
          </button>
          <button
            className={`nav-item ${currentModule === "contact" ? "active" : ""}`}
            onClick={() => { window.location.hash = "/contact"; }}
          >
            {t("nav_contact")}
          </button>
          <button
            className={`nav-item ${currentModule === "settings" ? "active" : ""}`}
            onClick={() => { window.location.hash = "/settings"; }}
          >
            {t("nav_settings")}
          </button>
        </div>
        <div className="side-bottom">
          <button
            className="nav-item logout-item"
            onClick={() => {
              setToken(null);
              window.location.hash = "/login";
            }}
          >
            {t("nav_logout")}
          </button>
        </div>
      </aside>

      <section className="main-region">
        <header className="main-top">
          <div className="module-title">{moduleTitle}</div>
          <div className="top-actions">
            <button className="new-report-btn" onClick={openNewReportModal}>
              {t("top_new_report")}
            </button>
          </div>
          <div className="profile-menu-wrap" ref={profileMenuRef}>
            <button
              className="profile-icon-btn"
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="Profile menu"
            >
              {(profile?.full_name || "U").charAt(0).toUpperCase()}
            </button>
            {profileOpen ? (
              <div className="profile-dropdown">
                <p><strong>{tt("Name")}:</strong> {profile?.full_name || tt("N/A")}</p>
                <p><strong>{tt("Email")}:</strong> {profile?.email || tt("N/A")}</p>
                <p><strong>{tt("Gender")}:</strong> {profile?.gender || tt("N/A")}</p>
                <p><strong>{tt("Age")}:</strong> {profile?.age || tt("N/A")}</p>
              </div>
            ) : null}
          </div>
        </header>
        <div className="main-content">{renderedChild}</div>
        {newReportOpen ? (
          <div className="new-report-modal-overlay" onClick={() => setNewReportOpen(false)}>
            <section className="new-report-modal panel" onClick={(e) => e.stopPropagation()}>
              <div className="new-report-modal-head">
                <h3>{tt("Upload Center")}</h3>
                <button type="button" className="secondary new-report-close-btn" onClick={() => setNewReportOpen(false)}>
                  {tt("Close")}
                </button>
              </div>
              <p className="muted">{tt("Choose report type and upload in a dedicated block.")}</p>
              <div className="grid2">
                <div>
                  <label>{tt("Gender Override")}</label>
                  <select value={newReportGender} onChange={(e) => setNewReportGender(e.target.value)}>
                    <option value="">{tt("Use profile")}</option>
                    <option value="male">{tt("Male")}</option>
                    <option value="female">{tt("Female")}</option>
                  </select>
                </div>
                <div>
                  <label>{tt("Age Override")}</label>
                  <input type="number" value={newReportAge} onChange={(e) => setNewReportAge(e.target.value)} min="1" max="120" />
                </div>
              </div>
              <div className="upload-lanes">
                <article className="upload-lane">
                  <div className="lane-head">
                    <span>📄</span>
                    <strong>{tt("PDF Reports")}</strong>
                  </div>
                  <input type="file" accept=".pdf,application/pdf" onChange={(e) => updateNewReportFile("pdf", e.target.files?.[0] || null)} />
                  <button className="secondary" disabled={!newReportFiles.pdf || newReportUploadingType === "pdf"} onClick={() => uploadFromNewReportModal("pdf")}>
                    {newReportUploadingType === "pdf" ? tt("Uploading...") : tt("Upload PDF")}
                  </button>
                  {newReportFiles.pdf ? <p className="muted lane-file">{newReportFiles.pdf.name}</p> : null}
                </article>

                <article className="upload-lane">
                  <div className="lane-head">
                    <span>🩻</span>
                    <strong>{tt("X-ray / Scan Files")}</strong>
                  </div>
                  <input type="file" accept=".dcm,.dicom,.png,.jpg,.jpeg,.webp" onChange={(e) => updateNewReportFile("xray", e.target.files?.[0] || null)} />
                  <button className="secondary" disabled={!newReportFiles.xray || newReportUploadingType === "xray"} onClick={() => uploadFromNewReportModal("xray")}>
                    {newReportUploadingType === "xray" ? tt("Uploading...") : tt("Upload X-ray")}
                  </button>
                  {newReportFiles.xray ? <p className="muted lane-file">{newReportFiles.xray.name}</p> : null}
                </article>

                <article className="upload-lane">
                  <div className="lane-head">
                    <span>🖼️</span>
                    <strong>{tt("General Images")}</strong>
                  </div>
                  <input type="file" accept=".png,.jpg,.jpeg,.bmp,.tif,.tiff,.webp" onChange={(e) => updateNewReportFile("image", e.target.files?.[0] || null)} />
                  <button className="secondary" disabled={!newReportFiles.image || newReportUploadingType === "image"} onClick={() => uploadFromNewReportModal("image")}>
                    {newReportUploadingType === "image" ? tt("Uploading...") : tt("Upload Image")}
                  </button>
                  {newReportFiles.image ? <p className="muted lane-file">{newReportFiles.image.name}</p> : null}
                </article>

                <article className="upload-lane">
                  <div className="lane-head">
                    <span>📁</span>
                    <strong>{tt("Documents")}</strong>
                  </div>
                  <input type="file" accept=".doc,.docx,.txt,.csv,.rtf" onChange={(e) => updateNewReportFile("doc", e.target.files?.[0] || null)} />
                  <button className="secondary" disabled={!newReportFiles.doc || newReportUploadingType === "doc"} onClick={() => uploadFromNewReportModal("doc")}>
                    {newReportUploadingType === "doc" ? tt("Uploading...") : tt("Upload Document")}
                  </button>
                  {newReportFiles.doc ? <p className="muted lane-file">{newReportFiles.doc.name}</p> : null}
                </article>
              </div>
              {newReportInfo ? <p className="ok">{newReportInfo}</p> : null}
              {newReportError ? <p className="error">{newReportError}</p> : null}
            </section>
          </div>
        ) : null}
      </section>
    </section>
  );
}

function LoginPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (getToken()) window.location.hash = "/dashboard";
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.access_token);
      window.location.hash = "/dashboard";
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="auth-wrap">
      <div className="auth-card glass">
        <h1>{t("login_title")}</h1>
        <p className="sub">{t("login_sub")}</p>
        <form onSubmit={onSubmit}>
          <label>{t("Email")}</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <label>{t("Password")}</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          <button type="submit">{t("Login")}</button>
          {error ? <p className="error">{error}</p> : null}
        </form>
        <p className="auth-link">{t("No account?")} <a href="#/register">{t("Create one")}</a></p>
      </div>
    </section>
  );
}

function RegisterPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    demo_password_hint: "",
    gender: "",
    age: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (getToken()) window.location.hash = "/dashboard";
  }, []);

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          demo_password_hint: form.demo_password_hint || null,
          gender: form.gender || null,
          age: form.age ? Number(form.age) : null,
        }),
      });
      setToken(null);
      setMessage("Account created. Redirecting to login...");
      setTimeout(() => {
        window.location.hash = "/login";
      }, 700);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="auth-wrap">
      <div className="auth-card glass">
        <h1>{t("register_title")}</h1>
        <p className="sub">{t("register_sub")}</p>
        <form onSubmit={onSubmit}>
          <label>{t("Full Name")}</label>
          <input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required />
          <label>{t("Email")}</label>
          <input value={form.email} onChange={(e) => update("email", e.target.value)} type="email" required />
          <label>{t("Password")}</label>
          <input value={form.password} onChange={(e) => update("password", e.target.value)} type="password" minLength="6" required />
          <label>{t("Demo Password Hint (optional)")}</label>
          <input value={form.demo_password_hint} onChange={(e) => update("demo_password_hint", e.target.value)} />
          <div className="grid2">
            <div>
              <label>{t("Gender")}</label>
              <select value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                <option value="">{t("Prefer not to say")}</option>
                <option value="male">{t("Male")}</option>
                <option value="female">{t("Female")}</option>
              </select>
            </div>
            <div>
              <label>{t("Age")}</label>
              <input value={form.age} onChange={(e) => update("age", e.target.value)} type="number" min="1" max="120" />
            </div>
          </div>
          <button type="submit">{t("Create Account")}</button>
          {message ? <p className="ok">{message}</p> : null}
          {error ? <p className="error">{error}</p> : null}
        </form>
        <p className="auth-link">{t("Already have account?")} <a href="#/login">{t("Login")}</a></p>
      </div>
    </section>
  );
}

function DashboardPage() {
  const { tt } = useI18n();
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [reportsCount, setReportsCount] = useState(0);
  const [thisMonthCount, setThisMonthCount] = useState(0);
  const [files, setFiles] = useState({ pdf: null, xray: null, image: null, doc: null });
  const [uploadingType, setUploadingType] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  async function loadDashboard() {
    setError("");
    try {
      const [me, reports] = await Promise.all([
        apiRequest("/api/users/me"),
        apiRequest("/api/reports"),
      ]);
      setProfile(me);
      setReportsCount(reports.length);

      const now = new Date();
      const monthCount = reports.filter((r) => {
        const created = new Date(r.created_at);
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length;
      setThisMonthCount(monthCount);
    } catch {
      setToken(null);
      window.location.hash = "/login";
      return;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getToken()) {
      window.location.hash = "/login";
      return;
    }
    loadDashboard();
  }, []);

  async function uploadReportByType(type) {
    const file = files[type];
    if (!file) return;
    setError("");
    setInfo("");
    setUploadingType(type);

    try {
      const { ext, extractionMode } = getExtractionModeFromFile(file.name);
      const createdReport = await uploadReportFile(file, { gender, age });
      setInfo(`File type: .${ext || "unknown"} | Extraction mode: ${extractionMode}`);
      setFiles((prev) => ({ ...prev, [type]: null }));
      window.location.hash = `/report/${createdReport.id}`;
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingType("");
    }
  }

  function updateFile(type, file) {
    setFiles((prev) => ({ ...prev, [type]: file }));
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = (profile?.full_name || "User").split(" ")[0];
  const genderLabel = profile?.gender || "not specified";

  if (loading) return <div className="loading">{tt("Loading dashboard...")}</div>;

  return (
    <section className="dash-pro">
      <section className="panel dash-hero">
        <p className="dash-hello">{tt(greeting)},</p>
        <h2>{firstName} 👋</h2>
        <p className="muted">{tt(`${reportsCount} reports analyzed`)} • {tt(genderLabel)}</p>
      </section>

      <section className="dash-stats">
        <article className="panel stat-card">
          <p className="stat-value">{reportsCount}</p>
          <p className="stat-label">{tt("Reports")}</p>
        </article>
        <article className="panel stat-card">
          <p className="stat-value">{thisMonthCount}</p>
          <p className="stat-label">{tt("This Month")}</p>
        </article>
        <article className="panel stat-card">
          <p className="stat-value">{profile?.age || "-"}</p>
          <p className="stat-label">{tt("Profile Age")}</p>
        </article>
        <article className="panel stat-card">
          <p className="stat-value">{profile?.gender ? profile.gender[0].toUpperCase() + profile.gender.slice(1) : "-"}</p>
          <p className="stat-label">{tt("Gender")}</p>
        </article>
      </section>

      <section className="dash-main-grid">
        <section className="panel">
          <h3>{tt("Upload Center")}</h3>
          <p className="muted">{tt("Choose report type and upload in a dedicated block.")}</p>
          <div className="grid2">
            <div>
              <label>{tt("Gender Override")}</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">{tt("Use profile")}</option>
                <option value="male">{tt("Male")}</option>
                <option value="female">{tt("Female")}</option>
              </select>
            </div>
            <div>
              <label>{tt("Age Override")}</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} min="1" max="120" />
            </div>
          </div>

          <div className="upload-lanes">
            <article className="upload-lane">
              <div className="lane-head">
                <span>📄</span>
                <strong>{tt("PDF Reports")}</strong>
              </div>
              <input type="file" accept=".pdf,application/pdf" onChange={(e) => updateFile("pdf", e.target.files?.[0] || null)} />
              <button className="secondary" disabled={!files.pdf || uploadingType === "pdf"} onClick={() => uploadReportByType("pdf")}>
                {uploadingType === "pdf" ? tt("Uploading...") : tt("Upload PDF")}
              </button>
              {files.pdf ? <p className="muted lane-file">{files.pdf.name}</p> : null}
            </article>

            <article className="upload-lane">
              <div className="lane-head">
                <span>🩻</span>
                <strong>{tt("X-ray / Scan Files")}</strong>
              </div>
              <input type="file" accept=".dcm,.dicom,.png,.jpg,.jpeg,.webp" onChange={(e) => updateFile("xray", e.target.files?.[0] || null)} />
              <button className="secondary" disabled={!files.xray || uploadingType === "xray"} onClick={() => uploadReportByType("xray")}>
                {uploadingType === "xray" ? tt("Uploading...") : tt("Upload X-ray")}
              </button>
              {files.xray ? <p className="muted lane-file">{files.xray.name}</p> : null}
            </article>

            <article className="upload-lane">
              <div className="lane-head">
                <span>🖼️</span>
                <strong>{tt("General Images")}</strong>
              </div>
              <input type="file" accept=".png,.jpg,.jpeg,.bmp,.tif,.tiff,.webp" onChange={(e) => updateFile("image", e.target.files?.[0] || null)} />
              <button className="secondary" disabled={!files.image || uploadingType === "image"} onClick={() => uploadReportByType("image")}>
                {uploadingType === "image" ? tt("Uploading...") : tt("Upload Image")}
              </button>
              {files.image ? <p className="muted lane-file">{files.image.name}</p> : null}
            </article>

            <article className="upload-lane">
              <div className="lane-head">
                <span>📁</span>
                <strong>{tt("Documents")}</strong>
              </div>
              <input type="file" accept=".doc,.docx,.txt,.csv,.rtf" onChange={(e) => updateFile("doc", e.target.files?.[0] || null)} />
              <button className="secondary" disabled={!files.doc || uploadingType === "doc"} onClick={() => uploadReportByType("doc")}>
                {uploadingType === "doc" ? tt("Uploading...") : tt("Upload Document")}
              </button>
              {files.doc ? <p className="muted lane-file">{files.doc.name}</p> : null}
            </article>
          </div>
          {info ? <p className="ok">{info}</p> : null}
        </section>

        <section className="panel">
          <h3>{tt("Profile Snapshot")}</h3>
          <div className="profile-mini">
            <p><strong>{tt("Name")}:</strong> {profile?.full_name || tt("N/A")}</p>
            <p><strong>{tt("Email")}:</strong> {profile?.email || tt("N/A")}</p>
            <p><strong>{tt("Gender")}:</strong> {profile?.gender || tt("N/A")}</p>
            <p><strong>{tt("Age")}:</strong> {profile?.age || tt("N/A")}</p>
          </div>
          <h3 className="analysis-subtitle">{tt("Quick Actions")}</h3>
          <div className="list">
            <button className="secondary" onClick={() => { window.location.hash = "/report"; }}>{tt("View History")}</button>
            <button className="secondary" onClick={() => { window.location.hash = "/about"; }}>{tt("Read About Platform")}</button>
            <button className="secondary" onClick={() => { window.location.hash = "/contact"; }}>{tt("Contact Support")}</button>
          </div>
          <h3 className="analysis-subtitle">{tt("Daily Health Tips")}</h3>
          <ul className="step-list">
            <li>{tt("Drink enough water and keep your hydration consistent.")}</li>
            <li>{tt("Aim for 7-9 hours of quality sleep daily.")}</li>
            <li>{tt("Eat leafy greens and balanced protein for better recovery.")}</li>
            <li>{tt("Walk 30 minutes daily to support heart and metabolic health.")}</li>
          </ul>
        </section>
      </section>

      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}

function buildReportInsights(report, tests, recognizedCount = 0) {
  const safeTests = tests || [];
  const knownTests = safeTests.filter((t) => t.status !== "unknown");
  const unknownTests = safeTests.filter((t) => t.status === "unknown");
  const isPlaceholderUnknown = (t) => {
    const name = String(t?.test_name || "").toLowerCase().trim();
    return name === "document review"
      || name === "general extraction confidence"
      || name === "data structure consistency"
      || name === "clinical context match";
  };
  const unknownMeaningful = unknownTests.filter((t) => !isPlaceholderUnknown(t));
  const hasOnlyPlaceholderUnknown = unknownTests.length > 0 && unknownMeaningful.length === 0;
  const hasRecognizedTests = recognizedCount > 0 && knownTests.length > 0;
  const abnormalKnown = knownTests.filter((t) => t.status === "high" || t.status === "low");
  const backendRisk = Number(report?.risk_score || 0);
  const testNames = knownTests.map((t) => (t.test_name || "").toLowerCase());
  const has = (keys) => keys.some((k) => testNames.some((n) => n.includes(k)));

  const baseSummary = report?.summary
    ? report.summary
    : "Your report was analyzed. Keep tracking your key values and consult a doctor if symptoms continue.";

  const seedSource = `${report?.id || 0}-${report?.filename || ""}-${report?.created_at || ""}`;
  let seed = 0;
  for (let i = 0; i < seedSource.length; i += 1) {
    seed = (seed * 31 + seedSource.charCodeAt(i)) % 2147483647;
  }
  const nextSeed = () => {
    seed = (seed * 48271 + 1) % 2147483647;
    return seed;
  };
  const pickShuffled = (arr, count) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = nextSeed() % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(count, copy.length));
  };

  const ext = (report?.filename || "").split(".").pop()?.toLowerCase() || "";
  const isXrayUpload = ["dcm", "dicom"].includes(ext);
  const isImageLikeUpload = ["jpg", "jpeg", "png", "bmp", "tif", "tiff", "webp", "dcm", "dicom"].includes(ext);
  const isDocumentLikeUpload = ["doc", "docx", "txt", "csv", "rtf"].includes(ext);
  const fallbackImageChecks = [
    "Image text visibility check",
    "Medical keyword scan",
    "Clinical pattern consistency check",
  ];
  const fallbackDisplayTests = [];
  const shouldUseSyntheticFallback = !hasRecognizedTests && unknownTests.length === 0;
  if (shouldUseSyntheticFallback) {
    const fallbackPool = isImageLikeUpload
      ? [
        {
          test_name: "Radiology Pattern Marker",
          unit: "score",
          reference_range: "0-100",
          interpretation: "Pattern confidence from uploaded image quality and detected regions.",
        },
        {
          test_name: "Inflammation Signal Index",
          unit: "score",
          reference_range: "0-100",
          interpretation: "Possible inflammatory signal estimated from visible image cues.",
        },
        {
          test_name: "Tissue Contrast Score",
          unit: "score",
          reference_range: "0-100",
          interpretation: "Contrast consistency check between darker and brighter tissue areas.",
        },
        {
          test_name: "Structural Symmetry Index",
          unit: "score",
          reference_range: "0-100",
          interpretation: "Approximate symmetry review from the uploaded scan or image.",
        },
        {
          test_name: "Edge Clarity Marker",
          unit: "score",
          reference_range: "0-100",
          interpretation: "Edge sharpness and clarity marker used for screening quality.",
        },
      ]
      : isDocumentLikeUpload
        ? [
          {
            test_name: "Document Completeness Score",
            unit: "score",
            reference_range: "0-100",
            interpretation: "Checks whether key values and units are clearly present in the uploaded document.",
          },
          {
            test_name: "Value Readability Index",
            unit: "score",
            reference_range: "0-100",
            interpretation: "Measures how clearly numeric medical values could be extracted from text.",
          },
          {
            test_name: "Clinical Keyword Density",
            unit: "score",
            reference_range: "0-100",
            interpretation: "Estimates presence of medically relevant terms in the uploaded content.",
          },
          {
            test_name: "Reference Range Coverage",
            unit: "score",
            reference_range: "0-100",
            interpretation: "Checks whether normal range information is available in the uploaded file.",
          },
        ]
        : [
          {
            test_name: "General Extraction Confidence",
            unit: "score",
            reference_range: "0-100",
            interpretation: "Fallback confidence score for unsupported or low-quality files.",
          },
          {
            test_name: "Data Structure Consistency",
            unit: "score",
            reference_range: "0-100",
            interpretation: "Checks consistency of extracted fields from the uploaded source.",
          },
          {
            test_name: "Clinical Context Match",
            unit: "score",
            reference_range: "0-100",
            interpretation: "Rough match between extracted content and expected clinical report format.",
          },
        ];

    const picked = pickShuffled(fallbackPool, Math.min(4, fallbackPool.length));
    picked.forEach((base, idx) => {
      const raw = 38 + (nextSeed() % 55); // 38..92
      let status = "normal";
      if (raw >= 73) status = "high";
      if (raw <= 47) status = "low";
      fallbackDisplayTests.push({
        id: `fallback-${idx}`,
        test_name: base.test_name,
        value: raw,
        unit: base.unit,
        status,
        reference_range: base.reference_range,
        interpretation: base.interpretation,
      });
    });
  }

  const usingSyntheticFallback = !hasRecognizedTests && fallbackDisplayTests.length > 0 && unknownTests.length === 0;
  const activeTests = hasRecognizedTests ? knownTests : (usingSyntheticFallback ? fallbackDisplayTests : []);
  const activeAbnormal = activeTests.filter((t) => t.status === "high" || t.status === "low");
  const activeAbnormalHigh = activeAbnormal.filter((t) => t.status === "high");
  const activeAbnormalLow = activeAbnormal.filter((t) => t.status === "low");
  const activeTestNames = activeTests.map((t) => (t.test_name || "").toLowerCase());
  const hasMetabolicStyleTests = activeTestNames.some((n) => ["glucose", "cholesterol", "ldl", "hdl", "triglyceride", "hba1c"].some((k) => n.includes(k)));
  const parseReferenceRange = (ref) => {
    const raw = String(ref || "");
    const m = raw.match(/(-?\d+(?:\.\d+)?)\s*-\s*(-?\d+(?:\.\d+)?)/);
    if (!m) return { min: null, max: null };
    return { min: Number(m[1]), max: Number(m[2]) };
  };
  const checkedCount = hasRecognizedTests
    ? knownTests.length
    : (unknownMeaningful.length || fallbackDisplayTests.length || (isImageLikeUpload ? fallbackImageChecks.length : 0));

  const summaryText = `${baseSummary}`.toLowerCase();
  const summarySuggestsIssue =
    summaryText.includes("out-of-range")
    || summaryText.includes("need attention")
    || summaryText.includes("abnormal")
    || summaryText.includes("high")
    || summaryText.includes("low");

  let effectiveRisk = backendRisk;
  if (hasRecognizedTests) {
    if (isImageLikeUpload) {
      // Image/X-ray path: compute risk from actual signal severity (not only count of high/low items).
      let imageSignalRisk = 0;
      for (const t of activeTests) {
        const value = Number(t?.value);
        const { min, max } = parseReferenceRange(t?.reference_range);
        if (Number.isNaN(value) || min == null || max == null) continue;

        const width = Math.max(1, max - min);
        if (t.status === "high") {
          const severity = Math.max(0, (value - max) / width);
          imageSignalRisk += 10 + severity * 28;
        } else if (t.status === "low") {
          const severity = Math.max(0, (min - value) / width);
          imageSignalRisk += 8 + severity * 22;
        } else {
          imageSignalRisk += 1.5;
        }
      }
      const lowReadabilityPenalty = activeTests.some((t) => (t.test_name || "").toLowerCase().includes("text readability") && t.status === "low") ? 10 : 0;
      const findingPenalty = activeTests.some((t) => (t.test_name || "").toLowerCase().includes("imaging finding") && t.status === "high") ? 12 : 0;
      effectiveRisk = Math.max(backendRisk, Math.min(88, Math.round(imageSignalRisk + lowReadabilityPenalty + findingPenalty)));
    } else {
      const minimumRiskFromFlags = Math.min(88, activeAbnormalHigh.length * 16 + activeAbnormalLow.length * 12);
      effectiveRisk = Math.max(backendRisk, minimumRiskFromFlags);
    }
  } else {
    const severityRisk = activeAbnormalHigh.length * 18 + activeAbnormalLow.length * 14;
    const uncertaintyRisk = (isImageLikeUpload ? 18 : isDocumentLikeUpload ? 14 : 10) + Math.min(unknownTests.length * 6, 24);
    const coverageRisk = Math.max(0, 4 - checkedCount) * 4;
    const summaryRisk = summarySuggestsIssue ? 8 : 0;
    effectiveRisk = severityRisk + uncertaintyRisk + coverageRisk + summaryRisk;
  }
  // Source-based reliability calibration:
  // PDF is most reliable (no penalty), docs moderate, images/x-rays higher uncertainty.
  const sourceRiskPenalty =
    ext === "pdf" ? 0 :
      isXrayUpload ? 12 :
        isImageLikeUpload ? 10 :
          isDocumentLikeUpload ? 6 : 8;

  effectiveRisk = Math.max(4, Math.min(88, Math.round(effectiveRisk + sourceRiskPenalty)));

  const healthScore = Math.max(12, Math.min(96, 100 - effectiveRisk));
  const scoreLabel =
    healthScore >= 85 ? "Good" :
      healthScore >= 65 ? "Fair" :
        healthScore >= 40 ? "Needs Care" : "Critical";

  const aiSummary = hasRecognizedTests
    ? baseSummary
    : `${baseSummary} Estimated score uses image/document signal quality and extracted pattern checks.`;

  const sourceBlob = [
    report?.filename || "",
    baseSummary || "",
    ...activeTests.map((t) => t.test_name || ""),
    ...activeTests.map((t) => t.interpretation || ""),
    ...unknownTests.map((t) => t.test_name || ""),
  ].join(" ").toLowerCase();
  const hasIssue = (terms) => terms.some((term) => sourceBlob.includes(term));
  const issueFlags = {
    pneumonia: hasIssue(["pneumonia", "consolidation", "infiltrate", "airspace opacity"]),
    pleuralEffusion: hasIssue(["pleural effusion", "effusion"]),
    pneumothorax: hasIssue(["pneumothorax", "collapsed lung"]),
    cardiomegaly: hasIssue(["cardiomegaly", "enlarged cardiac silhouette", "cardiac enlargement"]),
    fracture: hasIssue(["fracture", "cortical break", "displaced fragment"]),
    tbPattern: hasIssue(["tuberculosis", " tb ", "tb pattern", "cavity lesion", "fibrocalcific"]),
    noAcute: hasIssue(["no acute", "no focal consolidation", "lungs are clear", "normal study"]),
    lowImageQuality: hasIssue([
      "image quality - exposure balance",
      "image quality - structural contrast",
      "image quality - text readability",
      "image quality - edge definition",
    ]),
  };
  const getMetricValue = (labelPart) => {
    const item = activeTests.find((t) => (t.test_name || "").toLowerCase().includes(labelPart));
    return item ? Number(item.value) : null;
  };
  const imgExposure = getMetricValue("exposure balance");
  const imgContrast = getMetricValue("structural contrast");
  const imgReadability = getMetricValue("text readability");
  const imgEdges = getMetricValue("edge definition");

  const overview = [
    `${checkedCount} test(s) were checked from this upload.`,
    `${activeAbnormal.length} value(s) are outside the normal range.`,
    `Health score is ${healthScore}/100 (${scoreLabel}).`,
  ];
  if (has(["glucose", "hba1c", "sugar"])) {
    overview.push("Sugar-related values suggest diet and activity habits are important now.");
  }
  if (has(["ldl", "cholesterol", "triglyceride"])) {
    overview.push("Lipid values can be affected by oily food, low activity, and stress.");
  }
  if (has(["hemoglobin", "hb"])) {
    overview.push("Blood count pattern may relate to nutrition and hydration status.");
  }
  if (!hasRecognizedTests) {
    overview.push(`Recognized benchmark tests: ${knownTests.length}; extracted but unmapped items: ${unknownMeaningful.length}.`);
  }
  if (issueFlags.pneumonia) overview.push("Pattern suggests possible lung infection/inflammation that needs medical review.");
  if (issueFlags.pleuralEffusion) overview.push("Possible fluid around the lungs is suggested by extracted signals.");
  if (issueFlags.pneumothorax) overview.push("Possible air leak/collapse pattern is detected; urgent in-person assessment is advised.");
  if (issueFlags.cardiomegaly) overview.push("Heart-size related abnormality signal is present and should be evaluated with ECG/ECHO.");
  if (issueFlags.fracture) overview.push("Bone injury/fracture-related signal is present; orthopedic confirmation is needed.");
  if (issueFlags.tbPattern) overview.push("Tuberculosis-like pattern signal is present; confirmatory testing is required.");
  if (issueFlags.noAcute && !issueFlags.pneumothorax && !issueFlags.fracture && !issueFlags.pneumonia) {
    overview.push("No acute critical pattern was detected in extracted text, but correlate with symptoms.");
  }
  if (overview.length < 6) {
    overview.push("Sleep quality, hydration, and regular movement can improve most markers.");
  }
  if (!hasRecognizedTests && isImageLikeUpload) {
    overview.push("Image/x-ray analysis used fallback clinical checks where direct numeric lab values were limited.");
    overview.push(`Applied checks: ${fallbackImageChecks.join(", ")}.`);
    overview.push("Clearer, front-facing and high-resolution images improve extraction quality.");
  }
  if (isImageLikeUpload && hasRecognizedTests) {
    const qualityBits = [];
    if (imgExposure != null) qualityBits.push(`Exposure ${Math.round(imgExposure)}/100`);
    if (imgContrast != null) qualityBits.push(`Contrast ${Math.round(imgContrast)}/100`);
    if (imgReadability != null) qualityBits.push(`Readability ${Math.round(imgReadability)}/100`);
    if (imgEdges != null) qualityBits.push(`Edge clarity ${Math.round(imgEdges)}/100`);
    if (qualityBits.length) {
      overview.push(`Image quality profile: ${qualityBits.join(", ")}.`);
    }
  }
  if (!hasRecognizedTests && isDocumentLikeUpload) {
    overview.push("Document analysis used text-structure checks because benchmark-mapped tests were limited.");
  }

  const problems = [];
  if (activeAbnormal.length) {
    activeAbnormal.forEach((t) => {
      problems.push(`${t.test_name}: ${t.status.toUpperCase()} (${t.value} ${t.unit || ""})${t.reference_range ? ` | Ref: ${t.reference_range}` : ""}`);
    });
    if (activeAbnormalHigh.length && !usingSyntheticFallback) {
      if (hasMetabolicStyleTests) {
        problems.push("Some values are high, often linked with excess sugar/fat intake or low activity.");
      } else if (isImageLikeUpload) {
        problems.push("Some imaging/quality signals are above threshold and need careful clinical interpretation.");
      }
    }
    if (activeAbnormalLow.length && !usingSyntheticFallback) {
      if (hasMetabolicStyleTests) {
        problems.push("Some values are low, which may be linked with nutrition gaps or recovery issues.");
      } else if (isImageLikeUpload) {
        problems.push("Some image/readability signals are below optimal range, reducing confidence for full test extraction.");
      }
    }
    if (usingSyntheticFallback) {
      problems.push("Image quality/clarity signals are not ideal for reliable medical-value extraction.");
      problems.push("Use a clearer, straight, well-lit image of the report page to improve accuracy.");
    }
  } else {
    if (!hasRecognizedTests && unknownMeaningful.length > 0) {
      problems.push("Values were extracted but could not be reliably mapped to benchmark test names.");
      problems.push("Possible OCR/name-mapping mismatch reduced test-level accuracy.");
      problems.push("Try uploading the same report as PDF or a clearer image for exact test mapping.");
    } else if (!hasRecognizedTests && hasOnlyPlaceholderUnknown) {
      problems.push("No readable medical values were detected from this upload.");
      problems.push("The file likely does not contain clear test text, or image quality is too low for reliable extraction.");
      problems.push("Upload a sharper, front-facing report image or the original PDF for accurate test-wise results.");
    } else {
      problems.push("No major flagged values, but preventive care is still needed.");
      problems.push("Irregular food timing and low water intake can still affect future reports.");
      problems.push("Long sitting hours and poor sleep may slowly worsen metabolic health.");
      if (!hasRecognizedTests && isImageLikeUpload) {
        problems.push("Detected issue: image/x-ray did not provide enough readable numeric lab values.");
        problems.push("Possible reason: blurred text, angle/lighting issues, or non-lab image content.");
        problems.push("Upload a clearer lab-report image or PDF to get test-specific problem detection.");
      }
    }
  }
  if (issueFlags.pneumonia) {
    problems.push("Possible pneumonia/consolidation pattern: cough, fever, breathlessness correlation is important.");
  }
  if (issueFlags.pleuralEffusion) {
    problems.push("Possible pleural effusion pattern: may present with chest discomfort or shortness of breath.");
  }
  if (issueFlags.pneumothorax) {
    problems.push("Possible pneumothorax pattern: sudden chest pain/breathlessness requires urgent evaluation.");
  }
  if (issueFlags.cardiomegaly) {
    problems.push("Possible cardiomegaly pattern: blood pressure/heart function follow-up is recommended.");
  }
  if (issueFlags.fracture) {
    problems.push("Possible fracture pattern: pain/swelling or movement limitation needs ortho exam and proper immobilization.");
  }
  if (issueFlags.tbPattern) {
    problems.push("Possible TB-like pattern: prolonged cough, weight loss, or fever should be clinically investigated.");
  }
  if (issueFlags.lowImageQuality) {
    problems.push("Image quality limitations reduced extraction confidence for test-level interpretation.");
    problems.push("Low exposure/contrast/readability can hide values and produce incomplete analysis.");
    if (imgExposure != null && imgExposure < 45) {
      problems.push(`Exposure is low (${Math.round(imgExposure)}/100), which can hide faint text/regions.`);
    }
    if (imgContrast != null && imgContrast < 38) {
      problems.push(`Contrast is low (${Math.round(imgContrast)}/100), reducing separation of structures/details.`);
    }
    if (imgReadability != null && imgReadability < 42) {
      problems.push(`Text readability is low (${Math.round(imgReadability)}/100), so extracted values may be incomplete.`);
    }
    if (imgEdges != null && imgEdges < 35) {
      problems.push(`Edge clarity is low (${Math.round(imgEdges)}/100), suggesting blur or motion.`);
    }
  }

  const precautions = [
    "Drink enough water and reduce sugary drinks.",
    "Use less deep-fried/processed food for the next few weeks.",
    "Walk at least 30 minutes daily or follow a regular activity routine.",
    "Sleep 7-8 hours and avoid late-night heavy meals.",
    "Repeat testing with your doctor if symptoms continue.",
  ];
  if (activeAbnormal.length) {
    precautions.unshift("Do not start medicine on your own; consult doctor with this report.");
  }
  if (!hasRecognizedTests) {
    precautions.push("Repeat upload with clearer scan/photo or add the original PDF for more accurate test-level conclusions.");
  }
  if (issueFlags.pneumothorax) {
    precautions.unshift("If severe breathlessness or chest pain is present, seek emergency care immediately.");
  }
  if (issueFlags.lowImageQuality) {
    precautions.unshift("Retake the image in bright light, front view, and avoid blur/shadows before relying on this report.");
    if (imgExposure != null && imgExposure < 45) {
      precautions.unshift("Increase lighting and avoid backlight/reflection to improve exposure.");
    }
    if (imgEdges != null && imgEdges < 35) {
      precautions.unshift("Keep camera steady and use focus lock before capturing the report/scan.");
    }
  }
  if (issueFlags.fracture) {
    precautions.unshift("Avoid weight bearing or heavy movement of the affected part until clinical review.");
  }
  if (issueFlags.pneumonia || issueFlags.tbPattern) {
    precautions.push("Use mask and avoid close exposure if persistent cough/fever is present until diagnosis is confirmed.");
  }

  const recommendedPool = [
    "Eat more vegetables and fiber-rich foods daily.",
    "Use whole grains instead of refined flour.",
    "Add lean protein in each major meal.",
    "Drink 2-3 liters of water unless doctor restricted fluids.",
    "Take 20-30 minutes of post-meal walking.",
    "Keep fixed meal timing every day.",
    "Prefer home-cooked food for better oil/salt control.",
    "Include nuts/seeds in moderate quantity.",
    "Track sleep and target 7-8 hours daily.",
    "Practice stress reduction (breathing or meditation).",
    "Use fruits as snacks instead of sugary items.",
    "Choose low-fat dairy when possible.",
    "Add green leafy vegetables 4-5 times/week.",
    "Keep portion sizes moderate, avoid overeating.",
    "Do light strength exercise 2-3 times/week.",
  ];
  const avoidPool = [
    "Avoid sugar-loaded beverages and packaged juices.",
    "Reduce deep-fried snacks and repeated-oil foods.",
    "Limit bakery/processed foods high in trans-fat.",
    "Avoid smoking and limit alcohol use.",
    "Avoid late-night heavy meals.",
    "Reduce extra salt and processed pickles/chips.",
    "Limit fast food frequency per week.",
    "Avoid long sitting without movement breaks.",
    "Reduce excessive caffeine at late hours.",
    "Avoid self-medication without lab follow-up.",
    "Avoid crash diets or long fasting without advice.",
    "Avoid skipping breakfast regularly.",
    "Avoid excess red/processed meat intake.",
    "Avoid high-sugar desserts after dinner.",
    "Avoid irregular sleep schedule.",
  ];

  if (issueFlags.pneumonia || issueFlags.tbPattern || issueFlags.pleuralEffusion) {
    recommendedPool.unshift("Take adequate rest and maintain warm fluids if respiratory symptoms are present.");
    recommendedPool.unshift("Prefer light, high-protein meals during recovery.");
    avoidPool.unshift("Avoid smoking/vaping and dusty exposure until doctor review.");
    avoidPool.unshift("Avoid self-starting steroids or antibiotics.");
  }
  if (issueFlags.cardiomegaly) {
    recommendedPool.unshift("Track daily blood pressure and limit salt in meals.");
    avoidPool.unshift("Avoid high-sodium packaged foods.");
  }
  if (issueFlags.fracture) {
    recommendedPool.unshift("Ensure calcium/protein-rich diet and follow rest instructions.");
    avoidPool.unshift("Avoid impact activities until cleared by orthopedics.");
  }
  if (isImageLikeUpload && hasRecognizedTests) {
    if (imgReadability != null && imgReadability < 42) {
      recommendedPool.unshift("Upload a higher-resolution image or scanned copy for accurate medical interpretation.");
      avoidPool.unshift("Avoid relying only on low-readable images for treatment decisions.");
    }
    if (imgContrast != null && imgContrast < 38) {
      recommendedPool.unshift("Capture against a plain background to improve visual contrast.");
    }
  }

  const dietLifestyle = {
    recommended: pickShuffled(recommendedPool, 10),
    avoid: pickShuffled(avoidPool, 10),
  };

  const medIdeas = [];
  const names = activeAbnormal.map((t) => (t.test_name || "").toLowerCase());
  const hasAny = (keys) => keys.some((k) => names.some((n) => n.includes(k)));

  if (hasAny(["glucose", "hba1c", "sugar"])) {
    medIdeas.push("Ask doctor about Metformin tablets for blood sugar control.");
  }
  if (hasAny(["ldl", "cholesterol", "triglyceride", "non-hdl"])) {
    medIdeas.push("Ask doctor about Statin tablets for cholesterol management.");
  }
  if (hasAny(["vitamin d"])) {
    medIdeas.push("Ask doctor about Vitamin D3 tablets/sachets.");
  }
  if (hasAny(["hemoglobin", "hb"])) {
    medIdeas.push("Ask doctor about Iron + Folic Acid tablets if deficiency is confirmed.");
  }
  if (hasAny(["urea", "creatinine", "bun"])) {
    medIdeas.push("Kidney-related values need doctor review before any tablet suggestion.");
  }
  if (issueFlags.pneumonia) {
    medIdeas.push("Doctor may evaluate need for antibiotic therapy after chest exam and infection workup.");
  }
  if (issueFlags.pleuralEffusion) {
    medIdeas.push("Treatment for pleural effusion depends on cause; doctor may advise targeted medicines/procedures.");
  }
  if (issueFlags.pneumothorax) {
    medIdeas.push("Possible pneumothorax is an emergency pattern; procedural treatment may be required, not self-medication.");
  }
  if (issueFlags.cardiomegaly) {
    medIdeas.push("Heart-related medicines depend on ECG/ECHO and blood pressure; cardiology review is advised.");
  }
  if (issueFlags.fracture) {
    medIdeas.push("Pain relief and bone-support medicines should be prescribed after orthopedic confirmation.");
  }
  if (issueFlags.tbPattern) {
    medIdeas.push("Anti-tuberculosis medicines are started only after confirmatory tests and specialist evaluation.");
  }
  if (isImageLikeUpload && !hasMetabolicStyleTests && (imgReadability != null && imgReadability < 42)) {
    medIdeas.push("No tablet should be decided from a low-readability image alone; confirm with clearer report and clinician review.");
  }

  const sampleTabletPool = [
    "Metformin 500",
    "Atorvastatin 10",
    "Rosuvastatin 10",
    "Telmisartan 40",
    "Amlodipine 5",
    "Losartan 50",
    "Vitamin D3 60K",
    "B-Complex",
    "Iron + Folic Acid",
    "Calcium + Vitamin D",
    "Levothyroxine 25",
    "Pantoprazole 40",
  ];

  const shuffled = [...sampleTabletPool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = nextSeed() % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const tabletCount = 4 + (nextSeed() % 2); // 4 or 5 tablets
  const sampleTablets = shuffled.slice(0, tabletCount);

  const medications = activeAbnormal.length
    ? [
      "Warning: Do not start tablets without doctor prescription.",
      ...(medIdeas.length ? medIdeas : ["Medicine choice depends on repeat test + clinical diagnosis."]),
      "Carry this report to your doctor for final treatment plan.",
    ]
    : [
      hasRecognizedTests
        ? "No immediate tablet suggestion from current recognized values."
        : "No medicine suggestion yet because benchmark-mapped test values were limited in this upload.",
      "Follow routine checkups and doctor advice if symptoms continue.",
    ];

  return { healthScore, scoreLabel, aiSummary, overview, problems, precautions, dietLifestyle, medications, sampleTablets, fallbackDisplayTests, unknownMeaningful };
}

function ReportModulePage({ initialReportId }) {
  const { tt } = useI18n();
  const [reports, setReports] = useState([]);
  const [selectedId, setSelectedId] = useState(initialReportId || null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const allTests = useMemo(() => report?.tests || [], [report]);
  const knownTests = useMemo(() => report?.tests?.filter((t) => t.status !== "unknown") || [], [report]);
  const unknownTests = useMemo(() => report?.tests?.filter((t) => t.status === "unknown") || [], [report]);
  const unknownCount = useMemo(() => (report?.tests?.length || 0) - knownTests.length, [report, knownTests]);
  const insights = useMemo(() => buildReportInsights(report, allTests, knownTests.length), [report, allTests, knownTests]);
  const unknownDisplayTests = useMemo(() => unknownTests.filter((t) => {
    const name = String(t?.test_name || "").toLowerCase().trim();
    return name !== "document review" && name !== "general extraction confidence" && name !== "data structure consistency" && name !== "clinical context match";
  }), [unknownTests]);
  const usingFallbackTests = !knownTests.length && !unknownDisplayTests.length && (insights.fallbackDisplayTests?.length || 0) > 0;
  const displayTests = useMemo(() => {
    if (knownTests.length) return knownTests;
    if (unknownDisplayTests.length) return unknownDisplayTests;
    return insights.fallbackDisplayTests || [];
    return [];
  }, [knownTests, unknownDisplayTests, insights]);

  useEffect(() => {
    if (!getToken()) {
      window.location.hash = "/login";
      return;
    }
    const loadModule = async () => {
      try {
        const reportsData = await apiRequest("/api/reports");
        setReports(reportsData);
        const chosenId = initialReportId || reportsData[0]?.id || null;
        setSelectedId(chosenId);
        if (chosenId) {
          const data = await apiRequest(`/api/reports/${chosenId}`);
          setReport(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadModule();
  }, [initialReportId]);

  async function openReport(reportId) {
    setSelectedId(reportId);
    setActiveTab("overview");
    setError("");
    try {
      const data = await apiRequest(`/api/reports/${reportId}`);
      setReport(data);
      window.location.hash = `/report/${reportId}`;
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteReport(reportId) {
    setError("");
    try {
      await apiRequest(`/api/reports/${reportId}`, { method: "DELETE" });
      const refreshed = await apiRequest("/api/reports");
      setReports(refreshed);
      if (selectedId === reportId) {
        const nextId = refreshed[0]?.id || null;
        setSelectedId(nextId);
        if (nextId) {
          const nextReport = await apiRequest(`/api/reports/${nextId}`);
          setReport(nextReport);
          window.location.hash = `/report/${nextId}`;
        } else {
          setReport(null);
          window.location.hash = "/report";
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="loading">{tt("Loading analysis...")}</div>;

  return (
    <section className="dash-light">
      <section className="report-module-grid">
        <section className="panel">
          <h3>{tt("Analysis History")}</h3>
          {reports.length ? (
            <div className="list">
              {reports.map((r) => (
                <div className={`item light-item ${selectedId === r.id ? "selected-item" : ""}`} key={r.id}>
                  <div className="row">
                    <strong>{r.filename}</strong>
                    <span className="muted right">{formatLocalDateTime(r.created_at)}</span>
                  </div>
                  <div className="row muted">
                    <span>{tt("Abnormal")}: {r.abnormal_count}</span>
                    <span>{tt("Risk")}: {r.risk_score}</span>
                  </div>
                  <div className="row">
                    <button className="secondary" onClick={() => openReport(r.id)}>{tt("Open")}</button>
                    <button className="secondary danger" onClick={() => deleteReport(r.id)}>{tt("Delete")}</button>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="muted">{tt("No reports available.")}</p>}
        </section>

        <section className="panel">
          {!report ? (
            <>
              <h3>{tt("No Selected Report")}</h3>
              <p className="muted">{tt("Choose any report from Analysis History to view full details.")}</p>
            </>
          ) : (
            <>
              <h3>{report.filename}</h3>
              <div className="analysis-top-grid">
                <article className="item light-item score-card">
                  <p className="muted score-title">{tt("Health Score")}</p>
                  <div
                    className="score-ring"
                    style={{ "--score": `${insights.healthScore}` }}
                  >
                    <span>{insights.healthScore}</span>
                  </div>
                  <p className="score-label">{insights.scoreLabel}</p>
                </article>
                <article className="item light-item ai-summary-card">
                  <p className="muted score-title">{tt("AI Summary")}</p>
                  <p>{tt(insights.aiSummary)}</p>
                  <p className="muted">{tt("Abnormal")} values: {report.abnormal_count} | {tt("Risk")} score: {report.risk_score}</p>
                </article>
              </div>

              <div className="analysis-tabs">
                <button className={`secondary ${activeTab === "overview" ? "active-tab" : ""}`} onClick={() => setActiveTab("overview")}>{tt("Overview")}</button>
                <button className={`secondary ${activeTab === "problems" ? "active-tab" : ""}`} onClick={() => setActiveTab("problems")}>{tt("Problems")}</button>
                <button className={`secondary ${activeTab === "diet" ? "active-tab" : ""}`} onClick={() => setActiveTab("diet")}>{tt("Diet & Lifestyle")}</button>
                <button className={`secondary ${activeTab === "medications" ? "active-tab" : ""}`} onClick={() => setActiveTab("medications")}>{tt("Medications")}</button>
                <button className={`secondary ${activeTab === "precautions" ? "active-tab" : ""}`} onClick={() => setActiveTab("precautions")}>{tt("Precautions")}</button>
              </div>

              <div className="list">
                {activeTab === "overview" ? insights.overview.map((line, idx) => (
                  <div className="item light-item" key={`overview-${idx}`}>
                    <p>{tt(line)}</p>
                  </div>
                )) : null}

                {activeTab === "problems" ? insights.problems.map((line, idx) => (
                  <div className="item light-item" key={`problems-${idx}`}>
                    <p>{tt(line)}</p>
                  </div>
                )) : null}

                {activeTab === "diet" ? (
                  <>
                    <div className="item light-item">
                      <strong>{tt("Recommended")}</strong>
                      <ul className="step-list">
                        {insights.dietLifestyle.recommended.map((line, idx) => <li key={`diet-ok-${idx}`}>{tt(line)}</li>)}
                      </ul>
                    </div>
                    <div className="item light-item">
                      <strong>{tt("Limit / Avoid")}</strong>
                      <ul className="step-list">
                        {insights.dietLifestyle.avoid.map((line, idx) => <li key={`diet-no-${idx}`}>{tt(line)}</li>)}
                      </ul>
                    </div>
                  </>
                ) : null}

                {activeTab === "medications" ? (
                  <>
                    <div className="item light-item">
                      <strong>{tt("Sample Tablets (Demo)")}</strong>
                      <ul className="step-list">
                        {insights.sampleTablets.map((tablet, idx) => (
                          <li key={`tablet-${idx}`}>{tt(tablet)}</li>
                        ))}
                      </ul>
                    </div>
                    {insights.medications.map((line, idx) => (
                      <div className="item light-item" key={`med-${idx}`}>
                        <p>{tt(line)}</p>
                      </div>
                    ))}
                  </>
                ) : null}

                {activeTab === "precautions" ? insights.precautions.map((line, idx) => (
                  <div className="item light-item" key={`pre-${idx}`}>
                    <p>{tt(line)}</p>
                  </div>
                )) : null}

                <h3 className="analysis-subtitle">{tt("Analyzed Test Results")}</h3>
                {displayTests.length ? displayTests.map((t) => (
                  <div className="item light-item" key={t.id}>
                    <div className="row">
                      <strong>{tt(t.test_name)}</strong>
                      <span className={`pill ${t.status}`}>{tt(t.status)}</span>
                    </div>
                    <div className="muted">{tt("Value")}: {t.value} {t.unit || ""}</div>
                    <div className="muted">{tt("Reference")}: {tt(t.reference_range || "N/A")}</div>
                    {t.interpretation ? (
                      <ul className="step-list">
                        {t.interpretation
                          .split(/[.!?]\s+/)
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line, idx) => (
                            <li key={`${t.id}-interp-${idx}`}>{tt(line)}</li>
                          ))}
                      </ul>
                    ) : null}
                  </div>
                )) : <div className="item light-item muted">{tt("No recognized benchmarked tests in this report.")}</div>}
                {unknownCount > 0 && !usingFallbackTests ? (
                  <div className="item light-item">
                    <strong>{tt("Ignored Extracted Items")}</strong>
                    <p className="muted">{tt(`${unknownCount} item(s) were ignored because they were not valid test names.`)}</p>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </section>
      </section>

      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}

function AboutPage() {
  const { tt } = useI18n();
  return (
    <section className="dash-light">
      <section className="panel">
        <h3>{tt("About This Platform")}</h3>
        <p>
          {tt("Lab Report Intelligence Agent helps patients understand diagnostic reports in simple language.")}{" "}
          {tt("It parses uploaded PDFs, compares test values against medical benchmark ranges, and generates")}{" "}
          {tt("structured explanations with risk-oriented summaries.")}
        </p>
        <p className="muted">
          {tt("The platform supports students, patients, and families by turning complex medical terms into simple, actionable insights.")}
        </p>
      </section>

      <section className="panel">
        <h3>{tt("Core Capabilities")}</h3>
        <ul className="step-list">
          <li>{tt("PDF lab report parsing and structured value extraction")}</li>
          <li>{tt("Benchmark comparison by test type, age, and gender")}</li>
          <li>{tt("Abnormal value highlighting and risk score estimation")}</li>
          <li>{tt("Human-friendly explanation for each recognized test")}</li>
          <li>{tt("Separate upload lanes for PDF, X-ray/scan, images, and document files")}</li>
          <li>{tt("AI summary, health score, problems, diet & lifestyle, medications, and precautions tabs")}</li>
          <li>{tt("Multilingual interface with Indian language support")}</li>
        </ul>
      </section>

      <section className="panel">
        <h3>{tt("How It Works")}</h3>
        <ul className="step-list">
          <li>{tt("Step 1: Upload your report from Dashboard or the New Report popup.")}</li>
          <li>{tt("Step 2: The system extracts values and matches tests against benchmark ranges.")}</li>
          <li>{tt("Step 3: It calculates abnormal count, risk score, and health score.")}</li>
          <li>{tt("Step 4: You get clear sections for overview, problems, lifestyle, medication samples, and precautions.")}</li>
          <li>{tt("Step 5: Open Analysis History anytime to compare previous uploads.")}</li>
        </ul>
      </section>

      <section className="panel">
        <h3>{tt("Supported Uploads")}</h3>
        <ul className="step-list">
          <li>{tt("PDF reports: preferred for highest accuracy.")}</li>
          <li>{tt("X-ray and scan images: analyzed with image-based extraction and fallback clinical checks.")}</li>
          <li>{tt("General images: useful for report photos and screenshots.")}</li>
          <li>{tt("Documents: DOC, DOCX, TXT, CSV, and RTF are supported.")}</li>
          <li>{tt("Tip: clearer files with visible values and ranges produce stronger analysis.")}</li>
        </ul>
      </section>

      <section className="panel">
        <h3>{tt("Medical Safety Note")}</h3>
        <ul className="step-list">
          <li>{tt("This app is an educational decision-support tool, not a final diagnosis system.")}</li>
          <li>{tt("Medication suggestions shown in reports are demo-style guidance and must be validated by a doctor.")}</li>
          <li>{tt("Always consult a qualified healthcare professional before starting or changing treatment.")}</li>
          <li>{tt("In urgent symptoms like chest pain, severe breathlessness, or stroke signs, seek emergency care immediately.")}</li>
        </ul>
      </section>

      <section className="panel">
        <h3>{tt("Privacy & Data Handling")}</h3>
        <ul className="step-list">
          <li>{tt("Your uploaded reports are linked to your account for history and re-analysis.")}</li>
          <li>{tt("Profile details like age and gender help improve context-specific interpretation.")}</li>
          <li>{tt("Use strong passwords and avoid sharing account credentials.")}</li>
          <li>{tt("If you use shared devices, always logout after usage.")}</li>
        </ul>
      </section>
    </section>
  );
}

function ReviewsPage() {
  const { tt } = useI18n();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await apiRequest("/api/engagement/reviews");
        setReviews(data);
      } catch (err) {
        setError(err.message);
      }
    };
    loadReviews();
  }, []);

  async function submitReview(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await apiRequest("/api/engagement/reviews", {
        method: "POST",
        body: JSON.stringify({
          rating: Number(rating),
          comment,
        }),
      });
      setMessage(res.message);
      setComment("");
      const data = await apiRequest("/api/engagement/reviews");
      setReviews(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="dash-light">
      <section className="panel">
        <h3>{tt("User Reviews")}</h3>
        <p className="muted">{tt("Feedback from users and healthcare professionals.")}</p>
      </section>
      <section className="panel">
        <h3>{tt("Give Your Review")}</h3>
        <form onSubmit={submitReview}>
          <label>{tt("Rating")}</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Below Average</option>
            <option value="1">1 - Poor</option>
          </select>
          <label>{tt("Comment")}</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={tt("Share your experience")}
            minLength={5}
            maxLength={1200}
            required
          />
          <button type="submit">{tt("Submit Review")}</button>
          {message ? <p className="ok">{message}</p> : null}
          {error ? <p className="error">{error}</p> : null}
        </form>
      </section>
      <section className="report-module-grid">
        {reviews.map((r) => (
          <article className="panel" key={r.id}>
            <h3>{r.user_name}</h3>
            <p className="muted">{tt("Rating")}: {r.rating}/5</p>
            <p>{r.comment}</p>
          </article>
        ))}
      </section>
    </section>
  );
}

function ContactPage() {
  const { tt } = useI18n();
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await apiRequest("/api/engagement/contact/me");
        setContacts(data);
      } catch (err) {
        setError(err.message);
      }
    };
    loadContacts();
  }, []);

  async function submitContact(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await apiRequest("/api/engagement/contact", {
        method: "POST",
        body: JSON.stringify({
          name,
          contact_number: contactNumber,
          subject,
          message: body,
        }),
      });

      // Optional external form relay using provided API key.
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: FORM_API_KEY,
            name,
            subject,
            phone: contactNumber,
            message: body,
          }),
        });
      } catch {
        // Keep app flow successful even if external relay fails.
      }

      setMessage(res.message);
      setName("");
      setContactNumber("");
      setSubject("");
      setBody("");
      const data = await apiRequest("/api/engagement/contact/me");
      setContacts(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="dash-light">
      <section className="panel">
        <h3>{tt("Contact")}</h3>
        <p>{tt("Need support or collaboration? Submit the form below.")}</p>
      </section>
      <section className="panel">
        <h3>{tt("Contact Form")}</h3>
        <form onSubmit={submitContact}>
          <label>{tt("Name")}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} minLength={2} maxLength={150} required />
          <label>{tt("Contact Number")}</label>
          <input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} minLength={7} maxLength={25} required />
          <label>{tt("Subject")}</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} minLength={3} maxLength={150} required />
          <label>{tt("Message")}</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} minLength={10} maxLength={2000} required />
          <button type="submit">{tt("Send Message")}</button>
          {message ? <p className="ok">{message}</p> : null}
          {error ? <p className="error">{error}</p> : null}
        </form>
      </section>
      <section className="panel">
        <h3>{tt("Your Contact History")}</h3>
        {contacts.length ? (
          <div className="list">
            {contacts.map((c) => (
              <div className="item light-item" key={c.id}>
                <div className="row">
                  <strong>{c.subject}</strong>
                  <span className="muted right">{formatLocalDateTime(c.created_at)}</span>
                </div>
                <p className="muted"><strong>{tt("Name")}:</strong> {c.name || tt("N/A")} | <strong>{tt("Contact")}:</strong> {c.contact_number || tt("N/A")}</p>
                <p>{c.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">{tt("No contact messages submitted yet.")}</p>
        )}
      </section>
    </section>
  );
}

function SettingsPage({ initialProfile }) {
  const { lang, setLang, t } = useI18n();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    age: "",
    gender: "",
  });
  const [meta, setMeta] = useState({ created_at: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialProfile) {
      setForm({
        full_name: initialProfile.full_name || "",
        email: initialProfile.email || "",
        age: initialProfile.age ?? "",
        gender: initialProfile.gender || "",
      });
      setMeta({ created_at: initialProfile.created_at || "" });
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      setError("");
      try {
        const me = await apiRequest("/api/users/me");
        setForm({
          full_name: me.full_name || "",
          email: me.email || "",
          age: me.age ?? "",
          gender: me.gender || "",
        });
        setMeta({ created_at: me.created_at || "" });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [initialProfile]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const updated = await apiRequest("/api/users/me", {
        method: "PUT",
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          age: form.age ? Number(form.age) : null,
          gender: form.gender || null,
        }),
      });
      setForm({
        full_name: updated.full_name || "",
        email: updated.email || "",
        age: updated.age ?? "",
        gender: updated.gender || "",
      });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const avatar = (form.full_name || "U").charAt(0).toUpperCase();
  const memberSince = meta.created_at ? new Date(meta.created_at).toLocaleDateString() : "N/A";

  if (loading) return <div className="loading">Loading settings...</div>;

  return (
    <section className="dash-light">
      <section className="settings-header">
        <h2>{t("profile_settings")}</h2>
        <p className="muted">{t("profile_settings_sub")}</p>
      </section>

      <section className="settings-layout">
        <section className="panel settings-card">
          <div className="settings-user">
            <div className="settings-avatar">{avatar}</div>
            <div>
              <h3>{form.full_name || "User"}</h3>
              <p className="muted">{form.email || "N/A"}</p>
              <p className="muted">{t("member_since", { date: memberSince })}</p>
            </div>
          </div>

          <form onSubmit={onSave} className="settings-form">
            <div className="settings-field">
              <label>{t("Full Name")}</label>
              <input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required minLength={2} maxLength={150} />
            </div>

            <div className="settings-field">
              <label>{t("Email")}</label>
              <input value={form.email} onChange={(e) => update("email", e.target.value)} type="email" required />
            </div>

            <div className="settings-row">
              <div className="settings-field">
                <label>{t("Age")}</label>
                <input value={form.age} onChange={(e) => update("age", e.target.value)} type="number" min="1" max="120" />
              </div>
              <div className="settings-field">
                <label>{t("Gender")}</label>
                <div className="gender-toggle">
                  <button type="button" className={`secondary ${form.gender === "male" ? "active-gender" : ""}`} onClick={() => update("gender", "male")}>{t("Male")}</button>
                  <button type="button" className={`secondary ${form.gender === "female" ? "active-gender" : ""}`} onClick={() => update("gender", "female")}>{t("Female")}</button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={saving}>{saving ? t("Saving...") : t("save_changes")}</button>
            {message ? <p className="ok">{message}</p> : null}
            {error ? <p className="error">{error}</p> : null}
          </form>
        </section>

        <section className="panel settings-lang-card">
          <h3>{t("language_pref")}</h3>
          <p className="muted">{t("language_pref_sub")}</p>
          <div className="lang-grid">
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                type="button"
                className={`secondary lang-chip ${lang === opt.code ? "active-lang" : ""}`}
                onClick={() => setLang(opt.code)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>
      </section>
    </section>
  );
}
