import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Navigation, Phone, Sunrise, Moon } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useEffect } from "react";
import { findContentItem, getContentByLanguage, getImageUrl } from "@/api/helpers";
import { useHomePageData } from "@/contexts/HomePageContext";

interface VisitData {
  morningStart: string;
  morningEnd: string;
  eveningStart: string;
  eveningEnd: string;
  templeName: string;
  address: string;
  phone: string;
  email: string;
  latitude: string;
  longitude: string;
  imageUrl?: string;
}

const VisitSection = () => {
  const { t, language } = useLanguage();
  const { pageData } = useHomePageData();
  const [visitData, setVisitData] = useState<VisitData>({
    morningStart: "",
    morningEnd: "",
    eveningStart: "",
    eveningEnd: "",
    templeName: "",
    address: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (pageData.length > 0) {
      const lang = language as 'en' | 'hi' | 'mr';

      const getContent = (key: string) => getContentByLanguage(findContentItem(pageData, key), lang);

      const imageItem = findContentItem(pageData, 'visit_image');
      const imageUrl = getImageUrl(imageItem);

      setVisitData({
        morningStart: getContent('visit_darshan_morning_start'),
        morningEnd: getContent('visit_darshan_morning_end'),
        eveningStart: getContent('visit_darshan_evening_start'),
        eveningEnd: getContent('visit_darshan_evening_end'),
        templeName: getContent('visit_temple_name'),
        address: getContent('visit_address'),
        phone: getContent('visit_phone'),
        email: getContent('visit_email'),
        latitude: getContent('visit_latitude'),
        longitude: getContent('visit_longitude'),
        imageUrl,
      });
    }
  }, [pageData, language]);
  return (
    <section id="visit" className="relative py-0 overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0">
          {visitData.imageUrl && <img src={visitData.imageUrl} alt="Temple view" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/90" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <div className="lotus-divider mb-4"><span className="text-3xl">🪷</span></div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-3">{t.visitSection.title}</motion.h2>
            <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">{t.visitSection.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-border/50">
              <div className="w-14 h-14 rounded-2xl bg-secondary/15 flex items-center justify-center mb-5"><Clock className="text-secondary" size={28} /></div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-5">{t.visitSection.darshanTimings}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent">
                  <Sunrise className="text-secondary shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wide">{t.visitSection.morningDarshan}</p>
                    <p className="text-foreground font-heading font-semibold text-lg">{visitData.morningStart} – {visitData.morningEnd}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent">
                  <Moon className="text-secondary shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wide">{t.visitSection.eveningAarti}</p>
                    <p className="text-foreground font-heading font-semibold text-lg">{visitData.eveningStart} – {visitData.eveningEnd}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-border/50">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5"><MapPin className="text-primary" size={28} /></div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-5">{t.visitSection.templeLocation}</h3>
              <div className="space-y-1 text-muted-foreground mb-6">
                <p className="font-semibold text-foreground">{visitData.templeName}</p>
                <p>{visitData.address}</p>
              </div>
              <Button variant="temple" size="sm" className="w-full" onClick={() => window.open('https://www.google.com/maps?cid=2975436080203355362&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAEYASAB&hl=en-US&source=embed', '_blank')}><Navigation size={14} className="mr-1" />{t.visitSection.getDirections}</Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-border/50">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5"><Phone className="text-primary" size={28} /></div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-5">{t.visitSection.getInTouch}</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-accent">
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">{t.visitSection.phone}</p>
                  <p className="text-foreground font-medium">{visitData.phone}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent">
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">{t.visitSection.email}</p>
                  <p className="text-foreground font-medium text-sm">{visitData.email}</p>
                </div>
              </div>
              <Link to="/contact" className="block mt-5"><Button variant="gold" size="sm" className="w-full">{t.visitSection.contactUs}</Button></Link>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="rounded-2xl overflow-hidden shadow-2xl border-2 border-primary-foreground/20 max-w-4xl mx-auto">
            <iframe title="Temple Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3845.024046!2d73.4323744!3d16.7386302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bea78f02bae4c2f%3A0x294adf59b466d4e2!2sShri%20Aarya%20Durga%20temple%20Devihasol!5e0!3m2!1sen!2sin!4v1" width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisitSection;
