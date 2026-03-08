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
import DevotionalQuote from "@/components/temple/DevotionalQuote";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLoader } from "@/contexts/LoaderContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
    fetchPageContent,
    findContentItem,
    getContentByLanguage,
    getImageUrl,
} from "@/api/helpers";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";

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
    const [ancient, setAncient] = useState({ era: "", title: "", desc: "" });
    const [medieval, setMedieval] = useState({ era: "", title: "", desc: "" });
    const [colonial, setColonial] = useState({ era: "", title: "", desc: "" });
    const [postIndep, setPostIndep] = useState({
        era: "",
        title: "",
        desc: "",
    });
    const [modern, setModern] = useState({ era: "", title: "", desc: "" });

    // Traditions
    const [traditionsTitle, setTraditionsTitle] = useState("");
    const [traditionsSubtitle, setTraditionsSubtitle] = useState("");
    const [navratri, setNavratri] = useState({ title: "", desc: "" });
    const [texts, setTexts] = useState({ title: "", desc: "" });
    const [konkan, setKonkan] = useState({ title: "", desc: "" });
    const [diwali, setDiwali] = useState({ title: "", desc: "" });

    // Banner
    const [bannerQuote, setBannerQuote] = useState("");
    const [bannerImage, setBannerImage] = useState("");
    const imagesLoaded = useImagesLoaded([heroImage, originImage, bannerImage]);

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
            setAncient({
                era: getContent("ancient_era"),
                title: getContent("ancient_title"),
                desc: getContent("ancient_description"),
            });
            setMedieval({
                era: getContent("medieval_era"),
                title: getContent("medieval_title"),
                desc: getContent("medieval_description"),
            });
            setColonial({
                era: getContent("colonial_era"),
                title: getContent("colonial_title"),
                desc: getContent("colonial_description"),
            });
            setPostIndep({
                era: getContent("post_independence_era"),
                title: getContent("post_independence_title"),
                desc: getContent("post_independence_description"),
            });
            setModern({
                era: getContent("modern_day_era"),
                title: getContent("modern_day_title"),
                desc: getContent("modern_day_description"),
            });

            // Traditions
            setTraditionsTitle(getContent("traditions_title"));
            setTraditionsSubtitle(getContent("traditions_subtitle"));
            setNavratri({
                title: getContent("navratri_title"),
                desc: getContent("navratri_description"),
            });
            setTexts({
                title: getContent("texts_title"),
                desc: getContent("texts_description"),
            });
            setKonkan({
                title: getContent("konkan_title"),
                desc: getContent("konkan_description"),
            });
            setDiwali({
                title: getContent("diwali_title"),
                desc: getContent("diwali_description"),
            });

            // Banner
            setBannerQuote(getContent("banner_quote"));
            setBannerImage(getImg("banner_image"));
        } catch (error) {
            // Error fetching history content
        } finally {
            setLoading(false);
        }
    };

    const timeline = [
        {
            icon: Landmark,
            year: ancient.era,
            title: ancient.title,
            desc: ancient.desc,
        },
        {
            icon: Crown,
            year: medieval.era,
            title: medieval.title,
            desc: medieval.desc,
        },
        {
            icon: TreePalm,
            year: colonial.era,
            title: colonial.title,
            desc: colonial.desc,
        },
        {
            icon: Flame,
            year: postIndep.era,
            title: postIndep.title,
            desc: postIndep.desc,
        },
        { icon: Sun, year: modern.era, title: modern.title, desc: modern.desc },
    ];

    const traditions = [
        { icon: Flame, title: navratri.title, desc: navratri.desc },
        { icon: BookOpen, title: texts.title, desc: texts.desc },
        { icon: Mountain, title: konkan.title, desc: konkan.desc },
        { icon: Sparkles, title: diwali.title, desc: diwali.desc },
    ];

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
                        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                            {heroSubtitle}
                        </p>
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
                                        <p className="text-muted-foreground leading-relaxed mb-4">
                                            {originP1}
                                        </p>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {originP2}
                                        </p>
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
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    {item.desc}
                                                </p>
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
                                    <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                                        {traditionsSubtitle}
                                    </p>
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
                                            <p className="text-muted-foreground text-sm">
                                                {item.desc}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Banner Quote Section */}
                <section className="relative py-24 overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={bannerImage}
                            alt="Temple"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/80" />
                    </div>
                    <div className="relative z-10 text-center px-4">
                        <div className="lotus-divider mb-6">
                            <span className="text-3xl">🪷</span>
                        </div>
                        {loading ? (
                            <Skeleton className="h-20 w-3/4 mx-auto bg-primary-foreground/20" />
                        ) : (
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="font-heading text-2xl md:text-4xl font-semibold text-primary-foreground max-w-3xl mx-auto italic leading-relaxed"
                            >
                                "{bannerQuote}"
                            </motion.p>
                        )}
                        <div className="lotus-divider mt-6">
                            <span className="text-3xl">🪷</span>
                        </div>
                    </div>
                </section>

                <DevotionalQuote />
                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default History;
