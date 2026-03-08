export type Language = "en" | "mr" | "hi";

export interface Translations {
  // Navbar
  nav: {
    home: string;
    about: string;
    history: string;
    poojaDonation: string;
    eventsGallery: string;
    contact: string;
    templeName: string;
  };
  // Hero
  hero: {
    title: string;
    subtitle: string;
    description: string;
    explore: string;
    viewEvents: string;
  };
  // About Section (home)
  aboutSection: {
    readMore: string;
  };
  // History Section (home)
  historySection: {
    learnMore: string;
  };
  // Events Section (home)
  eventsSection: {
    viewAll: string;
  };
  // Gallery Section (home)
  gallerySection: {
    title: string;
  };
  // Visit Section (home)
  visitSection: {
    title: string;
    subtitle: string;
    darshanTimings: string;
    morningDarshan: string;
    eveningAarti: string;
    templeLocation: string;
    getDirections: string;
    getInTouch: string;
    phone: string;
    email: string;
    contactUs: string;
  };
  // Footer
  footer: {
    templeInfo: string;
    quickLinks: string;
    home: string;
    about: string;
    history: string;
    events: string;
    contact: string;
  };
  // About Page
  aboutPage: {
    committeeTitle: string;
    committeeDesc: string;
    trustMember: string;
  };
  // History Page
  historyPage: {
    heroTitle: string;
    heroSubtitle: string;
    originTitle: string;
    originP1: string;
    originP2: string;
    throughAges: string;
    ancientEra: string;
    ancientTitle: string;
    ancientDesc: string;
    medieval: string;
    medievalTitle: string;
    medievalDesc: string;
    colonial: string;
    colonialTitle: string;
    colonialDesc: string;
    postIndependence: string;
    postTitle: string;
    postDesc: string;
    modernDay: string;
    modernTitle: string;
    modernDesc: string;
    sacredTraditions: string;
    traditionsSubtitle: string;
    navratriTitle: string;
    navratriDesc: string;
    textsTitle: string;
    textsDesc: string;
    konkanTitle: string;
    konkanDesc: string;
    diwaliTitle: string;
    diwaliDesc: string;
    bannerQuote: string;
  };
  // Pooja & Donation Page
  poojaPage: {
    heroTitle: string;
    heroSubtitle: string;
    servicesTitle: string;
    servicesSubtitle: string;
    dailyAarti: string;
    dailyAartiTime: string;
    dailyAartiDesc: string;
    durgaPooja: string;
    durgaPoojaTime: string;
    durgaPoojaDesc: string;
    satyanarayanPooja: string;
    satyanarayanTime: string;
    satyanarayanDesc: string;
    navratriPooja: string;
    navratriTime: string;
    navratriDesc: string;
    abhishek: string;
    abhishekTime: string;
    abhishekDesc: string;
    birthdayPooja: string;
    birthdayTime: string;
    birthdayDesc: string;
    bookPooja: string;
    free: string;
    scheduleTitle: string;
    schedule: { time: string; event: string }[];
    donationsTitle: string;
    donationsSubtitle: string;
    annaDaan: string;
    annaDaanDesc: string;
    diyaFund: string;
    diyaFundDesc: string;
    maintenance: string;
    maintenanceDesc: string;
    festivalFund: string;
    festivalFundDesc: string;
    suggested: string;
    donateNow: string;
    bannerQuote: string;
  };
  // Events & Gallery Page
  eventsGalleryPage: {
    templeEvents: string;
    photoGallery: string;
    upcomingTitle: string;
    templeMoments: string;
    momentsSubtitle: string;
    bannerQuote: string;
  };
  // Contact Page
  contactPage: {
    heroTitle: string;
    heroSubtitle: string;
    sendMessage: string;
    sendMessageSubtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    phoneNumber: string;
    phonePlaceholder: string;
    emailAddress: string;
    emailPlaceholder: string;
    subject: string;
    subjectOptions: string[];
    message: string;
    messagePlaceholder: string;
    sendBtn: string;
  };
  // Auth
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    forgotPasswordTitle: string;
    forgotPasswordSubtitle: string;
    resetPasswordTitle: string;
    resetPasswordSubtitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    rememberMe: string;
    signIn: string;
    signUp: string;
    noAccount: string;
    haveAccount: string;
    forgotPasswordLink: string;
    backToLogin: string;
    sendResetLink: string;
    signingIn: string;
    signingUp: string;
    sending: string;
    passwordsDoNotMatch: string;
  };
  // User Module
  user: {
    profileTitle: string;
    profileSubtitle: string;
    changePasswordTitle: string;
    changePasswordSubtitle: string;
    personalInfo: string;
    currentPassword: string;
    newPassword: string;
    saveChanges: string;
    updating: string;
    logout: string;
    logoutConfirmTitle: string;
    logoutConfirmDesc: string;
    cancel: string;
    confirmLogout: string;
    updatePassword: string;
    lastLogin: string;
    memberSince: string;
  };
}
