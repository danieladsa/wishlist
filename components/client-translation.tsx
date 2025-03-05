"use client"

import { useLanguage } from "@/contexts/language-context"
import type { translations } from "@/lib/translations"
import type { HTMLAttributes } from "react"

interface ClientTranslationProps extends HTMLAttributes<HTMLSpanElement> {
  translationKey: keyof typeof translations.en
}

export default function ClientTranslation({ translationKey, ...props }: ClientTranslationProps) {
  const { t } = useLanguage()

  return <span {...props}>{t(translationKey)}</span>
}

