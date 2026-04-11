import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useEffect } from "react";
import { getContentByLanguage, findContentItem } from "@/api/helpers";
import { useEventsGalleryPageData } from "@/contexts/EventsGalleryPageContext";
import {
    ApiEvent,
    fetchPublicEvents,
    getEventCoverImageUrl,
    getLocalizedEventValue,
} from "@/api/events";

const EventsSection = () => {
    const { language } = useLanguage();
    const { pageData, loading } = useEventsGalleryPageData();
    const [title, setTitle] = useState<string>("");
    const [events, setEvents] = useState<ApiEvent[]>([]);

    useEffect(() => {
        if (pageData.length > 0) {
            const lang = language as "en" | "mr";
            const titleData = findContentItem(pageData, "events_title");
            if (titleData) {
                setTitle(getContentByLanguage(titleData, lang));
            }
        }
    }, [pageData, language]);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchPublicEvents();
                setEvents(data.slice(0, 3));
            } catch (error) {
                console.error("Failed to load home events", error);
            }
        };

        loadEvents();
    }, []);

    return (
        <section id="events" className="py-20 bg-card">
            <div className="container mx-auto px-4 text-center">
                <div className="gold-line mx-auto mb-4" />
                {loading ? (
                    <Skeleton className="mx-auto mb-12 h-10 w-64" />
                ) : (
                    <h2 className="mb-12 font-heading text-3xl font-bold text-foreground md:text-4xl">
                        {title}
                    </h2>
                )}
                <div className="grid gap-8 md:grid-cols-3 mb-10">
                    {events.map((event, i) => {
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
                        const dateLabel =
                            getLocalizedEventValue(
                                event,
                                "date_label",
                                language as "en" | "mr",
                            ) ||
                            (event.event_date
                                ? new Date(event.event_date).toLocaleDateString(
                                      language === "mr" ? "mr-IN" : "en-US",
                                      {
                                          year: "numeric",
                                          month: "short",
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
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                className="overflow-hidden rounded-lg border border-border bg-accent shadow-md transition-shadow group hover:shadow-lg"
                            >
                                <div className="overflow-hidden h-52">
                                    <img
                                        src={getEventCoverImageUrl(event)}
                                        alt={title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-5 text-left">
                                    <h3 className="mb-1 font-heading text-xl font-semibold text-foreground">
                                        {title}
                                    </h3>
                                    <p className="mb-2 flex items-center gap-1 text-sm text-gold">
                                        <CalendarDays size={14} /> {dateLabel}
                                    </p>
                                    <p className="line-clamp-3 text-sm text-muted-foreground">
                                        {summary.replace(/<[^>]+>/g, "")}
                                    </p>
                                    {event.slug && (
                                        <Link
                                            to={`/events-gallery/${event.slug}`}
                                            className="mt-4 inline-block text-sm font-semibold text-primary"
                                        >
                                            View Details
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                <Link to="/events-gallery">
                    <Button variant="temple" size="lg">
                        View All Events
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default EventsSection;
