export const translations = {
  en: {
    // Navigation
    home: "Home",
    about: "About",
    login: "Login",
    logout: "Logout",

    // Common
    welcome: "Welcome",
    loading: "Loading...",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    view: "View",

    // Authentication
    username: "Username",
    password: "Password",
    enterUsername: "Enter username",
    enterPassword: "Enter password",
    secureLogin: "Secure Login",
    secureLoginPortal: "Secure Login Portal",
    governmentOfficials: "Government Officials Only",
    selectRole: "Select Role",
    chooseDesignation: "Choose your designation",
    pleaseEnterBoth: "Please enter both username and password",
    pleaseSelectRole: "Please select your role",
    loginFailed: "Login failed. Please try again.",
    authenticating: "Authenticating...",
    forgotPassword: "Forgot Password?",
    technicalSupport: "Technical Support:",

    // Dashboard
    dashboard: "Dashboard",
    districtPortal: "District Portal",
    governmentOf: "Government of Chhattisgarh",

    // Location
    rajdhani: "RAJDHANI",
    raipur: "RAIPUR",
    capitalCity: "Capital City",

    // Quick Links
    quickLinks: "Quick Links",

    // Payment
    completePayment: "Complete Payment",
    paymentCompleted: "Payment Completed",
  },
  hi: {
    // Navigation
    home: "होम",
    about: "के बारे में",
    login: "लॉगिन",
    logout: "लॉगआउट",

    // Common
    welcome: "स्वागत",
    loading: "लोड हो रहा है...",
    submit: "जमा करें",
    cancel: "रद्द करें",
    save: "सेव करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    view: "देखें",

    // Authentication
    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    enterUsername: "उपयोगकर्ता नाम दर्ज करें",
    enterPassword: "पासवर्ड दर्ज करें",
    secureLogin: "सुरक्षित लॉगिन",
    secureLoginPortal: "सुरक्षित लॉगिन पोर्टल",
    governmentOfficials: "केवल सरकारी अधिकारी",
    selectRole: "भूमिका चुनें",
    chooseDesignation: "अपना पदनाम चुनें",
    pleaseEnterBoth: "कृपया उपयोगकर्ता नाम और पासवर्ड दोनों दर्ज करें",
    pleaseSelectRole: "कृपया अपनी भूमिका चुनें",
    loginFailed: "लॉगिन असफल। कृपया पुनः प्रयास करें।",
    authenticating: "प्रमाणीकरण...",
    forgotPassword: "पासवर्ड भूल गए?",
    technicalSupport: "तकनीकी सहायता:",

    // Dashboard
    dashboard: "डैशबोर्ड",
    districtPortal: "जिला पोर्टल",
    governmentOf: "छत्तीसगढ़ सरकार",

    // Location
    rajdhani: "राजधानी",
    raipur: "रायपुर",
    capitalCity: "राजधानी शहर",

    // Quick Links
    quickLinks: "त्वरित लिंक",

    // Payment
    completePayment: "भुगतान पूरा करें",
    paymentCompleted: "भुगतान पूरा",
  },
}

export function getTranslation(key: string, language: "en" | "hi"): string {
  return translations[language][key as keyof typeof translations.en] || key
}
