"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Country = "USA" | "UK" | "Turkey";
export type Language = "en" | "tr";

interface CountryContextType {
  country: Country | null;
  setCountry: (country: Country) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  loading: boolean;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

const COUNTRY_STORAGE_KEY = "selectedCountry";
const LANGUAGE_STORAGE_KEY = "selectedLanguage";

const getLanguageForCountry = (country: Country | null): Language => {
  if (country === "Turkey") {
    return "tr";
  }
  return "en";
};

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<Country | null>(null);
  const [language, setLanguageState] = useState<Language>("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load country from localStorage on mount
    const savedCountry = localStorage.getItem(COUNTRY_STORAGE_KEY) as Country | null;
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (savedCountry === "USA" || savedCountry === "UK" || savedCountry === "Turkey") {
      setCountryState(savedCountry);
      if (savedLanguage === "en" || savedLanguage === "tr") {
        setLanguageState(savedLanguage);
      } else {
        setLanguageState(getLanguageForCountry(savedCountry));
      }
    } else if (savedLanguage === "en" || savedLanguage === "tr") {
      setLanguageState(savedLanguage);
    }
    setLoading(false);
  }, []);

  const setCountry = (newCountry: Country) => {
    setCountryState(newCountry);
    localStorage.setItem(COUNTRY_STORAGE_KEY, newCountry);
    const derivedLanguage = getLanguageForCountry(newCountry);
    setLanguageState(derivedLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, derivedLanguage);
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
  };

  return (
    <CountryContext.Provider value={{ country, setCountry, language, setLanguage, loading }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}

