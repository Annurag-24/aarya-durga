import { createContext, useContext, useState, useCallback, useRef } from 'react';

interface LoaderContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setLoading] = useState(false);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const MIN_LOAD_TIME = 600; // Minimum time to show loader (ms) to ensure images render

  const showLoader = useCallback(() => {
    // Clear any existing timer
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
    setLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    // Set a minimum display time to ensure images have time to render
    loadingTimerRef.current = setTimeout(() => {
      setLoading(false);
    }, MIN_LOAD_TIME);
  }, []);

  // Legacy support for setLoading
  const legacySetLoading = useCallback((loading: boolean) => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  return (
    <LoaderContext.Provider value={{ isLoading, setLoading: legacySetLoading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within LoaderProvider');
  }
  return context;
};
