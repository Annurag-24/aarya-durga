import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import client from "@/api/client";
import { constructImageUrl } from "@/api/imageUrl";

interface DailyImageData {
    image: { file_url?: string } | null;
    image_date?: string;
    caption_en?: string;
    caption_hi?: string;
    caption_mr?: string;
}

const formatDate = (iso: string, lang: string) => {
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    const locale = lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-US";
    return d.toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

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
        <motion.section
            className="bg-accent pt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className="container mx-auto px-4">
                <div className="relative rounded-2xl overflow-hidden">
                    <img
                        src={imageUrl}
                        alt="Daily blessing"
                        className="w-full max-h-[480px] object-contain rounded-2xl"
                    />
                    {data.image_date && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-6 py-4 pt-10 rounded-b-2xl">
                            <p className="text-white text-base font-semibold drop-shadow">
                                {formatDate(data.image_date, language)}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {caption && (
                <div className="py-5 text-center">
                    <div className="gold-line mx-auto mb-3" />
                    <p className="font-body text-sm italic text-muted-foreground leading-relaxed">
                        {caption}
                    </p>
                </div>
            )}
        </motion.section>
    );
};

export default DailyImageSection;
