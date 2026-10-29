"use client"

import { useState } from "react"
import { ArrowRight, Camera, Shield, DollarSign, Truck, CheckCircle, X, Plus, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const STEPS = [
  { id: "dados", title: "Dados do Veículo", icon: "🚗" },
  { id: "fotos", title: "Fotos", icon: "📸" },
  { id: "detalhes", title: "Detalhes & Equipamentos", icon: "⚙️" },
  { id: "preco", title: "Preço & Publicação", icon: "💰" },
]

const BRANDS = [
  { id: "1", name: "Chevrolet" }, { id: "2", name: "Volkswagen" }, { id: "3", name: "Fiat" },
  { id: "4", name: "Hyundai" }, { id: "5", name: "Toyota" }, { id: "6", name: "Ford" },
  { id: "7", name: "Honda" }, { id: "8", name: "Renault" }, { id: "9", name: "Nissan" },
  { id: "10", name: "Jeep" }, { id: "11", name: "Caoa Chery" }, { id: "12", name: "Peugeot" },
  { id: "13", name: "Citroën" }, { id: "14", name: "Mitsubishi" }, { id: "15", name: "Kia" },
]

const MODELS: Record<string, { id: string; name: string }[]> = {
  "1": [{ id: "1", name: "Onix" }, { id: "2", name: "Onix Plus" }, { id: "3", name: "Tracker" }, { id: "4", name: "S10" }, { id: "5", name: "Spin" }],
  "2": [{ id: "6", name: "Gol" }, { id: "7", name: "Voyage" }, { id: "8", name: "T-Cross" }, { id: "9", name: "Nivus" }, { id: "10", name: "Saveiro" }],
  "3": [{ id: "11", name: "Argo" }, { id: "12", name: "Cronos" }, { id: "13", name: "Mobi" }, { id: "14", name: "Pulse" }, { id: "15", name: "Strada" }],
  "4": [{ id: "16", name: "HB20" }, { id: "17", name: "HB20S" }, { id: "18", name: "Creta" }, { id: "19", name: "Tucson" }, { id: "20", name: "i30" }],
  "5": [{ id: "21", name: "Corolla" }, { id: "22", name: "Corolla Cross" }, { id: "23", name: "Yaris" }, { id: "24", name: "Hilux" }, { id: "25", name: "SW4" }],
}

const FUEL_TYPES = ["GASOLINE", "ETHANOL", "FLEX", "DIESEL", "HYBRID", "ELECTRIC", "GNV"]
const TRANSMISSION_TYPES = ["MANUAL", "AUTOMATIC", "CVT", "AUTOMATED"]
const BODY_TYPES = ["HATCH", "SEDAN", "SUV", "PICKUP", "COUPE", "CONVERTIBLE", "WAGON", "VAN", "MINIVAN"]
const COLORS = ["Branco", "Preto", "Prata", "Cinza", "Vermelho", "Azul", "Verde", "Amarelo", "Laranja", "Marrom", "Bege", "Dourado"]
const STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]

const EQUIPMENT_CATEGORIES = {
  conforto: ["Ar condicionado", "Ar condicionado digital", "Vidros elétricos", "Travas elétricas", "Volante multifuncional", "Computador de bordo", "Banco motorista regulagem altura", "Descansa-braço", "Bancos de couro", "Bancos aquecidos", "Bancos ventilados", "Teto solar", "Chave presencial", "Partida por botão"],
  seguranca: ["Airbag motorista", "Airbag passageiro", "Airbags laterais", "Airbags cortina", "Freios ABS", "EBD", "Controle de tração", "Controle de estabilidade", "Assistente partida rampa", "ISOFAX", "Câmera de ré", "Sensor estacionamento", "Faróis neblina", "Faróis xenon/LED", "Alerta ponto cego", "Alerta mudança faixa", "Piloto automático adaptativo", "Frenagem automática emergência"],
  tecnologia: ["Central multimídia", "Bluetooth", "USB", "Apple CarPlay", "Android Auto", "GPS integrado", "Comando voz", "Espelhamento tela", "Carregador sem fio", "Hotspot WiFi", "Painel digital", "Head-up display", "Som premium"],
  exterior: ["Rodas liga leve", "Faróis LED", "Lanternas LED", "Retrovisores rebatíveis", "Retrovisores seta", "Maçanetas cor veículo", "Rack teto", "Estribo lateral", "Santo antônio", "Capota marítima", "Protetor caçamba"],
}

export default function VenderPage() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Dados básicos
    brandId: "", modelId: "", version: "", year: "", yearModel: "", price: "", mileage: "",
    fuelType: "FLEX", transmission: "MANUAL", bodyType: "HATCH", color: "", doors: "4",
    engine: "", power: "", torque: "", licensePlate: "", vin: "",
    // Localização
    state: "", city: "", zipCode: "",
    // Fotos
    images: [] as File[],
    // Detalhes
    description: "", equipment: {} as Record<string, string[]>,
    // Publicação
    plan: "basico", featured: false, terms: false,
  })
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const currentStepData = STEPS[currentStep]
  const progress = ((currentStep + 1) / STEPS.length) * 100

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (files: FileList) => {
    const newFiles = Array.from(files).slice(0, 20 - formData.images.length)
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.terms) {
      toast({ title: "Erro", description: "Você deve aceitar os termos de uso", variant: "destructive" })
      return
    }
    setUploading(true)
    await new Promise(r => setTimeout(r, 2000))
    setUploading(false)
    toast({ title: "Anúncio enviado!", description: "Seu anúncio está em análise e será publicado em breve.", variant: "success" })
    setCurrentStep(0)
    setFormData({
      brandId: "", modelId: "", version: "", year: "", yearModel: "", price: "", mileage: "",
      fuelType: "FLEX", transmission: "MANUAL", bodyType: "HATCH", color: "", doors: "4",
      engine: "", power: "", torque: "", licensePlate: "", vin: "",
      state: "", city: "", zipCode: "", images: [], description: "", equipment: {},
      plan: "basico", featured: false, terms: false,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Anuncie seu Veículo</h1>
            <p className="text-muted-foreground mt-1">Processo simples, rápido e 100% online</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {STEPS.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    idx < currentStep ? "bg-primary text-primary-foreground" :
                    idx === currentStep ? "bg-primary text-primary-foreground" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {idx < currentStep ? <CheckCircle className="h-5 w-5" /> : step.icon}
                  </div>
                  <span className={cn("ml-2 hidden sm:block text-sm font-medium", idx <= currentStep ? "text-foreground" : "text-muted-foreground")}>
                    {step.title}
                  </span>
                  {idx < STEPS.length - 1 && (
                    <div className={cn("ml-4 h-1 w-20 sm:w-32", idx < currentStep ? "bg-primary" : "bg-muted")} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <Tabs value={currentStepData.id} onValueChange={setCurrentStep} className="w-full">
              <TabsContent value="dados" className="space-y-6 animate-slide-up">
                <Card>
                  <CardHeader><CardTitle>Informações Básicas</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Marca *</Label>
                        <Select value={formData.brandId} onValueChange={(v) => { handleChange("brandId", v); handleChange("modelId", "") }}>
                          <SelectTrigger><SelectValue placeholder="Selecione a marca" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Selecione</SelectItem>
                            {BRANDS.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Modelo *</Label>
                        <Select value={formData.modelId} onValueChange={(v) => handleChange("modelId", v)} disabled={!formData.brandId}>
                          <SelectTrigger><SelectValue placeholder={formData.brandId ? "Selecione o modelo" : "Selecione a marca primeiro"} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Selecione</SelectItem>
                            {MODELS[formData.brandId]?.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Versão/Complemento *</Label>
                      <Input placeholder="Ex: LT 1.0 Turbo Flex Automatizado" value={formData.version} onChange={e => handleChange("version", e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <Label>Ano Fabricação *</Label>
                        <Select value={formData.year} onValueChange={v => handleChange("year", v)}>
                          <SelectTrigger><SelectValue placeholder="Ano" /></SelectTrigger>
                          <SelectContent>
                            {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Ano Modelo *</Label>
                        <Select value={formData.yearModel} onValueChange={v => handleChange("yearModel", v)}>
                          <SelectTrigger><SelectValue placeholder="Ano" /></SelectTrigger>
                          <SelectContent>
                            {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Quilometragem *</Label>
                        <Input type="number" placeholder="Ex: 15000" value={formData.mileage} onChange={e => handleChange("mileage", e.target.value)} required />
                      </div>
                      <div>
                        <Label>Cor *</Label>
                        <Select value={formData.color} onValueChange={v => handleChange("color", v)}>
                          <SelectTrigger><SelectValue placeholder="Cor" /></SelectTrigger>
                          <SelectContent>
                            {COLORS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label>Combustível *</Label>
                        <Select value={formData.fuelType} onValueChange={v => handleChange("fuelType", v)}>
                          <SelectTrigger><SelectValue placeholder="Combustível" /></SelectTrigger>
                          <SelectContent>
                            {FUEL_TYPES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Transmissão *</Label>
                        <Select value={formData.transmission} onValueChange={v => handleChange("transmission", v)}>
                          <SelectTrigger><SelectValue placeholder="Transmissão" /></SelectTrigger>
                          <SelectContent>
                            {TRANSMISSION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Carroceria *</Label>
                        <Select value={formData.bodyType} onValueChange={v => handleChange("bodyType", v)}>
                          <SelectTrigger><SelectValue placeholder="Carroceria" /></SelectTrigger>
                          <SelectContent>
                            {BODY_TYPES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label>Portas</Label>
                        <Select value={formData.doors} onValueChange={v => handleChange("doors", v)}>
                          <SelectTrigger><SelectValue placeholder="Portas" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4">4</SelectItem><SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Motor</Label>
                        <Input placeholder="Ex: 1.0 Turbo" value={formData.engine} onChange={e => handleChange("engine", e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label>Potência (cv)</Label><Input type="number" placeholder="116" value={formData.power} onChange={e => handleChange("power", e.target.value)} /></div>
                        <div><Label>Torque (Nm)</Label><Input type="number" placeholder="168" value={formData.torque} onChange={e => handleChange("torque", e.target.value)} /></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><Label>Placa (opcional)</Label><Input placeholder="ABC1D23" value={formData.licensePlate} onChange={e => handleChange("licensePlate", e.target.value.toUpperCase())} /></div>
                      <div><Label>Chassi/VIN (opcional)</Label><Input placeholder="9BWZZZ377VT004251" value={formData.vin} onChange={e => handleChange("vin", e.target.value.toUpperCase())} /></div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fotos" className="space-y-6 animate-slide-up">
                <Card>
                  <CardHeader><CardTitle>Fotos do Veículo</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground">Adicione até 20 fotos. A primeira será a capa. Recomendamos: frente, traseira, laterais, interior, painel, rodas, motor, documentos.</p>
                    <div
                      className={cn("border-2 border-dashed rounded-xl p-8 text-center transition-colors", dragActive ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50")}
                      onDragEnter={e => { e.preventDefault(); setDragActive(true) }}
                      onDragLeave={e => { e.preventDefault(); setDragActive(false) }}
                      onDragOver={e => { e.preventDefault() }}
                      onDrop={e => { e.preventDefault(); setDragActive(false); handleImageUpload(e.dataTransfer.files) }}
                    >
                      <input type="file" multiple accept="image/*" onChange={e => e.target.files && handleImageUpload(e.target.files)} className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-1">Arraste fotos aqui ou clique para selecionar</p>
                        <p className="text-sm text-muted-foreground">{formData.images.length}/20 fotos • JPG, PNG, WebP • Máx 10MB cada</p>
                      </label>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {formData.images.map((file, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                            <img src={URL.createObjectURL(file)} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                            {idx === 0 && <Badge className="absolute top-2 left-2 bg-yellow-500">Capa</Badge>}
                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"><X className="h-4 w-4" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="detalhes" className="space-y-6 animate-slide-up">
                <Card>
                  <CardHeader><CardTitle>Descrição do Veículo</CardTitle></CardHeader>
                  <CardContent>
                    <Textarea placeholder="Descreva o estado do veículo, histórico de manutenção, acessórios, motivo da venda..." value={formData.description} onChange={e => handleChange("description", e.target.value)} rows={6} className="mb-6" />
                    <Label>Equipamentos e Opcionais</Label>
                    <div className="space-y-6 mt-4">
                      {Object.entries(EQUIPMENT_CATEGORIES).map(([cat, items]) => (
                        <div key={cat} className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-3 capitalize">{cat}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {items.map(item => (
                              <label key={item} className="flex items-center space-x-2 cursor-pointer">
                                <Checkbox
                                  checked={formData.equipment[cat]?.includes(item) || false}
                                  onCheckedChange={checked => {
                                    const catItems = formData.equipment[cat] || []
                                    handleChange("equipment", {
                                      ...formData.equipment,
                                      [cat]: checked ? [...catItems, item] : catItems.filter(i => i !== item)
                                    })
                                  }}
                                />
                                <span className="text-sm">{item}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preco" className="space-y-6 animate-slide-up">
                <Card>
                  <CardHeader><CardTitle>Preço e Publicação</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Preço *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                        <Input type="number" placeholder="89900" className="pl-8" value={formData.price} onChange={e => handleChange("price", e.target.value)} required />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Sugestão: R$ {formatPrice(Number(formData.price) || 0)}</p>
                    </div>
                    <div>
                      <Label>Plano de Anúncio</Label>
                      <RadioGroup value={formData.plan} onValueChange={v => handleChange("plan", v)}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            { id: "basico", name: "Básico", price: 0, features: ["Até 10 fotos", "30 dias online", "Suporte por e-mail"] },
                            { id: "destaque", name: "Destaque", price: 89, features: ["Até 20 fotos", "60 dias online", "Badge Destaque", "Topo nas buscas", "Suporte prioritário"] },
                            { id: "premium", name: "Premium", price: 179, features: ["Tudo do Destaque", "90 dias online", "Vídeo do veículo", "Relatório de visualizações", "Destaque na homepage"] },
                          ].map(plan => (
                            <Card key={plan.id} className={cn("cursor-pointer transition-all border-2", formData.plan === plan.id ? "border-primary" : "border-muted hover:border-primary/50")}>
                              <CardContent className="p-4">
                                <RadioGroupItem value={plan.id} className="sr-only" />
                                <div className="text-center">
                                  <h4 className="font-semibold">{plan.name}</h4>
                                  <p className="text-2xl font-bold text-primary mt-1">{plan.price === 0 ? "Grátis" : `R$ ${plan.price},00`}</p>
                                  <ul className="text-sm text-muted-foreground mt-3 space-y-1 text-left">
                                    {plan.features.map(f => <li key={f} className="flex items-center space-x-1"><CheckCircle className="h-4 w-4 text-green-500" />{f}</li>)}
                                  </ul>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="featured" checked={formData.featured} onCheckedChange={v => handleChange("featured", v)} disabled={formData.plan === "basico"} />
                      <Label htmlFor="featured">Destacar na homepage (R$ 29,00/semana)</Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" checked={formData.terms} onCheckedChange={v => handleChange("terms", v)} required />
                      <Label htmlFor="terms" className="text-sm">
                        Aceito os <a href="/termos" className="text-primary underline">Termos de Uso</a> e <a href="/privacidade" className="text-primary underline">Política de Privacidade</a>. Autorizo a verificação dos dados do veículo.
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                Voltar
              </Button>
              {currentStep === STEPS.length - 1 ? (
                <Button type="submit" disabled={uploading} className="w-full sm:w-auto">
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <>Publicar Anúncio <ArrowRight className="h-4 w-4 ml-2" /></>}
                </Button>
              ) : (
                <Button type="button" onClick={nextStep} className="w-full sm:w-auto">
                  Próximo <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}