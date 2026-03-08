import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import settings from '@/api/settings';

interface SettingsContextType {
  settingsData: any;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settingsData, setSettingsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await settings.getPublic();
        setSettingsData(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setSettingsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settingsData, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
