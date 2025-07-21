"use client"

import { useState, useEffect } from "react"

export type Language = "en" | "hi"

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "hi" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  return { language, toggleLanguage }
}
