import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { findContentItem, getContentByLanguage, getImageUrl } from "@/api/helpers";
import { useHomePageData } from "@/contexts/HomePageContext";

const AboutSection = () => {
  const { t, language } = useLanguage();
  const { pageData, loading: contextLoading } = useHomePageData();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    if (pageData.length > 0) {
      const lang = language as 'en' | 'hi' | 'mr';

      const titleItem = findContentItem(pageData, 'about_title');
      const descItem = findContentItem(pageData, 'about_description');
      const imgItem = findContentItem(pageData, 'about_image');

      setTitle(getContentByLanguage(titleItem, lang));
      setDescription(getContentByLanguage(descItem, lang));
      setImage(getImageUrl(imgItem));
    }
  }, [pageData, language]);

  return (
    <section id="about" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="rounded-lg overflow-hidden shadow-xl">
            <img src={image} alt="Temple interior with diyas" className="w-full h-[400px] object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="gold-line mb-4" />
            {contextLoading ? <Skeleton className="h-10 w-40 mb-6" /> : <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">{title}</h2>}
            <div className="space-y-4 mb-6">
              {contextLoading ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </>
              ) : (
                description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed">{paragraph}</p>
                ))
              )}
            </div>
            <Link to="/about"><Button variant="temple">{t.aboutSection.readMore}</Button></Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
