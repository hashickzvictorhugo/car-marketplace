"use client"

import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { Heart, Car, X, ChevronRight, Filter, Grid, List, MapPin, Calendar, Gauge, Zap, Settings } from "lucide-react"
import { cn, formatPrice, formatNumber, BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CarCard } from "@/components/car-card"
import { SearchFiltersComponent } from "@/components/search-filters"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const mockFavorites = [
  { id: "1", title: "Onix LT 1.0 Turbo Flex", brand: { name: "Chevrolet", id: "1" }, model: { name: "Onix", id: "1" }, price: 89900, year: 2023, mileage: 15000, fuelType: "FLEX", transmission: "MANUAL", bodyType: "HATCH", color: "Branco", city: "São Paulo", state: "SP", featured: true, status: "ACTIVE", images: [{ id: "1", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800", alt: "Chevrolet Onix", isCover: true }], seller: { name: "AutoMax Seminovos", isVerified: true } },
  { id: "2", title: "Corolla XEi 2.0 Hybrid", brand: { name: "Toyota", id: "5" }, model: { name: "Corolla", id: "5" }, price: 189900, year: 2023, mileage: 8000, fuelType: "HYBRID", transmission: "CVT", bodyType: "SEDAN", color: "Prata", city: "São Paulo", state: "SP", featured: false, status: "ACTIVE", images: [{ id: "2", url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800", alt: "Toyota Corolla", isCover: true }], seller: { name: "Toyota São Paulo", isVerified: true } },
  { id: "3", title: "Compass Limited 2.0 Diesel", brand: { name: "Jeep", id: "10" }, model: { name: "Compass", id: "10" }, price: 219900, year: 2022, mileage: 25000, fuelType: "DIESEL", transmission: "AUTOMATIC", bodyType: "SUV", color: "Preto", city: "Rio de Janeiro", state: "RJ", featured: false, status: "ACTIVE", images: [{ id: "3", url: "https://images.unsplash.com/photo-1520031032609-855c4f8a4c7a?w=800", alt: "Jeep Compass", isCover: true }], seller: { name: "Jeep Rio", isVerified: true } },
  { id: "4", title: "HB20 Platinum 1.0 Turbo", brand: { name: "Hyundai", id: "4" }, model: { name: "HB20", id: "4" }, price: 95900, year: 2023, mileage: 12000, fuelType: "FLEX", transmission: "AUTOMATIC", bodyType: "HATCH", color: "Azul", city: "Belo Horizonte", state: "MG", featured: false, status: "ACTIVE", images: [{ id: "4", url: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800", alt: "Hyundai HB20", isCover: true }], seller: { name: "Hyundai BH", isVerified: true } },
]

export default function FavoritosPage() {
  const { userId, isLoaded } = useAuth()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-80 bg-muted rounded-xl" />)}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16">
          <div className="max-w-md mx-auto text-center">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Faça login para ver seus favoritos</h1>
            <p className="text-muted-foreground mb-6">Salve veículos que você gostou e receba alertas de preço</p>
            <Link href="/login"><Button size="lg"><Heart className="h-4 w-4 mr-2" />Entrar ou Cadastrar</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2">
                  <Heart className="h-8 w-8 text-red-500" />
                  Meus Favoritos
                </h1>
                <p className="text-muted-foreground mt-1">{mockFavorites.length} veículo{s} salvo{s}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setFiltersOpen(!filtersOpen)}>
                  <Filter className="h-4 w-4 mr-2" /> Filtros
                </Button>
                <div className="flex border rounded-lg overflow-hidden">
                  <Button variant={viewMode === "grid" ? "default" : "ghost" size="icon" onClick={() => setViewMode("grid")}><Grid className="h-4 w-4" /></Button>
                  <Button variant={viewMode === "list" ? "default" : "ghost" size="icon" onClick={() => setViewMode("list")}><List className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>

            {filtersOpen && (
              <div className="animate-slide-down mb-8">
                <SearchFiltersComponent />
              </div>
            )}

            {mockFavorites.length > 0 ? (
              <>
                <div className={cn("gap-6", viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col")}>
                  {mockFavorites.map(listing => (
                    <CarCard key={listing.id} listing={listing as any} variant={viewMode === "list" ? "compact" : "default"} onFavoriteToggle={() => {}} />
                  ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={() => {}}><Car className="h-4 w-4 mr-2" /> Continuar comprando</Button>
                  <Button variant="outline" onClick={() => {}}><MapPin className="h-4 w-4 mr-2" /> Ver no mapa</Button>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h3>
                <p className="text-muted-foreground mb-6">Comece a salvar veículos que você gostou clicando no coração</p>
                <Link href="/comprar"><Button size="lg"><Car className="h-4 w-4 mr-2" />Explorar veículos</Button></Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}