import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import client from "@/api/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useLoader } from "@/contexts/LoaderContext";
import { Pencil, Trash2, Plus, X, Upload } from "lucide-react";
import { constructImageUrl } from "@/api/imageUrl";
import media from "@/api/media";

interface HeroContent {
    title_en: string;
    title_mr: string;
    subtitle_en: string;
    subtitle_mr: string;
    image_id?: number;
    existingImageUrl?: string;
}

interface AlbumMediaForm {
    clientKey: string;
    media_id?: number;
    existingUrl?: string;
    mime_type?: string;
}

interface AlbumForm {
    id?: number;
    clientKey: string;
    name_en: string;
    name_mr: string;
    cover_image_id?: number;
    coverImageUrl?: string;
    media: AlbumMediaForm[];
}

const emptyAlbum = (): AlbumForm => ({
    clientKey: `new-album-${Date.now()}`,
    name_en: "",
    name_mr: "",
    cover_image_id: undefined,
    coverImageUrl: undefined,
    media: [],
});

const GalleryPageEditor = () => {
    const { setLoading: setGlobalLoading } = useLoader();
    const [albums, setAlbums] = useState<AlbumForm[]>([]);
    const [heroContent, setHeroContent] = useState<HeroContent>({
        title_en: "",
        title_mr: "",
        subtitle_en: "",
        subtitle_mr: "",
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savingHero, setSavingHero] = useState(false);
    const [activeSection, setActiveSection] = useState<"hero" | "albums">(
        "hero",
    );

    const sections = [
        {
            key: "hero" as const,
            label: "Hero Section",
            description: "Title, subtitle, background image",
        },
        {
            key: "albums" as const,
            label: "Albums",
            description: "Create and manage gallery albums",
        },
    ];
    const [editingAlbum, setEditingAlbum] = useState<AlbumForm | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mediaUploading, setMediaUploading] = useState(false);
    const [mediaDragging, setMediaDragging] = useState(false);

    useEffect(() => {
        fetchAlbums();
        fetchHero();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchHero = async () => {
        try {
            const response = await client.get(
                "/public/page-content/gallery",
            );
            const data = response.data || [];
            const findContent = (key: string) =>
                data.find((item: any) => item.section_key === key);
            const heroImage = findContent("hero_image");
            setHeroContent({
                title_en: findContent("hero_title")?.content_en || "",
                title_mr: findContent("hero_title")?.content_mr || "",
                subtitle_en: findContent("hero_subtitle")?.content_en || "",
                subtitle_mr: findContent("hero_subtitle")?.content_mr || "",
                image_id: heroImage?.image_id,
                existingImageUrl: heroImage?.image?.file_url
                    ? constructImageUrl(heroImage.image.file_url)
                    : undefined,
            });
        } catch {
            // page may not exist yet; ignore
        }
    };

    const saveHero = async () => {
        setSavingHero(true);
        try {
            await Promise.all([
                client.put("/admin/page-content/gallery/hero_title", {
                    content_en: heroContent.title_en,
                    content_hi: heroContent.title_en,
                    content_mr: heroContent.title_mr,
                }),
                client.put("/admin/page-content/gallery/hero_subtitle", {
                    content_en: heroContent.subtitle_en,
                    content_hi: heroContent.subtitle_en,
                    content_mr: heroContent.subtitle_mr,
                }),
                heroContent.image_id
                    ? client.put("/admin/page-content/gallery/hero_image", {
                          image_id: heroContent.image_id,
                      })
                    : Promise.resolve(),
            ]);
            toast.success("Hero section saved");
        } catch {
            toast.error("Failed to save hero section");
        } finally {
            setSavingHero(false);
        }
    };

    const fetchAlbums = async () => {
        setLoading(true);
        setGlobalLoading(true);
        try {
            const response = await client.get("/admin/gallery-albums");
            const data = response.data || [];
            setAlbums(
                data.map((album: any) => {
                    const cover = album.cover_image || album.coverImage;
                    return {
                        id: album.id,
                        clientKey: `album-${album.id}`,
                        name_en: album.name_en || "",
                        name_mr: album.name_mr || "",
                        cover_image_id: album.cover_image_id,
                        coverImageUrl: cover?.file_url
                            ? constructImageUrl(cover.file_url)
                            : undefined,
                        media: (album.media || []).map(
                            (item: any, idx: number) => ({
                                clientKey: `album-${album.id}-media-${item.id || idx}`,
                                media_id: item.media_id,
                                existingUrl: item.media?.file_url
                                    ? constructImageUrl(item.media.file_url)
                                    : undefined,
                                mime_type: item.media?.mime_type,
                            }),
                        ),
                    };
                }),
            );
        } catch (error) {
            toast.error("Failed to load albums");
        } finally {
            setLoading(false);
            setGlobalLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingAlbum(emptyAlbum());
        setIsModalOpen(true);
    };

    const openEditModal = (album: AlbumForm) => {
        setEditingAlbum({ ...album, media: album.media.map((m) => ({ ...m })) });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingAlbum(null);
        setIsModalOpen(false);
    };

    const updateEditingAlbum = (updater: (album: AlbumForm) => AlbumForm) => {
        setEditingAlbum((current) => (current ? updater(current) : current));
    };

    const handleAlbumMediaUpload = async (files: FileList | File[]) => {
        const fileArr = Array.from(files);
        if (fileArr.length === 0) return;
        setMediaUploading(true);
        try {
            const uploaded = await Promise.all(
                fileArr.map(async (file) => {
                    const result: any = await media.upload(file, "gallery");
                    return {
                        clientKey: `album-media-${result.id}-${Date.now()}-${Math.random()}`,
                        media_id: result.id as number,
                        existingUrl: result.file_url
                            ? constructImageUrl(result.file_url)
                            : undefined,
                        mime_type: result.mime_type as string | undefined,
                    } as AlbumMediaForm;
                }),
            );
            updateEditingAlbum((album) => ({
                ...album,
                media: [...album.media, ...uploaded],
            }));
        } catch {
            toast.error("Failed to upload one or more files");
        } finally {
            setMediaUploading(false);
        }
    };

    const saveAlbum = async () => {
        if (!editingAlbum) return;
        if (!editingAlbum.name_en.trim() && !editingAlbum.name_mr.trim()) {
            toast.error("Add an album name before saving");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name_en: editingAlbum.name_en,
                name_hi: editingAlbum.name_en,
                name_mr: editingAlbum.name_mr,
                cover_image_id: editingAlbum.cover_image_id ?? null,
                media_ids: editingAlbum.media
                    .filter((m) => m.media_id)
                    .map((m) => m.media_id as number),
                is_active: true,
            };

            if (editingAlbum.id) {
                await client.put(
                    `/admin/gallery-albums/${editingAlbum.id}`,
                    payload,
                );
            } else {
                await client.post("/admin/gallery-albums", payload);
            }
            toast.success("Album saved successfully");
            closeModal();
            await fetchAlbums();
        } catch {
            toast.error("Failed to save album");
        } finally {
            setSaving(false);
        }
    };

    const deleteAlbum = async (album: AlbumForm) => {
        if (!album.id) {
            setAlbums((prev) =>
                prev.filter((a) => a.clientKey !== album.clientKey),
            );
            return;
        }
        if (!confirm(`Delete album "${album.name_en || album.name_mr}"?`)) return;
        try {
            await client.delete(`/admin/gallery-albums/${album.id}`);
            toast.success("Album deleted");
            await fetchAlbums();
        } catch {
            toast.error("Failed to delete album");
        }
    };

    return (
        <div className="max-w-6xl space-y-8">
            <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">
                    Gallery Page Editor
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Manage gallery hero and albums
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {sections.map((section) => (
                    <Card
                        key={section.key}
                        className={`cursor-pointer transition-all ${
                            activeSection === section.key
                                ? "ring-2 ring-primary"
                                : ""
                        }`}
                        onClick={() => setActiveSection(section.key)}
                    >
                        <CardContent className="pt-6">
                            <p className="text-sm font-semibold text-foreground">
                                {section.label}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {section.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {activeSection === "hero" && (
            <Card>
                <CardContent className="space-y-6 pt-6">
                    <h2 className="font-heading text-xl font-semibold text-foreground">
                        Hero Section
                    </h2>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Title</h3>
                        <Tabs defaultValue="en" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="en">English</TabsTrigger>
                                <TabsTrigger value="mr">मराठी</TabsTrigger>
                            </TabsList>
                            <TabsContent value="en" className="mt-3">
                                <Input
                                    value={heroContent.title_en}
                                    onChange={(e) =>
                                        setHeroContent((prev) => ({
                                            ...prev,
                                            title_en: e.target.value,
                                        }))
                                    }
                                    placeholder="Hero title (English)"
                                />
                            </TabsContent>
                            <TabsContent value="mr" className="mt-3">
                                <Input
                                    value={heroContent.title_mr}
                                    onChange={(e) =>
                                        setHeroContent((prev) => ({
                                            ...prev,
                                            title_mr: e.target.value,
                                        }))
                                    }
                                    placeholder="हिरो शीर्षक (मराठी)"
                                />
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">
                            Subtitle
                        </h3>
                        <Tabs defaultValue="en" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="en">English</TabsTrigger>
                                <TabsTrigger value="mr">मराठी</TabsTrigger>
                            </TabsList>
                            <TabsContent value="en" className="mt-3">
                                <Input
                                    value={heroContent.subtitle_en}
                                    onChange={(e) =>
                                        setHeroContent((prev) => ({
                                            ...prev,
                                            subtitle_en: e.target.value,
                                        }))
                                    }
                                    placeholder="Hero subtitle (English)"
                                />
                            </TabsContent>
                            <TabsContent value="mr" className="mt-3">
                                <Input
                                    value={heroContent.subtitle_mr}
                                    onChange={(e) =>
                                        setHeroContent((prev) => ({
                                            ...prev,
                                            subtitle_mr: e.target.value,
                                        }))
                                    }
                                    placeholder="हिरो उपशीर्षक (मराठी)"
                                />
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">
                            Background Image
                        </h3>
                        <ImageUpload
                            onUpload={(mediaId: number) =>
                                setHeroContent((prev) => ({
                                    ...prev,
                                    image_id: mediaId,
                                }))
                            }
                            onRemove={() =>
                                setHeroContent((prev) => ({
                                    ...prev,
                                    image_id: undefined,
                                    existingImageUrl: undefined,
                                }))
                            }
                            existingImageUrl={heroContent.existingImageUrl}
                            section="gallery-hero"
                        />
                    </div>

                    <Button
                        onClick={saveHero}
                        disabled={savingHero}
                        className="w-full"
                    >
                        {savingHero ? "Saving..." : "Save Hero Section"}
                    </Button>
                </CardContent>
            </Card>
            )}

            {activeSection === "albums" && (
            <>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Albums
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create albums with images and videos
                    </p>
                </div>
                <Button onClick={openCreateModal} className="gap-2">
                    <Plus size={16} /> Add Album
                </Button>
            </div>

            {albums.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground">
                    No albums yet. Create your first album.
                </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {albums.map((album) => (
                    <Card key={album.clientKey} className="overflow-hidden">
                        <div className="aspect-video bg-muted">
                            {album.coverImageUrl ? (
                                <img
                                    src={album.coverImageUrl}
                                    alt={album.name_en}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                    No cover
                                </div>
                            )}
                        </div>
                        <CardContent className="space-y-2 pt-4">
                            <p className="font-semibold text-foreground">
                                {album.name_en || album.name_mr || "Untitled"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {album.media.length} item
                                {album.media.length === 1 ? "" : "s"}
                            </p>
                            <div className="flex gap-2 pt-2">
                                <Button
                                    onClick={() => openEditModal(album)}
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Pencil size={14} /> Edit
                                </Button>
                                <Button
                                    onClick={() => deleteAlbum(album)}
                                    variant="destructive"
                                    size="sm"
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog
                open={isModalOpen}
                onOpenChange={(open) => {
                    if (!open) closeModal();
                }}
            >
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAlbum?.id ? "Edit Album" : "New Album"}
                        </DialogTitle>
                        <DialogDescription>
                            Album name, cover image and gallery media
                        </DialogDescription>
                    </DialogHeader>

                    {editingAlbum && (
                        <div className="space-y-6 py-2">
                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground">
                                    Album Name
                                </h3>
                                <Tabs defaultValue="en" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="en">
                                            English
                                        </TabsTrigger>
                                        <TabsTrigger value="mr">मराठी</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="en" className="mt-3">
                                        <Input
                                            value={editingAlbum.name_en}
                                            onChange={(e) =>
                                                updateEditingAlbum((a) => ({
                                                    ...a,
                                                    name_en: e.target.value,
                                                }))
                                            }
                                            placeholder="Album name (English)"
                                        />
                                    </TabsContent>
                                    <TabsContent value="mr" className="mt-3">
                                        <Input
                                            value={editingAlbum.name_mr}
                                            onChange={(e) =>
                                                updateEditingAlbum((a) => ({
                                                    ...a,
                                                    name_mr: e.target.value,
                                                }))
                                            }
                                            placeholder="अल्बम नाव (मराठी)"
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground">
                                    Cover Image
                                </h3>
                                <ImageUpload
                                    onUpload={(mediaId: number) =>
                                        updateEditingAlbum((a) => ({
                                            ...a,
                                            cover_image_id: mediaId,
                                        }))
                                    }
                                    onRemove={() =>
                                        updateEditingAlbum((a) => ({
                                            ...a,
                                            cover_image_id: undefined,
                                            coverImageUrl: undefined,
                                        }))
                                    }
                                    existingImageUrl={editingAlbum.coverImageUrl}
                                    section="gallery"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-foreground">
                                        Album Media
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Images & videos · drop multiple files
                                    </p>
                                </div>

                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setMediaDragging(true);
                                    }}
                                    onDragLeave={() => setMediaDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setMediaDragging(false);
                                        if (e.dataTransfer.files?.length) {
                                            handleAlbumMediaUpload(
                                                e.dataTransfer.files,
                                            );
                                        }
                                    }}
                                    className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                                        mediaDragging
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/50"
                                    }`}
                                >
                                    <div className="text-center">
                                        <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                                        <p className="text-sm font-medium">
                                            Drag & drop images or videos here
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            or click to browse · select multiple
                                        </p>
                                        <input
                                            type="file"
                                            accept="image/*,video/*"
                                            multiple
                                            onChange={(e) => {
                                                if (e.target.files?.length) {
                                                    handleAlbumMediaUpload(
                                                        e.target.files,
                                                    );
                                                    e.target.value = "";
                                                }
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    {mediaUploading && (
                                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                                        </div>
                                    )}
                                </div>

                                {editingAlbum.media.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                        {editingAlbum.media.map((item) => {
                                            const isVideo =
                                                item.mime_type?.startsWith(
                                                    "video/",
                                                ) ||
                                                /\.(mp4|webm|mov|ogg|avi|mkv)(\?|$)/i.test(
                                                    item.existingUrl || "",
                                                );
                                            return (
                                                <div
                                                    key={item.clientKey}
                                                    className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
                                                >
                                                    {item.existingUrl ? (
                                                        isVideo ? (
                                                            <video
                                                                src={item.existingUrl}
                                                                className="w-full h-full object-cover"
                                                                muted
                                                                playsInline
                                                            />
                                                        ) : (
                                                            <img
                                                                src={item.existingUrl}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                                            No preview
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateEditingAlbum(
                                                                (a) => ({
                                                                    ...a,
                                                                    media: a.media.filter(
                                                                        (m) =>
                                                                            m.clientKey !==
                                                                            item.clientKey,
                                                                    ),
                                                                }),
                                                            )
                                                        }
                                                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md"
                                                        title="Remove"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button onClick={saveAlbum} disabled={saving}>
                            {saving ? "Saving..." : "Save Album"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </>
            )}
        </div>
    );
};

export default GalleryPageEditor;
