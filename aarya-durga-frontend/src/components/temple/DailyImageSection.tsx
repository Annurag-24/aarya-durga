import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import client from "@/api/client";
import { constructImageUrl } from "@/api/imageUrl";

interface DailyImageData {
    image: { file_url?: string } | null;
    caption_en?: string;
    caption_hi?: string;
    caption_mr?: string;
}

const DailyImageSection = () => {
    const { language } = useLanguage();
    const [data, setData] = useState<DailyImageData | null>(null);

    useEffect(() => {
        client
            .get<DailyImageData>("/public/daily-image")
            .then((res) => setData(res.data))
            .catch(() => setData(null));
    }, []);

    if (!data?.image?.file_url) return null;

    const imageUrl = constructImageUrl(data.image.file_url);
    const caption =
        language === "mr"
            ? data.caption_mr || data.caption_en
            : language === "hi"
            ? data.caption_hi || data.caption_en
            : data.caption_en;

    return (
        <section className="py-12 bg-accent">
            <div className="container mx-auto px-4 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg overflow-hidden rounded-2xl shadow-xl bg-card"
                >
                    <img
                        src={imageUrl}
                        alt="Daily blessing"
                        className="w-full h-72 object-cover"
                    />
                    {caption && (
                        <div className="px-6 py-5 text-center">
                            <div className="gold-line mx-auto mb-3" />
                            <p className="font-body text-sm italic text-muted-foreground leading-relaxed">
                                {caption}
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default DailyImageSection;
