"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Car, Shield, Truck, Star, ArrowRight, Zap, MapPin, Calendar, Gauge, Settings, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CarCard } from "@/components/car-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { formatPrice, BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES } from "@/lib/utils"

const featuredListings = [
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
]

const brands = [
  { id: "1", name: "Chevrolet", logo: "/brands/chevrolet.svg", count: 1250 },
  { id: "2", name: "Volkswagen", logo: "/brands/volkswagen.svg", count: 980 },
  { id: "3", name: "Fiat", logo: "/brands/fiat.svg", count: 890 },
  { id: "4", name: "Hyundai", logo: "/brands/hyundai.svg", count: 750 },
  { id: "5", name: "Toyota", logo: "/brands/toyota.svg", count: 680 },
  { id: "6", name: "Ford", logo: "/brands/ford.svg", count: 590 },
  { id: "7", name: "Honda", logo: "/brands/honda.svg", count: 520 },
  { id: "8", name: "Renault", logo: "/brands/renault.svg", count: 480 },
  { id: "9", name: "Nissan", logo: "/brands/nissan.svg", count: 410 },
  { id: "10", name: "Jeep", logo: "/brands/jeep.svg", count: 380 },
]

const benefits = [
  { icon: Shield, title: "Compra 100% Segura", desc: "Verificamos procedência e documentação de todos os veículos" },
  { icon: Car, title: "25.000+ Veículos", desc: "O maior estoque de seminovos do Brasil" },
  { icon: Truck, title: "Entrega em Todo Brasil", desc: "Levamos o carro até a sua casa com seguro" },
  { icon: Star, title: "Garantia Estendida", desc: "Até 2 anos de garantia em veículos selecionados" },
  { icon: Zap, title: "Financiamento na Hora", desc: "Aprovação em minutos com as melhores taxas" },
  { icon: MapPin, title: "Test Drive Agendado", desc: "Agende online e teste o carro antes de comprar" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary via-primary/90 to-primary/70 text-primary-foreground">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="container relative py-20 lg:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 text-lg px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                +25.000 veículos verificados • Entrega em todo Brasil
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Encontre o seu <span className="text-yellow-300">próximo carro</span> aqui
              </h1>
              <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                O maior marketplace de veículos do Brasil. Compre e venda com segurança, transparência e as melhores condições de financiamento.
              </p>

              {/* Search Bar */}
              <div className="bg-background/90 backdrop-blur rounded-2xl p-4 shadow-2xl max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2">
                    <Label htmlFor="hero-search" className="sr-only">O que você procura?</Label>
                    <Input
                      id="hero-search"
                      placeholder="Modelo, marca, versão... (ex: Onix LT, Corolla Hybrid)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-brand" className="sr-only">Marca</Label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger id="hero-brand" className="h-12">
                        <SelectValue placeholder="Todas as marcas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas as marcas</SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>{brand.name} ({brand.count})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="h-12 text-lg bg-yellow-500 hover:bg-yellow-600 text-primary font-semibold" size="lg">
                    <Search className="h-5 w-5 mr-2" />
                    Buscar
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-primary-foreground/70">
                  <span className="flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span>Flex, Híbrido, Elétrico</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>2010 - 2024</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Gauge className="h-4 w-4" />
                    <span>Até 300.000 km</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Settings className="h-4 w-4" />
                    <span>Manual, Automático, CVT</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="container pb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { value: "25.000+", label: "Veículos Anunciados" },
                { value: "5.000+", label: "Vendedores Verificados" },
                { value: "98%", label: "Clientes Satisfeitos" },
                { value: "24h", label: "Média de Venda" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-background/10 backdrop-blur rounded-xl border border-primary-foreground/10">
                  <p className="text-3xl sm:text-4xl font-bold text-yellow-300">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/80 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Veículos em Destaque</h2>
                <p className="text-muted-foreground mt-1">Selecionados especialmente para você</p>
              </div>
              <Link href="/destaques" className="flex items-center space-x-1 text-primary hover:underline font-medium">
                <span>Ver todos</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <CarCard key={listing.id} listing={listing as any} variant="featured" />
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Por que escolher a AutoMax?</h2>
              <p className="text-muted-foreground mt-2 text-lg">A melhor experiência de compra e venda de veículos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-card p-6 rounded-2xl border hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brands */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Marcas Populares</h2>
                <p className="text-muted-foreground mt-1">Encontre veículos das principais montadoras</p>
              </div>
              <Link href="/marcas" className="flex items-center space-x-1 text-primary hover:underline font-medium">
                <span>Ver todas</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/marca/${brand.id}`}
                  className="group flex flex-col items-center p-4 rounded-xl bg-card border hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="text-2xl font-bold text-primary">{brand.name.charAt(0)}</span>
                  </div>
                  <span className="font-medium text-sm text-center">{brand.name}</span>
                  <span className="text-xs text-muted-foreground">{brand.count} veículos</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Quer vender seu carro?</h2>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Anuncie grátis e alcance milhares de compradores. Foto profissional, vistoria gratuita e pagamento garantido.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/vender" className="w-full sm:w-auto">
                  <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                    Anunciar Meu Carro
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/avaliacao" className="w-full sm:w-auto">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground">
                    Avaliação Grátis Online
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Como funciona</h2>
              <p className="text-muted-foreground mt-2 text-lg">Simples, rápido e seguro</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Encontre seu carro",
                  desc: "Use nossos filtros avançados para encontrar o veículo perfeito. Compare modelos, veja fotos em alta resolução e histórico completo.",
                  icon: Search,
                },
                {
                  step: "02",
                  title: "Agende test drive",
                  desc: "Agende online em poucos cliques. Nossos parceiros entram em contato para confirmar o melhor horário e local para você.",
                  icon: Calendar,
                },
                {
                  step: "03",
                  title: "Compre com segurança",
                  desc: "Financiamento aprovado na hora, documentação por nossa conta e entrega em todo Brasil. Você recebe as chaves sem preocupação.",
                  icon: Shield,
                },
              ].map((item) => (
                <div key={item.step} className="text-center p-6">
                  <div className="text-4xl font-bold text-primary/10 mb-4">{item.step}</div>
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Receba as melhores ofertas</h2>
              <p className="text-muted-foreground mb-6">
                Cadastre seu e-mail e receba semanalmente os melhores veículos que combinam com seu perfil.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  className="flex-1"
                  required
                />
                <Button type="submit" className="w-full sm:w-auto" size="lg">
                  Cadastrar
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                Sem spam. Cancelamento a qualquer momento. <a href="/privacidade" className="underline">Política de Privacidade</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}