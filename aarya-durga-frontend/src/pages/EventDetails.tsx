import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Clock3, MapPin } from "lucide-react";
import Navbar from "@/components/temple/Navbar";
import Footer from "@/components/temple/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLoader } from "@/contexts/LoaderContext";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";
import { RichTextContent } from "@/components/global/RichTextContent";
import {
    ApiEvent,
    fetchPublicEventBySlug,
    getEventCoverImageUrl,
    getEventGalleryUrls,
    getLocalizedEventValue,
} from "@/api/events";

const EventDetails = () => {
    const { slug = "" } = useParams();
    const { language } = useLanguage();
    const { setLoading: setGlobalLoading } = useLoader();
    const [event, setEvent] = useState<ApiEvent | null>(null);
    const [loading, setLoading] = useState(true);

    const imageUrls = useMemo(() => {
        if (!event) {
            return [];
        }

        return [
            getEventCoverImageUrl(event),
            ...getEventGalleryUrls(event),
        ].filter(Boolean);
    }, [event]);

    const imagesLoaded = useImagesLoaded([loading, ...imageUrls]);

    useEffect(() => {
        if (loading || !imagesLoaded) {
            setGlobalLoading(true);
            return;
        }

        setGlobalLoading(false);
    }, [imagesLoaded, loading, setGlobalLoading]);

    useEffect(() => {
        const loadEvent = async () => {
            setLoading(true);
            try {
                const data = await fetchPublicEventBySlug(slug);
                setEvent(data);
            } catch (error) {
                console.error("Failed to load event details", error);
                setEvent(null);
            } finally {
                setLoading(false);
            }
        };

        loadEvent();
    }, [slug]);

    if (!event && !loading) {
        return (
            <HomePageProvider>
                <div className="min-h-screen">
                    <Navbar />
                    <section className="pt-32 pb-20 bg-card">
                        <div className="container mx-auto px-4 text-center">
                            <h1 className="font-heading text-4xl font-bold text-foreground">
                                Event not found
                            </h1>
                            <p className="mt-4 text-muted-foreground">
                                The event you are looking for is unavailable.
                            </p>
                            <Link to="/events-gallery">
                                <Button variant="temple" className="mt-8">
                                    Back to Events
                                </Button>
                            </Link>
                        </div>
                    </section>
                    <Footer />
                </div>
            </HomePageProvider>
        );
    }

    const currentLanguage = language as "en" | "mr";
    const title = event
        ? getLocalizedEventValue(event, "title", currentLanguage)
        : "";
    const summary = event
        ? getLocalizedEventValue(event, "summary", currentLanguage)
        : "";
    const details = event
        ? getLocalizedEventValue(event, "details", currentLanguage) ||
          getLocalizedEventValue(event, "description", currentLanguage)
        : "";
    const location = event
        ? getLocalizedEventValue(event, "location", currentLanguage)
        : "";
    const time = event
        ? getLocalizedEventValue(event, "time", currentLanguage)
        : "";
    const dateLabel = event
        ? getLocalizedEventValue(event, "date_label", currentLanguage) ||
          (event.event_date
              ? new Date(event.event_date).toLocaleDateString(
                    currentLanguage === "mr" ? "mr-IN" : "en-US",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    },
                )
              : "")
        : "";

    return (
        <HomePageProvider>
            <div className="min-h-screen">
                <Navbar />

                <section className="relative pt-16 min-h-[58vh] overflow-hidden">
                    {event && (
                        <>
                            <img
                                src={getEventCoverImageUrl(event)}
                                alt={title}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground/90" />
                        </>
                    )}
                    <div className="relative z-10 container mx-auto px-4 py-24">
                        <Link
                            to="/events-gallery"
                            className="mb-8 inline-flex items-center gap-2 text-primary-foreground/90 transition-opacity hover:opacity-80"
                        >
                            <ArrowLeft size={18} />
                            Back to Events
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl"
                        >
                            <span className="inline-flex rounded-full bg-primary px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground">
                                {event?.category}
                            </span>
                            <h1 className="mt-6 font-heading text-4xl md:text-6xl font-bold text-primary-foreground">
                                {title}
                            </h1>
                            <RichTextContent
                                content={summary}
                                className="mt-6 max-w-3xl text-lg text-primary-foreground/85 prose-p:text-primary-foreground/85 prose-strong:text-primary-foreground prose-em:text-primary-foreground/90"
                            />

                            <div className="mt-8 flex flex-wrap gap-6 text-sm text-primary-foreground/85">
                                {dateLabel && (
                                    <p className="flex items-center gap-2">
                                        <CalendarDays size={18} />
                                        {dateLabel}
                                    </p>
                                )}
                                {time && (
                                    <p className="flex items-center gap-2">
                                        <Clock3 size={18} />
                                        {time}
                                    </p>
                                )}
                                {location && (
                                    <p className="flex items-center gap-2">
                                        <MapPin size={18} />
                                        {location}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="bg-card py-20">
                    <div className="container mx-auto grid gap-14 px-4 lg:grid-cols-[minmax(0,1fr)_340px]">
                        <div>
                            <div className="gold-line mb-4" />
                            <h2 className="font-heading text-3xl font-bold text-foreground">
                                Event Details
                            </h2>
                            <RichTextContent
                                content={details}
                                className="mt-8 text-muted-foreground prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-em:text-muted-foreground"
                            />
                        </div>

                        <aside className="rounded-[2rem] border border-border bg-accent p-8 shadow-sm">
                            <h3 className="font-heading text-2xl font-bold text-foreground">
                                Event Information
                            </h3>
                            <div className="mt-8 space-y-6 text-sm">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                        Category
                                    </p>
                                    <p className="mt-2 text-base text-foreground">
                                        {event?.category}
                                    </p>
                                </div>
                                {dateLabel && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                            Date
                                        </p>
                                        <p className="mt-2 text-base text-foreground">
                                            {dateLabel}
                                        </p>
                                    </div>
                                )}
                                {time && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                            Time
                                        </p>
                                        <p className="mt-2 text-base text-foreground">
                                            {time}
                                        </p>
                                    </div>
                                )}
                                {location && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                            Location
                                        </p>
                                        <p className="mt-2 text-base text-foreground">
                                            {location}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </section>

                {event && getEventGalleryUrls(event).length > 0 && (
                    <section className="bg-accent py-20">
                        <div className="container mx-auto px-4">
                            <div className="text-center">
                                <div className="gold-line mx-auto mb-4" />
                                <h2 className="font-heading text-3xl font-bold text-foreground">
                                    Event Gallery
                                </h2>
                            </div>

                            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {getEventGalleryUrls(event).map((imageUrl, index) => (
                                    <motion.div
                                        key={`${imageUrl}-${index}`}
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.06,
                                        }}
                                        className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm"
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`${title} gallery ${index + 1}`}
                                            className="h-72 w-full object-cover"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default EventDetails;
