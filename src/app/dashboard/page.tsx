"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { LayoutDashboard, Car, Plus, Eye, Edit, Trash2, Heart, MessageSquare, BarChart2, Settings, LogOut, ChevronRight, Filter, Download, Clock, CheckCircle, XCircle, AlertTriangle, DollarSign, Users, Star, TrendingUp } from "lucide-react"
import { cn, formatPrice, formatNumber, formatRelativeTime, LISTING_STATUS_LABELS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const mockListings = [
  { id: "1", title: "Onix LT 1.0 Turbo", brand: "Chevrolet", model: "Onix", price: 89900, year: 2023, mileage: 15000, status: "ACTIVE", images: [{ url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400", isCover: true }], views: 1250, favorites: 89, inquiries: 23, createdAt: "2024-01-15" },
  { id: "2", title: "Corolla XEi 2.0 Hybrid", brand: "Toyota", model: "Corolla", price: 189900, year: 2023, mileage: 8000, status: "ACTIVE", images: [{ url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400", isCover: true }], views: 890, favorites: 67, inquiries: 15, createdAt: "2024-01-10" },
  { id: "3", title: "Compass Limited 2.0 Diesel", brand: "Jeep", model: "Compass", price: 219900, year: 2022, mileage: 25000, status: "SOLD", images: [{ url: "https://images.unsplash.com/photo-1520031032609-855c4f8a4c7a?w=400", isCover: true }], views: 2100, favorites: 156, inquiries: 45, createdAt: "2023-12-20" },
  { id: "4", title: "HB20 Platinum 1.0 Turbo", brand: "Hyundai", model: "HB20", price: 95900, year: 2023, mileage: 12000, status: "PENDING_REVIEW", images: [{ url: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400", isCover: true }], views: 450, favorites: 34, inquiries: 8, createdAt: "2024-01-18" },
  { id: "5", title: "T-Cross Highline 1.4 TSI", brand: "Volkswagen", model: "T-Cross", price: 149900, year: 2023, mileage: 18000, status: "ACTIVE", images: [{ url: "https://images.unsplash.com/photo-1606664515524-edb54d20657d?w=400", isCover: true }], views: 1800, favorites: 112, inquiries: 31, createdAt: "2024-01-05" },
  { id: "6", title: "Argo Trekking 1.3 Flex", brand: "Fiat", model: "Argo", price: 82900, year: 2023, mileage: 22000, status: "DRAFT", images: [{ url: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400", isCover: true }], views: 0, favorites: 0, inquiries: 0, createdAt: "2024-01-20" },
]

const mockInquiries = [
  { id: "1", listingId: "1", listingTitle: "Onix LT 1.0 Turbo", listingImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400", buyerName: "João Silva", buyerPhone: "(11) 99999-1111", message: "Olá, tem interesse no veículo. Está disponível para test drive?", status: "NEW", createdAt: "2024-01-20" },
  { id: "2", listingId: "2", listingTitle: "Corolla XEi 2.0 Hybrid", listingImage: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400", buyerName: "Maria Santos", buyerPhone: "(11) 99999-2222", message: "Qual o valor à vista? Aceita troca?", status: "READ", createdAt: "2024-01-19" },
  { id: "3", listingId: "1", listingTitle: "Onix LT 1.0 Turbo", listingImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400", buyerName: "Pedro Costa", buyerPhone: "(11) 99999-3333", message: "Gostaria de agendar uma visita.", status: "REPLIED", createdAt: "2024-01-18" },
]

const statusColors = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  SOLD: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  PENDING_REVIEW: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  EXPIRED: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
}

const statusIcons = {
  ACTIVE: CheckCircle,
  SOLD: DollarSign,
  PENDING_REVIEW: Clock,
  DRAFT: AlertTriangle,
  REJECTED: XCircle,
  EXPIRED: AlertTriangle,
}

export default function DashboardPage() {
  const { userId, isLoaded, signOut } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("meus-anuncios")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showInquiryDialog, setShowInquiryDialog] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [replyMessage, setReplyMessage] = useState("")

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-xl" />)}
            </div>
            <div className="h-64 bg-muted rounded-xl" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const filteredListings = mockListings.filter(l => {
    const matchesStatus = statusFilter === "all" || l.status === statusFilter
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.model.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const stats = {
    total: mockListings.length,
    active: mockListings.filter(l => l.status === "ACTIVE").length,
    sold: mockListings.filter(l => l.status === "SOLD").length,
    pending: mockListings.filter(l => l.status === "PENDING_REVIEW").length,
    draft: mockListings.filter(l => l.status === "DRAFT").length,
    totalViews: mockListings.reduce((a, b) => a + b.views, 0),
    totalInquiries: mockListings.reduce((a, b) => a + b.inquiries, 0),
    totalFavorites: mockListings.reduce((a, b) => a + b.favorites, 0),
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Meu Painel</h1>
              <p className="text-muted-foreground">Gerencie seus anúncios e acompanhe resultados</p>
            </div>
            <Link href="/vender">
              <Button><Plus className="h-4 w-4 mr-2" /> Novo Anúncio</Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Anúncios</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ativos</p>
                    <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Visualizações</p>
                    <p className="text-3xl font-bold">{formatNumber(stats.totalViews)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Contatos Recebidos</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.totalInquiries}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="meus-anuncios">Meus Anúncios</TabsTrigger>
              <TabsTrigger value="contatos">Contatos ({mockInquiries.filter(i => i.status === "NEW").length})</TabsTrigger>
              <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            </TabsList>

            {/* Meus Anúncios */}
            <TabsContent value="meus-anuncios" className="mt-6 animate-slide-up">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input placeholder="Buscar seus anúncios..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Todos os status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ACTIVE">Ativos</SelectItem>
                    <SelectItem value="SOLD">Vendidos</SelectItem>
                    <SelectItem value="PENDING_REVIEW">Em análise</SelectItem>
                    <SelectItem value="DRAFT">Rascunhos</SelectItem>
                    <SelectItem value="REJECTED">Rejeitados</SelectItem>
                    <SelectItem value="EXPIRED">Expirados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredListings.length > 0 ? (
                <div className="space-y-4">
                  {filteredListings.map(listing => (
                    <Card key={listing.id} className="overflow-hidden">
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="relative w-24 h-18 sm:w-32 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                            <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold truncate">{listing.brand} {listing.model} {listing.title.replace(`${listing.brand} ${listing.model}`, "").trim()}</h3>
                                <p className="text-sm text-muted-foreground">{listing.year} • {formatNumber(listing.mileage)} km • {formatRelativeTime(listing.createdAt)}</p>
                              </div>
                              <Badge className={cn("whitespace-nowrap", statusColors[listing.status as keyof typeof statusColors])}>
                                <statusIcons[listing.status as keyof typeof statusIcons] className="h-3 w-3 mr-1" />
                                {LISTING_STATUS_LABELS[listing.status as keyof typeof LISTING_STATUS_LABELS]}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {formatNumber(listing.views)}</span>
                              <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {listing.favorites}</span>
                              <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {listing.inquiries}</span>
                              <span className="font-semibold text-primary">{formatPrice(listing.price)}</span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Opções do anúncio</DropdownMenuLabel>
                              <DropdownMenuItem asChild><Link href={`/veiculo/${listing.id}/editar`}><Edit className="h-4 w-4 mr-2" />Editar</Link></DropdownMenuItem>
                              <DropdownMenuItem asChild><Link href={`/veiculo/${listing.id}`} target="_blank"><Eye className="h-4 w-4 mr-2" />Ver público</Link></DropdownMenuItem>
                              <DropdownMenuItem><BarChart2 className="h-4 w-4 mr-2" />Estatísticas</DropdownMenuItem>
                              <DropdownMenuItem><Download className="h-4 w-4 mr-2" />Exportar dados</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => toast({title: "Excluído", description: "Anúncio movido para lixeira", variant: "destructive"})}><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Nenhum anúncio encontrado</h3>
                    <p className="text-muted-foreground mb-6">{searchQuery || statusFilter !== "all" ? "Tente alterar os filtros" : "Você ainda não criou nenhum anúncio"}</p>
                    {(!searchQuery && statusFilter === "all") && <Link href="/vender"><Button><Plus className="h-4 w-4 mr-2" />Criar primeiro anúncio</Button></Link>}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Contatos */}
            <TabsContent value="contatos" className="mt-6 animate-slide-up">
              <div className="space-y-4">
                {mockInquiries.map(inquiry => (
                  <Card key={inquiry.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative w-20 h-18 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img src={inquiry.listingImage} alt={inquiry.listingTitle} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{inquiry.buyerName}</p>
                              <p className="text-sm text-muted-foreground">{inquiry.listingTitle} • {formatRelativeTime(inquiry.createdAt)}</p>
                            </div>
                            <Badge variant={inquiry.status === "NEW" ? "default" : inquiry.status === "READ" ? "secondary" : "success"}>
                              {inquiry.status === "NEW" ? "Novo" : inquiry.status === "READ" ? "Lido" : "Respondido"}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1 line-clamp-2">{inquiry.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{inquiry.buyerPhone}</span>
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedInquiry(inquiry); setShowInquiryDialog(true) }}>Responder</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Favoritos */}
            <TabsContent value="favoritos" className="mt-6 animate-slide-up">
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum favorito salvo</h3>
                  <p className="text-muted-foreground mb-6">Veículos que você favoritar aparecerão aqui</p>
                  <Link href="/comprar"><Button><Car className="h-4 w-4 mr-2" />Explorar veículos</Button></Link>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configurações */}
            <TabsContent value="configuracoes" className="mt-6 animate-slide-up">
              <div className="max-w-2xl space-y-8">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Perfil</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-24 w-24"><AvatarFallback className="text-3xl">U</AvatarFallback></Avatar>
                      <div>
                        <h4 className="font-semibold">Usuário Teste</h4>
                        <p className="text-muted-foreground">usuario@email.com</p>
                        <Badge variant="secondary" className="mt-2">Vendedor Verificado</Badge>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><Label>Nome completo</Label><Input defaultValue="Usuário Teste" /></div>
                      <div><Label>Telefone</Label><Input defaultValue="(11) 99999-9999" /></div>
                      <div><Label>E-mail</Label><Input defaultValue="usuario@email.com" disabled /></div>
                      <div><Label>CPF/CNPJ</Label><Input placeholder="000.000.000-00" /></div>
                    </div>
                    <Button>Salvar alterações</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Segurança</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div><p className="font-medium">Autenticação de dois fatores</p><p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p></div>
                      <Button variant="outline" size="sm">Ativar</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div><p className="font-medium">Alterar senha</p><p className="text-sm text-muted-foreground">Atualize sua senha regularmente</p></div>
                      <Button variant="outline" size="sm">Alterar</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><LogOut className="h-5 w-5" /> Conta</CardTitle></CardHeader>
                  <CardContent>
                    <Button variant="destructive" onClick={() => signOut()}>Sair da conta</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Reply Dialog */}
      <Dialog open={showInquiryDialog} onOpenChange={setShowInquiryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Responder: {selectedInquiry?.buyerName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">Veículo: {selectedInquiry?.listingTitle}</p>
            <Textarea value={replyMessage} onChange={e => setReplyMessage(e.target.value)} placeholder="Digite sua resposta..." rows={4} />
            <div className="flex space-x-2">
              <Button className="flex-1" onClick={() => { toast({title: "Resposta enviada!", variant: "success"}); setShowInquiryDialog(false); setReplyMessage("") }}>Enviar</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowInquiryDialog(false)}>Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      <Toaster />
    </div>
  )
}