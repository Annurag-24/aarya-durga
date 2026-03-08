import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchPageContent } from '@/api/helpers';

interface HomePageContextType {
  pageData: any[];
  loading: boolean;
}

const HomePageContext = createContext<HomePageContextType | undefined>(undefined);

export const HomePageProvider = ({ children }: { children: ReactNode }) => {
  const [pageData, setPageData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPageContent('home');
        setPageData(data);
      } catch (error) {
        console.error('Error fetching home page data:', error);
        setPageData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <HomePageContext.Provider value={{ pageData, loading }}>
      {children}
    </HomePageContext.Provider>
  );
};

export const useHomePageData = () => {
  const context = useContext(HomePageContext);
  if (!context) {
    throw new Error('useHomePageData must be used within HomePageProvider');
  }
  return context;
};
