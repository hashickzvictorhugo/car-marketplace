import Link from "next/link"
import { Car, Shield, Truck, Headphones, Globe, MessageSquare, Video } from "lucide-react"

const footerLinks = {
  empresa: [
    { name: "Sobre Nós", href: "/sobre" },
    { name: "Carreiras", href: "/carreiras" },
    { name: "Imprensa", href: "/imprensa" },
    { name: "Blog", href: "/blog" },
    { name: "Parceiros", href: "/parceiros" },
  ],
  comprar: [
    { name: "Todos os Veículos", href: "/comprar" },
    { name: "Carros Novos", href: "/comprar?condition=new" },
    { name: "Seminovos", href: "/comprar?condition=used" },
    { name: "Marcas", href: "/marcas" },
    { name: "Comparar", href: "/comparar" },
  ],
  vender: [
    { name: "Anuncie Seu Carro", href: "/vender" },
    { name: "Como Funciona", href: "/vender/como-funciona" },
    { name: "Planos", href: "/vender/planos" },
    { name: "Dicas de Venda", href: "/vender/dicas" },
    { name: "Avaliação Grátis", href: "/avaliacao" },
  ],
  suporte: [
    { name: "Central de Ajuda", href: "/ajuda" },
    { name: "Fale Conosco", href: "/contato" },
    { name: "Perguntas Frequentes", href: "/faq" },
    { name: "Segurança", href: "/seguranca" },
    { name: "Termos de Uso", href: "/termos" },
  ],
  legal: [
    { name: "Política de Privacidade", href: "/privacidade" },
    { name: "Termos de Serviço", href: "/termos" },
    { name: "Cookies", href: "/cookies" },
    { name: "LGPD", href: "/lgpd" },
    { name: "Acessibilidade", href: "/acessibilidade" },
  ],
}

const benefits = [
  { icon: Shield, title: "Compra Segura", description: "Verificamos todos os anúncios" },
  { icon: Car, title: "Milhares de Opções", description: "Maior estoque do Brasil" },
  { icon: Truck, title: "Entrega Nacional", description: "Entregamos em todo o país" },
  { icon: Headphones, title: "Suporte 7 dias", description: "Equipe pronta para ajudar" },
]

const socialLinks = [
  { icon: Globe, href: "https://facebook.com/automax", label: "Facebook" },
  { icon: MessageSquare, href: "https://instagram.com/automax", label: "Instagram" },
  { icon: Globe, href: "https://twitter.com/automax", label: "Twitter" },
  { icon: Video, href: "https://youtube.com/automax", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/50" role="contentinfo">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4" aria-label="AutoMax Home">
              <span className="text-2xl font-bold text-primary">AutoMax</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              O maior marketplace de veículos do Brasil. Compre e venda com segurança, transparência e as melhores condições.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Empresa">
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Comprar">
            <h3 className="font-semibold mb-4">Comprar</h3>
            <ul className="space-y-3">
              {footerLinks.comprar.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Vender">
            <h3 className="font-semibold mb-4">Vender</h3>
            <ul className="space-y-3">
              {footerLinks.vender.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Suporte">
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3">
              {footerLinks.suporte.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 p-6 bg-card rounded-xl border">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <benefit.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{benefit.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; 2024 AutoMax. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="/privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Termos
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
            <Link href="/acessibilidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Acessibilidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}