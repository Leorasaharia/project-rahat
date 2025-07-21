"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/useLanguage"

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
    >
      {language === "en" ? "हिंदी" : "English"}
    </Button>
  )
}
