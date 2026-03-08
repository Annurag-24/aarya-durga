import { useEffect } from 'react';
import { constructImageUrl } from '@/api/imageUrl';
import { useSettings } from '@/contexts/SettingsContext';

export const SiteTitleFaviconManager = () => {
  const { settingsData } = useSettings();

  useEffect(() => {
    if (settingsData) {
      // Update page title
      if (settingsData.site_title) {
        document.title = settingsData.site_title;
      }

      // Update favicon
      if (settingsData.favicon?.file_url) {
        let faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;

        if (!faviconLink) {
          faviconLink = document.createElement('link');
          faviconLink.rel = 'icon';
          document.head.appendChild(faviconLink);
        }

        // Construct full URL using helper
        const faviconUrl = settingsData.favicon.file_url.startsWith('http')
          ? settingsData.favicon.file_url
          : constructImageUrl(settingsData.favicon.file_url);

        faviconLink.href = faviconUrl;
      }
    }
  }, [settingsData]);

  return null;
};
