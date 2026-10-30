import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://automax.com.br"

    // Fetch dynamic URLs
    const [listings, brands] = await Promise.all([
      prisma.listing.findMany({
        where: { status: "ACTIVE" },
        select: { id: true, updatedAt: true },
        take: 50000,
      }),
      prisma.brand.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true },
      }),
    ])

    const staticPages = [
      { url: "", changefreq: "daily", priority: 1.0 },
      { url: "/comprar", changefreq: "hourly", priority: 0.9 },
      { url: "/destaques", changefreq: "daily", priority: 0.8 },
      { url: "/comparar", changefreq: "weekly", priority: 0.6 },
      { url: "/financiamento", changefreq: "weekly", priority: 0.7 },
      { url: "/vender", changefreq: "monthly", priority: 0.5 },
      { url: "/marcas", changefreq: "weekly", priority: 0.7 },
    ]

    const listingUrls = listings.map(l => ({
      url: `/veiculo/${l.id}`,
      lastmod: l.updatedAt.toISOString(),
      changefreq: "daily",
      priority: 0.8,
    }))

    const brandUrls = brands.map(b => ({
      url: `/marca/${b.id}`,
      lastmod: b.updatedAt.toISOString(),
      changefreq: "weekly",
      priority: 0.7,
    }))

    const allUrls = [...staticPages, ...listingUrls, ...brandUrls]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join("\n")}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return NextResponse.json({ error: "Erro ao gerar sitemap" }, { status: 500 })
  }
}