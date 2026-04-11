import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock3, MapPin, X } from "lucide-react";
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
import { RichTextContent } from "@/components/global/RichTextContent";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";
import {
    ApiEvent,
    fetchPublicEvents,
    getEventCoverImageUrl,
    getLocalizedEventValue,
} from "@/api/events";

const EventsGallery = () => {
    const [selected, setSelected] = useState<number | null>(null);
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<"events" | "gallery">(
        (searchParams.get("tab") as "events" | "gallery") || "events",
    );
    const [eventFilter, setEventFilter] = useState<"upcoming" | "past">(
        "upcoming",
    );
    const { t, language } = useLanguage();
    const { setLoading: setGlobalLoading } = useLoader();
    const [loading, setLoading] = useState(true);
    const [heroTitle, setHeroTitle] = useState("");
    const [heroSubtitle, setHeroSubtitle] = useState("");
    const [heroImage, setHeroImage] = useState("");
    const [eventsTitle, setEventsTitle] = useState("");
    const [galleryTitle, setGalleryTitle] = useState("");
    const [gallerySubtitle, setGallerySubtitle] = useState("");
    const [events, setEvents] = useState<ApiEvent[]>([]);
    const [galleryImages, setGalleryImages] = useState<
        Array<{ src: string; alt: string }>
    >([]);

    const visibleImageUrls = useMemo(() => {
        const urls = [heroImage];

        if (activeTab === "events") {
            urls.push(...events.map((event) => getEventCoverImageUrl(event)));
        } else {
            urls.push(...galleryImages.map((img) => img.src));
        }

        return urls.filter(Boolean);
    }, [heroImage, activeTab, events, galleryImages]);

    const imagesLoaded = useImagesLoaded([loading, ...visibleImageUrls]);

    const filteredEvents = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return events.filter((event) => {
            if (!event.event_date) {
                return eventFilter === "upcoming";
            }

            const eventDate = new Date(event.event_date);
            eventDate.setHours(0, 0, 0, 0);

            if (eventFilter === "upcoming") {
                return eventDate >= today;
            }

            return eventDate < today;
        });
    }, [events, eventFilter]);

    useEffect(() => {
        if (loading || !imagesLoaded) {
            setGlobalLoading(true);
            return;
        }

        setGlobalLoading(false);
    }, [loading, imagesLoaded, setGlobalLoading]);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const [pageData, publicEvents] = await Promise.all([
                    fetchPageContent("events_gallery"),
                    fetchPublicEvents(),
                ]);
                const lang = language as "en" | "mr";

                const getContent = (key: string) =>
                    getContentByLanguage(findContentItem(pageData, key), lang);
                const getImg = (key: string) =>
                    getImageUrl(findContentItem(pageData, key));

                setHeroTitle(getContent("hero_title"));
                setHeroSubtitle(getContent("hero_subtitle"));
                setHeroImage(getImg("hero_image"));
                setEventsTitle(getContent("events_title"));
                setGalleryTitle(getContent("gallery_title"));
                setGallerySubtitle(getContent("gallery_subtitle"));
                setEvents(publicEvents);

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
                setGalleryImages(
                    sortedGalleryNumbers.map((num) => ({
                        src: getImageUrl(
                            findContentItem(pageData, `gallery_${num}_image`),
                        ),
                        alt: `Gallery Image ${num}`,
                    })),
                );
            } catch (error) {
                console.error("Error fetching events gallery content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [language, setGlobalLoading]);

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
                        <RichTextContent
                            content={heroSubtitle}
                            className="mx-auto max-w-2xl text-lg text-primary-foreground/80 prose-p:text-primary-foreground/80 prose-strong:text-primary-foreground prose-em:text-primary-foreground/90"
                        />
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
                            <div className="relative mb-12">
                                <div className="text-center">
                                    <div className="gold-line mx-auto mb-4" />
                                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                        {eventsTitle ||
                                            t.eventsGalleryPage.upcomingTitle}
                                    </h2>
                                </div>

                                <div className="mt-6 flex justify-center md:absolute md:right-0 md:top-0 md:mt-0">
                                    <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEventFilter("upcoming")
                                            }
                                            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                                eventFilter === "upcoming"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            {language === "mr"
                                                ? "आगामी"
                                                : "Upcoming"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEventFilter("past")
                                            }
                                            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                                eventFilter === "past"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            {language === "mr" ? "मागील" : "Past"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {filteredEvents.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredEvents.map((event, i) => {
                                        const title = getLocalizedEventValue(
                                            event,
                                            "title",
                                            language as "en" | "mr",
                                        );
                                        const summary =
                                            getLocalizedEventValue(
                                                event,
                                                "summary",
                                                language as "en" | "mr",
                                            ) ||
                                            getLocalizedEventValue(
                                                event,
                                                "description",
                                                language as "en" | "mr",
                                            );
                                        const location =
                                            getLocalizedEventValue(
                                                event,
                                                "location",
                                                language as "en" | "mr",
                                            );
                                        const time = getLocalizedEventValue(
                                            event,
                                            "time",
                                            language as "en" | "mr",
                                        );
                                        const dateLabel =
                                            getLocalizedEventValue(
                                                event,
                                                "date_label",
                                                language as "en" | "mr",
                                            ) ||
                                            (event.event_date
                                                ? new Date(
                                                      event.event_date,
                                                  ).toLocaleDateString(
                                                      language === "mr"
                                                          ? "mr-IN"
                                                          : "en-US",
                                                      {
                                                          year: "numeric",
                                                          month: "long",
                                                          day: "numeric",
                                                      },
                                                  )
                                                : "");

                                        return (
                                            <motion.div
                                                key={event.id}
                                                initial={{ opacity: 0, y: 30 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.08,
                                                }}
                                                className="bg-card rounded-lg overflow-hidden shadow-md border border-border hover:shadow-lg transition-shadow group"
                                            >
                                                <div className="overflow-hidden h-52 relative">
                                                    <img
                                                        src={getEventCoverImageUrl(
                                                            event,
                                                        )}
                                                        alt={title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                                                        {event.category}
                                                    </span>
                                                </div>

                                                <div className="p-6 flex flex-col">
                                                    <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
                                                        {title}
                                                    </h3>

                                                    {dateLabel && (
                                                        <p className="flex items-center gap-1 text-sm text-secondary mb-3">
                                                            <CalendarDays
                                                                size={14}
                                                            />
                                                            {dateLabel}
                                                        </p>
                                                    )}

                                                    <RichTextContent
                                                        content={summary}
                                                        className="text-sm text-muted-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-em:text-muted-foreground"
                                                    />

                                                    {(time || location) && (
                                                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                                            {time && (
                                                                <p className="flex items-center gap-2">
                                                                    <Clock3
                                                                        size={
                                                                            15
                                                                        }
                                                                    />
                                                                    {time}
                                                                </p>
                                                            )}
                                                            {location && (
                                                                <p className="flex items-center gap-2">
                                                                    <MapPin
                                                                        size={
                                                                            15
                                                                        }
                                                                    />
                                                                    {location}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="mt-5">
                                                        <Link
                                                            to={`/events-gallery/${event.slug}`}
                                                        >
                                                            <Button
                                                                variant="temple"
                                                                size="sm"
                                                            >
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">
                                        {eventFilter === "upcoming"
                                            ? language === "mr"
                                                ? "सध्या कोणतेही आगामी कार्यक्रम नाहीत"
                                                : "No upcoming events at the moment"
                                            : language === "mr"
                                              ? "सध्या कोणतेही मागील कार्यक्रम नाहीत"
                                              : "No past events at the moment"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === "gallery" && (
                    <section className="py-20 bg-card">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <div className="gold-line mx-auto mb-4" />
                                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                                    {galleryTitle ||
                                        t.eventsGalleryPage.templeMoments}
                                </h2>
                                <RichTextContent
                                    content={
                                        gallerySubtitle ||
                                        t.eventsGalleryPage.momentsSubtitle
                                    }
                                    className="mx-auto max-w-2xl text-muted-foreground"
                                />
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {galleryImages.map((image, index) => (
                                    <motion.button
                                        key={`${image.src}-${index}`}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.06,
                                        }}
                                        onClick={() => setSelected(index)}
                                        className="group overflow-hidden rounded-[1.75rem] border border-border bg-accent text-left shadow-sm"
                                    >
                                        <div className="h-80 overflow-hidden">
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <AnimatePresence>
                    {selected !== null && galleryImages[selected] && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
                            onClick={() => setSelected(null)}
                        >
                            <button
                                type="button"
                                className="absolute right-6 top-6 text-white"
                                onClick={() => setSelected(null)}
                            >
                                <X size={32} />
                            </button>
                            <motion.img
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                src={galleryImages[selected].src}
                                alt={galleryImages[selected].alt}
                                className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
                                onClick={(event) => event.stopPropagation()}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default EventsGallery;
