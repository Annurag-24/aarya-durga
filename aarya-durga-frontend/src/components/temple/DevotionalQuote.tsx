import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useEffect } from "react";
import { findContentItem, getContentByLanguage } from "@/api/helpers";
import { useHomePageData } from "@/contexts/HomePageContext";

const DevotionalQuote = () => {
  const { language } = useLanguage();
  const { pageData } = useHomePageData();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    if (pageData.length > 0) {
      const lang = language as 'en' | 'hi' | 'mr';
      const footerTitleData = findContentItem(pageData, 'footer_title');
      const quoteText = getContentByLanguage(footerTitleData, lang);
      setQuote(quoteText);
    }
  }, [pageData, language]);

  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4 text-center">
        <div className="lotus-divider mb-4"><span className="text-2xl">🪷</span></div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="font-heading text-2xl md:text-3xl font-semibold text-foreground italic max-w-2xl mx-auto">
          "{quote}"
        </motion.p>
        <div className="lotus-divider mt-4"><span className="text-2xl">🪷</span></div>
      </div>
    </section>
  );
};

export default DevotionalQuote;
