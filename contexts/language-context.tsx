"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type Language, translations } from "@/lib/translations"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations.en) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Intentar obtener el idioma guardado en localStorage, o usar inglés por defecto
  const [language, setLanguageState] = useState<Language>("es") // Cambiar la línea donde se establece el estado inicial del idioma

  // Cargar el idioma guardado cuando el componente se monta
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // Guardar el idioma en localStorage cuando cambia
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  // Función para obtener traducciones
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Hook personalizado para usar el contexto
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

