import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/i18n/LanguageContext";
import client from "@/api/client";
import { constructImageUrl } from "@/api/imageUrl";

interface ApiFacility {
    id: number;
    slug: string;
    title_en: string;
    title_mr?: string;
    description_en?: string;
    description_mr?: string;
    image?: { file_url?: string };
    has_details_page?: boolean;
}

const stripHtml = (html: string) =>
    html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const FacilitiesSection = () => {
    const { language } = useLanguage();
    const [facilities, setFacilities] = useState<ApiFacility[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client
            .get<ApiFacility[]>("/public/facilities")
            .then((response) => setFacilities(response.data))
            .catch(() => setFacilities([]))
            .finally(() => setLoading(false));
    }, []);

    const getTitle = (facility: ApiFacility) =>
        language === "mr"
            ? facility.title_mr || facility.title_en
            : facility.title_en;

    const getDescription = (facility: ApiFacility) => {
        const raw =
            language === "mr"
                ? facility.description_mr || facility.description_en
                : facility.description_en;
        return raw ? stripHtml(raw) : "";
    };

    if (!loading && facilities.length === 0) {
        return null;
    }

    return (
        <section id="facilities" className="py-20 bg-card">
            <div className="container mx-auto px-4 text-center">
                <div className="gold-line mx-auto mb-4" />
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12">
                    {language === "mr" ? "सुविधा" : "Facilities"}
                </h2>

                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-72 rounded-[1.5rem]"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {facilities.map((facility, index) => {
                            const imageUrl = facility.image?.file_url
                                ? constructImageUrl(facility.image.file_url)
                                : "";
                            const description = getDescription(facility);
                            return (
                                <motion.div
                                    key={facility.id}
                                    className="h-full"
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.45,
                                        delay: index * 0.08,
                                    }}
                                >
                                    {(() => {
                                        const cardInner = (
                                            <>
                                                <div className="aspect-video overflow-hidden bg-muted">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={getTitle(facility)}
                                                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                                                            No image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-heading text-xl font-semibold text-foreground">
                                                        {getTitle(facility)}
                                                    </h3>
                                                    {description && (
                                                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                                                            {description}
                                                        </p>
                                                    )}
                                                </div>
                                            </>
                                        );
                                        const cardClass =
                                            "group flex flex-col h-full overflow-hidden rounded-[1.5rem] border border-border bg-accent text-left shadow-sm";
                                        if (facility.has_details_page) {
                                            return (
                                                <Link
                                                    to={`/facilities/${facility.slug}`}
                                                    className={`${cardClass} hover:shadow-lg transition-shadow`}
                                                >
                                                    {cardInner}
                                                </Link>
                                            );
                                        }
                                        return (
                                            <div className={cardClass}>
                                                {cardInner}
                                            </div>
                                        );
                                    })()}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FacilitiesSection;
