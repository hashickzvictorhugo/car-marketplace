"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, Grid, List, Loader2, MapPin, Calendar, Gauge, Fuel, Settings, Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import { CarCard } from "@/components/car-card"
import { SearchFiltersComponent } from "@/components/search-filters"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn, formatPrice, formatNumber } from "@/lib/utils"

interface Listing {
  id: string
  title: string
  brand: { name: string; id: string }
  model: { name: string; id: string }
  price: number
  year: number
  mileage: number
  fuelType: string
  transmission: string
  bodyType: string
  color: string
  city: string
  state: string
  featured: boolean
  status: string
  images: { id: string; url: string; alt: string; isCover: boolean }[]
  seller: { name: string; isVerified: boolean }
}

interface SearchFiltersState {
  query: string
  brand: string
  model: string
  minPrice: number
  maxPrice: number
  minYear: number
  maxYear: number
  minMileage: number
  maxMileage: number
  fuelType: string[]
  transmission: string[]
  bodyType: string[]
  condition: string
  state: string
  city: string
  featured: boolean
  sort: string
}

const FUEL_TYPES = [
  { value: "GASOLINE", label: "Gasolina" },
  { value: "ETHANOL", label: "Etanol" },
  { value: "FLEX", label: "Flex" },
  { value: "DIESEL", label: "Diesel" },
  { value: "HYBRID", label: "Híbrido" },
  { value: "ELECTRIC", label: "Elétrico" },
  { value: "GNV", label: "GNV" },
]

const TRANSMISSIONS = [
  { value: "MANUAL", label: "Manual" },
  { value: "AUTOMATIC", label: "Automático" },
  { value: "CVT", label: "CVT" },
  { value: "SEMI_AUTO", label: "Automatizado" },
]

const BODY_TYPES = [
  { value: "HATCH", label: "Hatch" },
  { value: "SEDAN", label: "Sedã" },
  { value: "SUV", label: "SUV" },
  { value: "PICKUP", label: "Picape" },
  { value: "COUPE", label: "Cupê" },
  { value: "CONVERTIBLE", label: "Conversível" },
  { value: "WAGON", label: "Perua" },
  { value: "MINIVAN", label: "Minivan" },
  { value: "VAN", label: "Van" },
]

const STATES = [
  { value: "SP", label: "São Paulo" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "MG", label: "Minas Gerais" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "PR", label: "Paraná" },
  { value: "SC", label: "Santa Catarina" },
  { value: "BA", label: "Bahia" },
  { value: "GO", label: "Goiás" },
  { value: "PE", label: "Pernambuco" },
  { value: "CE", label: "Ceará" },
]

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevância" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "year_desc", label: "Ano (mais novo)" },
  { value: "year_asc", label: "Ano (mais antigo)" },
  { value: "mileage_asc", label: "Menor km" },
  { value: "mileage_desc", label: "Maior km" },
  { value: "newest", label: "Mais recentes" },
]

const DEFAULT_FILTERS: SearchFiltersState = {
  query: "",
  brand: "",
  model: "",
  minPrice: 0,
  maxPrice: 1000000,
  minYear: 1990,
  maxYear: new Date().getFullYear() + 1,
  minMileage: 0,
  maxMileage: 500000,
  fuelType: [],
  transmission: [],
  bodyType: [],
  condition: "",
  state: "",
  city: "",
  featured: false,
  sort: "relevance",
}

export function ComprarClient({ initialListings }: { initialListings: Listing[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [listings] = useState<Listing[]>(initialListings)
  const [filters, setFilters] = useState<SearchFiltersState>(DEFAULT_FILTERS)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const itemsPerPage = 12

  // Initialize filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const newFilters = { ...DEFAULT_FILTERS }

    if (params.get("q")) newFilters.query = params.get("q")!
    if (params.get("brand")) newFilters.brand = params.get("brand")!
    if (params.get("model")) newFilters.model = params.get("model")!
    if (params.get("minPrice")) newFilters.minPrice = parseInt(params.get("minPrice")!)
    if (params.get("maxPrice")) newFilters.maxPrice = parseInt(params.get("maxPrice")!)
    if (params.get("minYear")) newFilters.minYear = parseInt(params.get("minYear")!)
    if (params.get("maxYear")) newFilters.maxYear = parseInt(params.get("maxYear")!)
    if (params.get("minMileage")) newFilters.minMileage = parseInt(params.get("minMileage")!)
    if (params.get("maxMileage")) newFilters.maxMileage = parseInt(params.get("maxMileage")!)
    if (params.get("fuelType")) newFilters.fuelType = params.get("fuelType")!.split(",").filter(Boolean)
    if (params.get("transmission")) newFilters.transmission = params.get("transmission")!.split(",").filter(Boolean)
    if (params.get("bodyType")) newFilters.bodyType = params.get("bodyType")!.split(",").filter(Boolean)
    if (params.get("condition")) newFilters.condition = params.get("condition")!
    if (params.get("state")) newFilters.state = params.get("state")!
    if (params.get("city")) newFilters.city = params.get("city")!
    if (params.get("featured")) newFilters.featured = params.get("featured") === "true"
    if (params.get("sort")) newFilters.sort = params.get("sort")!
    if (params.get("page")) setCurrentPage(parseInt(params.get("page")!))

    setFilters(newFilters)
  }, [searchParams])

  // Update URL when filters change
  const updateFilters = (newFilters: Partial<SearchFiltersState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)

    const params = new URLSearchParams()
    if (updated.query) params.set("q", updated.query)
    if (updated.brand) params.set("brand", updated.brand)
    if (updated.model) params.set("model", updated.model)
    if (updated.minPrice > 0) params.set("minPrice", updated.minPrice.toString())
    if (updated.maxPrice < 1000000) params.set("maxPrice", updated.maxPrice.toString())
    if (updated.minYear > 1990) params.set("minYear", updated.minYear.toString())
    if (updated.maxYear < new Date().getFullYear() + 1) params.set("maxYear", updated.maxYear.toString())
    if (updated.minMileage > 0) params.set("minMileage", updated.minMileage.toString())
    if (updated.maxMileage < 500000) params.set("maxMileage", updated.maxMileage.toString())
    if (updated.fuelType.length > 0) params.set("fuelType", updated.fuelType.join(","))
    if (updated.transmission.length > 0) params.set("transmission", updated.transmission.join(","))
    if (updated.bodyType.length > 0) params.set("bodyType", updated.bodyType.join(","))
    if (updated.condition) params.set("condition", updated.condition)
    if (updated.state) params.set("state", updated.state)
    if (updated.city) params.set("city", updated.city)
    if (updated.featured) params.set("featured", "true")
    if (updated.sort !== "relevance") params.set("sort", updated.sort)
    if (currentPage > 1) params.set("page", currentPage.toString())

    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setCurrentPage(1)
    router.push(pathname)
  }

  const hasActiveFilters = useMemo(() => {
    return (
      filters.query ||
      filters.brand ||
      filters.model ||
      filters.minPrice > 0 ||
      filters.maxPrice < 1000000 ||
      filters.minYear > 1990 ||
      filters.maxYear < new Date().getFullYear() + 1 ||
      filters.minMileage > 0 ||
      filters.maxMileage < 500000 ||
      filters.fuelType.length > 0 ||
      filters.transmission.length > 0 ||
      filters.bodyType.length > 0 ||
      filters.condition ||
      filters.state ||
      filters.city ||
      filters.featured
    )
  }, [filters])

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      if (filters.query) {
        const query = filters.query.toLowerCase()
        const searchText = `${listing.title} ${listing.brand.name} ${listing.model.name} ${listing.city} ${listing.color}`.toLowerCase()
        if (!searchText.includes(query)) return false
      }
      if (filters.brand && listing.brand.id !== filters.brand) return false
      if (filters.model && listing.model.id !== filters.model) return false
      if (listing.price < filters.minPrice || listing.price > filters.maxPrice) return false
      if (listing.year < filters.minYear || listing.year > filters.maxYear) return false
      if (listing.mileage < filters.minMileage || listing.mileage > filters.maxMileage) return false
      if (filters.fuelType.length > 0 && !filters.fuelType.includes(listing.fuelType)) return false
      if (filters.transmission.length > 0 && !filters.transmission.includes(listing.transmission)) return false
      if (filters.bodyType.length > 0 && !filters.bodyType.includes(listing.bodyType)) return false
      if (filters.state && listing.state !== filters.state) return false
      if (filters.city && listing.city !== filters.city) return false
      if (filters.featured && !listing.featured) return false
      return true
    })
  }, [listings, filters])

  const sortedListings = useMemo(() => {
    const sorted = [...filteredListings]
    switch (filters.sort) {
      case "price_asc":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "year_desc":
        sorted.sort((a, b) => b.year - a.year)
        break
      case "year_asc":
        sorted.sort((a, b) => a.year - b.year)
        break
      case "mileage_asc":
        sorted.sort((a, b) => a.mileage - b.mileage)
        break
      case "mileage_desc":
        sorted.sort((a, b) => b.mileage - a.mileage)
        break
      case "newest":
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      default:
        // Relevance: featured first, then by year desc
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.year - a.year)
    }
    return sorted
  }, [filteredListings, filters.sort])

  const totalPages = Math.ceil(sortedListings.length / itemsPerPage)
  const paginatedListings = sortedListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-BR").format(num)
  }

  const getFuelLabel = (value: string) => {
    return FUEL_TYPES.find((f) => f.value === value)?.label || value
  }

  const getTransmissionLabel = (value: string) => {
    return TRANSMISSIONS.find((t) => t.value === value)?.label || value
  }

  const getBodyTypeLabel = (value: string) => {
    return BODY_TYPES.find((b) => b.value === value)?.label || value
  }

  const getStateLabel = (value: string) => {
    return STATES.find((s) => s.value === value)?.label || value
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {sortedListings.length} veículo{sortedListings.length !== 1 ? "s" : ""} encontrado{sortedListings.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-muted rounded-lg p-1" role="group" aria-label="Modo de visualização">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === "grid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Visualização em grade"
              aria-pressed={viewMode === "grid"}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === "list" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Visualização em lista"
              aria-pressed={viewMode === "list"}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Sort Select */}
          <Select value={filters.sort} onValueChange={(value) => updateFilters({ sort: value, page: 1 })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {filters.query && (
            <Badge variant="secondary" className="gap-1">
              Busca: {filters.query}
              <button onClick={() => updateFilters({ query: "" })} className="hover:text-foreground">×</button>
            </Badge>
          )}
          {filters.brand && (
            <Badge variant="secondary" className="gap-1">
              Marca
              <button onClick={() => updateFilters({ brand: "", model: "" })} className="hover:text-foreground">×</button>
            </Badge>
          )}
          {filters.fuelType.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Combustível: {filters.fuelType.map(getFuelLabel).join(", ")}
              <button onClick={() => updateFilters({ fuelType: [] })} className="hover:text-foreground">×</button>
            </Badge>
          )}
          {filters.transmission.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Câmbio: {filters.transmission.map(getTransmissionLabel).join(", ")}
              <button onClick={() => updateFilters({ transmission: [] })} className="hover:text-foreground">×</button>
            </Badge>
          )}
          {filters.bodyType.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Tipo: {filters.bodyType.map(getBodyTypeLabel).join(", ")}
              <button onClick={() => updateFilters({ bodyType: [] })} className="hover:text-foreground">×</button>
            </Badge>
          )}
          {filters.state && (
            <Badge variant="secondary" className="gap-1">
              {getStateLabel(filters.state)}
              <button onClick={() => updateFilters({ state: "", city: "" })} className="hover:text-foreground">×</button>
            </Badge>
          )}
          {filters.featured && (
            <Badge variant="secondary" className="gap-1">
              Destaques
              <button onClick={() => updateFilters({ featured: false })} className="hover:text-foreground">×</button>
            </Badge>
          )}
          {filters.minPrice > 0 || filters.maxPrice < 1000000 ? (
            <Badge variant="secondary" className="gap-1">
              {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
              <button onClick={() => updateFilters({ minPrice: 0, maxPrice: 1000000 })} className="hover:text-foreground">×</button>
            </Badge>
          ) : null}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" /> Limpar todos
          </Button>
        </div>
      )}

      {/* Mobile Filters Toggle */}
      <Button
        variant="outline"
        className="sm:hidden w-full justify-start gap-2"
        onClick={() => setShowMobileFilters(true)}
      >
        <Filter className="h-4 w-4" />
        Filtros {hasActiveFilters && <Badge variant="secondary" className="ml-1">{Object.entries(filters).filter(([k, v]) => k !== "sort" && k !== "page" && v && (Array.isArray(v) ? v.length > 0 : v !== (DEFAULT_FILTERS as any)[k])).length}</Badge>}
      </Button>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <SearchFilters
            filters={filters}
            onFiltersChange={updateFilters}
            fuelTypes={FUEL_TYPES}
            transmissions={TRANSMISSIONS}
            bodyTypes={BODY_TYPES}
            states={STATES}
            maxPrice={1000000}
            maxYear={new Date().getFullYear() + 1}
            maxMileage={500000}
          />
        </aside>

        {/* Listings Grid/List */}
        <div className="flex-1 min-w-0">
          {paginatedListings.length === 0 ? (
            <div className="text-center py-16">
              <Loader2 className="h-12 w-12 mx-auto text-muted-foreground/50 animate-spin" />
              <h3 className="mt-4 text-lg font-medium">Nenhum veículo encontrado</h3>
              <p className="text-muted-foreground mt-1">Tente ajustar seus filtros ou buscar por outros termos</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Limpar todos os filtros
              </Button>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedListings.map((listing) => (
                    <CarCard key={listing.id} listing={listing} variant="default" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedListings.map((listing) => (
                    <CarCard key={listing.id} listing={listing} variant="compact" />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Paginação">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newPage = currentPage - 1
                      setCurrentPage(newPage)
                      updateFilters({ page: newPage })
                    }}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setCurrentPage(pageNum)
                          updateFilters({ page: pageNum })
                        }}
                        aria-label={`Página ${pageNum}`}
                        aria-current={currentPage === pageNum ? "page" : undefined}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newPage = currentPage + 1
                      setCurrentPage(newPage)
                      updateFilters({ page: newPage })
                    }}
                    disabled={currentPage === totalPages}
                    aria-label="Próxima página"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filtros</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-1 rounded hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <SearchFilters
                filters={filters}
                onFiltersChange={updateFilters}
                fuelTypes={FUEL_TYPES}
                transmissions={TRANSMISSIONS}
                bodyTypes={BODY_TYPES}
                states={STATES}
                maxPrice={1000000}
                maxYear={new Date().getFullYear() + 1}
                maxMileage={500000}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}