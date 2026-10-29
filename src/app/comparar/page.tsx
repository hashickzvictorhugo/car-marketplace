"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { X, ChevronRight, CheckCircle, XCircle, Star, Car, Gauge, Zap, Settings, Calendar, DollarSign, Trash2, Plus } from "lucide-react"
import { cn, formatPrice, formatNumber, BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const mockListings = [
  { id: "1", title: "Onix LT 1.0 Turbo", brand: "Chevrolet", model: "Onix", price: 89900, year: 2023, mileage: 15000, fuelType: "FLEX", transmission: "MANUAL", bodyType: "HATCH", color: "Branco", engine: "1.0 Turbo", power: 116, torque: 168, doors: 4, images: [{ url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400", isCover: true }] },
  { id: "2", title: "HB20 Platinum 1.0 Turbo", brand: "Hyundai", model: "HB20", price: 95900, year: 2023, mileage: 12000, fuelType: "FLEX", transmission: "AUTOMATIC", bodyType: "HATCH", color: "Azul", engine: "1.0 Turbo", power: 120, torque: 175, doors: 4, images: [{ url: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400", isCover: true }] },
  { id: "3", title: "Argo Trekking 1.3", brand: "Fiat", model: "Argo", price: 82900, year: 2023, mileage: 22000, fuelType: "FLEX", transmission: "MANUAL", bodyType: "HATCH", color: "Vermelho", engine: "1.3 Firefly", power: 107, torque: 137, doors: 4, images: [{ url: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400", isCover: true }] },
  { id: "4", title: "Corolla XEi 2.0 Hybrid", brand: "Toyota", model: "Corolla", price: 189900, year: 2023, mileage: 8000, fuelType: "HYBRID", transmission: "CVT", bodyType: "SEDAN", color: "Prata", engine: "2.0 Hybrid", power: 177, torque: 206, doors: 4, images: [{ url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400", isCover: true }] },
]

const comparisonSpecs = [
  { key: "Preço", icon: DollarSign, format: (v: any) => formatPrice(v) },
  { key: "Ano", icon: Calendar, format: (v: any) => v },
  { key: "Quilometragem", icon: Gauge, format: (v: any) => `${formatNumber(v)} km` },
  { key: "Combustível", icon: Zap, format: (v: any) => FUEL_TYPES[v as keyof typeof FUEL_TYPES]?.label || v },
  { key: "Transmissão", icon: Settings, format: (v: any) => TRANSMISSION_TYPES[v as keyof typeof TRANSMISSION_TYPES]?.label || v },
  { key: "Carroceria", icon: Car, format: (v: any) => BODY_TYPES[v as keyof typeof BODY_TYPES]?.label || v },
  { key: "Cor", icon: null, format: (v: any) => v },
  { key: "Motor", icon: null, format: (v: any) => v || "Não informado" },
  { key: "Potência (cv)", icon: null, format: (v: any) => v ? `${v} cv` : "Não informado" },
  { key: "Torque (Nm)", icon: null, format: (v: any) => v ? `${v} Nm` : "Não informado" },
  { key: "Portas", icon: null, format: (v: any) => `${v}` },
]

export default function CompararPage() {
  const { userId, isLoaded } = useAuth()
  const { toast } = useToast()
  const [compareList, setCompareList] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")

  if (!isLoaded) {
    return <div className="min-h-screen"><Header /><main className="flex-1 container py-8"><div className="animate-pulse h-64 bg-muted rounded-xl" /></main><Footer /></div>
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16">
          <div className="max-w-md mx-auto text-center">
            <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Compare veículos lado a lado</h1>
            <p className="text-muted-foreground mb-6">Faça login para salvar e comparar até 4 veículos</p>
            <Button size="lg" asChild><a href="/login">Entrar para comparar</a></Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const selectedVehicles = mockListings.filter(v => compareList.includes(v.id))

  const addToCompare = (id: string) => {
    if (compareList.includes(id)) return
    if (compareList.length >= 4) {
      toast({ title: "Limite atingido", description: "Você pode comparar no máximo 4 veículos", variant: "destructive" })
      return
    }
    setCompareList([...compareList, id])
    toast({ title: "Adicionado à comparação", variant: "success" })
  }

  const removeFromCompare = (id: string) => {
    setCompareList(compareList.filter(v => v !== id))
  }

  const isDifferent = (values: any[]) => new Set(values).size > 1

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2"><Star className="h-8 w-8 text-yellow-500" /> Comparar Veículos</h1>
              <p className="text-muted-foreground">Selecione até 4 veículos para comparar lado a lado</p>
            </div>
            {compareList.length > 0 && (
              <Button variant="outline" onClick={() => { setCompareList([]); toast({ title: "Comparação limpa" }) }}>
                <Trash2 className="h-4 w-4 mr-2" /> Limpar todos
              </Button>
            )}
          </div>

          {/* Selected Vehicles Bar */}
          <Card className="mb-8">
            <CardContent className="py-4">
              <div className="flex items-center gap-4 flex-wrap">
                {selectedVehicles.map(vehicle => (
                  <div key={vehicle.id} className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                    <img src={vehicle.images[0].url} alt={vehicle.title} className="w-12 h-8 rounded object-cover" />
                    <div>
                      <p className="text-sm font-medium">{vehicle.brand} {vehicle.model}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(vehicle.price)}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCompare(vehicle.id)}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
                {compareList.length < 4 && (
                  <Button variant="outline" onClick={() => toast({ title: "Use a busca", description: "Clique no ícone de comparação nos cards dos veículos" })}>
                    <Plus className="h-4 w-4 mr-2" /> Adicionar ({compareList.length}/4)
                  </Button>
                )}
              </div>
              {compareList.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum veículo selecionado. Busque veículos e clique no ícone de comparação para adicionar.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {compareList.length > 0 && (
            <>
              {/* View Toggle */}
              <div className="flex justify-end mb-4">
                <div className="flex border rounded-lg overflow-hidden">
                  <Button variant={viewMode === "table" ? "default" : "ghost" size="sm" onClick={() => setViewMode("table")}>Tabela</Button>
                  <Button variant={viewMode === "cards" ? "default" : "ghost" size="sm" onClick={() => setViewMode("cards")}>Cards</Button>
                </div>
              </div>

              {viewMode === "table" && (
                {/* Table View */}
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-4 text-left font-semibold">Especificação</th>
                        {selectedVehicles.map(v => (
                          <th key={v.id} className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <img src={v.images[0].url} alt={v.title} className="w-16 h-10 rounded object-cover" />
                              <span className="font-medium">{v.brand} {v.model}</span>
                              <Button variant="ghost" size="icon" onClick={() => removeFromCompare(v.id)}><X className="h-4 w-4" /></Button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonSpecs.map(spec => (
                        <tr key={spec.key} className="border-t">
                          <td className="p-4 font-medium text-muted-foreground flex items-center gap-2 whitespace-nowrap">
                            {spec.icon && <spec.icon className="h-4 w-4" />}
                            {spec.key}
                          </td>
                          {selectedVehicles.map(v => {
                            const value = v[spec.key.toLowerCase().replace(/[^a-z]/g, "") as keyof typeof v] || v[spec.key as keyof typeof v]
                            return (
                              <td key={v.id} className={cn("p-4 text-center", isDifferent(selectedVehicles.map(vv => vv[spec.key as keyof typeof vv])) && "bg-yellow-50 font-semibold")}>
                                {spec.format(value)}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                      <tr className="bg-primary/5">
                        <td className="p-4 font-semibold">Preço Total (c/ taxas est.)</td>
                        {selectedVehicles.map(v => (
                          <td key={v.id} className="p-4 text-center font-bold text-primary">{formatPrice(v.price * 1.05)}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {viewMode === "cards" && (
                {/* Cards View */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {selectedVehicles.map(v => (
                    <Card key={v.id} className="relative">
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10" onClick={() => removeFromCompare(v.id)}><X className="h-4 w-4" /></Button>
                      <CardHeader className="text-center">
                        <img src={v.images[0].url} alt={v.title} className="w-full h-40 object-cover rounded-lg mx-auto mb-4" />
                        <CardTitle>{v.brand} {v.model}</CardTitle>
                        <p className="text-2xl font-bold text-primary">{formatPrice(v.price)}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {comparisonSpecs.slice(0, 6).map(spec => (
                          <div key={spec.key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{spec.key}</span>
                            <span className="font-medium">{spec.format(v[spec.key as keyof typeof v] || "")}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}