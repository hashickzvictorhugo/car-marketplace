"use client"

import { useState } from "react"
import { Calculator, DollarSign, Percent, Calendar, ArrowRight, Shield, Truck, Clock, CheckCircle, CreditCard, Banknote } from "lucide-react"
import { cn, formatPrice, formatNumber, calculateFinancing } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const BANKS = [
  { id: "itau", name: "Itaú", logo: "IT", rate: 1.29, maxMonths: 60, minDown: 20 },
  { id: "bradesco", name: "Bradesco", logo: "BR", rate: 1.35, maxMonths: 60, minDown: 20 },
  { id: "santander", name: "Santander", logo: "ST", rate: 1.39, maxMonths: 60, minDown: 20 },
  { id: "bb", name: "Banco do Brasil", logo: "BB", rate: 1.45, maxMonths: 60, minDown: 10 },
  { id: "caixa", name: "Caixa Econômica", logo: "CE", rate: 1.49, maxMonths: 60, minDown: 10 },
  { id: "pan", name: "Banco Pan", logo: "PN", rate: 1.69, maxMonths: 72, minDown: 0 },
  { id: "bmg", name: "BMG", logo: "BM", rate: 1.79, maxMonths: 72, minDown: 0 },
  { id: "omni", name: "Omni", logo: "OM", rate: 1.89, maxMonths: 72, minDown: 0 },
]

export default function FinanciamentoPage() {
  const { toast } = useToast()
  const [vehiclePrice, setVehiclePrice] = useState(100000)
  const [downPayment, setDownPayment] = useState(20000)
  const [months, setMonths] = useState(48)
  const [selectedBank, setSelectedBank] = useState("itau")
  const [includeInsurance, setIncludeInsurance] = useState(true)
  const [includeWarranty, setIncludeWarranty] = useState(false)

  const bank = BANKS.find(b => b.id === selectedBank)!
  const monthlyRate = bank.rate / 100
  const financedAmount = vehiclePrice - downPayment
  const financing = calculateFinancing(vehiclePrice, downPayment, months, monthlyRate)
  const insuranceMonthly = vehiclePrice * 0.0035
  const warrantyMonthly = vehiclePrice * 0.0015
  const totalMonthly = financing.monthlyPayment + (includeInsurance ? insuranceMonthly : 0) + (includeWarranty ? warrantyMonthly : 0)
  const totalPaid = financing.totalPaid + (includeInsurance ? insuranceMonthly * months : 0) + (includeWarranty ? warrantyMonthly * months : 0)

  const formatInputValue = (value: number) => value.toLocaleString('pt-BR')
  const parseInputValue = (value: string) => parseInt(value.replace(/\D/g, '')) || 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary via-primary/90 to-primary/70 text-primary-foreground py-12 lg:py-16">
          <div className="container text-center">
            <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
              <Calculator className="h-4 w-4 mr-2" />
              Simulador de Financiamento
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Simule seu financiamento em segundos</h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">Compare taxas dos principais bancos, escolha o melhor plano e tenha seu carro novo na garagem.</p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Simulator */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> Configurar Simulação</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Valor do Veículo</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                        <Input type="text" value={formatInputValue(vehiclePrice)} onChange={e => setVehiclePrice(parseInputValue(e.target.value))} className="pl-8" />
                      </div>
                      <Slider max={500000} step={5000} value={[vehiclePrice]} onValueChange={([v]) => setVehiclePrice(v)} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label>Entrada</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                          <Input type="text" value={formatInputValue(downPayment)} onChange={e => setDownPayment(Math.min(parseInputValue(e.target.value), vehiclePrice))} className="pl-8" />
                        </div>
                        <Slider max={vehiclePrice} step={1000} value={[downPayment]} onValueChange={([v]) => setDownPayment(v)} className="mt-2" />
                        <p className="text-sm text-muted-foreground mt-1">{Math.round((downPayment / vehiclePrice) * 100)}% do valor</p>
                      </div>
                      <div>
                        <Label>Parcelas</Label>
                        <Select value={String(months)} onValueChange={v => setMonths(parseInt(v))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[12, 18, 24, 30, 36, 42, 48, 54, 60, 72].filter(m => m <= bank.maxMonths).map(m => <SelectItem key={m} value={String(m)}>{m}x ({m/12} anos)</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Banco / Financeira</Label>
                      <Select value={selectedBank} onValueChange={setSelectedBank}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {BANKS.map(b => (
                            <SelectItem key={b.id} value={b.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{b.name}</span>
                                <span className="text-primary font-semibold">{b.rate.toFixed(2)}% a.m.</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={includeInsurance} onChange={e => setIncludeInsurance(e.target.checked)} className="w-4 h-4 rounded border-muted text-primary focus:ring-primary" />
                        <div><p className="font-medium">Seguro Prestamista</p><p className="text-sm text-muted-foreground">Proteção para sua família (0,35% a.m.)</p></div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={includeWarranty} onChange={e => setIncludeWarranty(e.target.checked)} className="w-4 h-4 rounded border-muted text-primary focus:ring-primary" />
                        <div><p className="font-medium">Garantia Estendida</p><p className="text-sm text-muted-foreground">Cobertura mecânica extra (0,15% a.m.)</p></div>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* Results */}
                <Card className="border-primary/20">
                  <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" /> Resultado da Simulação</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 bg-primary/5 rounded-xl text-center">
                        <p className="text-sm text-muted-foreground">Entrada</p>
                        <p className="text-2xl font-bold text-primary">{formatPrice(downPayment)}</p>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-xl text-center">
                        <p className="text-sm text-muted-foreground">Financiado</p>
                        <p className="text-2xl font-bold text-primary">{formatPrice(financedAmount)}</p>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-xl text-center">
                        <p className="text-sm text-muted-foreground">Parcela (sem seguros)</p>
                        <p className="text-2xl font-bold text-primary">{formatPrice(financing.monthlyPayment)}</p>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-xl text-center">
                        <p className="text-sm text-muted-foreground">Parcela Total</p>
                        <p className="text-2xl font-bold text-primary">{formatPrice(totalMonthly)}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between py-2"><span>Valor do veículo</span><span className="font-medium">{formatPrice(vehiclePrice)}</span></div>
                      <div className="flex justify-between py-2"><span>Entrada ({Math.round((downPayment/vehiclePrice)*100)}%)</span><span className="font-medium">-{formatPrice(downPayment)}</span></div>
                      <div className="flex justify-between py-2"><span>Valor financiado</span><span className="font-medium">{formatPrice(financedAmount)}</span></div>
                      <Separator />
                      {months > 0 && (
                        <>
                          <div className="flex justify-between py-2"><span>Juros ({bank.rate}% a.m.)</span><span className="font-medium text-primary">{formatPrice(financing.totalInterest)}</span></div>
                          {includeInsurance && <div className="flex justify-between py-2"><span>Seguro prestamista ({months}x)</span><span className="font-medium">{formatPrice(insuranceMonthly * months)}</span></div>}
                          {includeWarranty && <div className="flex justify-between py-2"><span>Garantia estendida ({months}x)</span><span className="font-medium">{formatPrice(warrantyMonthly * months)}</span></div>}
                        </>
                      )}
                      <Separator />
                      <div className="flex justify-between py-2 text-lg"><span>Total a pagar</span><span className="font-bold text-primary">{formatPrice(totalPaid)}</span></div>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 text-green-800 dark:text-green-200 mb-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Simulação aprovada para análise!</span>
                      </div>
                      <p className="text-green-700 dark:text-green-300 text-sm">Esta simulação é referencial. A aprovação final depende de análise de crédito do banco escolhido.</p>
                    </div>

                    <Button className="w-full" size="lg" onClick={() => toast({ title: "Simulação enviada!", description: "Nossa equipe entrará em contato para dar continuidade.", variant: "success" })}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Solicitar Aprovação
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Banknote className="h-5 w-5" /> Comparação de Bancos</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {BANKS.map(b => {
                      const f = calculateFinancing(vehiclePrice, downPayment, months, b.rate / 100)
                      return (
                        <div key={b.id} className={cn("p-4 rounded-lg border transition-all cursor-pointer", selectedBank === b.id ? "border-primary bg-primary/5" : "hover:border-primary/50")} onClick={() => setSelectedBank(b.id)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">{b.logo}</div>
                              <div>
                                <p className="font-medium">{b.name}</p>
                                <p className="text-sm text-muted-foreground">{b.rate.toFixed(2)}% a.m. • até {b.maxMonths}x • Entrada mín. {b.minDown}%</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">{formatPrice(f.monthlyPayment)}</p>
                              <p className="text-xs text-muted-foreground">/mês</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Benefícios AutoMax</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { icon: Shield, title: "Análise em 15 min", desc: "Resposta rápida com múltiplos bancos" },
                      { icon: Percent, title: "Melhores taxas", desc: "Comparamos e negociamos por você" },
                      { icon: Calendar, title: "Até 72 meses", desc: "Parcelas que cabem no seu bolso" },
                      { icon: CreditCard, title: "Entrada facilitada", desc: "Aceitamos seu usado na troca" },
                      { icon: Truck, title: "Entrega grátis", desc: "Seu carro na porta de casa" },
                      { icon: Clock, title: "Sem burocracia", desc: "Cuidamos de toda documentação" },
                    ].map(item => (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><item.icon className="h-5 w-5 text-primary" /></div>
                        <div><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Documentos Necessários</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {["RG e CPF (ou CNH)", "Comprovante de residência (últimos 3 meses)", "Comprovante de renda (últimos 3 holerites/IR)", "Extrato bancário (últimos 3 meses)", "Comprovante de estado civil (se casado)"].map((doc, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />{doc}</div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold">Dúvidas Frequentes</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                { q: "Qual a taxa de juros real?", a: "As taxas variam de 1,29% a 1,89% ao mês dependendo do banco, seu score e o veículo. A taxa final é definida na análise de crédito." },
                { q: "Preciso dar entrada?", a: "A maioria dos bancos exige 10-20% de entrada. Alguns aceitam entrada zero para scores altos ou veículos até R$ 80k." },
                { q: "Posso usar meu carro na troca?", a: "Sim! Avaliamos seu veículo gratuitamente e o valor pode ser usado como entrada no financiamento." },
                { q: "Quanto tempo demora a aprovação?", a: "Análise prévia em 15 minutos. Aprovação final em até 24h úteis. Documentação e liberação em 48h." },
                { q: "Posso quitar antecipadamente?", a: "Sim, sem multa. Você economiza os juros futuros. Consulte as condições do banco escolhido." },
                { q: "O que é seguro prestamista?", a: "Protege sua família quitando o financiamento em caso de morte, invalidez ou desemprego involuntário. Opcional mas recomendado." },
              ].map((faq, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">{faq.q}</h4>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}