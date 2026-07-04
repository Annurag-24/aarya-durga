import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/temple/Navbar";
import Footer from "@/components/temple/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLoader } from "@/contexts/LoaderContext";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";
import { RichTextContent } from "@/components/global/RichTextContent";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
    media?: Array<{
        id: number;
        media_id: number;
        media?: { file_url?: string; mime_type?: string };
    }>;
}

interface MediaItem {
    url: string;
    isVideo: boolean;
}

const FacilityDetails = () => {
    const { slug = "" } = useParams();
    const { language } = useLanguage();
    const { setLoading: setGlobalLoading } = useLoader();
    const [facility, setFacility] = useState<ApiFacility | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(
        null,
    );

    const imageUrl = useMemo(
        () =>
            facility?.image?.file_url
                ? constructImageUrl(facility.image.file_url)
                : "",
        [facility],
    );

    const mediaItems = useMemo<MediaItem[]>(() => {
        return (facility?.media || [])
            .map((item) => {
                const path = item.media?.file_url;
                if (!path) return null;
                const mime = item.media?.mime_type;
                const isVideo =
                    mime?.startsWith("video/") === true ||
                    /\.(mp4|webm|mov|ogg|avi|mkv)(\?|$)/i.test(path);
                return {
                    url: constructImageUrl(path),
                    isVideo,
                } as MediaItem;
            })
            .filter((item): item is MediaItem => item !== null);
    }, [facility]);

    const imagesLoaded = useImagesLoaded([
        loading,
        imageUrl,
        ...mediaItems.filter((m) => !m.isVideo).map((m) => m.url),
    ]);

    useEffect(() => {
        if (loading || !imagesLoaded) {
            setGlobalLoading(true);
            return;
        }
        setGlobalLoading(false);
    }, [loading, imagesLoaded, setGlobalLoading]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const response = await client.get<ApiFacility>(
                    `/public/facilities/${slug}`,
                );
                setFacility(response.data);
            } catch (error) {
                console.error("Failed to load facility", error);
                setFacility(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    const title = facility
        ? language === "mr"
            ? facility.title_mr || facility.title_en
            : facility.title_en
        : "";
    const description = facility
        ? language === "mr"
            ? facility.description_mr || facility.description_en
            : facility.description_en
        : "";

    if (!loading && !facility) {
        return (
            <HomePageProvider>
                <div className="min-h-screen">
                    <Navbar />
                    <section className="pt-32 pb-20 container mx-auto px-4 text-center">
                        <h1 className="font-heading text-3xl font-bold text-foreground">
                            Facility not found
                        </h1>
                        <Link to="/" className="mt-6 inline-block">
                            <Button variant="outline" className="gap-2">
                                <ArrowLeft size={14} /> Back to Home
                            </Button>
                        </Link>
                    </section>
                    <Footer />
                </div>
            </HomePageProvider>
        );
    }

    return (
        <HomePageProvider>
            <div className="min-h-screen">
                <Navbar />

                <section className="relative pt-16 min-h-[45vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-contain"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
                    </div>
                    <div className="relative z-10 text-center px-4 py-16">
                        <Link to="/#facilities">
                            <Button
                                variant="outline"
                                size="sm"
                                className="mb-4 gap-2"
                            >
                                <ArrowLeft size={14} /> Back
                            </Button>
                        </Link>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground"
                        >
                            {title}
                        </motion.h1>
                    </div>
                </section>

                <section className="py-16 bg-card">
                    <div className="container mx-auto max-w-5xl px-4">
                        {description ? (
                            <RichTextContent
                                content={description}
                                className="prose prose-lg max-w-none text-foreground text-justify prose-p:text-foreground prose-p:text-justify prose-strong:text-foreground prose-em:text-foreground"
                            />
                        ) : (
                            <p className="text-center text-muted-foreground">
                                More details coming soon.
                            </p>
                        )}
                    </div>
                </section>

                {mediaItems.length > 0 && (
                    <section className="bg-accent py-20">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-10">
                                <div className="gold-line mx-auto mb-4" />
                                <h2 className="font-heading text-3xl font-bold text-foreground">
                                    Photos & Videos
                                </h2>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {mediaItems.map((item, index) => (
                                    <motion.button
                                        type="button"
                                        onClick={() =>
                                            setActiveMediaIndex(index)
                                        }
                                        key={`${item.url}-${index}`}
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.06,
                                        }}
                                        className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {item.isVideo ? (
                                            <>
                                                <video
                                                    src={item.url}
                                                    muted
                                                    playsInline
                                                    preload="metadata"
                                                    className="h-72 w-full bg-black object-contain pointer-events-none"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                                        <div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-foreground ml-1" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <img
                                                src={item.url}
                                                alt={`${title} ${index + 1}`}
                                                className="h-72 w-full object-contain transition-transform group-hover:scale-105"
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <Dialog
                    open={activeMediaIndex !== null}
                    onOpenChange={(open) => {
                        if (!open) setActiveMediaIndex(null);
                    }}
                >
                    <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black border-0 overflow-hidden [&>button]:bg-white/15 [&>button]:hover:bg-white/30 [&>button]:text-white [&>button]:rounded-full [&>button]:p-2 [&>button]:opacity-100 [&>button>svg]:h-5 [&>button>svg]:w-5">
                        {activeMediaIndex !== null &&
                            mediaItems[activeMediaIndex] && (
                                <div className="relative flex items-center justify-center bg-black">
                                    {mediaItems[activeMediaIndex].isVideo ? (
                                        <video
                                            src={mediaItems[activeMediaIndex].url}
                                            controls
                                            autoPlay
                                            playsInline
                                            className="w-full max-h-[85vh] bg-black"
                                        />
                                    ) : (
                                        <img
                                            src={mediaItems[activeMediaIndex].url}
                                            alt={`${title} ${activeMediaIndex + 1}`}
                                            className="w-full max-h-[85vh] object-contain bg-black"
                                        />
                                    )}
                                </div>
                            )}
                    </DialogContent>
                </Dialog>

                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default FacilityDetails;
