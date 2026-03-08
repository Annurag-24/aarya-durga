import { useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { languageLabels } from "@/i18n/constants";
import { Language } from "@/i18n/types";

interface LanguageSwitcherProps {
    mobile?: boolean;
}

const LanguageSwitcher = ({ mobile }: LanguageSwitcherProps) => {
    const [langOpen, setLangOpen] = useState(false);
    const { language, setLanguage } = useLanguage();
    const languages: Language[] = ["en", "mr", "hi"];

    if (mobile) {
        return (
            <div className="relative">
                <button
                    onClick={() => setLangOpen(!langOpen)}
                    className="text-foreground/80 hover:text-primary p-1"
                    aria-label="Change Language"
                    aria-expanded={langOpen}
                    aria-haspopup="true"
                >
                    <Globe size={20} />
                </button>
                {langOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                        <div className="absolute right-0 top-full mt-1 z-50 bg-card rounded-lg shadow-lg border border-border py-1 min-w-[120px]">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => {
                                        setLanguage(lang);
                                        setLangOpen(false);
                                    }}
                                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${language === lang
                                        ? "text-primary bg-accent font-semibold"
                                        : "text-foreground/80 hover:bg-accent hover:text-primary"
                                        }`}
                                >
                                    {languageLabels[lang]}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-accent"
                aria-label="Change Language"
                aria-expanded={langOpen}
                aria-haspopup="true"
            >
                <Globe size={16} />
                <span>{languageLabels[language]}</span>
            </button>
            {langOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-50 bg-card rounded-lg shadow-lg border border-border py-1 min-w-[120px]">
                        {languages.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => {
                                    setLanguage(lang);
                                    setLangOpen(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${language === lang
                                    ? "text-primary bg-accent font-semibold"
                                    : "text-foreground/80 hover:bg-accent hover:text-primary"
                                    }`}
                            >
                                {languageLabels[lang]}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default LanguageSwitcher;
