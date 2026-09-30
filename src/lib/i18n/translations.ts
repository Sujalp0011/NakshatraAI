export type LanguageCode = "en" | "hi" | "es" | "fr" | "ar";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
];

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav & General
    "nav.features": "Features",
    "nav.howItWorks": "How It Works",
    "nav.pricing": "Pricing",
    "nav.languages": "Languages",
    "nav.getStarted": "Get Started Free",
    "nav.login": "Sign In",
    "nav.signup": "Sign Up",
    "nav.brand": "NakshatraAI",

    // Dashboard Nav
    "dash.home": "Home",
    "dash.myKundli": "My Kundli",
    "dash.predictions": "Predictions",
    "dash.aiChat": "AI Chat",
    "dash.compatibility": "Compatibility",
    "dash.settings": "Settings",
    "dash.logout": "Sign Out",
    "dash.upgrade": "Upgrade to Premium",
    "dash.freePlan": "Free Plan",
    "dash.premiumPlan": "Premium Plan",

    // Actions & Common
    "common.save": "Save Changes",
    "common.saving": "Saving...",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.delete": "Delete Account",
    "common.deleting": "Deleting...",
    "common.downloadPdf": "Download PDF Report",
    "common.clearChat": "Clear Chat",
    "common.language": "Language",
    "common.preferredLanguage": "Preferred Language",
    "common.backToHome": "Back to Home",
    "common.loading": "Loading cosmic alignment...",

    // Hero
    "hero.badge": "✨ AI-Powered Multilingual Astrology Engine",
    "hero.title1": "Know Your Stars,",
    "hero.title2": "Shape Your Destiny",
    "hero.subtitle": "Precision Vedic Kundli generation, daily transit horoscopes, and 24/7 AI Astrologer guidance in 5+ languages.",
    "hero.ctaPrimary": "Generate Free Kundli",
    "hero.ctaSecondary": "Explore Features",

    // Features
    "features.badge": "Cosmic Capabilities",
    "features.title": "Ancient Vedic Wisdom Powered by Modern AI",
    "features.description": "Combining sacred Jyotish math with state-of-the-art neural intelligence.",
    "features.feat1Title": "Instant Kundli Generation",
    "features.feat1Desc": "Precise planetary calculations, Divisional Charts (D1, D9 Navamsha), and South/North Indian layouts.",
    "features.feat2Title": "24/7 AI Astrologer",
    "features.feat2Desc": "Ask any question regarding career, love, health, or remedies and receive instant personalized readings.",
    "features.feat3Title": "Daily & Annual Predictions",
    "features.feat3Desc": "Real-time Mahadasha, Antardasha, and Gochar transit impacts mapped specifically to your birth chart.",
    "features.feat4Title": "Kundli Matching & Guna Milan",
    "features.feat4Desc": "Comprehensive 36 Guna Ashtakoota compatibility analysis with Dosha identification.",
    "features.feat5Title": "High-Res PDF Export",
    "features.feat5Desc": "Export beautiful, print-ready astrological chart reports directly to PDF.",
    "features.feat6Title": "Native Multilingual Support",
    "features.feat6Desc": "Read birth charts and interact with the AI assistant seamlessly in English, Hindi, Spanish, French, and Arabic.",

    // How It Works
    "how.badge": "Simple 3-Step Process",
    "how.title": "How NakshatraAI Works",
    "how.desc": "Your personalized cosmic roadmap in under a minute.",
    "how.step1Title": "Enter Birth Details",
    "how.step1Desc": "Provide exact date, time, and location of birth for high-precision planetary coordinates.",
    "how.step2Title": "Generate Chart & Analysis",
    "how.step2Desc": "Our engine computes exact planetary longitudes, Rashi positions, and Nakshatras.",
    "how.step3Title": "Consult AI Astrologer",
    "how.step3Desc": "Chat naturally with the Groq AI engine for tailored remedies, guidance, and predictions.",

    // Pricing
    "pricing.badge": "Fair & Transparent",
    "pricing.title": "Choose Your Cosmic Journey",
    "pricing.desc": "Start free and upgrade anytime for unlimited AI consultation and high-resolution chart downloads.",
    "pricing.freeTitle": "Free Seeker",
    "pricing.freePrice": "$0",
    "pricing.freeDesc": "Essential Kundli calculation & daily horoscope overview.",
    "pricing.premTitle": "Cosmic Voyager",
    "pricing.premPrice": "$9.99",
    "pricing.premDesc": "Full AI Chat consultation, PDF downloads, and in-depth Dasha breakdowns.",

    // Languages Section
    "langSec.badge": "Multilingual Support",
    "langSec.title": "Speak the Language of the Stars",
    "langSec.desc": "Astrology knows no borders. Access accurate Vedic charts and AI insights natively in your preferred language.",
    "langSec.rtlNotice": "Native RTL support for Arabic and Hebrew.",

    // Testimonials
    "test.badge": "Seeker Reviews",
    "test.title": "Loved by Astrologers & Seekers Worldwide",

    // Footer
    "footer.desc": "Empowering seekers worldwide with authentic Vedic astrology and AI intelligence.",
    "footer.rights": "All rights reserved.",

    // Home Page Dashboard
    "dashHome.welcome": "Welcome back,",
    "dashHome.subtitle": "Here is your cosmic overview and planetary alignment for today.",
    "dashHome.dailyOverview": "Daily Transit Overview",
    "dashHome.quickActions": "Quick Actions",
    "dashHome.generateKundli": "Generate Kundli",
    "dashHome.askAi": "Ask AI Astrologer",
    "dashHome.predictions": "View Predictions",

    // Kundli Page
    "kundli.title": "Vedic Kundli & Birth Chart",
    "kundli.subtitle": "South Indian style chart with authentic house mappings and Rashi zodiac symbols.",
    "kundli.birthDetails": "Birth Details",
    "kundli.name": "Full Name",
    "kundli.dob": "Date of Birth",
    "kundli.tob": "Time of Birth",
    "kundli.pob": "Place of Birth",
    "kundli.generate": "Generate Kundli",
    "kundli.downloadPdf": "Download High-Res PDF",
    "kundli.rashi": "Rashi (Zodiac)",
    "kundli.house": "House",
    "kundli.grahas": "Planets (Grahas)",

    // Chat Page
    "chat.title": "Cosmic AI Astrologer",
    "chat.subtitle": "Ask questions about your career, relationships, remedies, or planetary transits.",
    "chat.placeholder": "Type your message or ask an astrological question...",
    "chat.send": "Send Message",
    "chat.clearConfirm": "Are you sure you want to clear your chat history?",

    // Settings Page
    "settings.title": "Profile & Settings",
    "settings.subtitle": "Manage your personal details, birth information, and preferred language.",
    "settings.personalInfo": "Personal Information",
    "settings.birthDetails": "Birth Details (For Kundli & Horoscope)",
    "settings.activePlan": "Active Plan",
    "settings.dangerZone": "Danger Zone",
  },
  hi: {
    // Nav & General
    "nav.features": "विशेषताएं",
    "nav.howItWorks": "यह कैसे काम करता है",
    "nav.pricing": "मूल्य निर्धारण",
    "nav.languages": "भाषाएं",
    "nav.getStarted": "निःशुल्क शुरू करें",
    "nav.login": "साइन इन करें",
    "nav.signup": "साइन अप करें",
    "nav.brand": "नक्षत्रAI",

    // Dashboard Nav
    "dash.home": "होम",
    "dash.myKundli": "मेरी कुंडली",
    "dash.predictions": "भविष्यवाणी",
    "dash.aiChat": "AI चैट",
    "dash.compatibility": "गुण मिलान",
    "dash.settings": "सेटिंग्स",
    "dash.logout": "साइन आउट",
    "dash.upgrade": "प्रीमियम में अपग्रेड करें",
    "dash.freePlan": "फ्री प्लान",
    "dash.premiumPlan": "प्रीमियम प्लान",

    // Actions & Common
    "common.save": "बदलाव सहेजें",
    "common.saving": "सहेजा जा रहा है...",
    "common.cancel": "रद्द करें",
    "common.confirm": "पुष्टि करें",
    "common.delete": "खाता हटाएं",
    "common.deleting": "हटाया जा रहा है...",
    "common.downloadPdf": "PDF रिपोर्ट डाउनलोड करें",
    "common.clearChat": "चैट साफ करें",
    "common.language": "भाषा",
    "common.preferredLanguage": "पसंदीदा भाषा",
    "common.backToHome": "मुख्य पृष्ठ पर लौटें",
    "common.loading": "ग्रह स्थिति लोड हो रही है...",

    // Hero
    "hero.badge": "✨ AI-संचालित बहुभाषी वैदिक ज्योतिष इंजन",
    "hero.title1": "अपने सितारों को जानें,",
    "hero.title2": "अपना भाग्य संवारें",
    "hero.subtitle": "5+ भाषाओं में सटीक वैदिक कुंडली निर्माण, दैनिक राशिफल, और 24/7 AI ज्योतिषी मार्गदर्शन।",
    "hero.ctaPrimary": "मुफ्त कुंडली बनाएं",
    "hero.ctaSecondary": "विशेषताएं देखें",

    // Features
    "features.badge": "अलौकिक क्षमताएं",
    "features.title": "आधुनिक AI द्वारा संचालित प्राचीन वैदिक ज्ञान",
    "features.description": "पवित्र ज्योतिष गणित और अत्याधुनिक न्यूरल इंटेलिजेंस का अनोखा संगम।",
    "features.feat1Title": "तत्काल कुंडली निर्माण",
    "features.feat1Desc": "सटीक ग्रहीय गणना, वर्ग कुंडली (D1, D9 नवांश), और दक्षिण/उत्तर भारतीय लेआउट।",
    "features.feat2Title": "24/7 AI ज्योतिषी",
    "features.feat2Desc": "करियर, प्रेम, स्वास्थ्य या उपायों के बारे में कोई भी प्रश्न पूछें और तुरंत व्यक्तिगत मार्गदर्शन प्राप्त करें।",
    "features.feat3Title": "दैनिक व वार्षिक फलादेश",
    "features.feat3Desc": "आपकी जन्मपत्री के अनुसार महादशा, अंतर्दशा और गोचर प्रभावों की सटीक गणना।",
    "features.feat4Title": "कुंडली मिलान एवं गुण मिलान",
    "features.feat4Desc": "दोषों के विश्लेषण के साथ संपूर्ण 36 गुण अष्टकूट मिलान की रिपोर्ट।",
    "features.feat5Title": "उच्च-गुणवत्ता PDF निर्यात",
    "features.feat5Desc": "सुंदर और प्रिंट-योग्य ज्योतिषीय चार्ट रिपोर्ट को सीधे PDF में डाउनलोड करें।",
    "features.feat6Title": "मूल बहुभाषी सहायता",
    "features.feat6Desc": "अंग्रेजी, हिंदी, स्पेनिश, फ्रेंच और अरबी में अपनी कुंडली देखें और AI से बात करें।",

    // How It Works
    "how.badge": "सरल 3-चरणीय प्रक्रिया",
    "how.title": "नक्षत्रAI कैसे काम करता है",
    "how.desc": "एक मिनट के भीतर आपका व्यक्तिगत ज्योतिषीय मार्गदर्शक।",
    "how.step1Title": "जन्म विवरण दर्ज करें",
    "how.step1Desc": "सटीक ग्रहीय निर्देशांक के लिए जन्म की सही तिथि, समय और स्थान प्रदान करें।",
    "how.step2Title": "कुंडली एवं विश्लेषण प्राप्त करें",
    "how.step2Desc": "हमारा इंजन सटीक ग्रह देशांतर, राशि स्थिति और नक्षत्रों की गणना करता है।",
    "how.step3Title": "AI ज्योतिषी से परामर्श करें",
    "how.step3Desc": "व्यक्तिगत उपायों और भविष्यवाणियों के लिए Groq AI के साथ सहज बातचीत करें।",

    // Pricing
    "pricing.badge": "पारदर्शी एवं उचित",
    "pricing.title": "अपनी ज्योतिषीय यात्रा चुनें",
    "pricing.desc": "मुफ्त में शुरू करें और असीमित AI परामर्श के लिए कभी भी अपग्रेड करें।",
    "pricing.freeTitle": "निःशुल्क साधक",
    "pricing.freePrice": "₹0",
    "pricing.freeDesc": "आवश्यक कुंडली गणना और दैनिक राशिफल का विवरण।",
    "pricing.premTitle": "कॉस्मिक प्रीमियम",
    "pricing.premPrice": "₹799",
    "pricing.premDesc": "असीमित AI चैट परामर्श, उच्च गुणवत्ता PDF और विस्तृत दशा विश्लेषण।",

    // Languages Section
    "langSec.badge": "बहुभाषी सहायता",
    "langSec.title": "सितारों की भाषा में समझें",
    "langSec.desc": "ज्योतिष की कोई सीमा नहीं होती। अपनी पसंदीदा भाषा में वैदिक चार्ट और AI अंतर्दृष्टि प्राप्त करें।",
    "langSec.rtlNotice": "अरबी और हिब्रू के लिए मूल RTL समर्थन।",

    // Testimonials
    "test.badge": "उपयोगकर्ता समीक्षाएं",
    "test.title": "दुनिया भर के ज्योतिषियों और साधकों द्वारा पसंद किया गया",

    // Footer
    "footer.desc": "प्रामाणिक वैदिक ज्योतिष और AI बुद्धिमत्ता के साथ उपयोगकर्ताओं को सशक्त बनाना।",
    "footer.rights": "सर्वाधिकार सुरक्षित।",

    // Home Page Dashboard
    "dashHome.welcome": "वापसी पर आपका स्वागत है,",
    "dashHome.subtitle": "यहाँ आज का आपका अलौकिक अवलोकन और ग्रह गोचर स्थिति है।",
    "dashHome.dailyOverview": "दैनिक गोचर फलादेश",
    "dashHome.quickActions": "त्वरित कार्य",
    "dashHome.generateKundli": "कुंडली बनाएं",
    "dashHome.askAi": "AI ज्योतिषी से पूछें",
    "dashHome.predictions": "भविष्यवाणी देखें",

    // Kundli Page
    "kundli.title": "वैदिक कुंडली और जन्मपत्री",
    "kundli.subtitle": "राशि चिन्हों और प्रामाणिक भाव मैपिंग के साथ दक्षिण भारतीय शैली की कुंडली।",
    "kundli.birthDetails": "जन्म विवरण",
    "kundli.name": "पूरा नाम",
    "kundli.dob": "जन्म तिथि",
    "kundli.tob": "जन्म समय",
    "kundli.pob": "जन्म स्थान",
    "kundli.generate": "कुंडली उत्पन्न करें",
    "kundli.downloadPdf": "उच्च-गुणवत्ता PDF डाउनलोड करें",
    "kundli.rashi": "राशि",
    "kundli.house": "भाव (घर)",
    "kundli.grahas": "ग्रह स्थिति",

    // Chat Page
    "chat.title": "AI दिव्य ज्योतिषी",
    "chat.subtitle": "अपने करियर, संबंधों, उपायों या ग्रह गोचर के बारे में प्रश्न पूछें।",
    "chat.placeholder": "अपना संदेश लिखें या ज्योतिषीय प्रश्न पूछें...",
    "chat.send": "संदेश भेजें",
    "chat.clearConfirm": "क्या आप निश्चित रूप से अपना चैट इतिहास साफ करना चाहते हैं?",

    // Settings Page
    "settings.title": "प्रोफ़ाइल और सेटिंग्स",
    "settings.subtitle": "अपने व्यक्तिगत विवरण, जन्म जानकारी और पसंदीदा भाषा का प्रबंधन करें।",
    "settings.personalInfo": "व्यक्तिगत जानकारी",
    "settings.birthDetails": "जन्म विवरण (कुंडली और राशिफल के लिए)",
    "settings.activePlan": "सक्रिय योजना",
    "settings.dangerZone": "खतरा क्षेत्र (Danger Zone)",
  },
  es: {
    // Nav & General
    "nav.features": "Características",
    "nav.howItWorks": "Cómo Funciona",
    "nav.pricing": "Precios",
    "nav.languages": "Idiomas",
    "nav.getStarted": "Comenzar Gratis",
    "nav.login": "Iniciar Sesión",
    "nav.signup": "Registrarse",
    "nav.brand": "NakshatraAI",

    // Dashboard Nav
    "dash.home": "Inicio",
    "dash.myKundli": "Mi Kundli",
    "dash.predictions": "Predicciones",
    "dash.aiChat": "Chat IA",
    "dash.compatibility": "Compatibilidad",
    "dash.settings": "Ajustes",
    "dash.logout": "Cerrar Sesión",
    "dash.upgrade": "Actualizar a Premium",
    "dash.freePlan": "Plan Gratuito",
    "dash.premiumPlan": "Plan Premium",

    // Actions & Common
    "common.save": "Guardar Cambios",
    "common.saving": "Guardando...",
    "common.cancel": "Cancelar",
    "common.confirm": "Confirmar",
    "common.delete": "Eliminar Cuenta",
    "common.deleting": "Eliminando...",
    "common.downloadPdf": "Descargar Reporte PDF",
    "common.clearChat": "Limpiar Chat",
    "common.language": "Idioma",
    "common.preferredLanguage": "Idioma Preferido",
    "common.backToHome": "Volver al Inicio",
    "common.loading": "Cargando alineación cósmica...",

    // Hero
    "hero.badge": "✨ Motor de Astrología Multilingüe impulsado por IA",
    "hero.title1": "Conoce tus Estrellas,",
    "hero.title2": "Forja tu Destino",
    "hero.subtitle": "Generación precisa de Kundli Védico, horóscopos diarios y guía de Astrólogo IA en más de 5 idiomas.",
    "hero.ctaPrimary": "Generar Kundli Gratis",
    "hero.ctaSecondary": "Explorar Funciones",

    // Features
    "features.badge": "Capacidades Cósmicas",
    "features.title": "Sabiduría Védica Antigua Impulsada por IA Moderna",
    "features.description": "Combinando la matemática sagrada de Jyotish con inteligencia neuronal avanzada.",
    "features.feat1Title": "Generación Instantánea de Kundli",
    "features.feat1Desc": "Cálculos planetarios precisos y formatos de cartas del sur y norte de la India.",
    "features.feat2Title": "Astrólogo IA 24/7",
    "features.feat2Desc": "Haz cualquier pregunta sobre carrera, amor, salud o remedios y recibe lecturas personalizadas.",
    "features.feat3Title": "Predicciones Diarias y Anuales",
    "features.feat3Desc": "Impactos de Mahadasha y transitorios asignados específicamente a tu carta natal.",
    "features.feat4Title": "Compatibilidad y Guna Milan",
    "features.feat4Desc": "Análisis exhaustivo de compatibilidad con identificación de doshas.",
    "features.feat5Title": "Exportación PDF de Alta Resolución",
    "features.feat5Desc": "Exporta hermosos informes astrológicos directamente a PDF.",
    "features.feat6Title": "Soporte Multilingüe Nativo",
    "features.feat6Desc": "Lee cartas natales e interactúa en inglés, español, hindi, francés y árabe.",

    // How It Works
    "how.badge": "Proceso Simple en 3 Pasos",
    "how.title": "Cómo Funciona NakshatraAI",
    "how.desc": "Tu mapa cósmico personalizado en menos de un minuto.",
    "how.step1Title": "Ingresa Datos de Nacimiento",
    "how.step1Desc": "Proporciona fecha, hora y lugar de nacimiento exactos.",
    "how.step2Title": "Genera tu Carta Védica",
    "how.step2Desc": "Nuestro motor calcula las posiciones planetarias exactas y los signos del zodiaco.",
    "how.step3Title": "Consulta al Astrólogo IA",
    "how.step3Desc": "Chatea con la IA Groq para obtener remedios y predicciones a medida.",

    // Pricing
    "pricing.badge": "Justo y Transparente",
    "pricing.title": "Elige tu Viaje Cósmico",
    "pricing.desc": "Comienza gratis y actualiza en cualquier momento para consultas de IA ilimitadas.",
    "pricing.freeTitle": "Buscador Gratuito",
    "pricing.freePrice": "$0",
    "pricing.freeDesc": "Cálculo de Kundli esencial y horóscopo diario.",
    "pricing.premTitle": "Viajero Cósmico",
    "pricing.premPrice": "$9.99",
    "pricing.premDesc": "Consultas ilimitadas de IA y descargas de informes en PDF.",

    // Languages Section
    "langSec.badge": "Soporte Multilingüe",
    "langSec.title": "Habla el Idioma de las Estrellas",
    "langSec.desc": "La astrología no conoce fronteras. Accede a cartas védicas nativas en tu idioma.",
    "langSec.rtlNotice": "Soporte nativo RTL para árabe y hebreo.",

    // Testimonials
    "test.badge": "Reseñas de Usuarios",
    "test.title": "Amado por Astrólogos y Buscadores en todo el mundo",

    // Footer
    "footer.desc": "Empoderando a buscadores con astrología védica auténtica e inteligencia artificial.",
    "footer.rights": "Todos los derechos reservados.",

    // Home Page Dashboard
    "dashHome.welcome": "Bienvenido de nuevo,",
    "dashHome.subtitle": "Aquí está tu resumen cósmico y alineación planetaria de hoy.",
    "dashHome.dailyOverview": "Resumen de Tránsito Diario",
    "dashHome.quickActions": "Acciones Rápidas",
    "dashHome.generateKundli": "Generar Kundli",
    "dashHome.askAi": "Preguntar al Astrólogo IA",
    "dashHome.predictions": "Ver Predicciones",

    // Kundli Page
    "kundli.title": "Kundli Védico y Carta Natal",
    "kundli.subtitle": "Carta estilo sur de la India con símbolos del zodiaco Rashi.",
    "kundli.birthDetails": "Detalles de Nacimiento",
    "kundli.name": "Nombre Completo",
    "kundli.dob": "Fecha de Nacimiento",
    "kundli.tob": "Hora de Nacimiento",
    "kundli.pob": "Lugar de Nacimiento",
    "kundli.generate": "Generar Kundli",
    "kundli.downloadPdf": "Descargar PDF en Alta Res",
    "kundli.rashi": "Rashi (Zodíaco)",
    "kundli.house": "Casa",
    "kundli.grahas": "Planetas (Grahas)",

    // Chat Page
    "chat.title": "Astrólogo IA Cósmico",
    "chat.subtitle": "Pregunta sobre tu carrera, relaciones o transiciones planetarias.",
    "chat.placeholder": "Escribe tu mensaje o pregunta astrológica...",
    "chat.send": "Enviar Mensaje",
    "chat.clearConfirm": "¿Estás seguro de que deseas borrar el historial de chat?",

    // Settings Page
    "settings.title": "Perfil y Configuración",
    "settings.subtitle": "Administra tus datos personales e idioma preferido.",
    "settings.personalInfo": "Información Personal",
    "settings.birthDetails": "Detalles de Nacimiento",
    "settings.activePlan": "Plan Activo",
    "settings.dangerZone": "Zona de Peligro",
  },
  fr: {
    // Nav & General
    "nav.features": "Fonctionnalités",
    "nav.howItWorks": "Comment ça marche",
    "nav.pricing": "Tarifs",
    "nav.languages": "Langues",
    "nav.getStarted": "Commencer Gratuitement",
    "nav.login": "Se Connecter",
    "nav.signup": "S'inscrire",
    "nav.brand": "NakshatraAI",

    // Dashboard Nav
    "dash.home": "Accueil",
    "dash.myKundli": "Mon Kundli",
    "dash.predictions": "Prédictions",
    "dash.aiChat": "Chat IA",
    "dash.compatibility": "Compatibilité",
    "dash.settings": "Paramètres",
    "dash.logout": "Se Déconnecter",
    "dash.upgrade": "Passer à Premium",
    "dash.freePlan": "Offre Gratuite",
    "dash.premiumPlan": "Offre Premium",

    // Actions & Common
    "common.save": "Enregistrer les modifications",
    "common.saving": "Enregistrement...",
    "common.cancel": "Annuler",
    "common.confirm": "Confirmer",
    "common.delete": "Supprimer le Compte",
    "common.deleting": "Suppression...",
    "common.downloadPdf": "Télécharger le Rapport PDF",
    "common.clearChat": "Effacer la discussion",
    "common.language": "Langue",
    "common.preferredLanguage": "Langue Préférée",
    "common.backToHome": "Retour à l'accueil",
    "common.loading": "Chargement de l'alignement cosmique...",

    // Hero
    "hero.badge": "✨ Moteur d'Astrologie Multilingue propulsé par l'IA",
    "hero.title1": "Connaissez vos Étoiles,",
    "hero.title2": "Façonnez votre Destin",
    "hero.subtitle": "Génération précise de Kundli védique, horoscopes quotidiens et conseils d'astrologue IA en plus de 5 langues.",
    "hero.ctaPrimary": "Générer un Kundli Gratuit",
    "hero.ctaSecondary": "Découvrir les fonctionnalités",

    // Features
    "features.badge": "Capacités Cosmiques",
    "features.title": "Sagesse Védique Ancienne Propulsée par l'IA Moderne",
    "features.description": "Combiner les mathématiques sacrées du Jyotish avec une intelligence artificielle avancée.",
    "features.feat1Title": "Génération Instantanée de Kundli",
    "features.feat1Desc": "Calculs planétaires précis et thèmes astrologiques védiques.",
    "features.feat2Title": "Astrologue IA 24/7",
    "features.feat2Desc": "Posez toutes vos questions sur la carrière, l'amour, la santé et obtenez des réponses instantanées.",
    "features.feat3Title": "Prédictions Quotidiennes",
    "features.feat3Desc": "Impacts de Mahadasha et transits planétaires adaptés à votre thème natal.",
    "features.feat4Title": "Compatibilité & Guna Milan",
    "features.feat4Desc": "Analyse complète de compatibilité avec identification des doshas.",
    "features.feat5Title": "Exportation PDF Haute Définition",
    "features.feat5Desc": "Exportez de magnifiques thèmes astrologiques directement en PDF.",
    "features.feat6Title": "Support Multilingue Natif",
    "features.feat6Desc": "Disponible en anglais, français, espagnol, hindi et arabe.",

    // How It Works
    "how.badge": "Processus Simple en 3 Étapes",
    "how.title": "Comment fonctionne NakshatraAI",
    "how.desc": "Votre carte cosmique personnalisée en moins d'une minute.",
    "how.step1Title": "Saisir les Détails de Naissance",
    "how.step1Desc": "Entrez la date, l'heure et le lieu exacts de votre naissance.",
    "how.step2Title": "Générer votre Thème Astral",
    "how.step2Desc": "Calcul automatique des positions planétaires et des signes du zodiaque.",
    "how.step3Title": "Consulter l'Astrologue IA",
    "how.step3Desc": "Discutez avec l'IA pour obtenir des remèdes et des prédictions sur mesure.",

    // Pricing
    "pricing.badge": "Transparent & Équitable",
    "pricing.title": "Choisissez votre Voyage Cosmique",
    "pricing.desc": "Commencez gratuitement et passez à la version premium pour un accès illimité.",
    "pricing.freeTitle": "Chercheur Gratuit",
    "pricing.freePrice": "0 €",
    "pricing.freeDesc": "Calcul essentiel du Kundli et horoscope quotidien.",
    "pricing.premTitle": "Voyageur Cosmique",
    "pricing.premPrice": "9,99 €",
    "pricing.premDesc": "Consultations IA illimitées et téléchargements PDF.",

    // Languages Section
    "langSec.badge": "Support Multilingue",
    "langSec.title": "Parlez la Langue des Étoiles",
    "langSec.desc": "L'astrologie n'a pas de frontières. Accédez aux thèmes védiques dans votre langue.",
    "langSec.rtlNotice": "Support RTL natif pour l'arabe et l'hébreu.",

    // Testimonials
    "test.badge": "Avis des Utilisateurs",
    "test.title": "Apprécié par les astrologues et passionnés du monde entier",

    // Footer
    "footer.desc": "Offrir une astrologie védique authentique couplée à l'intelligence artificielle.",
    "footer.rights": "Tous droits réservés.",

    // Home Page Dashboard
    "dashHome.welcome": "Bon retour,",
    "dashHome.subtitle": "Voici votre aperçu cosmique et vos transits planétaires d'aujourd'hui.",
    "dashHome.dailyOverview": "Aperçu du Transit Quotidien",
    "dashHome.quickActions": "Actions Rapides",
    "dashHome.generateKundli": "Générer un Kundli",
    "dashHome.askAi": "Consulter l'IA",
    "dashHome.predictions": "Voir les Prédictions",

    // Kundli Page
    "kundli.title": "Kundli Védique & Thème Astral",
    "kundli.subtitle": "Thème astrologique de l'Inde du Sud avec symboles du zodiaque.",
    "kundli.birthDetails": "Détails de Naissance",
    "kundli.name": "Nom Complet",
    "kundli.dob": "Date de Naissance",
    "kundli.tob": "Heure de Naissance",
    "kundli.pob": "Lieu de Naissance",
    "kundli.generate": "Générer le Kundli",
    "kundli.downloadPdf": "Télécharger en PDF",
    "kundli.rashi": "Rashi (Zodiaque)",
    "kundli.house": "Maison",
    "kundli.grahas": "Planètes (Grahas)",

    // Chat Page
    "chat.title": "Astrologue Cosmique IA",
    "chat.subtitle": "Posez vos questions sur votre carrière, vos relations ou vos transits.",
    "chat.placeholder": "Écrivez votre message ou votre question astrologique...",
    "chat.send": "Envoyer le message",
    "chat.clearConfirm": "Voulez-vous vraiment effacer l'historique de discussion ?",

    // Settings Page
    "settings.title": "Profil & Paramètres",
    "settings.subtitle": "Gérez vos informations personnelles et votre langue préférée.",
    "settings.personalInfo": "Informations Personnelles",
    "settings.birthDetails": "Détails de Naissance",
    "settings.activePlan": "Offre Active",
    "settings.dangerZone": "Zone Dangereuse",
  },
  ar: {
    // Nav & General
    "nav.features": "المميزات",
    "nav.howItWorks": "كيف يعمل",
    "nav.pricing": "الأسعار",
    "nav.languages": "اللغات",
    "nav.getStarted": "ابدأ مجاناً",
    "nav.login": "تسجيل الدخول",
    "nav.signup": "إنشاء حساب",
    "nav.brand": "NakshatraAI",

    // Dashboard Nav
    "dash.home": "الرئيسية",
    "dash.myKundli": "خريطتي الفلكية (Kundli)",
    "dash.predictions": "التوقعات",
    "dash.aiChat": "مستشار الذكاء الاصطناعي",
    "dash.compatibility": "التوافق الفلكي",
    "dash.settings": "الإعدادات",
    "dash.logout": "تسجيل الخروج",
    "dash.upgrade": "الترقية للنسخة الممتازة",
    "dash.freePlan": "الخطة المجانية",
    "dash.premiumPlan": "الخطة الممتازة",

    // Actions & Common
    "common.save": "حفظ التغييرات",
    "common.saving": "جاري الحفظ...",
    "common.cancel": "إلغاء",
    "common.confirm": "تأكيد",
    "common.delete": "حذف الحساب",
    "common.deleting": "جاري الحذف...",
    "common.downloadPdf": "تحميل تقرير PDF",
    "common.clearChat": "مسح المحادثة",
    "common.language": "اللغة",
    "common.preferredLanguage": "اللغة المفضلة",
    "common.backToHome": "العودة للرئيسية",
    "common.loading": "جاري حساب المحاذاة الفلكية...",

    // Hero
    "hero.badge": "✨ محرك التنجيم الفيدي متعدد اللغات بالذكاء الاصطناعي",
    "hero.title1": "اعرف نجومك،",
    "hero.title2": "واصنع مصيرك",
    "hero.subtitle": "توليد دقيق للخريطة الفلكية الفيدية، الأبراج اليومية، واستشارات الذكاء الاصطناعي بـ 5+ لغات.",
    "hero.ctaPrimary": "إنشاء خريطة فلكية مجاناً",
    "hero.ctaSecondary": "استكشاف المميزات",

    // Features
    "features.badge": "قدرات كونية",
    "features.title": "الحكمة الفيدية القديمة مدعومة بالذكاء الاصطناعي الحديث",
    "features.description": "دمج الرياضيات الفلكية المقدسة مع الذكاء العصبي المتطور.",
    "features.feat1Title": "توليد فوري للخريطة الفلكية",
    "features.feat1Desc": "حسابات كوكبية دقيقة ومخططات فلكية بنمط جنوب وشمال الهند.",
    "features.feat2Title": "منجم بالذكاء الاصطناعي 24/7",
    "features.feat2Desc": "اسأل أي سؤال عن المهنة، الحب، الصحة أو العلاجات واحصل على إجابات فورية.",
    "features.feat3Title": "توقعات يومية وسنوية",
    "features.feat3Desc": "حسابات حركة الكواكب والدوشا المصممة خصيصاً لخريطتك الفلكية.",
    "features.feat4Title": "التوافق الفلكي وGuna Milan",
    "features.feat4Desc": "تحليل شامل للتوافق بين الشريكين مع تحديد العوامل الفلكية.",
    "features.feat5Title": "تصدير PDF عالي الدقة",
    "features.feat5Desc": "تصدير تقارير الخريطة الفلكية مباشرة بصيغة PDF جاهزة للطباعة.",
    "features.feat6Title": "دعم متعدد اللغات",
    "features.feat6Desc": "تصفح الخرائط وتحدث مع الذكاء الاصطناعي بالإنجليزية، العربية، الهندية، الإسبانية، والفرنسية.",

    // How It Works
    "how.badge": "عملية بسيطة من 3 خطوات",
    "how.title": "كيف يعمل NakshatraAI",
    "how.desc": "خارطتك الفلكية الشخصية في أقل من دقيقة.",
    "how.step1Title": "أدخل تفاصيل الميلاد",
    "how.step1Desc": "أدخل التاريخ والوقت ومكان الميلاد بدقة للحصول على إحداثيات كوكبية صحيحة.",
    "how.step2Title": "توليد الخريطة والتحليل",
    "how.step2Desc": "يحسب محركنا مواقع الكواكب والأبراج بدقة عالية.",
    "how.step3Title": "استشر منجم الذكاء الاصطناعي",
    "how.step3Desc": "تحدث بسلاسة مع الذكاء الاصطناعي للحصول على نصائح وتوقعات مخصصة.",

    // Pricing
    "pricing.badge": "عادل وشفاف",
    "pricing.title": "اختر رحلتك الكونية",
    "pricing.desc": "ابدأ مجاناً وقم بالترقية في أي وقت للحصول على استشارات غير محدودة.",
    "pricing.freeTitle": "الباحث المجاني",
    "pricing.freePrice": "$0",
    "pricing.freeDesc": "حسابات الخريطة الفلكية الأساسية والأبراج اليومية.",
    "pricing.premTitle": "المستكشف الكوني",
    "pricing.premPrice": "$9.99",
    "pricing.premDesc": "استشارات غير محدودة وتحميل التقارير بصيغة PDF.",

    // Languages Section
    "langSec.badge": "دعم متعدد اللغات",
    "langSec.title": "تحدث بلغة النجوم",
    "langSec.desc": "التنجيم لا يعرف الحدود. احصل على خرائط فلكية دقيقة بلغتك المفضلة.",
    "langSec.rtlNotice": "دعم كامل ومباشر للغة العربية والاتجاه من اليمين إلى اليسار.",

    // Testimonials
    "test.badge": "آراء المستكشفين",
    "test.title": "يحظى بثقة المنجمين والمستكشفين حول العالم",

    // Footer
    "footer.desc": "تمكين المستكشفين حول العالم بالتنجيم الفيدي الأصيل والذكاء الاصطناعي.",
    "footer.rights": "جميع الحقوق محفوظة.",

    // Home Page Dashboard
    "dashHome.welcome": "مرحباً بعودتك،",
    "dashHome.subtitle": "إليك نظرتك الكونية ومحاذاة الكواكب لهذا اليوم.",
    "dashHome.dailyOverview": "نظرة عامة على عبور الكواكب",
    "dashHome.quickActions": "إجراءات سريعة",
    "dashHome.generateKundli": "إنشاء خريطة فلكية",
    "dashHome.askAi": "استشارة الذكاء الاصطناعي",
    "dashHome.predictions": "عرض التوقعات",

    // Kundli Page
    "kundli.title": "الخريطة الفلكية الفيدية (Kundli)",
    "kundli.subtitle": "مخطط فلكي بنمط جنوب الهند مع رموز الأبراج الفلكية.",
    "kundli.birthDetails": "تفاصيل الميلاد",
    "kundli.name": "الاسم الكامل",
    "kundli.dob": "تاريخ الميلاد",
    "kundli.tob": "وقت الميلاد",
    "kundli.pob": "مكان الميلاد",
    "kundli.generate": "توليد الخريطة الفلكية",
    "kundli.downloadPdf": "تحميل تقرير PDF عالي الدقة",
    "kundli.rashi": "البرج (Rashi)",
    "kundli.house": "البيت (House)",
    "kundli.grahas": "الكواكب (Grahas)",

    // Chat Page
    "chat.title": "المنجم الكوني بالذكاء الاصطناعي",
    "chat.subtitle": "اسأل عن حياتك المهنية، العلاقات، أو عبور الكواكب.",
    "chat.placeholder": "اكتب رسالتك أو سؤالك الفلكي...",
    "chat.send": "إرسال الرسالة",
    "chat.clearConfirm": "هل أنت تأكد من أنك تريد مسح سجل المحادثة؟",

    // Settings Page
    "settings.title": "الملف الشخصي والإعدادات",
    "settings.subtitle": "إدارة بياناتك الشخصية ومعلومات الميلاد واللغة المفضلة.",
    "settings.personalInfo": "المعلومات الشخصية",
    "settings.birthDetails": "تفاصيل الميلاد",
    "settings.activePlan": "الخطة الحالية",
    "settings.dangerZone": "منطقة الخطر",
  },
};
