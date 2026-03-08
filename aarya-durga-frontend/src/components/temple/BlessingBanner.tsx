import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useEffect } from "react";
import { findContentItem, getContentByLanguage, getImageUrl } from "@/api/helpers";
import { useHomePageData } from "@/contexts/HomePageContext";

const BlessingBanner = () => {
  const { language } = useLanguage();
  const { pageData, loading } = useHomePageData();
  const [blessingImage, setBlessingImage] = useState<string>("");
  const [blessingContent, setBlessingContent] = useState<string>("");

  useEffect(() => {
    if (pageData.length > 0) {
      const lang = language as 'en' | 'hi' | 'mr';

      const contentItem = findContentItem(pageData, 'blessing_content');
      const imageItem = findContentItem(pageData, 'blessing_image');

      setBlessingContent(getContentByLanguage(contentItem, lang));
      setBlessingImage(getImageUrl(imageItem));
    }
  }, [pageData, language]);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        {blessingImage && (
          <img src={blessingImage} alt="Goddess Durga" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/80" />
      </div>
      <div className="relative z-10 text-center px-4">
        <div className="lotus-divider mb-6"><span className="text-3xl">🪷</span></div>
        {loading ? (
          <Skeleton className="h-20 w-3/4 mx-auto bg-primary-foreground/20" />
        ) : (
          <motion.p initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="font-heading text-2xl md:text-4xl font-semibold text-primary-foreground max-w-3xl mx-auto italic leading-relaxed">
            "{blessingContent}"
          </motion.p>
        )}
        <div className="lotus-divider mt-6"><span className="text-3xl">🪷</span></div>
      </div>
    </section>
  );
};

export default BlessingBanner;
