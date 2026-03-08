import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/i18n/LanguageContext";
import { getImageUrl, findContentItem } from "@/api/helpers";
import { useEventsGalleryPageData } from "@/contexts/EventsGalleryPageContext";

interface GalleryImage {
  src: string;
  alt: string;
}

const GallerySection = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const { t } = useLanguage();
  const { pageData, loading } = useEventsGalleryPageData();

  useEffect(() => {
    if (pageData.length > 0) {
      // Detect all gallery image indices
      const galleryIndices = new Set<number>();
      pageData.forEach((item: { section_key: string }) => {
        const match = item.section_key.match(/^gallery_(\d+)_/);
        if (match) galleryIndices.add(parseInt(match[1], 10));
      });

      // Get sorted gallery images (max 6)
      const galleryImages: GalleryImage[] = Array.from(galleryIndices)
        .sort((a, b) => a - b)
        .slice(0, 6)
        .map((num) => {
          const imageItem = findContentItem(pageData, `gallery_${num}_image`);
          return {
            src: getImageUrl(imageItem),
            alt: `Gallery Image ${num}`,
          };
        })
        .filter((img) => img.src);

      setImages(galleryImages);
    }
  }, [pageData]);

  return (
    <section id="gallery" className="py-20 bg-accent mandala-bg">
      <div className="container mx-auto px-4 text-center">
        <div className="gold-line mx-auto mb-4" />
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12">{t.gallerySection.title}</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 md:h-64 rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="overflow-hidden rounded-lg cursor-pointer group" onClick={() => setSelected(i)}>
                  <img src={img.src} alt={img.alt} className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>
            <div className="mt-12">
              <Link to="/events-gallery?tab=gallery">
                <Button variant="temple" size="lg">View All Gallery</Button>
              </Link>
            </div>
          </>
        )}
      </div>
      <AnimatePresence>
        {selected !== null && images[selected] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <button className="absolute top-6 right-6 text-primary-foreground" onClick={() => setSelected(null)}><X size={32} /></button>
            <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} src={images[selected].src} alt={images[selected].alt} className="max-w-full max-h-[85vh] rounded-lg object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
