import client from "@/api/client";
import { constructImageUrl } from "@/api/imageUrl";

export interface ApiMedia {
    id: number;
    file_url?: string;
    url?: string;
    mime_type?: string;
}

export interface EventGalleryItem {
    url: string;
    isVideo: boolean;
    mime_type?: string;
}

export interface ApiEventImage {
    id: number;
    media_id: number;
    sort_order: number;
    media?: ApiMedia;
}

export interface ApiEvent {
    id: number;
    title_en: string;
    title_hi?: string;
    title_mr: string;
    slug?: string;
    event_date?: string;
    description_en?: string;
    description_hi?: string;
    description_mr?: string;
    summary_en?: string;
    summary_hi?: string;
    summary_mr?: string;
    details_en?: string;
    details_hi?: string;
    details_mr?: string;
    location_en?: string;
    location_hi?: string;
    location_mr?: string;
    time_en?: string;
    time_hi?: string;
    time_mr?: string;
    category: string;
    image_id?: number;
    cover_image?: ApiMedia;
    coverImage?: ApiMedia;
    gallery_images?: ApiEventImage[];
    galleryImages?: ApiEventImage[];
    is_active: boolean;
    sort_order: number;
}

export const getLocalizedEventValue = (
    event: ApiEvent,
    baseKey:
        | "title"
        | "description"
        | "summary"
        | "details"
        | "location"
        | "time",
    language: "en" | "mr",
) => {
    const suffix = language === "mr" ? "mr" : "en";
    return (
        event[`${baseKey}_${suffix}` as keyof ApiEvent] ||
        event[`${baseKey}_en` as keyof ApiEvent] ||
        ""
    ) as string;
};

export const getEventCoverImageUrl = (event: ApiEvent) => {
    const media = event.coverImage || event.cover_image;
    const imagePath = media?.file_url || media?.url;
    return imagePath ? constructImageUrl(imagePath) : "";
};

export const getEventGalleryUrls = (event: ApiEvent) => {
    const images = event.galleryImages || event.gallery_images || [];
    return images
        .map((image) => {
            const path = image.media?.file_url || image.media?.url;
            return path ? constructImageUrl(path) : "";
        })
        .filter(Boolean);
};

export const getEventGalleryItems = (event: ApiEvent): EventGalleryItem[] => {
    const items = event.galleryImages || event.gallery_images || [];
    return items
        .map((image) => {
            const path = image.media?.file_url || image.media?.url;
            if (!path) return null;
            const mime = image.media?.mime_type;
            const isVideo =
                mime?.startsWith("video/") === true ||
                /\.(mp4|webm|mov|ogg|avi|mkv)(\?|$)/i.test(path);
            const item: EventGalleryItem = {
                url: constructImageUrl(path),
                isVideo,
                mime_type: mime,
            };
            return item;
        })
        .filter((item): item is EventGalleryItem => item !== null);
};

export const fetchPublicEvents = async () => {
    const response = await client.get<ApiEvent[]>("/public/events");
    return response.data;
};

export const fetchPublicEventBySlug = async (slug: string) => {
    const response = await client.get<ApiEvent>(`/public/events/${slug}`);
    return response.data;
};
