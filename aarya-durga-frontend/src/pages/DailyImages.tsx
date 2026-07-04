import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Navbar from "@/components/temple/Navbar";
import Footer from "@/components/temple/Footer";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useLanguage } from "@/i18n/LanguageContext";
import client from "@/api/client";
import { constructImageUrl } from "@/api/imageUrl";

interface DayImage {
    date: string;
    url: string;
    caption?: string;
}

const formatDate = (iso: string, lang: string) => {
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    const locale = lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-US";
    return d.toLocaleDateString(locale, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const DailyImages = () => {
    const { language } = useLanguage();
    const [images, setImages] = useState<DayImage[]>([]);
    const [selected, setSelected] = useState<DayImage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client
            .get("/public/daily-images")
            .then((res) => {
                const list = Array.isArray(res.data) ? res.data : [];
                const lang = language as "en" | "hi" | "mr";
                const mapped: DayImage[] = list
                    .filter((r) => r.image?.file_url && r.image_date)
                    .map((r) => ({
                        date: (r.image_date as string).slice(0, 10),
                        url: constructImageUrl(r.image.file_url),
                        caption:
                            lang === "mr" ? r.caption_mr || r.caption_en :
                            lang === "hi" ? r.caption_hi || r.caption_en :
                            r.caption_en,
                    }));
                setImages(mapped);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [language]);

    return (
        <HomePageProvider>
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 py-16 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-12 pt-8">
                        <h1 className="font-heading text-4xl font-bold text-foreground mb-3">Daily Image</h1>
                        <div className="gold-line mx-auto" />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
                            ))}
                        </div>
                    ) : images.length === 0 ? (
                        <p className="text-center text-muted-foreground py-20">No images available yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {images.map((img) => (
                                <motion.div
                                    key={img.date}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative aspect-square rounded-xl overflow-hidden shadow-md cursor-pointer"
                                    onClick={() => setSelected(img)}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.date}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3 pt-8">
                                        <p className="text-white text-sm font-medium drop-shadow">
                                            {formatDate(img.date, language)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
                        onClick={() => setSelected(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-primary-foreground"
                            onClick={() => setSelected(null)}
                        >
                            <X size={32} />
                        </button>
                        <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
                            <motion.img
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                src={selected.url}
                                alt={selected.date}
                                className="max-w-full max-h-[80vh] rounded-lg object-contain"
                            />
                            <p className="text-primary-foreground text-base font-medium">
                                {formatDate(selected.date, language)}
                            </p>
                            {selected.caption && (
                                <p className="text-primary-foreground text-sm italic text-center max-w-lg">
                                    {selected.caption}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
        </HomePageProvider>
    );
};

export default DailyImages;
