import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ComprarClient } from "./comprar-client"

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
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">Comprar Veículos</h1>
                <p className="text-muted-foreground mt-1">{mockListings.length} veículos encontrados</p>
              </div>
            </div>

            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border animate-pulse h-80" />
                ))}
              </div>
            }>
              <ComprarClient initialListings={mockListings} />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}