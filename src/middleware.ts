import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/comprar(.*)",
  "/veiculo(.*)",
  "/marca(.*)",
  "/destaques",
  "/comparar",
  "/financiamento",
  "/favoritos",
  "/dashboard",
  "/vender",
  "/api/webhooks/clerk",
  "/api/brands",
  "/api/models",
  "/api/listings",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/login",
  "/cadastro",
  "/sobre",
  "/contato",
  "/ajuda",
  "/faq",
  "/termos",
  "/privacidade",
])

const isIgnoredRoute = createRouteMatcher([
  "/api/webhooks/clerk",
  "/_next(.*)",
  "/static(.*)",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
])

export default clerkMiddleware(async (auth, request) => {
  if (isIgnoredRoute(request)) return
  if (!isPublicRoute(request)) await auth.protect()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}