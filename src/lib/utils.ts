import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("pt-BR").format(num)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffDays > 0) return `${diffDays}d atrás`
  if (diffHours > 0) return `${diffHours}h atrás`
  if (diffMinutes > 0) return `${diffMinutes}min atrás`
  return "Agora mesmo"
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function generateListingSlug(listing: { id: string; brand: string; model: string; year: number }): string {
  return `${slugify(listing.brand)}-${slugify(listing.model)}-${listing.year}-${listing.id.slice(0, 8)}`
}

export function calculateFinancing(
  price: number,
  downPayment: number,
  months: number,
  annualRate: number = 0.015 // 1.5% ao mês aproximado
): { monthlyPayment: number; totalInterest: number; totalPaid: number } {
  const financedAmount = price - downPayment
  if (financedAmount <= 0) return { monthlyPayment: 0, totalInterest: 0, totalPaid: downPayment }

  const monthlyRate = annualRate
  const monthlyPayment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  const totalPaid = monthlyPayment * months + downPayment
  const totalInterest = totalPaid - price

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
  }
}

export const FUEL_TYPES = {
  GASOLINE: { label: "Gasolina", icon: "⛽" },
  ETHANOL: { label: "Etanol", icon: "🌱" },
  FLEX: { label: "Flex", icon: "🔄" },
  DIESEL: { label: "Diesel", icon: "⛽" },
  HYBRID: { label: "Híbrido", icon: "🔋⛽" },
  ELECTRIC: { label: "Elétrico", icon: "🔋" },
  GNV: { label: "GNV", icon: "💨" },
} as const

export const TRANSMISSION_TYPES = {
  MANUAL: { label: "Manual", icon: "⚙️" },
  AUTOMATIC: { label: "Automático", icon: "🤖" },
  CVT: { label: "CVT", icon: "∞" },
  AUTOMATED: { label: "Automatizado", icon: "🤖⚙️" },
} as const

export const BODY_TYPES = {
  HATCH: { label: "Hatch", icon: "🚗" },
  SEDAN: { label: "Sedã", icon: "🚙" },
  SUV: { label: "SUV", icon: "🚙" },
  PICKUP: { label: "Picape", icon: "🛻" },
  COUPE: { label: "Cupê", icon: "🏎️" },
  CONVERTIBLE: { label: "Conversível", icon: "🏎️" },
  WAGON: { label: "Perua", icon: "🚙" },
  VAN: { label: "Van", icon: "🚐" },
  MINIVAN: { label: "Minivan", icon: "🚐" },
} as const

export const LISTING_STATUS_LABELS = {
  DRAFT: "Rascunho",
  PENDING_REVIEW: "Em análise",
  ACTIVE: "Ativo",
  SOLD: "Vendido",
  REJECTED: "Rejeitado",
  EXPIRED: "Expirado",
} as const

export const USER_ROLE_LABELS = {
  BUYER: "Comprador",
  SELLER: "Vendedor",
  ADMIN: "Admin",
} as const

export const STATES_BR = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
] as const

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + "..."
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), ms)
  }
}