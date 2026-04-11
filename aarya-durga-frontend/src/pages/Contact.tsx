import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Car, MessageSquare, Navigation, Plane, TrainFront } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/temple/Navbar";
import Footer from "@/components/temple/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import client from "@/api/client";
import {
    fetchPageContent,
    findContentItem,
    getContentByLanguage,
    getImageUrl,
} from "@/api/helpers";
import { RichTextContent } from "@/components/global/RichTextContent";
import { useLoader } from "@/contexts/LoaderContext";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";

interface ContactSubject {
    id: number;
    label_en: string;
    label_hi: string;
    label_mr: string;
}

interface HowToReachItem {
    mode: string;
    title: string;
    description: string;
}

const parseStoredModes = (
    rawValue: string | undefined,
    data: Array<{ section_key: string }>,
) => {
    if (rawValue) {
        try {
            const parsed = JSON.parse(rawValue);
            if (Array.isArray(parsed)) {
                return parsed.filter(
                    (value): value is string => typeof value === "string",
                );
            }
        } catch {
            // Fall back to legacy detection.
        }
    }

    const modes = new Set<string>();
    data.forEach((item) => {
        const match = item.section_key.match(/^how_to_reach_(\w+)_/);
        if (match) {
            modes.add(match[1]);
        }
    });

    return Array.from(modes).sort();
};

const getTravelIcon = (mode: string) => {
    const normalizedMode = mode.toLowerCase();

    if (normalizedMode.includes("road") || normalizedMode.includes("car")) {
        return Car;
    }

    if (normalizedMode.includes("train") || normalizedMode.includes("rail")) {
        return TrainFront;
    }

    if (normalizedMode.includes("air") || normalizedMode.includes("flight")) {
        return Plane;
    }

    return Navigation;
};

const Contact = () => {
    const { t, language } = useLanguage();
    const { setLoading: setGlobalLoading } = useLoader();
    const [heroTitle, setHeroTitle] = useState("");
    const [heroSubtitle, setHeroSubtitle] = useState("");
    const [heroImageUrl, setHeroImageUrl] = useState("");
    const [howToReachItems, setHowToReachItems] = useState<HowToReachItem[]>([]);
    const [subjects, setSubjects] = useState<ContactSubject[]>([]);
    const [loading, setLoading] = useState(true);
    const imagesLoaded = useImagesLoaded([heroImageUrl]);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (loading || !imagesLoaded) {
            setGlobalLoading(true);
            return;
        }

        setGlobalLoading(false);
    }, [loading, imagesLoaded, setGlobalLoading]);

    useEffect(() => {
        fetchContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            // Fetch page content
            const pageData = await fetchPageContent("contact");
            const lang = language as "en" | "hi" | "mr";

            const heroTitleItem = findContentItem(pageData, "hero_title");
            const heroSubtitleItem = findContentItem(pageData, "hero_subtitle");
            const heroImageItem = findContentItem(pageData, "hero_image");

            setHeroTitle(getContentByLanguage(heroTitleItem, lang));
            setHeroSubtitle(getContentByLanguage(heroSubtitleItem, lang));
            setHeroImageUrl(getImageUrl(heroImageItem));

            const orderedModes = parseStoredModes(
                findContentItem(pageData, "how_to_reach_modes")?.content_en,
                pageData,
            );
            setHowToReachItems(
                orderedModes
                    .map((mode) => ({
                        mode,
                        title:
                            getContentByLanguage(
                                findContentItem(
                                    pageData,
                                    `how_to_reach_${mode}_title`,
                                ),
                                lang,
                            ) || "",
                        description:
                            getContentByLanguage(
                                findContentItem(
                                    pageData,
                                    `how_to_reach_${mode}_description`,
                                ),
                                lang,
                            ) || "",
                    }))
                    .filter((item) => item.title || item.description),
            );

            // Fetch contact subjects from public API
            try {
                const subjectsResponse = await client.get(
                    "/public/contact-subjects",
                );
                setSubjects(subjectsResponse.data);
            } catch (error) {
                // Fall back to i18n subjects if API fails
            }
        } catch (error) {
            // Error fetching contact page content
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.message.trim()
        ) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            await client.post("/public/contact", {
                name: formData.name,
                email: formData.email,
                phone: formData.phone || undefined,
                subject: formData.subject || undefined,
                message: formData.message,
            });

            toast.success(
                "Your message has been sent successfully! We will get back to you soon.",
            );
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <HomePageProvider>
            <div className="min-h-screen">
                <Navbar />
                <section className="relative pt-16 min-h-[50vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={heroImageUrl}
                            alt="Temple"
                            className="w-full h-full object-cover"
                        />
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
                            {heroTitle || t.contactPage.heroTitle}
                        </motion.h1>
                        <RichTextContent
                            content={heroSubtitle || t.contactPage.heroSubtitle}
                            className="mx-auto max-w-2xl text-lg text-primary-foreground/80 prose-p:text-primary-foreground/80 prose-strong:text-primary-foreground prose-em:text-primary-foreground/90"
                        />
                    </div>
                </section>

                <section className="py-20 bg-accent mandala-bg">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <div className="gold-line mx-auto mb-4" />
                            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                {t.contactPage.sendMessage}
                            </h2>
                            <p className="text-muted-foreground max-w-xl mx-auto mt-4">
                                {t.contactPage.sendMessageSubtitle}
                            </p>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-2xl mx-auto bg-card rounded-2xl p-8 md:p-10 shadow-xl border border-border"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            {t.contactPage.fullName}
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder={
                                                t.contactPage
                                                    .fullNamePlaceholder
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            {t.contactPage.phoneNumber}
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder={
                                                t.contactPage.phonePlaceholder
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t.contactPage.emailAddress}
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder={
                                            t.contactPage.emailPlaceholder
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t.contactPage.subject}
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                    >
                                        <option value="">
                                            Select a subject
                                        </option>
                                        {subjects.length > 0
                                            ? subjects.map((subject) => {
                                                  const labelKey =
                                                      `label_${language}` as keyof ContactSubject;
                                                  return (
                                                      <option
                                                          key={subject.id}
                                                          value={
                                                              subject[labelKey]
                                                          }
                                                      >
                                                          {subject[labelKey]}
                                                      </option>
                                                  );
                                              })
                                            : t.contactPage.subjectOptions.map(
                                                  (opt) => (
                                                      <option key={opt}>
                                                          {opt}
                                                      </option>
                                                  ),
                                              )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t.contactPage.message}
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={5}
                                        placeholder={
                                            t.contactPage.messagePlaceholder
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    variant="temple"
                                    size="lg"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    <MessageSquare size={16} className="mr-2" />
                                    {isSubmitting
                                        ? "Sending..."
                                        : t.contactPage.sendBtn}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </section>

                {howToReachItems.length > 0 && (
                    <section className="py-16 bg-card">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-10">
                                <div className="gold-line mx-auto mb-4" />
                                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                    How to Reach Us
                                </h2>
                            </div>

                            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {howToReachItems.map((item, index) => {
                                    const Icon = getTravelIcon(item.mode);

                                    return (
                                        <motion.div
                                            key={`${item.mode}-${index}`}
                                            initial={{ opacity: 0, y: 24 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.45,
                                                delay: index * 0.08,
                                            }}
                                            className="rounded-2xl border border-border/80 bg-accent px-6 py-7 text-center shadow-md"
                                        >
                                            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                                                <Icon size={34} />
                                            </div>
                                            <h3 className="font-heading text-xl font-bold text-foreground">
                                                {item.title}
                                            </h3>
                                            <RichTextContent
                                                content={item.description}
                                                className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-muted-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-em:text-muted-foreground"
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default Contact;
