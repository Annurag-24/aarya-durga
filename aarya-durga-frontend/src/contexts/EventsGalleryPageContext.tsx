import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchPageContent } from '@/api/helpers';

interface EventsGalleryPageContextType {
  pageData: any[];
  loading: boolean;
}

const EventsGalleryPageContext = createContext<EventsGalleryPageContextType | undefined>(undefined);

export const EventsGalleryPageProvider = ({ children }: { children: ReactNode }) => {
  const [pageData, setPageData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPageContent('events_gallery');
        setPageData(data);
      } catch (error) {
        console.error('Error fetching events gallery page data:', error);
        setPageData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <EventsGalleryPageContext.Provider value={{ pageData, loading }}>
      {children}
    </EventsGalleryPageContext.Provider>
  );
};

export const useEventsGalleryPageData = () => {
  const context = useContext(EventsGalleryPageContext);
  if (!context) {
    throw new Error('useEventsGalleryPageData must be used within EventsGalleryPageProvider');
  }
  return context;
};
