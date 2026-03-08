import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, X } from "lucide-react";
import Navbar from "@/components/temple/Navbar";
import Footer from "@/components/temple/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLoader } from "@/contexts/LoaderContext";
import {
    fetchPageContent,
    findContentItem,
    getContentByLanguage,
    getImageUrl,
} from "@/api/helpers";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";

const EventsGallery = () => {
    const [selected, setSelected] = useState<number | null>(null);
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<"events" | "gallery">(
        (searchParams.get("tab") as "events" | "gallery") || "events",
    );
    const { t, language } = useLanguage();
    const { setLoading: setGlobalLoading } = useLoader();
    const [loading, setLoading] = useState(true);
    const [heroTitle, setHeroTitle] = useState("");
    const [heroSubtitle, setHeroSubtitle] = useState("");
    const [heroImage, setHeroImage] = useState("");
    const [eventsTitle, setEventsTitle] = useState("");
    const [events, setEvents] = useState<
        Array<{
            title: string;
            date: string;
            desc: string;
            category: string;
            image: string;
        }>
    >([]);
    const [galleryImages, setGalleryImages] = useState<
        Array<{ src: string; alt: string }>
    >([]);
    const [bannerQuote, setBannerQuote] = useState("");
    const [bannerImage, setBannerImage] = useState("");

    const visibleImageUrls = useMemo(() => {
        const urls = [heroImage, bannerImage];

        if (activeTab === "events") {
            urls.push(...events.map((event) => event.image));
        } else {
            urls.push(...galleryImages.map((img) => img.src));
        }

        return urls.filter(Boolean);
    }, [heroImage, bannerImage, activeTab, events, galleryImages]);

    const imagesLoaded = useImagesLoaded([loading, ...visibleImageUrls]);

    useEffect(() => {
        if (loading || !imagesLoaded) {
            setGlobalLoading(true);
            return;
        }

        setGlobalLoading(false);
    }, [loading, imagesLoaded, setGlobalLoading]);

    useEffect(() => {
        fetchHeroContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    const fetchHeroContent = async () => {
        setLoading(true);
        try {
            const pageData = await fetchPageContent("events_gallery");
            const lang = language as "en" | "hi" | "mr";

            const getContent = (key: string) =>
                getContentByLanguage(findContentItem(pageData, key), lang);
            const getImg = (key: string) =>
                getImageUrl(findContentItem(pageData, key));

            // Hero content
            setHeroTitle(getContent("hero_title"));
            setHeroSubtitle(getContent("hero_subtitle"));
            setHeroImage(getImg("hero_image"));

            // Events content - dynamically detect all events
            const eventNumbers = new Set<number>();
            pageData.forEach((item: { section_key: string }) => {
                const match = item.section_key.match(/^event_(\d+)_/);
                if (match) {
                    eventNumbers.add(parseInt(match[1], 10));
                }
            });

            const sortedEventNumbers = Array.from(eventNumbers).sort(
                (a, b) => a - b,
            );
            const eventsFromAPI = sortedEventNumbers
                .map((num) => {
                    const name = getContent(`event_${num}_name`);
                    const dateRaw = getContentByLanguage(
                        findContentItem(pageData, `event_${num}_date`),
                        "en",
                    );
                    const desc = getContent(`event_${num}_description`);
                    const tag = getContent(`event_${num}_tag`);

                    const eventImage = getImageUrl(
                        findContentItem(pageData, `event_${num}_image`),
                    );

                    return {
                        title: name,
                        date: dateRaw
                            ? new Date(dateRaw).toLocaleDateString(
                                  language === "en"
                                      ? "en-US"
                                      : language === "hi"
                                        ? "hi-IN"
                                        : "mr-IN",
                                  {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                  },
                              )
                            : "",
                        desc,
                        category: tag,
                        image: eventImage,
                    };
                })
                .filter((e) => e.title);

            setEvents(eventsFromAPI);
            setEventsTitle(getContent("events_title"));

            // Gallery images - dynamically detect all gallery images
            const galleryImageNumbers = new Set<number>();
            pageData.forEach((item: { section_key: string }) => {
                const match = item.section_key.match(/^gallery_(\d+)_/);
                if (match) {
                    galleryImageNumbers.add(parseInt(match[1], 10));
                }
            });

            const sortedGalleryNumbers = Array.from(galleryImageNumbers).sort(
                (a, b) => a - b,
            );
            const galleryFromAPI = sortedGalleryNumbers.map((num) => {
                const galleryImage = getImageUrl(
                    findContentItem(pageData, `gallery_${num}_image`),
                );
                return {
                    src: galleryImage,
                    alt: `Gallery Image ${num}`,
                };
            });

            setGalleryImages(galleryFromAPI);

            // Banner content
            setBannerQuote(getContent("banner_quote"));
            setBannerImage(getImg("banner_image"));
        } catch (error) {
            // Error fetching events & gallery content
        } finally {
            setLoading(false);
        }
    };

    return (
        <HomePageProvider>
            <div className="min-h-screen">
                <Navbar />
                <section className="relative pt-16 min-h-[50vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={heroImage}
                            alt="Temple Events"
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

                <section className="py-6 bg-card border-b border-border sticky top-16 z-40">
                    <div className="container mx-auto px-4 flex justify-center gap-4">
                        <Button
                            variant={
                                activeTab === "events" ? "temple" : "outline"
                            }
                            size="lg"
                            onClick={() => setActiveTab("events")}
                        >
                            {t.eventsGalleryPage.templeEvents}
                        </Button>
                        <Button
                            variant={
                                activeTab === "gallery" ? "temple" : "outline"
                            }
                            size="lg"
                            onClick={() => setActiveTab("gallery")}
                        >
                            {t.eventsGalleryPage.photoGallery}
                        </Button>
                    </div>
                </section>

                {activeTab === "events" && (
                    <section className="py-20 bg-accent mandala-bg">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <div className="gold-line mx-auto mb-4" />
                                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                    {eventsTitle ||
                                        t.eventsGalleryPage.upcomingTitle}
                                </h2>
                            </div>
                            {events.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {events.map((event, i) => (
                                        <motion.div
                                            key={`${event.title}-${i}`}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.5,
                                                delay: i * 0.1,
                                            }}
                                            className="bg-card rounded-lg overflow-hidden shadow-md border border-border hover:shadow-lg transition-shadow group"
                                        >
                                            <div className="overflow-hidden h-52 relative">
                                                <img
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                                                    {event.category}
                                                </span>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
                                                    {event.title}
                                                </h3>
                                                <p className="flex items-center gap-1 text-sm text-secondary mb-3">
                                                    <CalendarDays size={14} />{" "}
                                                    {event.date}
                                                </p>
                                                <p className="text-muted-foreground text-sm">
                                                    {event.desc}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">
                                        No upcoming events at the moment
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === "gallery" && (
                    <section className="py-20 bg-accent mandala-bg">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <div className="gold-line mx-auto mb-4" />
                                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                    {t.eventsGalleryPage.templeMoments}
                                </h2>
                                <p className="text-muted-foreground max-w-xl mx-auto mt-4">
                                    {t.eventsGalleryPage.momentsSubtitle}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {galleryImages.map((img, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.4,
                                            delay: i * 0.06,
                                        }}
                                        className="overflow-hidden rounded-lg cursor-pointer group"
                                        onClick={() => setSelected(i)}
                                    >
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <AnimatePresence>
                            {selected !== null && galleryImages[selected] && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
                                    onClick={() => setSelected(null)}
                                >
                                    <button
                                        className="absolute top-6 right-6 text-primary-foreground"
                                        onClick={() => setSelected(null)}
                                    >
                                        <X size={32} />
                                    </button>
                                    <motion.img
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0.8 }}
                                        src={galleryImages[selected].src}
                                        alt={galleryImages[selected].alt}
                                        className="max-w-full max-h-[85vh] rounded-lg object-contain"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                )}

                <section className="relative py-24 overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={bannerImage}
                            alt="Goddess Durga"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/80" />
                    </div>
                    <div className="relative z-10 text-center px-4">
                        <div className="lotus-divider mb-6">
                            <span className="text-3xl">🪷</span>
                        </div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="font-heading text-2xl md:text-4xl font-semibold text-primary-foreground max-w-3xl mx-auto italic leading-relaxed"
                        >
                            "{bannerQuote || t.eventsGalleryPage.bannerQuote}"
                        </motion.p>
                        <div className="lotus-divider mt-6">
                            <span className="text-3xl">🪷</span>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default EventsGallery;
