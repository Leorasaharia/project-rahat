"use client"

import { useState, useEffect } from "react"
import type { Language } from "@/lib/i18n"

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && (savedLang === "en" || savedLang === "hi")) {
      setLanguage(savedLang)
    }
  }, [])

  const toggleLanguage = () => {
    const newLang: Language = language === "en" ? "hi" : "en"
    setLanguage(newLang)
    localStorage.setItem("language", newLang)
  }

  return { language, toggleLanguage }
}
