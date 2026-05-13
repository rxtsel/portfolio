import type { Locale } from "@/lib/i18n"

export const dateTimeLabels = {
  en: {
    languageTag: "en-US",
    month: { one: "month", other: "months" },
    present: "Present",
    year: { one: "year", other: "years" },
  },
  es: {
    languageTag: "es-CO",
    month: { one: "mes", other: "meses" },
    present: "Actualidad",
    year: { one: "año", other: "años" },
  },
} satisfies Record<
  Locale,
  {
    languageTag: string
    month: Record<"one" | "other", string>
    present: string
    year: Record<"one" | "other", string>
  }
>

export function getDateTimeUnitLabel(unit: "month" | "year", value: number, locale: Locale) {
  return dateTimeLabels[locale][unit][value === 1 ? "one" : "other"]
}
