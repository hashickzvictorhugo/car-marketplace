import { Listing, Brand, Model, User, Inquiry, Favorite, Comparison } from "@prisma/client"

export type ListingWithRelations = Listing & {
  brand: Brand
  model: Model
  seller: Pick<User, "id" | "name" | "avatar" | "phone" | "isVerified" | "createdAt">
  images: { id: string; url: string; alt: string | null; isCover: boolean; sortOrder: number }[]
  features: { id: string; key: string; value: string }[]
  _count?: {
    favorites: number
    inquiries: number
    views: number
  }
  isFavorited?: boolean
}

export type BrandWithModels = Brand & {
  models: Model[]
  _count?: {
    models: number
    listings: number
  }
}

export type ModelWithBrand = Model & {
  brand: Brand
}

export type SellerDashboardStats = {
  totalListings: number
  activeListings: number
  soldListings: number
  pendingListings: number
  totalViews: number
  totalInquiries: number
  totalFavorites: number
  recentInquiries: InquiryWithListing[]
}

export type InquiryWithListing = Inquiry & {
  listing: Pick<Listing, "id" | "title" | "price" | "images"> & {
    images: { url: string; isCover: boolean }[]
  }
}

export type SearchFilters = {
  query?: string
  brandId?: string
  modelId?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  maxMileage?: number
  fuelType?: string[]
  transmission?: string[]
  bodyType?: string[]
  colors?: string[]
  state?: string
  city?: string
  featured?: boolean
  sortBy?: "price_asc" | "price_desc" | "year_desc" | "year_asc" | "mileage_asc" | "mileage_desc" | "newest" | "oldest"
  page?: number
  limit?: number
}

export type SearchResult = {
  listings: ListingWithRelations[]
  total: number
  page: number
  limit: number
  totalPages: number
  facets: {
    brands: { id: string; name: string; count: number }[]
    models: { id: string; name: string; count: number }[]
    fuelTypes: { value: string; label: string; count: number }[]
    transmissions: { value: string; label: string; count: number }[]
    bodyTypes: { value: string; label: string; count: number }[]
    priceRanges: { min: number; max: number; count: number }[]
    yearRanges: { min: number; max: number; count: number }[]
  }
}

export type FinancingSimulation = {
  price: number
  downPayment: number
  months: number
  monthlyPayment: number
  totalInterest: number
  totalPaid: number
  rate: number
}

export type ComparisonItem = ListingWithRelations & {
  specs: Record<string, string>
}

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}