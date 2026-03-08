import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/temple/Navbar";
import Footer from "@/components/temple/Footer";
import VisitSection from "@/components/temple/VisitSection";
import { useLanguage } from "@/i18n/LanguageContext";
import client from "@/api/client";
import {
    fetchPageContent,
    findContentItem,
    getContentByLanguage,
    getImageUrl,
} from "@/api/helpers";
import { useLoader } from "@/contexts/LoaderContext";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";

interface ContactSubject {
    id: number;
    label_en: string;
    label_hi: string;
    label_mr: string;
}

const Contact = () => {
    const { t, language } = useLanguage();
    const { setLoading: setGlobalLoading } = useLoader();
    const [heroTitle, setHeroTitle] = useState("");
    const [heroSubtitle, setHeroSubtitle] = useState("");
    const [heroImageUrl, setHeroImageUrl] = useState("");
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
                        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                            {heroSubtitle || t.contactPage.heroSubtitle}
                        </p>
                    </div>
                </section>

                <VisitSection />

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

                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default Contact;
