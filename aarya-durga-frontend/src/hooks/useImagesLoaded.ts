import { useEffect, useState } from "react";

/**
 * Hook that waits for all images on the page to load before resolving
 * Useful for ensuring loader stays visible until images are rendered
 */
export const useImagesLoaded = (dependencies: any[] = []) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        // Reset when dependencies change so callers can wait for newly rendered images.
        setImagesLoaded(false);

        const checkImagesLoaded = () => {
            const images = document.querySelectorAll("img");
            if (images.length === 0) {
                // No images on page, consider loaded
                setImagesLoaded(true);
                return;
            }

            let loadedCount = 0;
            let errorCount = 0;

            const handleImageLoad = () => {
                loadedCount++;
                if (loadedCount + errorCount === images.length) {
                    setImagesLoaded(true);
                }
            };

            const handleImageError = () => {
                errorCount++;
                if (loadedCount + errorCount === images.length) {
                    setImagesLoaded(true);
                }
            };

            // Check each image
            images.forEach((img) => {
                if (img.complete) {
                    // Image already loaded or failed
                    if (img.naturalHeight === 0) {
                        errorCount++;
                    } else {
                        loadedCount++;
                    }
                } else {
                    // Image still loading
                    img.addEventListener("load", handleImageLoad, {
                        once: true,
                    });
                    img.addEventListener("error", handleImageError, {
                        once: true,
                    });
                }
            });

            // Check if all images are already loaded
            if (loadedCount + errorCount === images.length) {
                setImagesLoaded(true);
            }
        };

        // Small delay to ensure DOM is fully rendered with images
        const timer = setTimeout(checkImagesLoaded, 100);
        return () => clearTimeout(timer);
    }, dependencies);

    return imagesLoaded;
};
