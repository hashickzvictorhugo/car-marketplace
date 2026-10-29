"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Car, Calendar, Gauge, Zap, Settings, Filter, Grid, List } from "lucide-react"
import { cn, formatPrice, formatNumber, BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CarCard } from "@/components/car-card"
import { SearchFiltersComponent } from "@/components/search-filters"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const BRAND_DATA: Record<string, { name: string; logo: string; description: string; models: { id: string; name: string; count: number }[] }> = {
  "1": { name: "Chevrolet", logo: "CH", description: "A Chevrolet é uma das marcas mais tradicionais do Brasil, oferecendo veículos para todos os perfis.", models: [{ id: "1", name: "Onix", count: 320 }, { id: "2", name: "Onix Plus", count: 180 }, { id: "3", name: "Tracker", count: 210 }, { id: "4", name: "S10", count: 95 }, { id: "5", name: "Spin", count: 67 }] },
  "2": { name: "Volkswagen", logo: "VW", description: "A Volkswagen combina tecnologia alemã com produção local, oferecendo qualidade e inovação.", models: [{ id: "6", name: "Gol", count: 150 }, { id: "7", name: "Voyage", count: 89 }, { id: "8", name: "T-Cross", count: 280 }, { id: "9", name: "Nivus", count: 165 }, { id: "10", name: "Saveiro", count: 120 }] },
  "3": { name: "Fiat", logo: "FI", description: "A Fiat é líder em vendas no Brasil, conhecida por veículos robustos e design italiano.", models: [{ id: "11", name: "Argo", count: 245 }, { id: "12", name: "Cronos", count: 178 }, { id: "13", name: "Mobi", count: 134 }, { id: "14", name: "Pulse", count: 198 }, { id: "15", name: "Strada", count: 310 }] },
  "4": { name: "Hyundai", logo: "HY", description: "A Hyundai oferece design moderno, tecnologia avançada e excelente custo-benefício.", models: [{ id: "16", name: "HB20", count: 290 }, { id: "17", name: "HB20S", count: 145 }, { id: "18", name: "Creta", count: 265 }, { id: "19", name: "Tucson", count: 87 }, { id: "20", name: "i30", count: 56 }] },
  "5": { name: "Toyota", logo: "TY", description: "A Toyota é sinônimo de confiabilidade, durabilidade e valor de revenda.", models: [{ id: "21", name: "Corolla", count: 340 }, { id: "22", name: "Corolla Cross", count: 275 }, { id: "23", name: "Yaris", count: 156 }, { id: "24", name: "Hilux", count: 198 }, { id: "25", name: "SW4", count: 89 }] },
}

const mockListings = [
  { id: "1", title: "Onix LT 1.0 Turbo Flex", brand: { name: "Chevrolet", id: "1" }, model: { name: "Onix", id: "1" }, price: 89900, year: 2023, mileage: 15000, fuelType: "FLEX", transmission: "MANUAL", bodyType: "HATCH", color: "Branco", city: "São Paulo", state: "SP", featured: true, status: "ACTIVE", images: [{ id: "1", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800", alt: "Chevrolet Onix", isCover: true }], seller: { name: "AutoMax Seminovos", isVerified: true } },
  { id: "2", title: "Onix Plus Premier 1.0 Turbo", brand: { name: "Chevrolet", id: "1" }, model: { name: "Onix Plus", id: "2" }, price: 109900, year: 2023, mileage: 8000, fuelType: "FLEX", transmission: "AUTOMATIC", bodyType: "SEDAN", color: "Prata", city: "São Paulo", state: "SP", featured: false, status: "ACTIVE", images: [{ id: "2", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800", alt: "Chevrolet Onix Plus", isCover: true }], seller: { name: "Chevrolet SP", isVerified: true } },
  { id: "3", title: "Tracker LTZ 1.2 Turbo", brand: { name: "Chevrolet", id: "1" }, model: { name: "Tracker", id: "3" }, price: 149900, year: 2022, mileage: 22000, fuelType: "FLEX", transmission: "AUTOMATIC", bodyType: "SUV", color: "Preto", city: "Campinas", state: "SP", featured: false, status: "ACTIVE", images: [{ id: "3", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800", alt: "Chevrolet Tracker", isCover: true }], seller: { name: "Chevrolet Campinas", isVerified: true } },
]

export default function MarcaPage() {
  const params = useParams()
  const brandId = params.id as string
  const brand = BRAND_DATA[brandId] || BRAND_DATA["1"]
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Brand Header */}
        <section className="bg-gradient-to-b from-primary via-primary/90 to-primary/70 text-primary-foreground">
          <div className="container py-12 lg:py-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <Link href="/marcas" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Voltar às marcas
                </Link>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-primary-foreground/10 flex items-center justify-center text-3xl font-bold">{brand.logo}</div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold">{brand.name}</h1>
                    <p className="text-primary-foreground/80 mt-1">{brand.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{mockListings.length}+</p>
                <p className="text-primary-foreground/80">veículos disponíveis</p>
              </div>
            </div>
          </div>
        </section>

        {/* Models */}
        <section className="py-8 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Modelos disponíveis</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {brand.models.map(model => (
                <Link key={model.id} href={`/comprar?brand=${brandId}&model=${model.id}`} className="group p-4 rounded-xl bg-card border hover:border-primary/50 hover:shadow-md transition-all">
                  <h3 className="font-semibold">{model.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{model.count} veículos</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors absolute bottom-4 right-4" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Listings */}
        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">{brand.name} - Veículos à venda</h2>
                <p className="text-muted-foreground">{mockListings.length} resultados</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setFiltersOpen(!filtersOpen)}><Filter className="h-4 w-4 mr-2" /> Filtros</Button>
                <div className="flex border rounded-lg overflow-hidden">
                  <Button variant={viewMode === "grid" ? "default" : "ghost" size="icon" onClick={() => setViewMode("grid")}><Grid className="h-4 w-4" /></Button>
                  <Button variant={viewMode === "list" ? "default" : "ghost" size="icon" onClick={() => setViewMode("list")}><List className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>

            {filtersOpen && <div className="animate-slide-down mb-8"><SearchFiltersComponent initialFilters={{ brandId }} /></div>}

            <div className={cn("gap-6", viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col")}>
              {mockListings.map(listing => (
                <CarCard key={listing.id} listing={listing as any} variant={viewMode === "list" ? "compact" : "default"} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}