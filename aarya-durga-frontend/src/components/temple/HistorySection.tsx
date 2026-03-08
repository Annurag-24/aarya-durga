import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Landmark, TreePalm, Flame } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useEffect } from "react";
import { findContentItem, getContentByLanguage } from "@/api/helpers";
import { useHomePageData } from "@/contexts/HomePageContext";

const HistorySection = () => {
  const { t, language } = useLanguage();
  const { pageData, loading: contextLoading } = useHomePageData();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [cards, setCards] = useState([
    { title: "", desc: "" },
    { title: "", desc: "" },
    { title: "", desc: "" },
  ]);

  // Hardcoded icons
  const icons = [Landmark, TreePalm, Flame];

  useEffect(() => {
    if (pageData.length > 0) {
      const lang = language as 'en' | 'hi' | 'mr';

      const titleData = findContentItem(pageData, 'history_title');
      const descriptionData = findContentItem(pageData, 'history_description');
      const card1TitleData = findContentItem(pageData, 'history_card1_title');
      const card1DescData = findContentItem(pageData, 'history_card1_description');
      const card2TitleData = findContentItem(pageData, 'history_card2_title');
      const card2DescData = findContentItem(pageData, 'history_card2_description');
      const card3TitleData = findContentItem(pageData, 'history_card3_title');
      const card3DescData = findContentItem(pageData, 'history_card3_description');

      setTitle(getContentByLanguage(titleData, lang));
      setDescription(getContentByLanguage(descriptionData, lang));
      setCards([
        {
          title: getContentByLanguage(card1TitleData, lang),
          desc: getContentByLanguage(card1DescData, lang),
        },
        {
          title: getContentByLanguage(card2TitleData, lang),
          desc: getContentByLanguage(card2DescData, lang),
        },
        {
          title: getContentByLanguage(card3TitleData, lang),
          desc: getContentByLanguage(card3DescData, lang),
        },
      ]);
    }
  }, [pageData, language]);

  return (
    <section id="history" className="py-20 bg-accent mandala-bg">
      <div className="container mx-auto px-4 text-center">
        <div className="gold-line mx-auto mb-4" />
        {contextLoading ? (
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
        ) : (
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
        )}
        {contextLoading ? (
          <Skeleton className="h-6 w-96 mx-auto mb-12" />
        ) : (
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">{description}</p>
        )}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {cards.map((item, i) => {
            const IconComponent = icons[i];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} className="bg-card rounded-lg p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  {IconComponent && <IconComponent className="text-primary" size={28} />}
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
        <Link to="/history"><Button variant="gold" size="lg">{t.historySection.learnMore}</Button></Link>
      </div>
    </section>
  );
};

export default HistorySection;
