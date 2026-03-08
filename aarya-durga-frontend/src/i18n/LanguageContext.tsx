import { createContext, useContext, useState, ReactNode } from "react";
import { Language, Translations } from "./types";
import { en } from "./en";
import { mr } from "./mr";
import { hi } from "./hi";

const translationsMap: Record<Language, Translations> = { en, mr, hi };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => { },
  t: en,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("temple-lang") as Language | null;
    return saved && translationsMap[saved] ? saved : "en";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("temple-lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translationsMap[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
