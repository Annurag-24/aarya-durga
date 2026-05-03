import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/temple/Navbar";
import Footer from "@/components/temple/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLoader } from "@/contexts/LoaderContext";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";
import {
    ApiAlbum,
    fetchPublicAlbumBySlug,
    getAlbumCoverUrl,
    getAlbumMediaItems,
    getAlbumName,
} from "@/api/galleryAlbums";

const AlbumDetails = () => {
    const { slug = "" } = useParams();
    const { language } = useLanguage();
    const { setLoading: setGlobalLoading } = useLoader();
    const [album, setAlbum] = useState<ApiAlbum | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(
        null,
    );

    const mediaItems = useMemo(
        () => (album ? getAlbumMediaItems(album) : []),
        [album],
    );

    const imageUrls = useMemo(() => {
        if (!album) return [];
        return [
            getAlbumCoverUrl(album),
            ...mediaItems.filter((m) => !m.isVideo).map((m) => m.url),
        ].filter(Boolean);
    }, [album, mediaItems]);

    const imagesLoaded = useImagesLoaded([loading, ...imageUrls]);

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
                const data = await fetchPublicAlbumBySlug(slug);
                setAlbum(data);
            } catch (error) {
                console.error("Failed to load album", error);
                setAlbum(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    const name = album ? getAlbumName(album, language as "en" | "mr") : "";
    const cover = album ? getAlbumCoverUrl(album) : "";

    return (
        <HomePageProvider>
            <div className="min-h-screen">
                <Navbar />

                <section className="relative pt-16 min-h-[40vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        {cover && (
                            <img
                                src={cover}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
                    </div>
                    <div className="relative z-10 text-center px-4 py-16">
                        <Link to="/gallery">
                            <Button
                                variant="outline"
                                size="sm"
                                className="mb-4 gap-2"
                            >
                                <ArrowLeft size={14} /> Back to Gallery
                            </Button>
                        </Link>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground"
                        >
                            {name}
                        </motion.h1>
                    </div>
                </section>

                <section className="bg-accent py-20">
                    <div className="container mx-auto px-4">
                        {mediaItems.length === 0 ? (
                            <p className="text-center text-muted-foreground">
                                No media in this album.
                            </p>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {mediaItems.map((item, index) => (
                                    <motion.button
                                        type="button"
                                        onClick={() => setActiveMediaIndex(index)}
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
                                                    className="h-72 w-full bg-black object-cover pointer-events-none"
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
                                                alt={`${name} ${index + 1}`}
                                                className="h-72 w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

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
                                            alt={`${name} ${activeMediaIndex + 1}`}
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

export default AlbumDetails;
