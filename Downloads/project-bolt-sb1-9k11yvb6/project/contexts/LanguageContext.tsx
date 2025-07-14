import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { getTranslation } from '@/lib/translations';

interface LanguageContextType {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  t: (key: string) => string;
  isLanguageLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [selectedLanguage, setSelectedLanguageState] = useState('en'); // Default to English
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await storage.getItem('selectedLanguage');
      if (savedLanguage) {
        setSelectedLanguageState(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    } finally {
      setIsLanguageLoaded(true);
    }
  };

  const setSelectedLanguage = async (language: string) => {
    try {
      setSelectedLanguageState(language);
      await storage.setItem('selectedLanguage', language);
      
      // Force re-render of all components using translations
      // by updating a timestamp that components can watch
      await storage.setItem('languageChangeTimestamp', Date.now().toString());
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  // Translation function
  const t = (key: string): string => {
    return getTranslation(key, selectedLanguage);
  };

  const value = {
    selectedLanguage,
    setSelectedLanguage,
    t,
    isLanguageLoaded,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}