import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import zh from '@/locales/zh.json';
import es from '@/locales/es.json';

export type LanguageCode = 'en' | 'hi' | 'zh' | 'es';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
  availableLanguages: Array<{ code: LanguageCode; name: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<LanguageCode, any> = {
  en,
  hi,
  zh,
  es,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem('languagePreference');
      if (storedLanguage && storedLanguage in translations) {
        setCurrentLanguage(storedLanguage as LanguageCode);
      }
    } catch (error) {
      console.error('Failed to load language preference:', error);
    }
  };

  const availableLanguages: Array<{ code: LanguageCode; name: string }> = [
    { code: 'en', name: 'English (UK)' },
    { code: 'hi', name: 'Hindi' },
    { code: 'zh', name: 'Chinese' },
    { code: 'es', name: 'Spanish' },
  ];

  const handleSetLanguage = async (language: LanguageCode) => {
    if (language in translations) {
      setCurrentLanguage(language);
      try {
        await AsyncStorage.setItem('languagePreference', language);
      } catch (error) {
        console.error('Failed to save language preference:', error);
      }
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage: handleSetLanguage,
        t,
        availableLanguages,
      }}>
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
