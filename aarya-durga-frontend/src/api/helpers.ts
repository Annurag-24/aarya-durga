import client from './client';
import { constructImageUrl } from './imageUrl';

/**
 * Fetch page content by page key
 */
export const fetchPageContent = async (pageKey: string) => {
  try {
    const response = await client.get(`/public/page-content/${pageKey}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching page content for ${pageKey}:`, error);
    return [];
  }
};

/**
 * Fetch specific section from page content
 */
export const fetchPageSection = async (pageKey: string, sectionKey: string) => {
  try {
    const response = await client.get(`/public/page-content/${pageKey}/${sectionKey}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${pageKey}/${sectionKey}:`, error);
    return null;
  }
};

/**
 * Get content value by language from page content item
 */
export const getContentByLanguage = (item: any, language: 'en' | 'hi' | 'mr'): string => {
  if (!item) return '';
  const contentKey = `content_${language}`;
  return item[contentKey] || '';
};

/**
 * Get image URL from page content item
 */
export const getImageUrl = (item: any): string => {
  if (!item?.image?.file_url) return '';
  return constructImageUrl(item.image.file_url);
};

/**
 * Find item in page content array by section key
 */
export const findContentItem = (data: any[], sectionKey: string) => {
  return data.find((item: any) => item.section_key === sectionKey);
};

/**
 * Find multiple items by regex pattern
 */
export const findContentByPattern = (data: any[], pattern: RegExp): Map<number, any> => {
  const items = new Map<number, any>();
  data.forEach((item: any) => {
    const match = item.section_key.match(pattern);
    if (match) {
      items.set(parseInt(match[1], 10), item);
    }
  });
  return items;
};

/**
 * Get sorted content items by numeric index (for events, gallery, etc.)
 * @param data - Page content array
 * @param prefix - Prefix to match (e.g., 'event_', 'gallery_')
 * @param limit - Maximum number of items to return
 * @returns Sorted array of content items
 */
export const getSortedContentByPrefix = (
  data: any[],
  prefix: string,
  limit?: number
): any[] => {
  const pattern = new RegExp(`^${prefix}(\\d+)_`);
  const items = findContentByPattern(data, pattern);

  const sorted = Array.from(items.entries())
    .sort((a, b) => a[0] - b[0])
    .slice(0, limit)
    .map(([_, item]) => item);

  return sorted;
};

/**
 * Build object with content in all languages
 */
export const buildMultilingualContent = (
  item: any,
  fallback = ''
): { en: string; hi: string; mr: string } => {
  return {
    en: getContentByLanguage(item, 'en') || fallback,
    hi: getContentByLanguage(item, 'hi') || fallback,
    mr: getContentByLanguage(item, 'mr') || fallback,
  };
};
