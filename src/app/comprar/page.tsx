"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, X, ChevronDown, ChevronUp, List, Grid, Loader2 } from "lucide-react"
import { cn, formatPrice, formatNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CarCard } from "@/components/car-card"
import { SearchFiltersComponent } from "@/components/search-filters"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const mockListings = [
  {
    id: "1",
    title: "Onix LT 1.0 Turbo Flex",
    brand: { name: "Chevrolet", id: "1" },
    model: { name: "Onix", id: "1" },
    price: 89900,
    year: 2023,
    mileage: 15000,
    fuelType: "FLEX",
    transmission: "MANUAL",
    bodyType: "HATCH",
    color: "Branco",
    city: "São Paulo",
    state: "SP",
    featured: true,
    status: "ACTIVE",
    images: [{ id: "1", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800", alt: "Chevrolet Onix", isCover: true }],
    seller: { name: "AutoMax Seminovos", isVerified: true },
  },
  {
    id: "2",
    title: "Corolla XEi 2.0 Hybrid",
    brand: { name: "Toyota", id: "5" },
    model: { name: "Corolla", id: "5" },
    price: 189900,
    year: 2023,
    mileage: 8000,
    fuelType: "HYBRID",
    transmission: "CVT",
    bodyType: "SEDAN",
    color: "Prata",
    city: "São Paulo",
    state: "SP",
    featured: false,
    status: "ACTIVE",
    images: [{ id: "2", url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800", alt: "Toyota Corolla", isCover: true }],
    seller: { name: "Toyota São Paulo", isVerified: true },
  },
  {
    id: "3",
    title: "Compass Limited 2.0 Diesel",
    brand: { name: "Jeep", id: "10" },
    model: { name: "Compass", id: "10" },
    price: 219900,
    year: 2022,
    mileage: 25000,
    fuelType: "DIESEL",
    transmission: "AUTOMATIC",
    bodyType: "SUV",
    color: "Preto",
    city: "Rio de Janeiro",
    state: "RJ",
    featured: false,
    status: "ACTIVE",
    images: [{ id: "3", url: "https://images.unsplash.com/photo-1520031032609-855c4f8a4c7a?w=800", alt: "Jeep Compass", isCover: true }],
    seller: { name: "Jeep Rio", isVerified: true },
  },
  {
    id: "4",
    title: "HB20 Platinum 1.0 Turbo",
    brand: { name: "Hyundai", id: "4" },
    model: { name: "HB20", id: "4" },
    price: 95900,
    year: 2023,
    mileage: 12000,
    fuelType: "FLEX",
    transmission: "AUTOMATIC",
    bodyType: "HATCH",
    color: "Azul",
    city: "Belo Horizonte",
    state: "MG",
    featured: false,
    status: "ACTIVE",
    images: [{ id: "4", url: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800", alt: "Hyundai HB20", isCover: true }],
    seller: { name: "Hyundai BH", isVerified: true },
  },
  {
    id: "5",
    title: "T-Cross Highline 1.4 TSI",
    brand: { name: "Volkswagen", id: "2" },
    model: { name: "T-Cross", id: "2" },
    price: 149900,
    year: 2023,
    mileage: 18000,
    fuelType: "FLEX",
    transmission: "AUTOMATIC",
    bodyType: "SUV",
    color: "Cinza",
    city: "Curitiba",
    state: "PR",
    featured: false,
    status: "ACTIVE",
    images: [{ id: "5", url: "https://images.unsplash.com/photo-1606664515524-edb54d20657d?w=800", alt: "VW T-Cross", isCover: true }],
    seller: { name: "VW Curitiba", isVerified: true },
  },
  {
    id: "6",
    title: "Argo Trekking 1.3 Flex",
    brand: { name: "Fiat", id: "3" },
    model: { name: "Argo", id: "3" },
    price: 82900,
    year: 2023,
    mileage: 22000,
    fuelType: "FLEX",
    transmission: "MANUAL",
    bodyType: "HATCH",
    color: "Vermelho",
    city: "Porto Alegre",
    state: "RS",
    featured: false,
    status: "ACTIVE",
    images: [{ id: "6", url: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800", alt: "Fiat Argo", isCover: true }],
    seller: { name: "Fiat RS", isVerified: true },
  },
  {
    id: "7",
    title: "Kicks SV 1.6 CVT",
    brand: { name: "Nissan", id: "9" },
    model: { name: "Kicks", id: "9" },
    price: 119900,
    year: 2023,
    mileage: 14000,
    fuelType: "FLEX",
    transmission: "CVT",
    bodyType: "SUV",
    color: "Branco",
    city: "Salvador",
    state: "BA",
    featured: false,
    status: "ACTIVE",
    images: [{ id: "7", url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800", alt: "Nissan Kicks", isCover: true }],
    seller: { name: "Nissan Bahia", isVerified: true },
  },
  {
    id: "8",
    title: "Ranger Limited 2.0 Diesel",
    brand: { name: "Ford", id: "6" },
    model: { name: "Ranger", id: "6" },
    price: 289900,
    year: 2022,
    mileage: 35000,
    fuelType: "DIESEL",
    transmission: "AUTOMATIC",
    bodyType: "PICKUP",
    color: "Prata",
    city: "Fortaleza",
    state: "CE",
    featured: false,
    status: "ACTIVE",
    images: [{ id: "8", url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800", alt: "Ford Ranger", isCover: true }],
    seller: { name: "Ford Fortaleza", isVerified: true },
  },
]

export default function ComprarPage() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState(mockListings)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const totalPages = Math.ceil(listings.length / itemsPerPage)
  const paginatedListings = listings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const activeFilters = searchParams.get("brand") || searchParams.get("model") || searchParams.get("minPrice") || searchParams.get("maxPrice") || searchParams.get("state") || searchParams.getAll("fuelType").length > 0 || searchParams.getAll("transmission").length > 0 || searchParams.getAll("bodyType").length > 0

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const sorted = [...listings].sort((a, b) => {
      switch (value) {
        case "price_asc": return a.price - b.price
        case "price_desc": return b.price - a.price
        case "year_desc": return b.year - a.year
        case "year_asc": return a.year - b.year
        case "mileage_asc": return a.mileage - b.mileage
        case "mileage_desc": return b.mileage - a.mileage
        case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
    setListings(sorted)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">Comprar Veículos</h1>
                <p className="text-muted-foreground mt-1">{listings.length} veículos encontrados</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => setFiltersOpen(!filtersOpen)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                  {activeFilters && <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{searchParams.getAll("fuelType").length + searchParams.getAll("transmission").length + searchParams.getAll("bodyType").length + (searchParams.get("brand") ? 1 : 0) + (searchParams.get("minPrice") ? 1 : 0) + (searchParams.get("maxPrice") ? 1 : 0)}</span>}
                </Button>
                <div className="flex items-center space-x-1 border rounded-lg overflow-hidden">
                  <Button variant={viewMode === "grid" ? "default" : "ghost" size="icon" onClick={() => setViewMode("grid")} aria-label="Grade">
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button variant={viewMode === "list" ? "default" : "ghost" size="icon" onClick={() => setViewMode("list")} aria-label="Lista">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {filtersOpen && (
              <div className="animate-slide-down mb-8">
                <SearchFiltersComponent />
              </div>
            )}

            {/* Results Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-card rounded-xl border">
              <div className="flex items-center space-x-4 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  Mostrando <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-semibold text-foreground">{Math.min(currentPage * itemsPerPage, listings.length)}</span> de <span className="font-semibold text-foreground">{listings.length}</span> resultados
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="sort" className="text-sm text-muted-foreground">Ordenar:</Label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="newest">Mais Recentes</option>
                  <option value="price_asc">Menor Preço</option>
                  <option value="price_desc">Maior Preço</option>
                  <option value="year_desc">Ano Decrescente</option>
                  <option value="year_asc">Ano Crescente</option>
                  <option value="mileage_asc">Menor Km</option>
                  <option value="mileage_desc">Maior Km</option>
                </select>
              </div>
            </div>

            {/* Listings Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border animate-pulse h-80" />
                ))}
              </div>
            ) : paginatedListings.length > 0 ? (
              <>
                <div className={cn(
                  "gap-6",
                  viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col"
                )} role="list">
                  {paginatedListings.map((listing) => (
                    <CarCard
                      key={listing.id}
                      listing={listing as any}
                      variant={viewMode === "list" ? "compact" : "default"}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className="flex items-center justify-center space-x-2 mt-8" aria-label="Paginação">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) pageNum = i + 1
                      else if (currentPage <= 3) pageNum = i + 1
                      else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                      else pageNum = currentPage - 2 + i

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="min-w-[40px]"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </nav>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhum veículo encontrado</h3>
                <p className="text-muted-foreground mb-6">Tente ajustar os filtros ou ampliar a busca</p>
                <Button variant="outline" onClick={() => window.location.href = "/comprar"}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}