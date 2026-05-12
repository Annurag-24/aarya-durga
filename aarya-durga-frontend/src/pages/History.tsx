import { motion } from "framer-motion";
import {
    Landmark,
    Crown,
    TreePalm,
    Flame,
    Sun,
    BookOpen,
    Mountain,
    Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/temple/Navbar";
import Footer from "@/components/temple/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLoader } from "@/contexts/LoaderContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
    fetchPageContent,
    findContentItem,
    getContentByLanguage,
    getImageUrl,
} from "@/api/helpers";
import client from "@/api/client";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";
import { RichTextContent } from "@/components/global/RichTextContent";

const History = () => {
    const { language } = useLanguage();
    const { setLoading: setGlobalLoading } = useLoader();
    const [loading, setLoading] = useState(true);

    // Hero
    const [heroTitle, setHeroTitle] = useState("");
    const [heroSubtitle, setHeroSubtitle] = useState("");
    const [heroImage, setHeroImage] = useState("");

    // Origin
    const [originTitle, setOriginTitle] = useState("");
    const [originP1, setOriginP1] = useState("");
    const [originP2, setOriginP2] = useState("");
    const [originImage, setOriginImage] = useState("");

    // Timeline
    const [timelineTitle, setTimelineTitle] = useState("");
    const [timelineItems, setTimelineItems] = useState<
        Array<{ era: string; title: string; desc: string }>
    >([]);

    // Traditions
    const [traditionsTitle, setTraditionsTitle] = useState("");
    const [traditionsSubtitle, setTraditionsSubtitle] = useState("");
    const [traditionItems, setTraditionItems] = useState<
        Array<{ title: string; desc: string }>
    >([]);

    const imagesLoaded = useImagesLoaded([heroImage, originImage]);

    useEffect(() => {
        if (loading || !imagesLoaded) {
            setGlobalLoading(true);
            return;
        }

        setGlobalLoading(false);
    }, [loading, imagesLoaded, setGlobalLoading]);

    useEffect(() => {
        fetchHistoryContent();
    }, [language]);

    const fetchHistoryContent = async () => {
        setLoading(true);
        try {
            const pageData = await fetchPageContent("history");
            const lang = language as "en" | "hi" | "mr";

            const getContent = (key: string) =>
                getContentByLanguage(findContentItem(pageData, key), lang);
            const getImg = (key: string) =>
                getImageUrl(findContentItem(pageData, key));

            // Hero
            setHeroTitle(getContent("hero_title"));
            setHeroSubtitle(getContent("hero_subtitle"));
            setHeroImage(getImg("hero_image"));

            // Origin
            setOriginTitle(getContent("origin_title"));
            setOriginP1(getContent("origin_paragraph1"));
            setOriginP2(getContent("origin_paragraph2"));
            setOriginImage(getImg("origin_image"));

            // Timeline
            setTimelineTitle(getContent("timeline_title"));
            try {
                const timelineRes = await client.get(
                    "/public/history-timeline",
                );
                const items = (timelineRes.data as Array<{
                    era_label_en: string;
                    era_label_hi: string;
                    era_label_mr: string;
                    title_en: string;
                    title_hi: string;
                    title_mr: string;
                    description_en?: string;
                    description_hi?: string;
                    description_mr?: string;
                }>).map((item) => ({
                    era:
                        lang === "mr"
                            ? item.era_label_mr || item.era_label_en
                            : lang === "hi"
                              ? item.era_label_hi || item.era_label_en
                              : item.era_label_en,
                    title:
                        lang === "mr"
                            ? item.title_mr || item.title_en
                            : lang === "hi"
                              ? item.title_hi || item.title_en
                              : item.title_en,
                    desc:
                        lang === "mr"
                            ? item.description_mr || item.description_en || ""
                            : lang === "hi"
                              ? item.description_hi || item.description_en || ""
                              : item.description_en || "",
                }));
                setTimelineItems(items.slice().reverse());
            } catch {
                setTimelineItems([]);
            }

            // Traditions
            setTraditionsTitle(getContent("traditions_title"));
            setTraditionsSubtitle(getContent("traditions_subtitle"));
            try {
                const traditionsRes = await client.get(
                    "/public/sacred-traditions",
                );
                const items = (traditionsRes.data as Array<{
                    title_en: string;
                    title_hi: string;
                    title_mr: string;
                    description_en?: string;
                    description_hi?: string;
                    description_mr?: string;
                }>).map((item) => ({
                    title:
                        lang === "mr"
                            ? item.title_mr || item.title_en
                            : lang === "hi"
                              ? item.title_hi || item.title_en
                              : item.title_en,
                    desc:
                        lang === "mr"
                            ? item.description_mr || item.description_en || ""
                            : lang === "hi"
                              ? item.description_hi || item.description_en || ""
                              : item.description_en || "",
                }));
                setTraditionItems(items);
            } catch {
                setTraditionItems([]);
            }

        } catch (error) {
            // Error fetching history content
        } finally {
            setLoading(false);
        }
    };

    const timelineIcons = [Landmark, Crown, TreePalm, Flame, Sun];
    const timeline = timelineItems.map((item, idx) => ({
        icon: timelineIcons[idx % timelineIcons.length],
        year: item.era,
        title: item.title,
        desc: item.desc,
    }));

    const traditionIcons = [Flame, BookOpen, Mountain, Sparkles];
    const traditions = traditionItems.map((item, idx) => ({
        icon: traditionIcons[idx % traditionIcons.length],
        title: item.title,
        desc: item.desc,
    }));

    return (
        <HomePageProvider>
            <div className="min-h-screen">
                <Navbar />

                {/* Hero Section */}
                <section className="relative pt-16 min-h-[50vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={heroImage}
                            alt="Temple History"
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
                            {heroTitle}
                        </motion.h1>
                        <RichTextContent
                            content={heroSubtitle}
                            className="mx-auto max-w-2xl text-lg text-primary-foreground/80 prose-p:text-primary-foreground/80 prose-strong:text-primary-foreground prose-em:text-primary-foreground/90"
                        />
                    </div>
                </section>

                {/* Origin Section */}
                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="rounded-lg overflow-hidden shadow-xl"
                            >
                                <img
                                    src={originImage}
                                    alt="Ancient temple"
                                    className="w-full h-[450px] object-cover"
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="gold-line mb-4" />
                                {loading ? (
                                    <>
                                        <Skeleton className="h-10 w-40 mb-6" />
                                        <Skeleton className="h-4 w-full mb-4" />
                                        <Skeleton className="h-4 w-full" />
                                    </>
                                ) : (
                                    <>
                                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                                            {originTitle}
                                        </h2>
                                        <RichTextContent
                                            content={originP1}
                                            className="mb-4 text-muted-foreground"
                                        />
                                        <RichTextContent
                                            content={originP2}
                                            className="text-muted-foreground"
                                        />
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Timeline Section */}
                <section className="py-20 bg-accent mandala-bg">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <div className="gold-line mx-auto mb-4" />
                            {loading ? (
                                <Skeleton className="h-10 w-60 mx-auto" />
                            ) : (
                                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                    {timelineTitle}
                                </h2>
                            )}
                        </div>
                        <div className="max-w-3xl mx-auto space-y-0">
                            {timeline.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{
                                        opacity: 0,
                                        x: i % 2 === 0 ? -30 : 30,
                                    }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.1,
                                    }}
                                    className="flex gap-6 relative pb-10"
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shrink-0">
                                            <item.icon
                                                className="text-primary"
                                                size={24}
                                            />
                                        </div>
                                        {i < timeline.length - 1 && (
                                            <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/30 to-primary/10 mt-2" />
                                        )}
                                    </div>
                                    <div className="pt-2 pb-4">
                                        {loading ? (
                                            <>
                                                <Skeleton className="h-3 w-20 mb-2" />
                                                <Skeleton className="h-5 w-32 mb-2" />
                                                <Skeleton className="h-4 w-48" />
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-sm font-semibold text-secondary">
                                                    {item.year}
                                                </span>
                                                <h3 className="font-heading text-xl font-bold text-foreground mt-1 mb-2">
                                                    {item.title}
                                                </h3>
                                                <RichTextContent
                                                    content={item.desc}
                                                    className="text-sm text-muted-foreground"
                                                />
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Traditions Section */}
                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <div className="gold-line mx-auto mb-4" />
                            {loading ? (
                                <>
                                    <Skeleton className="h-10 w-48 mx-auto mb-4" />
                                    <Skeleton className="h-5 w-96 mx-auto" />
                                </>
                            ) : (
                                <>
                                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                        {traditionsTitle}
                                    </h2>
                                    <RichTextContent
                                        content={traditionsSubtitle}
                                        className="mx-auto mt-4 max-w-2xl text-muted-foreground"
                                    />
                                </>
                            )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {traditions.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.1,
                                    }}
                                    className="bg-accent rounded-lg p-6 shadow-md border border-border flex gap-4 hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <item.icon
                                            className="text-primary"
                                            size={28}
                                        />
                                    </div>
                                    {loading ? (
                                        <div className="flex-1">
                                            <Skeleton className="h-5 w-32 mb-2" />
                                            <Skeleton className="h-4 w-full" />
                                        </div>
                                    ) : (
                                        <div>
                                            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                                                {item.title}
                                            </h3>
                                            <RichTextContent
                                                content={item.desc}
                                                className="text-sm text-muted-foreground"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default History;
