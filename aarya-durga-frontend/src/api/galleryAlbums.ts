import client from "@/api/client";
import { constructImageUrl } from "@/api/imageUrl";

export interface AlbumMediaItem {
    url: string;
    isVideo: boolean;
    mime_type?: string;
}

export interface ApiAlbum {
    id: number;
    name_en: string;
    name_hi?: string;
    name_mr?: string;
    slug: string;
    cover_image_id?: number | null;
    cover_image?: { file_url?: string; mime_type?: string };
    coverImage?: { file_url?: string; mime_type?: string };
    media?: Array<{
        id: number;
        media_id: number;
        media?: { file_url?: string; mime_type?: string };
    }>;
}

export const fetchPublicAlbums = async () => {
    const response = await client.get<ApiAlbum[]>("/public/gallery-albums");
    return response.data;
};

export const fetchPublicAlbumBySlug = async (slug: string) => {
    const response = await client.get<ApiAlbum>(
        `/public/gallery-albums/${slug}`,
    );
    return response.data;
};

export const getAlbumCoverUrl = (album: ApiAlbum) => {
    const cover = album.cover_image || album.coverImage;
    return cover?.file_url ? constructImageUrl(cover.file_url) : "";
};

export const getAlbumName = (album: ApiAlbum, language: "en" | "mr") => {
    if (language === "mr") return album.name_mr || album.name_en;
    return album.name_en || album.name_mr || "";
};

export const getAlbumMediaItems = (album: ApiAlbum): AlbumMediaItem[] => {
    return (album.media || [])
        .map((item) => {
            const path = item.media?.file_url;
            if (!path) return null;
            const mime = item.media?.mime_type;
            const isVideo =
                mime?.startsWith("video/") === true ||
                /\.(mp4|webm|mov|ogg|avi|mkv)(\?|$)/i.test(path);
            const result: AlbumMediaItem = {
                url: constructImageUrl(path),
                isVideo,
                mime_type: mime,
            };
            return result;
        })
        .filter((item): item is AlbumMediaItem => item !== null);
};
