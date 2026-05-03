import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/temple/Navbar";
import Footer from "@/components/temple/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLoader } from "@/contexts/LoaderContext";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { RichTextContent } from "@/components/global/RichTextContent";
import {
    fetchPageContent,
    findContentItem,
    getContentByLanguage,
    getImageUrl,
} from "@/api/helpers";

const PrivacyPolicy = () => {
    const { language } = useLanguage();
    const { setLoading: setGlobalLoading } = useLoader();
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [content, setContent] = useState("");
    const [heroImage, setHeroImage] = useState("");

    useEffect(() => {
        let cancelled = false;
        setGlobalLoading(true);
        (async () => {
            try {
                const pageData = await fetchPageContent("home");
                if (cancelled) return;
                const lang = language as "en" | "hi" | "mr";
                const get = (key: string) =>
                    getContentByLanguage(findContentItem(pageData, key), lang);
                setTitle(get("privacy_policy_title"));
                setSubtitle(get("privacy_policy_subtitle"));
                setContent(get("privacy_policy_content"));
                setHeroImage(
                    getImageUrl(findContentItem(pageData, "privacy_policy_image")) ||
                        getImageUrl(findContentItem(pageData, "about_image")),
                );
            } finally {
                if (!cancelled) setGlobalLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [language, setGlobalLoading]);

    return (
        <HomePageProvider>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <section className="relative pt-16 min-h-[50vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        {heroImage && (
                            <img
                                src={heroImage}
                                alt="Temple"
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
                    </div>
                    <div className="relative z-10 text-center px-4 py-20">
                        <div className="lotus-divider mb-4">
                            <span className="text-3xl">🪷</span>
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-4"
                        >
                            {title || "Privacy Policy"}
                        </motion.h1>
                        <RichTextContent
                            content={subtitle}
                            className="mx-auto max-w-2xl text-lg text-primary-foreground/80 prose-p:text-primary-foreground/80 prose-strong:text-primary-foreground prose-em:text-primary-foreground/90"
                        />
                    </div>
                </section>
                <main className="flex-1 bg-background">
                    <section className="py-16 md:py-20">
                        <div className="container mx-auto px-4 max-w-4xl">
                            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-10">
                                <RichTextContent
                                    content={content}
                                    className="prose-base lg:prose-lg max-w-none text-muted-foreground prose-headings:font-heading prose-headings:text-foreground prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border first:prose-h2:mt-0 prose-p:my-4 prose-p:leading-relaxed prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-2 prose-strong:text-foreground prose-a:text-primary"
                                />
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default PrivacyPolicy;
