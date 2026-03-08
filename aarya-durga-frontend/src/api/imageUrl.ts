/**
 * Construct full image URL from relative file_url returned by API
 * @param fileUrl - Relative file URL from API (e.g., /storage/uploads/image.jpg)
 * @returns Full absolute URL to the image
 */
export const constructImageUrl = (fileUrl: string): string => {
    if (!fileUrl) return "";

    // If API already returns an absolute URL, use it as-is.
    if (/^https?:\/\//i.test(fileUrl)) return fileUrl;

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    // Remove trailing /api from the API base URL for static file paths.
    const withoutApi = apiUrl.replace(/\/api\/?$/, "");
    const baseUrl = withoutApi.endsWith("/")
        ? withoutApi.slice(0, -1)
        : withoutApi;
    const normalizedFileUrl = fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;

    return `${baseUrl}${normalizedFileUrl}`;
};
