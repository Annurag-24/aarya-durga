import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { RichTextContent } from "@/components/global/RichTextContent";
import { useState, useEffect } from "react";
import {
    findContentItem,
    getContentByLanguage,
    getImageUrl,
} from "@/api/helpers";
import { useHomePageData } from "@/contexts/HomePageContext";
import client from "@/api/client";
import { constructImageUrl } from "@/api/imageUrl";

interface AboutSectionProps {
    showReadMore?: boolean;
}

const AboutSection = ({ showReadMore = true }: AboutSectionProps) => {
    const { t, language } = useLanguage();
    const { pageData, loading: contextLoading } = useHomePageData();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [dailyImage, setDailyImage] = useState<{ url: string; caption?: string } | null>(null);

    useEffect(() => {
        if (pageData.length > 0) {
            const lang = language as "en" | "hi" | "mr";

            const titleItem = findContentItem(pageData, "about_title");
            const descItem = findContentItem(pageData, "about_description");
            const imgItem = findContentItem(pageData, "about_image");

            setTitle(getContentByLanguage(titleItem, lang));
            setDescription(getContentByLanguage(descItem, lang));
            setImage(getImageUrl(imgItem));
        }
    }, [pageData, language]);

    useEffect(() => {
        client
            .get("/public/daily-image")
            .then((res) => {
                const di = res.data;
                if (di?.image?.file_url) {
                    const lang = language as "en" | "hi" | "mr";
                    const caption =
                        lang === "mr" ? di.caption_mr || di.caption_en :
                        lang === "hi" ? di.caption_hi || di.caption_en :
                        di.caption_en;
                    setDailyImage({ url: constructImageUrl(di.image.file_url), caption });
                }
            })
            .catch(() => setDailyImage(null));
    }, [language]);

    return (
        <section id="about" className="py-20 bg-card">
            <div className="container mx-auto px-4">
                <div className={`grid gap-8 items-stretch ${dailyImage ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                    {/* Daily Image */}
                    {dailyImage && (
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="group relative flex flex-col rounded-lg overflow-hidden shadow-xl"
                        >
                            <img
                                src={dailyImage.url}
                                alt="Daily blessing"
                                className="w-full h-[400px] object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                <Link
                                    to="/daily-images"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <Button variant="temple">View All</Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* About Image */}
                    <motion.div
                        initial={{ opacity: 0, x: dailyImage ? 0 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: dailyImage ? 0.1 : 0 }}
                        className="rounded-lg overflow-hidden shadow-xl"
                    >
                        <img
                            src={image}
                            alt="Temple interior with diyas"
                            className="w-full h-[400px] object-cover"
                        />
                    </motion.div>

                    {/* About Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex flex-col justify-center"
                    >
                        <div className="gold-line mb-4" />
                        {contextLoading ? (
                            <Skeleton className="h-10 w-40 mb-6" />
                        ) : (
                            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                                {title}
                            </h2>
                        )}
                        <div className="space-y-4 mb-6 max-h-48 overflow-y-auto">
                            {contextLoading ? (
                                <>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </>
                            ) : (
                                <RichTextContent
                                    content={description}
                                    className="text-muted-foreground"
                                />
                            )}
                        </div>
                        {showReadMore && (
                            <Link to="/about">
                                <Button variant="temple">
                                    {t.aboutSection.readMore}
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
