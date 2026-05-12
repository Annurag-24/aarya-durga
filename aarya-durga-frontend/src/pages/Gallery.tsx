import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/temple/Navbar";
import Footer from "@/components/temple/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLoader } from "@/contexts/LoaderContext";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";
import { RichTextContent } from "@/components/global/RichTextContent";
import {
    fetchPageContent,
    findContentItem,
    getContentByLanguage,
    getImageUrl,
} from "@/api/helpers";
import {
    ApiAlbum,
    fetchPublicAlbums,
    getAlbumCoverUrl,
    getAlbumName,
} from "@/api/galleryAlbums";

const Gallery = () => {
    const { language } = useLanguage();
    const { setLoading: setGlobalLoading } = useLoader();
    const [loading, setLoading] = useState(true);
    const [heroTitle, setHeroTitle] = useState("");
    const [heroSubtitle, setHeroSubtitle] = useState("");
    const [heroImage, setHeroImage] = useState("");
    const [albums, setAlbums] = useState<ApiAlbum[]>([]);

    const imageUrls = useMemo(
        () => [heroImage, ...albums.map((a) => getAlbumCoverUrl(a))].filter(Boolean),
        [heroImage, albums],
    );
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
                const [pageData, albumData] = await Promise.all([
                    fetchPageContent("gallery"),
                    fetchPublicAlbums(),
                ]);
                const lang = language as "en" | "mr";
                const getContent = (key: string) =>
                    getContentByLanguage(findContentItem(pageData, key), lang);
                const getImg = (key: string) =>
                    getImageUrl(findContentItem(pageData, key));

                setHeroTitle(getContent("hero_title"));
                setHeroSubtitle(getContent("hero_subtitle"));
                setHeroImage(getImg("hero_image"));
                setAlbums(albumData.slice().reverse());
            } catch (error) {
                console.error("Failed to load gallery", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [language]);

    return (
        <HomePageProvider>
            <div className="min-h-screen">
                <Navbar />
                <section className="relative pt-16 min-h-[50vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        {heroImage && (
                            <img
                                src={heroImage}
                                alt="Gallery"
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
                    </div>
                    <div className="relative z-10 text-center px-4 py-20">
                        <div className="lotus-divider mb-4">
                            <span className="text-3xl">🪷</span>
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-4"
                        >
                            {heroTitle || "Gallery"}
                        </motion.h1>
                        <RichTextContent
                            content={heroSubtitle}
                            className="mx-auto max-w-2xl text-lg text-primary-foreground/80 prose-p:text-primary-foreground/80 prose-strong:text-primary-foreground prose-em:text-primary-foreground/90"
                        />
                    </div>
                </section>

                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4">
                        {albums.length === 0 ? (
                            <p className="text-center text-muted-foreground">
                                No albums yet.
                            </p>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {albums.map((album, index) => {
                                    const cover = getAlbumCoverUrl(album);
                                    const name = getAlbumName(
                                        album,
                                        language as "en" | "mr",
                                    );
                                    const count = album.media?.length || 0;
                                    return (
                                        <motion.div
                                            key={album.id}
                                            initial={{ opacity: 0, y: 24 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.45,
                                                delay: index * 0.06,
                                            }}
                                        >
                                            <Link
                                                to={`/gallery/${album.slug}`}
                                                className="group block overflow-hidden rounded-[1.75rem] border border-border bg-accent shadow-sm hover:shadow-lg transition-shadow"
                                            >
                                                <div className="aspect-video overflow-hidden bg-muted">
                                                    {cover ? (
                                                        <img
                                                            src={cover}
                                                            alt={name}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                                                            No cover
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-heading text-xl font-semibold text-foreground">
                                                        {name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        {count} item
                                                        {count === 1 ? "" : "s"}
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default Gallery;
