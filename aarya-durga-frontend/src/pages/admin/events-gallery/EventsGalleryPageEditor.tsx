import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
import client from "@/api/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useLoader } from "@/contexts/LoaderContext";
import { Pencil, Trash2, Plus } from "lucide-react";
import { constructImageUrl } from "@/api/imageUrl";

interface HeroContent {
    title_en: string;
    title_mr: string;
    subtitle_en: string;
    subtitle_mr: string;
    image_id?: number;
    existingImageUrl?: string;
}

interface EventGalleryImageForm {
    clientKey: string;
    image_id?: number;
    existingImageUrl?: string;
}

interface TempleEventForm {
    id?: number;
    clientKey: string;
    title_en: string;
    title_mr: string;
    date_label_en: string;
    date_label_mr: string;
    event_date: string;
    summary_en: string;
    summary_mr: string;
    description_en: string;
    description_mr: string;
    details_en: string;
    details_mr: string;
    location_en: string;
    location_mr: string;
    time_en: string;
    time_mr: string;
    category: "Festival" | "Yatra" | "Pooja";
    image_id?: number;
    existingImageUrl?: string;
    galleryImages: EventGalleryImageForm[];
}

interface EventsContent {
    title_en: string;
    title_mr: string;
    events: TempleEventForm[];
}

interface GalleryImage {
    key: string;
    image_id?: number;
    existingImageUrl?: string;
}

interface GalleryContent {
    title_en: string;
    title_mr: string;
    subtitle_en: string;
    subtitle_mr: string;
    images: GalleryImage[];
}

const getOrderedNumericKeys = (
    rawValue: string | undefined,
    prefix: "gallery",
    data: any[],
) => {
    if (rawValue) {
        try {
            const parsed = JSON.parse(rawValue);
            if (Array.isArray(parsed)) {
                return parsed.filter(
                    (value): value is string => typeof value === "string",
                );
            }
        } catch {
            // Fall back to legacy detection.
        }
    }

    const numbers = new Set<number>();
    data.forEach((item) => {
        const match = item.section_key.match(new RegExp(`^${prefix}_(\\d+)_`));
        if (match) {
            numbers.add(parseInt(match[1], 10));
        }
    });

    return Array.from(numbers)
        .sort((a, b) => b - a)
        .map((num) => `${prefix}_${num}`);
};

const emptyEvent = (index: number): TempleEventForm => ({
    clientKey: `new-event-${Date.now()}-${index}`,
    title_en: "",
    title_mr: "",
    date_label_en: "",
    date_label_mr: "",
    event_date: "",
    summary_en: "",
    summary_mr: "",
    description_en: "",
    description_mr: "",
    details_en: "",
    details_mr: "",
    location_en: "",
    location_mr: "",
    time_en: "",
    time_mr: "",
    category: "Festival",
    image_id: undefined,
    existingImageUrl: undefined,
    galleryImages: [],
});

const convertTo24Hour = (time12: string): string => {
    if (!time12) return "";
    const [time, period] = time12.split(" ");
    if (!time || !period) return "";

    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const convertTo12Hour = (time24: string): string => {
    if (!time24) return "";
    const [hoursStr, minutesStr] = time24.split(":");
    const hoursNum = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const period = hoursNum >= 12 ? "PM" : "AM";
    const displayHours = hoursNum % 12 || 12;

    return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
};

const EventsGalleryPageEditor = () => {
    const { setLoading: setGlobalLoading } = useLoader();
    const [activeSection, setActiveSection] = useState<
        "hero" | "events" | "gallery"
    >("hero");

    const [heroContent, setHeroContent] = useState<HeroContent>({
        title_en: "",
        title_mr: "",
        subtitle_en: "",
        subtitle_mr: "",
    });

    const [eventsContent, setEventsContent] = useState<EventsContent>({
        title_en: "",
        title_mr: "",
        events: [],
    });

    const [galleryContent, setGalleryContent] = useState<GalleryContent>({
        title_en: "",
        title_mr: "",
        subtitle_en: "",
        subtitle_mr: "",
        images: [],
    });

    const [persistedEventIds, setPersistedEventIds] = useState<number[]>([]);
    const [persistedGalleryKeys, setPersistedGalleryKeys] = useState<string[]>(
        [],
    );
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<TempleEventForm | null>(
        null,
    );

    const sections = [
        {
            key: "hero",
            label: "Hero Section",
            description: "Title, subtitle, background image",
        },
        {
            key: "events",
            label: "Temple Events",
            description: "Manage event cards, full details, and galleries",
        },
        {
            key: "gallery",
            label: "Gallery Images",
            description: "Gallery title, subtitle & dynamic images",
        },
    ] as const;

    useEffect(() => {
        fetchContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        setGlobalLoading(true);
        try {
            const [pageResponse, eventsResponse] = await Promise.all([
                client.get("/public/page-content/events_gallery"),
                client.get("/admin/events"),
            ]);
            const data = pageResponse.data;
            const eventData = eventsResponse.data;

            const findContent = (key: string) =>
                data.find((item: any) => item.section_key === key);
            const getImage = (key: string) => {
                const item = findContent(key);
                if (item?.image?.file_url) {
                    return constructImageUrl(item.image.file_url);
                }
                return undefined;
            };

            setHeroContent({
                title_en: findContent("hero_title")?.content_en || "",
                title_mr: findContent("hero_title")?.content_mr || "",
                subtitle_en: findContent("hero_subtitle")?.content_en || "",
                subtitle_mr: findContent("hero_subtitle")?.content_mr || "",
                image_id: findContent("hero_image")?.image_id,
                existingImageUrl: getImage("hero_image"),
            });

            setEventsContent({
                title_en: findContent("events_title")?.content_en || "",
                title_mr: findContent("events_title")?.content_mr || "",
                events: eventData.map((event: any, index: number) => ({
                    id: event.id,
                    clientKey: `event-${event.id}`,
                    title_en: event.title_en || "",
                    title_mr: event.title_mr || "",
                    date_label_en: event.date_label_en || "",
                    date_label_mr: event.date_label_mr || "",
                    event_date: event.event_date || "",
                    summary_en: event.summary_en || "",
                    summary_mr: event.summary_mr || "",
                    description_en: event.description_en || "",
                    description_mr: event.description_mr || "",
                    details_en: event.details_en || "",
                    details_mr: event.details_mr || "",
                    location_en: event.location_en || "",
                    location_mr: event.location_mr || "",
                    time_en: event.time_en || "",
                    time_mr: event.time_mr || "",
                    category: event.category || "Festival",
                    image_id: event.image_id,
                    existingImageUrl: event.cover_image?.file_url
                        ? constructImageUrl(event.cover_image.file_url)
                        : event.coverImage?.file_url
                          ? constructImageUrl(event.coverImage.file_url)
                          : undefined,
                    galleryImages: (event.gallery_images ||
                        event.galleryImages ||
                        []
                    ).map((image: any, imageIndex: number) => ({
                        clientKey: `event-${event.id}-gallery-${image.id || imageIndex}`,
                        image_id: image.media_id,
                        existingImageUrl: image.media?.file_url
                            ? constructImageUrl(image.media.file_url)
                            : image.media?.url
                              ? constructImageUrl(image.media.url)
                              : undefined,
                    })),
                })),
            });
            setPersistedEventIds(eventData.map((event: any) => event.id));

            const orderedGalleryKeys = getOrderedNumericKeys(
                findContent("gallery_keys")?.content_en,
                "gallery",
                data,
            );
            setGalleryContent({
                title_en: findContent("gallery_title")?.content_en || "",
                title_mr: findContent("gallery_title")?.content_mr || "",
                subtitle_en: findContent("gallery_subtitle")?.content_en || "",
                subtitle_mr: findContent("gallery_subtitle")?.content_mr || "",
                images: orderedGalleryKeys.map((galleryKey) => {
                    const imageItem = findContent(`${galleryKey}_image`);
                    return {
                        key: galleryKey,
                        image_id: imageItem?.image_id,
                        existingImageUrl: imageItem?.image?.file_url
                            ? constructImageUrl(imageItem.image.file_url)
                            : undefined,
                    };
                }),
            });
            setPersistedGalleryKeys(orderedGalleryKeys);
        } catch (error) {
            toast.error("Failed to load content");
        } finally {
            setLoading(false);
            setGlobalLoading(false);
        }
    };

    const saveHeroSection = async () => {
        setSaving(true);
        try {
            await Promise.all([
                client.put("/admin/page-content/events_gallery/hero_title", {
                    content_en: heroContent.title_en,
                    content_hi: heroContent.title_en,
                    content_mr: heroContent.title_mr,
                }),
                client.put("/admin/page-content/events_gallery/hero_subtitle", {
                    content_en: heroContent.subtitle_en,
                    content_hi: heroContent.subtitle_en,
                    content_mr: heroContent.subtitle_mr,
                }),
                heroContent.image_id
                    ? client.put(
                          "/admin/page-content/events_gallery/hero_image",
                          {
                              image_id: heroContent.image_id,
                          },
                      )
                    : Promise.resolve(),
            ]);
            toast.success("Hero section saved successfully");
        } catch (error) {
            toast.error("Failed to save hero section");
        } finally {
            setSaving(false);
        }
    };

    const addEvent = () => {
        setEditingEvent(emptyEvent(eventsContent.events.length + 1));
        setIsEventModalOpen(true);
    };

    const removeEvent = (clientKey: string) => {
        setEventsContent((prev) => ({
            ...prev,
            events: prev.events.filter((event) => event.clientKey !== clientKey),
        }));
    };

    const openEditEventModal = (event: TempleEventForm) => {
        setEditingEvent({
            ...event,
            galleryImages: event.galleryImages.map((image) => ({ ...image })),
        });
        setIsEventModalOpen(true);
    };

    const closeEventModal = () => {
        setEditingEvent(null);
        setIsEventModalOpen(false);
    };

    const saveEventModal = async () => {
        if (!editingEvent) {
            return;
        }

        const eventToSave: TempleEventForm = {
            ...editingEvent,
            galleryImages: editingEvent.galleryImages.map((image) => ({
                ...image,
            })),
        };

        if (!eventToSave.title_en.trim() && !eventToSave.title_mr.trim()) {
            toast.error("Add an event title before saving");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                title_en: eventToSave.title_en,
                title_hi: eventToSave.title_en,
                title_mr: eventToSave.title_mr,
                date_label_en: eventToSave.date_label_en,
                date_label_hi: eventToSave.date_label_en,
                date_label_mr: eventToSave.date_label_mr,
                event_date: eventToSave.event_date || null,
                summary_en: eventToSave.summary_en,
                summary_hi: eventToSave.summary_en,
                summary_mr: eventToSave.summary_mr,
                description_en: eventToSave.description_en,
                description_hi: eventToSave.description_en,
                description_mr: eventToSave.description_mr,
                details_en: eventToSave.details_en,
                details_hi: eventToSave.details_en,
                details_mr: eventToSave.details_mr,
                location_en: eventToSave.location_en,
                location_hi: eventToSave.location_en,
                location_mr: eventToSave.location_mr,
                time_en: eventToSave.time_en,
                time_hi: eventToSave.time_en,
                time_mr: eventToSave.time_mr,
                category: eventToSave.category,
                image_id: eventToSave.image_id,
                gallery_image_ids: eventToSave.galleryImages
                    .map((image) => image.image_id)
                    .filter(Boolean),
                is_active: true,
                sort_order: eventToSave.id
                    ? eventsContent.events.findIndex(
                          (event) => event.id === eventToSave.id,
                      )
                    : eventsContent.events.length,
            };

            if (eventToSave.id) {
                await client.put(`/admin/events/${eventToSave.id}`, payload);
            } else {
                await client.post("/admin/events", payload);
            }

            toast.success(
                eventToSave.id
                    ? "Event updated successfully"
                    : "Event added successfully",
            );
            closeEventModal();
            await fetchContent();
        } catch (error) {
            const apiMessage = (error as any)?.response?.data?.message;
            const apiErrors = (error as any)?.response?.data?.errors;
            const validationMessage = apiErrors
                ? Object.values(apiErrors).flat().join(", ")
                : "";
            const message =
                apiMessage || validationMessage || "Failed to save event";
            toast.error(message || "Failed to save event");
        } finally {
            setSaving(false);
        }
    };

    const updateEditingEvent = (
        updater: (event: TempleEventForm) => TempleEventForm,
    ) => {
        setEditingEvent((prev) => (prev ? updater(prev) : prev));
    };

    const updateEvent = (
        clientKey: string,
        updater: (event: TempleEventForm) => TempleEventForm,
    ) => {
        setEventsContent((prev) => ({
            ...prev,
            events: prev.events.map((event) =>
                event.clientKey === clientKey ? updater(event) : event,
            ),
        }));
    };

    const addEventGalleryImage = (clientKey: string) => {
        updateEvent(clientKey, (event) => ({
            ...event,
            galleryImages: [
                ...event.galleryImages,
                {
                    clientKey: `${clientKey}-gallery-${Date.now()}`,
                    image_id: undefined,
                    existingImageUrl: undefined,
                },
            ],
        }));
    };

    const removeEventGalleryImage = (
        clientKey: string,
        imageClientKey: string,
    ) => {
        updateEvent(clientKey, (event) => ({
            ...event,
            galleryImages: event.galleryImages.filter(
                (image) => image.clientKey !== imageClientKey,
            ),
        }));
    };

    const saveEventsSection = async () => {
        setSaving(true);
        try {
            await client.put("/admin/page-content/events_gallery/events_title", {
                content_en: eventsContent.title_en,
                content_hi: eventsContent.title_en,
                content_mr: eventsContent.title_mr,
            });

            const removedIds = persistedEventIds.filter(
                (id) => !eventsContent.events.some((event) => event.id === id),
            );
            await Promise.all(
                removedIds.map((id) => client.delete(`/admin/events/${id}`)),
            );

            const savedEvents = await Promise.all(
                eventsContent.events.map((event, index) => {
                    const payload = {
                        title_en: event.title_en,
                        title_hi: event.title_en,
                        title_mr: event.title_mr,
                        date_label_en: event.date_label_en,
                        date_label_hi: event.date_label_en,
                        date_label_mr: event.date_label_mr,
                        event_date: event.event_date || null,
                        summary_en: event.summary_en,
                        summary_hi: event.summary_en,
                        summary_mr: event.summary_mr,
                        description_en: event.description_en,
                        description_hi: event.description_en,
                        description_mr: event.description_mr,
                        details_en: event.details_en,
                        details_hi: event.details_en,
                        details_mr: event.details_mr,
                        location_en: event.location_en,
                        location_hi: event.location_en,
                        location_mr: event.location_mr,
                        time_en: event.time_en,
                        time_hi: event.time_en,
                        time_mr: event.time_mr,
                        category: event.category,
                        image_id: event.image_id,
                        gallery_image_ids: event.galleryImages
                            .map((image) => image.image_id)
                            .filter(Boolean),
                        is_active: true,
                        sort_order: index,
                    };

                    if (event.id) {
                        return client.put(`/admin/events/${event.id}`, payload);
                    }

                    return client.post("/admin/events", payload);
                }),
            );

            await client.post(
                "/admin/events/reorder",
                savedEvents.map((response, index) => ({
                    id: response.data.id,
                    sort_order: index,
                })),
            );

            setPersistedEventIds(
                savedEvents.map((response) => response.data.id as number),
            );
            toast.success("Events section saved successfully");
            await fetchContent();
        } catch (error) {
            toast.error("Failed to save events section");
        } finally {
            setSaving(false);
        }
    };

    const addGalleryImage = () => {
        const nextIndex =
            galleryContent.images.length > 0
                ? Math.max(
                      ...galleryContent.images.map((image) => {
                          const match = image.key.match(/^gallery_(\d+)$/);
                          return match ? parseInt(match[1], 10) : 0;
                      }),
                  ) + 1
                : 1;
        setGalleryContent((prev) => ({
            ...prev,
            images: [
                { key: `gallery_${nextIndex}`, image_id: undefined },
                ...prev.images,
            ],
        }));
    };

    const removeGalleryImage = (key: string) => {
        setGalleryContent((prev) => ({
            ...prev,
            images: prev.images.filter((image) => image.key !== key),
        }));
    };

    const saveGallerySection = async () => {
        setSaving(true);
        try {
            const updates: Array<{
                endpoint: string;
                data: Record<string, string | number>;
            }> = [
                {
                    endpoint: "gallery_keys",
                    data: {
                        content_en: JSON.stringify(
                            galleryContent.images.map((image) => image.key),
                        ),
                    },
                },
                {
                    endpoint: "gallery_title",
                    data: {
                        content_en: galleryContent.title_en,
                        content_hi: galleryContent.title_en,
                        content_mr: galleryContent.title_mr,
                    },
                },
                {
                    endpoint: "gallery_subtitle",
                    data: {
                        content_en: galleryContent.subtitle_en,
                        content_hi: galleryContent.subtitle_en,
                        content_mr: galleryContent.subtitle_mr,
                    },
                },
            ];

            galleryContent.images.forEach((image) => {
                if (image.image_id) {
                    updates.push({
                        endpoint: `${image.key}_image`,
                        data: { image_id: image.image_id },
                    });
                }
            });

            const removedGalleryKeys = persistedGalleryKeys.filter(
                (key) => !galleryContent.images.some((image) => image.key === key),
            );

            await Promise.all([
                ...removedGalleryKeys.map((galleryKey) =>
                    client.delete(
                        `/admin/page-content/events_gallery/${galleryKey}_image`,
                    ),
                ),
                ...updates.map((update) =>
                    client.put(
                        `/admin/page-content/events_gallery/${update.endpoint}`,
                        update.data,
                    ),
                ),
            ]);

            setPersistedGalleryKeys(
                galleryContent.images.map((image) => image.key),
            );
            toast.success("Gallery section saved successfully");
        } catch (error) {
            toast.error("Failed to save gallery section");
        } finally {
            setSaving(false);
        }
    };

    const renderLanguageTabs = (
        label: string,
        en: string,
        mr: string,
        onChange: (lang: "en" | "mr", value: string) => void,
        isRichText = false,
    ) => (
        <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{label}</h3>
            <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="mt-4">
                    {isRichText ? (
                        <RichTextEditor
                            value={en}
                            onChange={(value) => onChange("en", value)}
                            placeholder={`Enter ${label} in English`}
                        />
                    ) : (
                        <Input
                            value={en}
                            onChange={(e) => onChange("en", e.target.value)}
                            placeholder={`Enter ${label} in English`}
                            disabled={loading}
                        />
                    )}
                </TabsContent>

                <TabsContent value="mr" className="mt-4">
                    {isRichText ? (
                        <RichTextEditor
                            value={mr}
                            onChange={(value) => onChange("mr", value)}
                            placeholder={`मराठीत ${label} प्रविष्ट करा`}
                        />
                    ) : (
                        <Input
                            value={mr}
                            onChange={(e) => onChange("mr", e.target.value)}
                            placeholder={`मराठीत ${label} प्रविष्ट करा`}
                            disabled={loading}
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );

    return (
        <div className="max-w-6xl space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">
                    Events & Gallery Page Editor
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Manage the Events page hero, detailed events, and gallery
                    images
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {sections.map((section) => (
                    <Card
                        key={section.key}
                        className={`cursor-pointer transition-all ${activeSection === section.key ? "ring-2 ring-primary" : ""}`}
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
                    <CardHeader>
                        <CardTitle>Hero Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="mb-4 font-semibold">Hero Image</h3>
                            <ImageUpload
                                onUpload={(mediaId) =>
                                    setHeroContent((prev) => ({
                                        ...prev,
                                        image_id: mediaId,
                                    }))
                                }
                                existingImageUrl={heroContent.existingImageUrl}
                                section="events-gallery-hero"
                            />
                        </div>

                        {renderLanguageTabs(
                            "Title",
                            heroContent.title_en,
                            heroContent.title_mr,
                            (lang, value) =>
                                setHeroContent((prev) => ({
                                    ...prev,
                                    [`title_${lang}`]: value,
                                })),
                        )}

                        {renderLanguageTabs(
                            "Subtitle",
                            heroContent.subtitle_en,
                            heroContent.subtitle_mr,
                            (lang, value) =>
                                setHeroContent((prev) => ({
                                    ...prev,
                                    [`subtitle_${lang}`]: value,
                                })),
                            true,
                        )}

                        <Button
                            onClick={saveHeroSection}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? "Saving..." : "Save Hero Section"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {activeSection === "events" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Temple Events Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {renderLanguageTabs(
                            "Section Title",
                            eventsContent.title_en,
                            eventsContent.title_mr,
                            (lang, value) =>
                                setEventsContent((prev) => ({
                                    ...prev,
                                    [`title_${lang}`]: value,
                                })),
                        )}

                        <div className="mt-8 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">
                                Events
                            </h3>
                            <Button
                                onClick={addEvent}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <Plus size={16} /> Add Event
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {[...eventsContent.events]
                                .reverse()
                                .map((event, reversedIndex) => {
                                    const index =
                                        eventsContent.events.length -
                                        1 -
                                        reversedIndex;

                                    return (
                                        <div
                                            key={event.clientKey}
                                            className="rounded-lg border bg-muted/30 p-5"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <h4 className="font-semibold text-foreground">
                                                        {event.title_en ||
                                                            event.title_mr ||
                                                            `Event ${index + 1}`}
                                                    </h4>
                                                    <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                                                        <p>
                                                            Category:{" "}
                                                            {event.category}
                                                        </p>
                                                        {event.event_date && (
                                                            <p>
                                                                Date:{" "}
                                                                {
                                                                    event.event_date
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        onClick={() =>
                                                            openEditEventModal(
                                                                event,
                                                            )
                                                        }
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                    >
                                                        <Pencil size={16} />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            removeEvent(
                                                                event.clientKey,
                                                            )
                                                        }
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        <Button
                            onClick={saveEventsSection}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? "Saving..." : "Save Events Section"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Dialog
                open={isEventModalOpen}
                onOpenChange={(open) => {
                    setIsEventModalOpen(open);
                    if (!open) {
                        setEditingEvent(null);
                    }
                }}
            >
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingEvent?.id ? "Edit Event" : "Add Event"}
                        </DialogTitle>
                        <DialogDescription>
                            Update the event card and detail page content here.
                        </DialogDescription>
                    </DialogHeader>

                    {editingEvent && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">
                                    Cover Image
                                </h3>
                                <ImageUpload
                                    onUpload={(mediaId: number) =>
                                        updateEditingEvent((currentEvent) => ({
                                            ...currentEvent,
                                            image_id: mediaId,
                                        }))
                                    }
                                    existingImageUrl={
                                        editingEvent.existingImageUrl
                                    }
                                    section="event-1"
                                />
                            </div>

                            {renderLanguageTabs(
                                "Event Title",
                                editingEvent.title_en,
                                editingEvent.title_mr,
                                (lang, value) =>
                                    updateEditingEvent((currentEvent) => ({
                                        ...currentEvent,
                                        [`title_${lang}`]: value,
                                    })),
                            )}

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground">
                                        Category
                                    </h3>
                                    <select
                                        value={editingEvent.category}
                                        onChange={(e) =>
                                            updateEditingEvent(
                                                (currentEvent) => ({
                                                    ...currentEvent,
                                                    category: e.target
                                                        .value as TempleEventForm["category"],
                                                }),
                                            )
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="Festival">
                                            Festival
                                        </option>
                                        <option value="Yatra">Yatra</option>
                                        <option value="Pooja">Pooja</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground">
                                        Event Date
                                    </h3>
                                    <Input
                                        type="date"
                                        value={editingEvent.event_date}
                                        onChange={(e) =>
                                            updateEditingEvent(
                                                (currentEvent) => ({
                                                    ...currentEvent,
                                                    event_date:
                                                        e.target.value,
                                                }),
                                            )
                                        }
                                    />
                                </div>

                            </div>

                            {renderLanguageTabs(
                                "Date Label",
                                editingEvent.date_label_en,
                                editingEvent.date_label_mr,
                                (lang, value) =>
                                    updateEditingEvent((currentEvent) => ({
                                        ...currentEvent,
                                        [`date_label_${lang}`]: value,
                                    })),
                            )}

                            <div className="space-y-4">
                                <h3 className="font-semibold text-foreground">
                                    Time
                                </h3>
                                <Tabs defaultValue="en" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="en">
                                            English
                                        </TabsTrigger>
                                        <TabsTrigger value="mr">
                                            मराठी
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="en" className="mt-4">
                                        <Input
                                            type="time"
                                            value={convertTo24Hour(
                                                editingEvent.time_en,
                                            )}
                                            onChange={(e) =>
                                                updateEditingEvent(
                                                    (currentEvent) => ({
                                                        ...currentEvent,
                                                        time_en:
                                                            convertTo12Hour(
                                                                e.target.value,
                                                            ),
                                                    }),
                                                )
                                            }
                                            disabled={loading}
                                        />
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Saved in 12-hour format like the
                                            pooja timings.
                                        </p>
                                    </TabsContent>

                                    <TabsContent value="mr" className="mt-4">
                                        <Input
                                            type="time"
                                            value={convertTo24Hour(
                                                editingEvent.time_mr,
                                            )}
                                            onChange={(e) =>
                                                updateEditingEvent(
                                                    (currentEvent) => ({
                                                        ...currentEvent,
                                                        time_mr:
                                                            convertTo12Hour(
                                                                e.target.value,
                                                            ),
                                                    }),
                                                )
                                            }
                                            disabled={loading}
                                        />
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Saved in 12-hour format like the
                                            pooja timings.
                                        </p>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            {renderLanguageTabs(
                                "Location",
                                editingEvent.location_en,
                                editingEvent.location_mr,
                                (lang, value) =>
                                    updateEditingEvent((currentEvent) => ({
                                        ...currentEvent,
                                        [`location_${lang}`]: value,
                                    })),
                            )}

                            {renderLanguageTabs(
                                "Card Summary",
                                editingEvent.summary_en,
                                editingEvent.summary_mr,
                                (lang, value) =>
                                    updateEditingEvent((currentEvent) => ({
                                        ...currentEvent,
                                        [`summary_${lang}`]: value,
                                    })),
                                true,
                            )}

                            {renderLanguageTabs(
                                "Short Description",
                                editingEvent.description_en,
                                editingEvent.description_mr,
                                (lang, value) =>
                                    updateEditingEvent((currentEvent) => ({
                                        ...currentEvent,
                                        [`description_${lang}`]: value,
                                    })),
                                true,
                            )}

                            {renderLanguageTabs(
                                "Full Details",
                                editingEvent.details_en,
                                editingEvent.details_mr,
                                (lang, value) =>
                                    updateEditingEvent((currentEvent) => ({
                                        ...currentEvent,
                                        [`details_${lang}`]: value,
                                    })),
                                true,
                            )}

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-foreground">
                                        Event Detail Gallery Images
                                    </h3>
                                    <Button
                                        onClick={() =>
                                            setEditingEvent((currentEvent) =>
                                                currentEvent
                                                    ? {
                                                          ...currentEvent,
                                                          galleryImages: [
                                                              {
                                                                  clientKey: `modal-gallery-${Date.now()}`,
                                                                  image_id:
                                                                      undefined,
                                                                  existingImageUrl:
                                                                      undefined,
                                                              },
                                                              ...currentEvent.galleryImages,
                                                          ],
                                                      }
                                                    : currentEvent,
                                            )
                                        }
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <Plus size={16} /> Add Image
                                    </Button>
                                </div>

                                {editingEvent.galleryImages.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        Add one or more extra images for the
                                        event details page.
                                    </p>
                                )}

                                {editingEvent.galleryImages.map(
                                    (galleryImage, galleryIndex) => (
                                        <div
                                            key={galleryImage.clientKey}
                                            className="space-y-3 rounded-lg border bg-background p-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-foreground">
                                                    Detail Image{" "}
                                                    {galleryIndex + 1}
                                                </p>
                                                <Button
                                                    onClick={() =>
                                                        setEditingEvent(
                                                            (
                                                                currentEvent,
                                                            ) =>
                                                                currentEvent
                                                                    ? {
                                                                          ...currentEvent,
                                                                          galleryImages:
                                                                              currentEvent.galleryImages.filter(
                                                                                  (
                                                                                      image,
                                                                                  ) =>
                                                                                      image.clientKey !==
                                                                                      galleryImage.clientKey,
                                                                              ),
                                                                      }
                                                                    : currentEvent,
                                                        )
                                                    }
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                            <ImageUpload
                                                onUpload={(mediaId: number) =>
                                                    setEditingEvent(
                                                        (currentEvent) =>
                                                            currentEvent
                                                                ? {
                                                                      ...currentEvent,
                                                                      galleryImages:
                                                                          currentEvent.galleryImages.map(
                                                                              (
                                                                                  image,
                                                                              ) =>
                                                                                  image.clientKey ===
                                                                                  galleryImage.clientKey
                                                                                      ? {
                                                                                            ...image,
                                                                                            image_id:
                                                                                                mediaId,
                                                                                        }
                                                                                      : image,
                                                                          ),
                                                                  }
                                                                : currentEvent,
                                                    )
                                                }
                                                existingImageUrl={
                                                    galleryImage.existingImageUrl
                                                }
                                                section="event-1"
                                            />
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={closeEventModal}>
                            Cancel
                        </Button>
                        <Button onClick={saveEventModal}>Save Event</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {activeSection === "gallery" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Gallery Images Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {renderLanguageTabs(
                            "Section Title",
                            galleryContent.title_en,
                            galleryContent.title_mr,
                            (lang, value) =>
                                setGalleryContent((prev) => ({
                                    ...prev,
                                    [`title_${lang}`]: value,
                                })),
                        )}

                        {renderLanguageTabs(
                            "Section Subtitle",
                            galleryContent.subtitle_en,
                            galleryContent.subtitle_mr,
                            (lang, value) =>
                                setGalleryContent((prev) => ({
                                    ...prev,
                                    [`subtitle_${lang}`]: value,
                                })),
                            true,
                        )}

                        <div className="mt-8 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">
                                Gallery Images
                            </h3>
                            <Button
                                onClick={addGalleryImage}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <Plus size={16} /> Add Image
                            </Button>
                        </div>

                        {galleryContent.images.map((image, index) => (
                            <div
                                key={image.key}
                                className="space-y-4 rounded-lg border bg-muted/30 p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <h4 className="font-semibold text-foreground">
                                        Gallery Image {index + 1}
                                    </h4>
                                    <Button
                                        onClick={() =>
                                            removeGalleryImage(image.key)
                                        }
                                        variant="destructive"
                                        size="sm"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>

                                <ImageUpload
                                    onUpload={(mediaId: number) =>
                                        setGalleryContent((prev) => ({
                                            ...prev,
                                            images: prev.images.map((item) =>
                                                item.key === image.key
                                                    ? {
                                                          ...item,
                                                          image_id: mediaId,
                                                      }
                                                    : item,
                                            ),
                                        }))
                                    }
                                    existingImageUrl={image.existingImageUrl}
                                    section={`gallery-${index + 1}`}
                                />
                            </div>
                        ))}

                        <Button
                            onClick={saveGallerySection}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? "Saving..." : "Save Gallery Section"}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default EventsGalleryPageEditor;
