import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useEffect } from "react";
import { getContentByLanguage, getImageUrl, findContentItem } from "@/api/helpers";
import { useEventsGalleryPageData } from "@/contexts/EventsGalleryPageContext";

interface Event {
  img: string;
  title: string;
  date: string;
  desc: string;
}

const EventsSection = () => {
  const { language } = useLanguage();
  const { pageData, loading } = useEventsGalleryPageData();
  const [title, setTitle] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (pageData.length > 0) {
      const lang = language as 'en' | 'hi' | 'mr';

      // Get title
      const titleData = findContentItem(pageData, 'events_title');
      if (titleData) {
        setTitle(getContentByLanguage(titleData, lang));
      }

      // Get sorted events (max 3)
      const eventIndices = new Set<number>();
      pageData.forEach((item: any) => {
        const match = item.section_key.match(/^event_(\d+)_/);
        if (match) eventIndices.add(parseInt(match[1], 10));
      });

      const sortedIndices = Array.from(eventIndices)
        .sort((a, b) => a - b)
        .slice(0, 3);

      const eventsArray: Event[] = sortedIndices
        .map((idx) => ({
          name: getContentByLanguage(
            findContentItem(pageData, `event_${idx}_name`),
            lang
          ),
          date: getContentByLanguage(
            findContentItem(pageData, `event_${idx}_date`),
            lang
          ),
          desc: getContentByLanguage(
            findContentItem(pageData, `event_${idx}_description`),
            lang
          ),
          img: getImageUrl(
            findContentItem(pageData, `event_${idx}_image`)
          ),
        }))
        .filter((e) => e.name && e.date && e.desc)
        .map((e) => ({
          img: e.img,
          title: e.name,
          date: e.date,
          desc: e.desc,
        }));

      setEvents(eventsArray);
    }
  }, [pageData, language]);

  return (
    <section id="events" className="py-20 bg-card">
      <div className="container mx-auto px-4 text-center">
        <div className="gold-line mx-auto mb-4" />
        {loading ? (
          <Skeleton className="h-10 w-64 mx-auto mb-12" />
        ) : (
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12">{title}</h2>
        )}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {events.map((event, i) => (
            <motion.div key={event.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} className="bg-accent rounded-lg overflow-hidden shadow-md border border-border hover:shadow-lg transition-shadow group">
              <div className="overflow-hidden h-52">
                <img src={event.img} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 text-left">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-1">{event.title}</h3>
                <p className="flex items-center gap-1 text-sm text-gold mb-2"><CalendarDays size={14} /> {event.date}</p>
                <p className="text-muted-foreground text-sm">{event.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <Link to="/events-gallery"><Button variant="temple" size="lg">View All Events</Button></Link>
      </div>
    </section>
  );
};

export default EventsSection;
