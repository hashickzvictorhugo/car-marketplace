"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Heart, Share2, MapPin, Calendar, Gauge, Zap, Settings, Shield, CheckCircle, X, ChevronLeft, ChevronRight, Phone, MessageCircle, User, Truck, Star, ArrowRight } from "lucide-react"
import { cn, formatPrice, formatNumber, BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES, calculateFinancing } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const mockListing = {
  id: "1",
  title: "Onix LT 1.0 Turbo Flex Automatizado",
  brand: { name: "Chevrolet", id: "1" },
  model: { name: "Onix", id: "1" },
  price: 89900,
  year: 2023,
  mileage: 15000,
  fuelType: "FLEX",
  transmission: "AUTOMATED",
  bodyType: "HATCH",
  color: "Branco",
  doors: 4,
  engine: "1.0 Turbo",
  power: 116,
  torque: 168,
  city: "São Paulo",
  state: "SP",
  zipCode: "01310-100",
  featured: true,
  status: "ACTIVE",
  description: "Veículo em excelente estado de conservação, único dono, todas as revisões feitas na concessionária. Manual do proprietário e chave reserva. Pneus novos, lataria sem detalhes, interior impecável. Versão LT com central multimídia, câmera de ré, sensor de estacionamento, volante multifuncional, ar condicionado digital, vidros e travas elétricos, faróis de neblina, rodas de liga leve 16\". IPVA 2024 pago, licenciamento em dia. Aceito troca por veículo de maior valor (mediante avaliação) e financio em até 60x com as melhores taxas do mercado. Agende seu test drive!",
  images: [
    { id: "1", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200", alt: "Chevrolet Onix frontal", isCover: true },
    { id: "2", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200", alt: "Chevrolet Onix traseira", isCover: false },
    { id: "3", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200", alt: "Chevrolet Onix lateral", isCover: false },
    { id: "4", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200", alt: "Chevrolet Onix interior", isCover: false },
    { id: "5", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200", alt: "Chevrolet Onix painel", isCover: false },
    { id: "6", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200", alt: "Chevrolet Onix roda", isCover: false },
  ],
  features: [
    { key: "Ar condicionado digital", value: "Sim" },
    { key: "Central multimídia", value: "Sim (7\")" },
    { key: "Câmera de ré", value: "Sim" },
    { key: "Sensor de estacionamento", value: "Traseiro" },
    { key: "Volante multifuncional", value: "Sim" },
    { key: "Vidros elétricos", value: "4 portas" },
    { key: "Travas elétricas", value: "Sim" },
    { key: "Faróis de neblina", value: "Sim" },
    { key: "Rodas de liga leve", value: "16\"" },
    { key: "Computador de bordo", value: "Sim" },
    { key: "Controle de tração", value: "Sim" },
    { key: "Controle de estabilidade", value: "Sim" },
    { key: "ISOFAX", value: "Sim" },
    { key: "Airbags", value: "6 (frontais, laterais, cortina)" },
    { key: "Freios ABS", value: "Sim" },
    { key: "EBD", value: "Sim" },
    { key: "Assistente de partida em rampa", value: "Sim" },
    { key: "Chave presencial", value: "Não" },
    { key: "Partida por botão", value: "Não" },
    { key: "Teto solar", value: "Não" },
  ],
  seller: {
    id: "seller-1",
    name: "AutoMax Seminovos",
    avatar: null,
    phone: "(11) 99999-9999",
    isVerified: true,
    createdAt: "2023-01-15",
  },
  createdAt: "2024-01-15",
  viewsCount: 1250,
  favoritesCount: 89,
  inquiriesCount: 23,
}

const specs = [
  { icon: Calendar, label: "Ano", value: "2023/2023" },
  { icon: Gauge, label: "Quilometragem", value: "15.000 km" },
  { icon: Zap, label: "Combustível", value: "Flex" },
  { icon: Settings, label: "Transmissão", value: "Automatizado" },
  { icon: MapPin, label: "Localização", value: "São Paulo - SP" },
  { icon: Shield, label: "Procedência", value: "Único dono, revisões em dia" },
]

const equipment = [
  { category: "Conforto", items: ["Ar condicionado digital", "Vidros elétricos (4)", "Travas elétricas", "Volante multifuncional", "Computador de bordo", "Banco do motorista com regulagem de altura", "Descansa-braço central"] },
  { category: "Segurança", items: ["6 airbags", "Freios ABS com EBD", "Controle de tração", "Controle de estabilidade", "Assistente de partida em rampa", "ISOFAX", "Câmera de ré", "Sensor de estacionamento traseiro", "Faróis de neblina"] },
  { category: "Tecnologia", items: ["Central multimídia 7\"", "Bluetooth", "USB", "Apple CarPlay / Android Auto", "Comando de voz", "Espelhamento de tela"] },
  { category: "Exterior", items: ["Rodas de liga leve 16\"", "Faróis com regulagem de altura", "Lanterna traseira em LED", "Retrovisores com repetidor de seta", "Maçanetas na cor do veículo"] },
]

export default function VehicleDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [currentImage, setCurrentImage] = useState(0)
  const [showInquiryDialog, setShowInquiryDialog] = useState(false)
  const [showFinancingDialog, setShowFinancingDialog] = useState(false)
  const [financing, setFinancing] = useState({ downPayment: 20000, months: 48 })
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [isFavorited, setIsFavorited] = useState(false)

  const listing = mockListing

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: "Mensagem enviada!", description: "O vendedor entrará em contato em breve.", variant: "success" })
    setShowInquiryDialog(false)
    setInquiryForm({ name: "", email: "", phone: "", message: "" })
  }

  const financingResult = calculateFinancing(listing.price, financing.downPayment, financing.months)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav className="bg-muted/30 py-3" aria-label="Breadcrumb">
          <div className="container flex items-center space-x-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground">Home</a>
            <ChevronRight className="h-4 w-4" />
            <a href="/comprar" className="hover:text-foreground">Comprar</a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{listing.brand.name} {listing.model.name}</span>
          </div>
        </nav>

        <div className="container py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Gallery */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                <Image
                  src={listing.images[currentImage].url}
                  alt={listing.images[currentImage].alt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 backdrop-blur hover:bg-background transition-colors"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImage((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 backdrop-blur hover:bg-background transition-colors"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <div className="flex items-center space-x-2">
                    {listing.featured && <Badge className="bg-yellow-500 text-yellow-500-foreground">Destaque</Badge>}
                    <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Disponível</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="bg-background/90 backdrop-blur" onClick={() => setIsFavorited(!isFavorited)}>
                    <Heart className={cn("h-5 w-5", isFavorited && "fill-red-500 text-red-500")} />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-center space-x-2 overflow-x-auto pb-2">
                    {listing.images.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentImage(idx)}
                        className={cn("relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all", idx === currentImage ? "border-primary" : "border-transparent hover:border-muted-foreground/50")}
                      >
                        <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="80px" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="descricao" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="descricao">Descrição</TabsTrigger>
                  <TabsTrigger value="ficha-tecnica">Ficha Técnica</TabsTrigger>
                  <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
                </TabsList>

                <TabsContent value="descricao" className="mt-4 animate-slide-up">
                  <div className="prose prose-slate max-w-none">
                    <p className="whitespace-pre-wrap">{listing.description}</p>
                  </div>
                </TabsContent>

                <TabsContent value="ficha-tecnica" className="mt-4 animate-slide-up">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Marca", value: listing.brand.name },
                      { label: "Modelo", value: listing.model.name },
                      { label: "Versão", value: listing.title.replace(`${listing.brand.name} ${listing.model.name}`, "").trim() },
                      { label: "Ano/Modelo", value: `${listing.year}/${listing.year}` },
                      { label: "Quilometragem", value: `${formatNumber(listing.mileage)} km` },
                      { label: "Combustível", value: FUEL_TYPES[listing.fuelType as keyof typeof FUEL_TYPES]?.label || listing.fuelType },
                      { label: "Transmissão", value: TRANSMISSION_TYPES[listing.transmission as keyof typeof TRANSMISSION_TYPES]?.label || listing.transmission },
                      { label: "Carroceria", value: BODY_TYPES[listing.bodyType as keyof typeof BODY_TYPES]?.label || listing.bodyType },
                      { label: "Cor", value: listing.color },
                      { label: "Portas", value: `${listing.doors}` },
                      { label: "Motor", value: listing.engine || "Não informado" },
                      { label: "Potência", value: listing.power ? `${listing.power} cv` : "Não informado" },
                      { label: "Torque", value: listing.torque ? `${listing.torque} Nm` : "Não informado" },
                      { label: "Cidade/Estado", value: `${listing.city}/${listing.state}` },
                      { label: "CEP", value: listing.zipCode || "Não informado" },
                      { label: "Procedência", value: "Único dono, revisões em concessionária" },
                    ].map((spec) => (
                      <div key={spec.label} className="bg-card p-4 rounded-xl border">
                        <p className="text-sm text-muted-foreground">{spec.label}</p>
                        <p className="font-medium">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="equipamentos" className="mt-4 animate-slide-up">
                  <div className="space-y-6">
                    {equipment.map((cat) => (
                      <div key={cat.category} className="bg-card p-6 rounded-xl border">
                        <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2 pb-2 border-b">
                          {cat.category}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {cat.items.map((item) => (
                            <div key={item} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Seller Info */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>Vendedor</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                      {listing.seller.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{listing.seller.name}</p>
                      <p className="text-sm text-muted-foreground">Vendedor verificado • Cadastrado desde {new Date(listing.seller.createdAt).getFullYear()}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1"><Shield className="h-4 w-4 text-green-500" /> Verificado</span>
                        <span className="flex items-center space-x-1"><Star className="h-4 w-4 text-yellow-500 fill-current" /> 4.9 (127 avaliações)</span>
                        <span className="flex items-center space-x-1"><Truck className="h-4 w-4" /> Entrega em todo Brasil</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-x-2">
                      <Button onClick={() => setShowInquiryDialog(true)} className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Conversar
                      </Button>
                      <Button variant="outline" onClick={() => setShowInquiryDialog(true)} className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Ligar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Price & Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Price Card */}
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">Preço à vista</p>
                      <p className="text-3xl font-bold text-primary">{formatPrice(listing.price)}</p>
                    </div>
                    <Separator />
                    <div className="my-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span>Entrada sugerida (20%)</span><span className="font-medium">{formatPrice(listing.price * 0.2)}</span></div>
                      <div className="flex justify-between"><span>Financiar (80%)</span><span className="font-medium">{formatPrice(listing.price * 0.8)}</span></div>
                    </div>
                    <Separator />
                    <div className="my-4">
                      <p className="text-sm text-muted-foreground mb-2">Simulação de financiamento (48x, 1.5% a.m.)</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span>Entrada</span><span className="font-medium">{formatPrice(financing.downPayment)}</span></div>
                        <div className="flex justify-between"><span>Parcelas (48x)</span><span className="font-medium">{formatPrice(financingResult.monthlyPayment)}</span></div>
                        <div className="flex justify-between"><span>Total a pagar</span><span className="font-medium">{formatPrice(financingResult.totalPaid)}</span></div>
                        <div className="flex justify-between text-primary"><span>Juros totais</span><span className="font-medium">{formatPrice(financingResult.totalInterest)}</span></div>
                      </div>
                    </div>
                    <Button onClick={() => setShowFinancingDialog(true)} className="w-full mb-2" size="lg">
                      Simular Financiamento
                    </Button>
                    <Button variant="outline" onClick={() => setShowInquiryDialog(true)} className="w-full mb-2">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Falar com Vendedor
                    </Button>
                    <Button variant="ghost" className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </CardContent>
                </Card>

                {/* Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span>Destaques</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "Único dono",
                        "Revisões em concessionária",
                        "IPVA 2024 pago",
                        "Licenciamento em dia",
                        "Laudo cautelar aprovado",
                        "Garantia de 1 ano (motor/câmbio)",
                        "Entrega em todo Brasil",
                        "Troca com avaliação justa",
                      ].map((item) => (
                        <li key={item} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card>
                  <CardContent className="pt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="border-r border-l p-4">
                      <p className="text-2xl font-bold text-primary">{formatNumber(listing.viewsCount)}</p>
                      <p className="text-xs text-muted-foreground">Visualizações</p>
                    </div>
                    <div className="border-r p-4">
                      <p className="text-2xl font-bold text-primary">{listing.favoritesCount}</p>
                      <p className="text-xs text-muted-foreground">Favoritos</p>
                    </div>
                    <div className="p-4">
                      <p className="text-2xl font-bold text-primary">{listing.inquiriesCount}</p>
                      <p className="text-xs text-muted-foreground">Contatos</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Financing Dialog */}
      <Dialog open={showFinancingDialog} onOpenChange={setShowFinancingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Simular Financiamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="downPayment">Entrada</Label>
              <Input
                id="downPayment"
                type="number"
                value={financing.downPayment}
                onChange={(e) => setFinancing({ ...financing, downPayment: parseInt(e.target.value) || 0 })}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="months">Parcelas</Label>
              <select
                id="months"
                value={financing.months}
                onChange={(e) => setFinancing({ ...financing, months: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {[12, 24, 36, 48, 60].map((m) => (
                  <option key={m} value={m}>{m}x</option>
                ))}
              </select>
            </div>
            <Card className="bg-muted/50">
              <CardContent className="pt-6 space-y-2">
                <div className="flex justify-between text-sm"><span>Entrada</span><span className="font-medium">{formatPrice(financing.downPayment)}</span></div>
                <div className="flex justify-between text-sm"><span>Parcelas ({financing.months}x)</span><span className="font-medium">{formatPrice(calculateFinancing(listing.price, financing.downPayment, financing.months).monthlyPayment)}</span></div>
                <div className="flex justify-between text-sm"><span>Total a pagar</span><span className="font-medium">{formatPrice(calculateFinancing(listing.price, financing.downPayment, financing.months).totalPaid)}</span></div>
                <div className="flex justify-between text-sm text-primary"><span>Juros totais</span><span className="font-medium">{formatPrice(calculateFinancing(listing.price, financing.downPayment, financing.months).totalInterest)}</span></div>
              </CardContent>
            </Card>
            <Button className="w-full" onClick={() => setShowFinancingDialog(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inquiry Dialog */}
      <Dialog open={showInquiryDialog} onOpenChange={setShowInquiryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Falar com Vendedor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInquirySubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={inquiryForm.name} onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={inquiryForm.phone} onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })} placeholder="(11) 99999-9999" />
            </div>
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea id="message" value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} placeholder="Olá, tenho interesse neste veículo..." rows={4} />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">Enviar Mensagem</Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowInquiryDialog(false)}>Cancelar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
      <Toaster />
    </div>
  )
}