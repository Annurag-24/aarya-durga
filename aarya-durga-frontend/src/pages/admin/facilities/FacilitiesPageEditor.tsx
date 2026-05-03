import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import client from "@/api/client";
import media from "@/api/media";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useLoader } from "@/contexts/LoaderContext";
import { Pencil, Trash2, Plus, Upload, X } from "lucide-react";
import { constructImageUrl } from "@/api/imageUrl";

interface FacilityMediaForm {
    clientKey: string;
    media_id?: number;
    existingUrl?: string;
    mime_type?: string;
}

interface FacilityForm {
    id?: number;
    clientKey: string;
    title_en: string;
    title_mr: string;
    description_en: string;
    description_mr: string;
    image_id?: number;
    existingImageUrl?: string;
    has_details_page: boolean;
    media: FacilityMediaForm[];
}

const emptyFacility = (): FacilityForm => ({
    clientKey: `new-facility-${Date.now()}`,
    title_en: "",
    title_mr: "",
    description_en: "",
    description_mr: "",
    image_id: undefined,
    existingImageUrl: undefined,
    has_details_page: false,
    media: [],
});

const FacilitiesPageEditor = () => {
    const { setLoading: setGlobalLoading } = useLoader();
    const [facilities, setFacilities] = useState<FacilityForm[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState<FacilityForm | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mediaUploading, setMediaUploading] = useState(false);
    const [mediaDragging, setMediaDragging] = useState(false);

    useEffect(() => {
        fetchFacilities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchFacilities = async () => {
        setLoading(true);
        setGlobalLoading(true);
        try {
            const response = await client.get("/admin/facilities");
            const data = response.data || [];
            setFacilities(
                data.map((f: any) => ({
                    id: f.id,
                    clientKey: `facility-${f.id}`,
                    title_en: f.title_en || "",
                    title_mr: f.title_mr || "",
                    description_en: f.description_en || "",
                    description_mr: f.description_mr || "",
                    image_id: f.image_id,
                    existingImageUrl: f.image?.file_url
                        ? constructImageUrl(f.image.file_url)
                        : undefined,
                    has_details_page: !!f.has_details_page,
                    media: (f.media || []).map((item: any, idx: number) => ({
                        clientKey: `facility-${f.id}-media-${item.id || idx}`,
                        media_id: item.media_id,
                        existingUrl: item.media?.file_url
                            ? constructImageUrl(item.media.file_url)
                            : undefined,
                        mime_type: item.media?.mime_type,
                    })),
                })),
            );
        } catch {
            toast.error("Failed to load facilities");
        } finally {
            setLoading(false);
            setGlobalLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditing(emptyFacility());
        setIsModalOpen(true);
    };

    const openEditModal = (facility: FacilityForm) => {
        setEditing({
            ...facility,
            media: facility.media.map((m) => ({ ...m })),
        });
        setIsModalOpen(true);
    };

    const updateEditingFn = (updater: (f: FacilityForm) => FacilityForm) =>
        setEditing((current) => (current ? updater(current) : current));

    const handleMediaUpload = async (files: FileList | File[]) => {
        const fileArr = Array.from(files);
        if (fileArr.length === 0) return;
        setMediaUploading(true);
        try {
            const uploaded = await Promise.all(
                fileArr.map(async (file) => {
                    const result: any = await media.upload(file, "facility");
                    return {
                        clientKey: `facility-media-${result.id}-${Date.now()}-${Math.random()}`,
                        media_id: result.id as number,
                        existingUrl: result.file_url
                            ? constructImageUrl(result.file_url)
                            : undefined,
                        mime_type: result.mime_type as string | undefined,
                    } as FacilityMediaForm;
                }),
            );
            updateEditingFn((f) => ({
                ...f,
                media: [...f.media, ...uploaded],
            }));
        } catch {
            toast.error("Failed to upload one or more files");
        } finally {
            setMediaUploading(false);
        }
    };

    const closeModal = () => {
        setEditing(null);
        setIsModalOpen(false);
    };

    const updateEditing = (updater: (f: FacilityForm) => FacilityForm) => {
        setEditing((current) => (current ? updater(current) : current));
    };

    const saveFacility = async () => {
        if (!editing) return;
        if (!editing.title_en.trim() && !editing.title_mr.trim()) {
            toast.error("Add a title before saving");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                title_en: editing.title_en,
                title_hi: editing.title_en,
                title_mr: editing.title_mr,
                description_en: editing.description_en,
                description_hi: editing.description_en,
                description_mr: editing.description_mr,
                image_id: editing.image_id ?? null,
                has_details_page: editing.has_details_page,
                media_ids: editing.media
                    .filter((m) => m.media_id)
                    .map((m) => m.media_id as number),
                is_active: true,
            };

            if (editing.id) {
                await client.put(`/admin/facilities/${editing.id}`, payload);
            } else {
                await client.post("/admin/facilities", payload);
            }
            toast.success("Facility saved");
            closeModal();
            await fetchFacilities();
        } catch {
            toast.error("Failed to save facility");
        } finally {
            setSaving(false);
        }
    };

    const deleteFacility = async (facility: FacilityForm) => {
        if (!facility.id) return;
        if (!confirm(`Delete "${facility.title_en || facility.title_mr}"?`))
            return;
        try {
            await client.delete(`/admin/facilities/${facility.id}`);
            toast.success("Facility deleted");
            await fetchFacilities();
        } catch {
            toast.error("Failed to delete facility");
        }
    };

    return (
        <div className="max-w-6xl space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-foreground">
                        Facilities
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Manage temple facilities with image, title and detailed
                        description
                    </p>
                </div>
                <Button onClick={openCreateModal} className="gap-2">
                    <Plus size={16} /> Add Facility
                </Button>
            </div>

            {facilities.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground">
                    No facilities yet.
                </p>
            )}

            <div className="space-y-3">
                {facilities.map((facility) => (
                    <div
                        key={facility.clientKey}
                        className="flex items-center gap-4 rounded-lg border bg-background p-4"
                    >
                        <div className="h-20 w-28 shrink-0 overflow-hidden rounded bg-muted">
                            {facility.existingImageUrl ? (
                                <img
                                    src={facility.existingImageUrl}
                                    alt={facility.title_en}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                    No image
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">
                                {facility.title_en ||
                                    facility.title_mr ||
                                    "Untitled"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {(facility.description_en ||
                                    facility.description_mr ||
                                    "")
                                    .replace(/<[^>]*>/g, "")
                                    .slice(0, 120)}
                            </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <Button
                                onClick={() => openEditModal(facility)}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <Pencil size={14} /> Edit
                            </Button>
                            <Button
                                onClick={() => deleteFacility(facility)}
                                variant="destructive"
                                size="sm"
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>
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
                            {editing?.id ? "Edit Facility" : "New Facility"}
                        </DialogTitle>
                        <DialogDescription>
                            Image, title and detailed description
                        </DialogDescription>
                    </DialogHeader>

                    {editing && (
                        <div className="space-y-6 py-2">
                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground">
                                    Image
                                </h3>
                                <ImageUpload
                                    onUpload={(mediaId: number) =>
                                        updateEditing((f) => ({
                                            ...f,
                                            image_id: mediaId,
                                        }))
                                    }
                                    onRemove={() =>
                                        updateEditing((f) => ({
                                            ...f,
                                            image_id: undefined,
                                            existingImageUrl: undefined,
                                        }))
                                    }
                                    existingImageUrl={editing.existingImageUrl}
                                    section="facility"
                                />
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground">
                                    Title
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
                                            value={editing.title_en}
                                            onChange={(e) =>
                                                updateEditing((f) => ({
                                                    ...f,
                                                    title_en: e.target.value,
                                                }))
                                            }
                                            placeholder="Facility title (English)"
                                        />
                                    </TabsContent>
                                    <TabsContent value="mr" className="mt-3">
                                        <Input
                                            value={editing.title_mr}
                                            onChange={(e) =>
                                                updateEditing((f) => ({
                                                    ...f,
                                                    title_mr: e.target.value,
                                                }))
                                            }
                                            placeholder="सुविधा शीर्षक (मराठी)"
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground">
                                    Description
                                </h3>
                                <Tabs defaultValue="en" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="en">
                                            English
                                        </TabsTrigger>
                                        <TabsTrigger value="mr">मराठी</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="en" className="mt-3">
                                        <RichTextEditor
                                            value={editing.description_en}
                                            onChange={(value) =>
                                                updateEditing((f) => ({
                                                    ...f,
                                                    description_en: value,
                                                }))
                                            }
                                            placeholder="Detailed description (English)"
                                        />
                                    </TabsContent>
                                    <TabsContent value="mr" className="mt-3">
                                        <RichTextEditor
                                            value={editing.description_mr}
                                            onChange={(value) =>
                                                updateEditing((f) => ({
                                                    ...f,
                                                    description_mr: value,
                                                }))
                                            }
                                            placeholder="तपशीलवार वर्णन (मराठी)"
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <div className="flex items-start justify-between gap-4 rounded-lg border bg-muted/30 p-4">
                                <div>
                                    <Label
                                        htmlFor="facility-has-details"
                                        className="font-semibold text-foreground"
                                    >
                                        Enable details page
                                    </Label>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        When enabled, clicking the facility
                                        card on the home page navigates to its
                                        details page.
                                    </p>
                                </div>
                                <Switch
                                    id="facility-has-details"
                                    checked={editing.has_details_page}
                                    onCheckedChange={(checked) =>
                                        updateEditing((f) => ({
                                            ...f,
                                            has_details_page: checked,
                                        }))
                                    }
                                />
                            </div>

                            {editing.has_details_page && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-foreground">
                                            Details Page Media
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Images & videos · drop multiple
                                            files
                                        </p>
                                    </div>

                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setMediaDragging(true);
                                        }}
                                        onDragLeave={() =>
                                            setMediaDragging(false)
                                        }
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setMediaDragging(false);
                                            if (e.dataTransfer.files?.length) {
                                                handleMediaUpload(
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
                                                Drag & drop images or videos
                                                here
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                or click to browse · select
                                                multiple
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/*,video/*"
                                                multiple
                                                onChange={(e) => {
                                                    if (
                                                        e.target.files?.length
                                                    ) {
                                                        handleMediaUpload(
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

                                    {editing.media.length > 0 && (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                            {editing.media.map((item) => {
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
                                                        className="relative aspect-square rounded-lg overflow-hidden border bg-muted"
                                                    >
                                                        {item.existingUrl ? (
                                                            isVideo ? (
                                                                <video
                                                                    src={
                                                                        item.existingUrl
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                    muted
                                                                    playsInline
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={
                                                                        item.existingUrl
                                                                    }
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
                                                                updateEditingFn(
                                                                    (f) => ({
                                                                        ...f,
                                                                        media: f.media.filter(
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
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button onClick={saveFacility} disabled={saving}>
                            {saving ? "Saving..." : "Save Facility"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FacilitiesPageEditor;
