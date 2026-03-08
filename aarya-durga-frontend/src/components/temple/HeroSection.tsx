import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePageText } from "@/hooks/content/usePageContent";
import { findContentItem, getImageUrl } from "@/api/helpers";
import { useState, useEffect } from "react";
import { useHomePageData } from "@/contexts/HomePageContext";

const HeroSection = () => {
  const { t, language } = useLanguage();
  const { pageData } = useHomePageData();
  const { text: titleText, isLoading: titleLoading } = usePageText('home', 'hero_title', language as 'en' | 'hi' | 'mr');
  const { text: subtitleText, isLoading: subtitleLoading } = usePageText('home', 'hero_subtitle', language as 'en' | 'hi' | 'mr');
  const { text: descriptionText, isLoading: descriptionLoading } = usePageText('home', 'hero_description', language as 'en' | 'hi' | 'mr');
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  useEffect(() => {
    if (pageData.length > 0) {
      const imageData = findContentItem(pageData, 'hero_image');
      if (imageData) {
        const imageUrl = getImageUrl(imageData);
        if (imageUrl) {
          setBackgroundImage(imageUrl);
        }
      }
    }
  }, [pageData]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={backgroundImage} alt="Aarya Durga Temple" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
      </div>
      <motion.div
        className="absolute top-20 left-10 text-4xl opacity-30"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity }}
      >🪷</motion.div>
      <motion.div
        className="absolute bottom-32 right-16 text-3xl opacity-20"
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity }}
      >🔔</motion.div>
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="lotus-divider mb-6"><span className="text-3xl">🪷</span></div>
          {titleLoading ? (
            <Skeleton className="h-16 w-full mx-auto mb-4 bg-primary-foreground/20" />
          ) : (
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary-foreground mb-4">
              {titleText || t.hero.title}
            </h1>
          )}
          {subtitleLoading ? (
            <Skeleton className="h-8 w-96 mx-auto mb-3 bg-primary-foreground/20" />
          ) : (
            <p className="font-heading text-xl md:text-2xl text-gold-light mb-3 italic">
              {subtitleText || t.hero.subtitle}
            </p>
          )}
          {descriptionLoading ? (
            <Skeleton className="h-6 w-full mx-auto mb-8 bg-primary-foreground/20" />
          ) : (
            <p className="text-primary-foreground/80 text-base md:text-lg max-w-2xl mx-auto mb-8 font-body">
              {descriptionText || t.hero.description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/about"><Button variant="hero" size="lg">{t.hero.explore}</Button></Link>
            <Link to="/events-gallery"><Button variant="heroOutline" size="lg">{t.hero.viewEvents}</Button></Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
