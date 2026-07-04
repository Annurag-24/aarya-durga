import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/i18n/LanguageContext";
import {
    ApiAlbum,
    fetchPublicAlbums,
    getAlbumName,
} from "@/api/galleryAlbums";
import { constructImageUrl } from "@/api/imageUrl";

interface GalleryTile {
    src: string;
    albumName: string;
    albumSlug: string;
}

const GallerySection = () => {
    const { t, language } = useLanguage();
    const [albums, setAlbums] = useState<ApiAlbum[]>([]);
    const [tiles, setTiles] = useState<GalleryTile[]>([]);
    const [selected, setSelected] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPublicAlbums()
            .then((data) => setAlbums(data))
            .catch(() => setAlbums([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const collected: GalleryTile[] = [];
        const buckets = albums.map((album) => {
            const albumName = getAlbumName(album, language as "en" | "mr");
            return (album.media || [])
                .map((item) => {
                    const path = item.media?.file_url;
                    if (!path) return null;
                    return {
                        src: constructImageUrl(path),
                        albumName,
                        albumSlug: album.slug,
                    } as GalleryTile;
                })
                .filter((tile): tile is GalleryTile => tile !== null);
        });

        // Round-robin pick across albums so the 6 tiles span various albums.
        let added = true;
        let cursor = 0;
        while (collected.length < 6 && added) {
            added = false;
            for (const bucket of buckets) {
                if (cursor < bucket.length) {
                    collected.push(bucket[cursor]);
                    added = true;
                    if (collected.length >= 6) break;
                }
            }
            cursor += 1;
        }

        setTiles(collected);
    }, [albums, language]);

    if (!loading && tiles.length === 0) {
        return null;
    }

    return (
        <section id="gallery" className="py-20 bg-accent mandala-bg">
            <div className="container mx-auto px-4 text-center">
                <div className="gold-line mx-auto mb-4" />
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12">
                    {t.gallerySection.title}
                </h2>
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-48 md:h-64 rounded-lg"
                            />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {tiles.map((tile, i) => (
                                <motion.div
                                    key={`${tile.src}-${i}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.4,
                                        delay: i * 0.1,
                                    }}
                                    className="relative overflow-hidden rounded-lg cursor-pointer group"
                                    onClick={() => setSelected(i)}
                                >
                                    <img
                                        src={tile.src}
                                        alt={tile.albumName}
                                        className="w-full h-48 md:h-64 object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <span className="absolute top-2 right-2 max-w-[70%] truncate rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
                                        {tile.albumName}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-12">
                            <Link to="/gallery">
                                <Button variant="temple" size="lg">
                                    View All Gallery
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
            <AnimatePresence>
                {selected !== null && tiles[selected] && (
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
                        <motion.img
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            src={tiles[selected].src}
                            alt={tiles[selected].albumName}
                            className="max-w-full max-h-[85vh] rounded-lg object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <span className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-foreground/80 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur">
                            {tiles[selected].albumName}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default GallerySection;
