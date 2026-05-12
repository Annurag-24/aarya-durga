import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
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
    const [events, setEvents] = useState<ApiEvent[]>([]);
    const visibleImageUrls = useMemo(() => {
        const urls = [heroImage];
        urls.push(...events.map((event) => getEventCoverImageUrl(event)));
        return urls.filter(Boolean);
    }, [heroImage, events]);

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
                setEvents(publicEvents.slice().reverse());
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

                {(
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

                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default EventsGallery;
