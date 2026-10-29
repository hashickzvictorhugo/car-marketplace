import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://automax.com.br"

  const robots = `
User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow private/admin areas
Disallow: /dashboard/
Disallow: /vender/
Disallow: /favoritos/
Disallow: /api/
Disallow: /login
Disallow: /cadastro
Disallow: /_next/
Disallow: /static/
Disallow: /*.json$
Disallow: /*.xml$

# Crawl-delay
Crawl-delay: 10
`.trim()

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  })
}