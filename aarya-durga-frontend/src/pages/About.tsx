import { motion } from "framer-motion";
import { Heart, Users, BookOpen, Star } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/temple/Navbar";
import Footer from "@/components/temple/Footer";
import DevotionalQuote from "@/components/temple/DevotionalQuote";
import { useLanguage } from "@/i18n/LanguageContext";
import {
    fetchPageContent,
    findContentItem,
    getContentByLanguage,
    getImageUrl,
} from "@/api/helpers";
import { useLoader } from "@/contexts/LoaderContext";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";

const About = () => {
    const { language } = useLanguage();
    const { setLoading: setGlobalLoading } = useLoader();
    const [heroTitle, setHeroTitle] = useState<string>("");
    const [heroSubtitle, setHeroSubtitle] = useState<string>("");
    const [heroImage, setHeroImage] = useState<string>("");
    const [aboutTitle, setAboutTitle] = useState<string>("");
    const [aboutDescription, setAboutDescription] = useState<string>("");
    const [aboutImage, setAboutImage] = useState<string>("");
    const [missionTitle, setMissionTitle] = useState<string>("");
    const [missionDesc, setMissionDesc] = useState<string>("");
    const [valuesTitle, setValuesTitle] = useState<string>("");
    const [devotionTitle, setDevotionTitle] = useState<string>("");
    const [devotionDesc, setDevotionDesc] = useState<string>("");
    const [communityTitle, setCommunityTitle] = useState<string>("");
    const [communityDesc, setCommunityDesc] = useState<string>("");
    const [traditionTitle, setTraditionTitle] = useState<string>("");
    const [traditionDesc, setTraditionDesc] = useState<string>("");
    const [serviceTitle, setServiceTitle] = useState<string>("");
    const [serviceDesc, setServiceDesc] = useState<string>("");
    const [bannerTitle, setBannerTitle] = useState<string>("");
    const [bannerImage, setBannerImage] = useState<string>("");
    const [committeeTitle, setCommitteeTitle] = useState<string>("");
    const [committeeDesc, setCommitteeDesc] = useState<string>("");
    const [member1Title, setMember1Title] = useState<string>("");
    const [member2Title, setMember2Title] = useState<string>("");
    const [member3Title, setMember3Title] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const imagesLoaded = useImagesLoaded([heroImage, aboutImage, bannerImage]);

    useEffect(() => {
        if (loading || !imagesLoaded) {
            setGlobalLoading(true);
            return;
        }

        setGlobalLoading(false);
    }, [loading, imagesLoaded, setGlobalLoading]);

    useEffect(() => {
        const fetchAboutContent = async () => {
            setLoading(true);
            try {
                const aboutData = await fetchPageContent("about");
                const homeData = await fetchPageContent("home");
                const lang = language as "en" | "hi" | "mr";

                const getContent = (arr: any[], key: string) =>
                    getContentByLanguage(findContentItem(arr, key), lang);
                const getImg = (arr: any[], key: string) =>
                    getImageUrl(findContentItem(arr, key));

                // Hero section from about page
                setHeroTitle(getContent(aboutData, "hero_title"));
                setHeroSubtitle(getContent(aboutData, "hero_subtitle"));
                setHeroImage(getImg(aboutData, "hero_image"));

                // About section from home page
                setAboutTitle(getContent(homeData, "about_title"));
                setAboutDescription(getContent(homeData, "about_description"));
                setAboutImage(getImg(homeData, "about_image"));

                // Mission section
                setMissionTitle(getContent(aboutData, "mission_title"));
                setMissionDesc(getContent(aboutData, "mission_description"));

                // Values title
                setValuesTitle(getContent(aboutData, "values_title"));

                // Core values
                setDevotionTitle(getContent(aboutData, "devotion_title"));
                setDevotionDesc(getContent(aboutData, "devotion_description"));
                setCommunityTitle(getContent(aboutData, "community_title"));
                setCommunityDesc(
                    getContent(aboutData, "community_description"),
                );
                setTraditionTitle(getContent(aboutData, "tradition_title"));
                setTraditionDesc(
                    getContent(aboutData, "tradition_description"),
                );
                setServiceTitle(getContent(aboutData, "service_title"));
                setServiceDesc(getContent(aboutData, "service_description"));

                // Committee section
                setCommitteeTitle(getContent(aboutData, "committee_title"));
                setCommitteeDesc(
                    getContent(aboutData, "committee_description"),
                );
                setMember1Title(getContent(aboutData, "member1_title"));
                setMember2Title(getContent(aboutData, "member2_title"));
                setMember3Title(getContent(aboutData, "member3_title"));

                // Banner section
                setBannerTitle(getContent(aboutData, "banner_title"));
                setBannerImage(getImg(aboutData, "banner_image"));
            } catch (error) {
                console.error("Error fetching about content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAboutContent();
    }, [language, setGlobalLoading]);

    const values = [
        { icon: Heart, title: devotionTitle, desc: devotionDesc },
        { icon: Users, title: communityTitle, desc: communityDesc },
        { icon: BookOpen, title: traditionTitle, desc: traditionDesc },
        { icon: Star, title: serviceTitle, desc: serviceDesc },
    ];

    const roles = [member1Title, member2Title, member3Title];

    return (
        <HomePageProvider>
            <div className="min-h-screen">
                <Navbar />
                <section className="relative pt-16 min-h-[50vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={heroImage}
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
                            {heroTitle}
                        </motion.h1>
                        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                            {heroSubtitle}
                        </p>
                    </div>
                </section>

                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="rounded-lg overflow-hidden shadow-xl"
                            >
                                <img
                                    src={aboutImage}
                                    alt="Temple interior"
                                    className="w-full h-[450px] object-cover"
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                            >
                                <div className="gold-line mb-4" />
                                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                                    {aboutTitle}
                                </h2>
                                <div className="space-y-4">
                                    {aboutDescription
                                        .split("\n\n")
                                        .map((paragraph, idx) => (
                                            <p
                                                key={idx}
                                                className="text-muted-foreground leading-relaxed"
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-accent mandala-bg">
                    <div className="container mx-auto px-4 text-center">
                        <div className="gold-line mx-auto mb-4" />
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                            {missionTitle}
                        </h2>
                        <p className="text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed">
                            {missionDesc}
                        </p>
                    </div>
                </section>

                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <div className="gold-line mx-auto mb-4" />
                            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                {valuesTitle}
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-4 gap-8">
                            {values.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.1,
                                    }}
                                    className="bg-accent rounded-lg p-6 text-center shadow-md border border-border hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <item.icon
                                            className="text-primary"
                                            size={30}
                                        />
                                    </div>
                                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative py-24 overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={bannerImage}
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/80" />
                    </div>
                    <div className="relative z-10 text-center px-4">
                        <div className="lotus-divider mb-6">
                            <span className="text-3xl">🪷</span>
                        </div>
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="font-heading text-2xl md:text-4xl font-semibold text-primary-foreground max-w-3xl mx-auto leading-relaxed"
                        >
                            {bannerTitle}
                        </motion.h2>
                        <div className="lotus-divider mt-6">
                            <span className="text-3xl">🪷</span>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4 text-center">
                        <div className="gold-line mx-auto mb-4" />
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                            {committeeTitle}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
                            {committeeDesc}
                        </p>
                        <div className="grid md:grid-cols-3 gap-8">
                            {roles.map((role, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-accent rounded-lg p-6 border border-border"
                                >
                                    <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                                        <Users
                                            className="text-primary"
                                            size={32}
                                        />
                                    </div>
                                    <h3 className="font-heading text-lg font-semibold text-foreground">
                                        {role}
                                    </h3>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <DevotionalQuote />
                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default About;
