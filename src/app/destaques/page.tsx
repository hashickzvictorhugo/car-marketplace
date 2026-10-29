"use client"

import { Star, Filter, Grid, List, ChevronRight } from "lucide-react"
import { cn, formatPrice, formatNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CarCard } from "@/components/car-card"
import { SearchFiltersComponent } from "@/components/search-filters"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const featuredListings = [
  { id: "1", title: "Onix LT 1.0 Turbo Flex", brand: { name: "Chevrolet", id: "1" }, model: { name: "Onix", id: "1" }, price: 89900, year: 2023, mileage: 15000, fuelType: "FLEX", transmission: "MANUAL", bodyType: "HATCH", color: "Branco", city: "São Paulo", state: "SP", featured: true, status: "ACTIVE", images: [{ id: "1", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800", alt: "Chevrolet Onix", isCover: true }], seller: { name: "AutoMax Seminovos", isVerified: true } },
  { id: "2", title: "Corolla XEi 2.0 Hybrid", brand: { name: "Toyota", id: "5" }, model: { name: "Corolla", id: "5" }, price: 189900, year: 2023, mileage: 8000, fuelType: "HYBRID", transmission: "CVT", bodyType: "SEDAN", color: "Prata", city: "São Paulo", state: "SP", featured: true, status: "ACTIVE", images: [{ id: "2", url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800", alt: "Toyota Corolla", isCover: true }], seller: { name: "Toyota São Paulo", isVerified: true } },
  { id: "3", title: "Compass Limited 2.0 Diesel", brand: { name: "Jeep", id: "10" }, model: { name: "Compass", id: "10" }, price: 219900, year: 2022, mileage: 25000, fuelType: "DIESEL", transmission: "AUTOMATIC", bodyType: "SUV", color: "Preto", city: "Rio de Janeiro", state: "RJ", featured: true, status: "ACTIVE", images: [{ id: "3", url: "https://images.unsplash.com/photo-1520031032609-855c4f8a4c7a?w=800", alt: "Jeep Compass", isCover: true }], seller: { name: "Jeep Rio", isVerified: true } },
  { id: "4", title: "HB20 Platinum 1.0 Turbo", brand: { name: "Hyundai", id: "4" }, model: { name: "HB20", id: "4" }, price: 95900, year: 2023, mileage: 12000, fuelType: "FLEX", transmission: "AUTOMATIC", bodyType: "HATCH", color: "Azul", city: "Belo Horizonte", state: "MG", featured: true, status: "ACTIVE", images: [{ id: "4", url: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800", alt: "Hyundai HB20", isCover: true }], seller: { name: "Hyundai BH", isVerified: true } },
  { id: "5", title: "T-Cross Highline 1.4 TSI", brand: { name: "Volkswagen", id: "2" }, model: { name: "T-Cross", id: "2" }, price: 149900, year: 2023, mileage: 18000, fuelType: "FLEX", transmission: "AUTOMATIC", bodyType: "SUV", color: "Cinza", city: "Curitiba", state: "PR", featured: true, status: "ACTIVE", images: [{ id: "5", url: "https://images.unsplash.com/photo-1606664515524-edb54d20657d?w=800", alt: "VW T-Cross", isCover: true }], seller: { name: "VW Curitiba", isVerified: true } },
  { id: "6", title: "Argo Trekking 1.3 Flex", brand: { name: "Fiat", id: "3" }, model: { name: "Argo", id: "3" }, price: 82900, year: 2023, mileage: 22000, fuelType: "FLEX", transmission: "MANUAL", bodyType: "HATCH", color: "Vermelho", city: "Porto Alegre", state: "RS", featured: true, status: "ACTIVE", images: [{ id: "6", url: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800", alt: "Fiat Argo", isCover: true }], seller: { name: "Fiat RS", isVerified: true } },
  { id: "7", title: "Kicks SV 1.6 CVT", brand: { name: "Nissan", id: "9" }, model: { name: "Kicks", id: "9" }, price: 119900, year: 2023, mileage: 14000, fuelType: "FLEX", transmission: "CVT", bodyType: "SUV", color: "Branco", city: "Salvador", state: "BA", featured: true, status: "ACTIVE", images: [{ id: "7", url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800", alt: "Nissan Kicks", isCover: true }], seller: { name: "Nissan Bahia", isVerified: true } },
  { id: "8", title: "Ranger Limited 2.0 Diesel", brand: { name: "Ford", id: "6" }, model: { name: "Ranger", id: "6" }, price: 289900, year: 2022, mileage: 35000, fuelType: "DIESEL", transmission: "AUTOMATIC", bodyType: "PICKUP", color: "Prata", city: "Fortaleza", state: "CE", featured: true, status: "ACTIVE", images: [{ id: "8", url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800", alt: "Ford Ranger", isCover: true }], seller: { name: "Ford Fortaleza", isVerified: true } },
]

export default function DestaquesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-yellow-500/10 via-white to-white py-12 lg:py-16">
          <div className="container text-center">
            <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              Veículos em Destaque
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Os melhores veículos selecionados para você</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Veículos verificados, com procedência garantida e as melhores condições de pagamento.</p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">{featuredListings.length} veículos em destaque</h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setFiltersOpen(!filtersOpen)}><Filter className="h-4 w-4 mr-2" /> Filtros</Button>
                <div className="flex border rounded-lg overflow-hidden">
                  <Button variant={viewMode === "grid" ? "default" : "ghost" size="icon" onClick={() => setViewMode("grid")}><Grid className="h-4 w-4" /></Button>
                  <Button variant={viewMode === "list" ? "default" : "ghost" size="icon" onClick={() => setViewMode("list")}><List className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>

            {filtersOpen && <div className="animate-slide-down mb-8"><SearchFiltersComponent initialFilters={{ featured: true }} /></div>}

            <div className={cn("gap-6", viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col")}>
              {featuredListings.map(listing => (
                <CarCard key={listing.id} listing={listing as any} variant={viewMode === "list" ? "compact" : "featured"} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Quer seu veículo em destaque?</h2>
              <p className="text-muted-foreground mb-6">Anuncie no plano Destaque ou Premium e apareça no topo das buscas e na homepage.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild><a href="/vender"><Star className="h-4 w-4 mr-2" />Anunciar em Destaque</a></Button>
                <Button variant="outline" size="lg" asChild><a href="/vender/planos"><ChevronRight className="h-4 w-4 mr-2" />Ver planos</a></Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}