import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: [
    "/",
    "/comprar(.*)",
    "/veiculo(.*)",
    "/marca(.*)",
    "/destaques",
    "/comparar",
    "/financiamento",
    "/api/webhooks/clerk",
    "/api/brands",
    "/api/models",
    "/api/listings",
    "/login",
    "/cadastro",
    "/sobre",
    "/contato",
    "/ajuda",
    "/faq",
    "/termos",
    "/privacidade",
  ],
  ignoredRoutes: [
    "/api/webhooks/clerk",
    "/_next(.*)",
    "/static(.*)",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
  ],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}