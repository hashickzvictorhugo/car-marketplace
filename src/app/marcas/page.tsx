"use client"

import { ChevronRight, Car, Gauge, Calendar } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const brands = [
  { id: "1", name: "Chevrolet", logo: "CH", count: 1250, models: ["Onix", "Onix Plus", "Tracker", "S10", "Spin"] },
  { id: "2", name: "Volkswagen", logo: "VW", count: 980, models: ["Gol", "Voyage", "T-Cross", "Nivus", "Saveiro"] },
  { id: "3", name: "Fiat", logo: "FI", count: 890, models: ["Argo", "Cronos", "Mobi", "Pulse", "Strada"] },
  { id: "4", name: "Hyundai", logo: "HY", count: 750, models: ["HB20", "HB20S", "Creta", "Tucson", "i30"] },
  { id: "5", name: "Toyota", logo: "TY", count: 680, models: ["Corolla", "Corolla Cross", "Yaris", "Hilux", "SW4"] },
  { id: "6", name: "Ford", logo: "FO", count: 590, models: ["Ka", "Ka+", "EcoSport", "Ranger", "Mustang"] },
  { id: "7", name: "Honda", logo: "HO", count: 520, models: ["Fit", "City", "Civic", "HR-V", "CR-V"] },
  { id: "8", name: "Renault", logo: "RE", count: 480, models: ["Kwid", "Sandero", "Logan", "Duster", "Oroch"] },
  { id: "9", name: "Nissan", logo: "NI", count: 410, models: ["Kicks", "Versa", "March", "Frontier", "Sentra"] },
  { id: "10", name: "Jeep", logo: "JE", count: 380, models: ["Compass", "Renegade", "Commander", "Wrangler", "Gladiator"] },
  { id: "11", name: "Caoa Chery", logo: "CC", count: 220, models: ["Tiggo 5x", "Tiggo 7", "Tiggo 8", "Arrizo 5", "Arrizo 6"] },
  { id: "12", name: "Peugeot", logo: "PE", count: 190, models: ["208", "2008", "3008", "5008", "Partner"] },
  { id: "13", name: "Citroën", logo: "CI", count: 160, models: ["C3", "C4 Cactus", "C4 Lounge", "Jumpy", "Berlingo"] },
  { id: "14", name: "Mitsubishi", logo: "MI", count: 140, models: ["Eclipse Cross", "Outlander", "L200", "ASX", "Pajero Sport"] },
  { id: "15", name: "Kia", logo: "KI", count: 120, models: ["Cerato", "Sportage", "Sorento", "Stonic", "Rio"] },
]

export default function MarcasPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary via-primary/90 to-primary/70 text-primary-foreground py-12 lg:py-16">
          <div className="container text-center">
            <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
              <Car className="h-4 w-4 mr-2" />
              Todas as Marcas
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Encontre veículos por marca</h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">Navegue pelas principais montadoras e encontre o modelo ideal para você.</p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {brands.map(brand => (
                <Link
                  key={brand.id}
                  href={`/marca/${brand.id}`}
                  className="group p-6 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                      {brand.logo}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{brand.name}</h3>
                      <p className="text-sm text-muted-foreground">{brand.count.toLocaleString("pt-BR")} veículos</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {brand.models.slice(0, 4).map(model => (
                      <span key={model} className="px-2 py-1 text-xs bg-muted rounded-full text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {model}
                      </span>
                    ))}
                    {brand.models.length > 4 && (
                      <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                        +{brand.models.length - 4} modelos
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm font-medium text-primary">Ver veículos</span>
                    <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">Não encontrou sua marca?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Temos veículos de mais de 30 marcas diferentes. Use a busca avançada para filtrar por qualquer fabricante.
            </p>
            <Link href="/comprar">
              <Button size="lg"><Car className="h-4 w-4 mr-2" />Buscar todos os veículos</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}