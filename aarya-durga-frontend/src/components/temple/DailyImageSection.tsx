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
        <motion.section
            className="bg-accent pt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className="container mx-auto px-4">
                <img
                    src={imageUrl}
                    alt="Daily blessing"
                    className="w-full max-h-[480px] object-cover rounded-2xl"
                />
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
