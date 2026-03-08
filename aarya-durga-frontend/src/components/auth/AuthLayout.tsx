import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { constructImageUrl } from "@/api/imageUrl";

interface AuthLayoutProps {
    children: ReactNode;
    heroImageSrc?: string;
}

const AuthLayout = ({ children, heroImageSrc }: AuthLayoutProps) => {
    const { t, language } = useLanguage();
    const { settingsData } = useSettings();

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-10 px-4">
            {/* Background with blur and overlay */}
            <div className="absolute inset-0 z-0">
                {heroImageSrc && <img src={heroImageSrc} alt="Temple" className="w-full h-full object-cover blur-[2px]" />}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-background/90 to-background" />
                <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
            </div>

            {/* Floating Elements */}
            <motion.div
                className="absolute top-20 left-10 text-4xl opacity-20 pointer-events-none"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                🪷
            </motion.div>
            <motion.div
                className="absolute bottom-20 right-10 text-4xl opacity-20 pointer-events-none"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                🔔
            </motion.div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo and Home Link */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex flex-col items-center gap-2 group">
                        {settingsData?.logo?.file_url && (
                            <div className="w-16 h-16 rounded-full bg-primary/10 backdrop-blur-md flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                                <img src={constructImageUrl(settingsData.logo.file_url)} alt="Temple Logo" className="w-14 h-14 object-cover" />
                            </div>
                        )}
                        <h1 className="font-heading text-2xl font-bold text-primary mt-2">
                            {language === 'hi'
                                ? settingsData?.website_name_hi || t.nav.templeName
                                : language === 'mr'
                                ? settingsData?.website_name_mr || t.nav.templeName
                                : settingsData?.website_name_en || t.nav.templeName}
                        </h1>
                    </Link>
                </div>

                {/* Content Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20 relative overflow-hidden"
                >
                    {/* Subtle decoration inside card */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full -ml-16 -mb-16 blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        {children}
                    </div>
                </motion.div>

                {/* Home link button */}
                <div className="text-center mt-8">
                    <Link to="/" className="text-primary/70 hover:text-primary font-medium text-sm transition-colors flex items-center justify-center gap-2">
                        <span>←</span> {t.nav.home}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
