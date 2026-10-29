import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const now = new Date()

    // Remover destaque de anúncios expirados
    const expiredFeatured = await prisma.listing.updateMany({
      where: {
        featured: true,
        expiresAt: { lt: now },
      },
      data: { featured: false, expiresAt: null },
    })

    // Notificar vendedores com destaque prestes a expirar (24h)
    const expiringSoon = await prisma.listing.findMany({
      where: {
        featured: true,
        expiresAt: {
          gt: now,
          lt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: { seller: true },
    })

    // TODO: Enviar notificação/email para sellers

    return NextResponse.json({
      success: true,
      expiredFeatured: expiredFeatured.count,
      expiringSoon: expiringSoon.length,
    })
  } catch (error) {
    console.error("Cron featured-expiry error:", error)
    return NextResponse.json({ error: "Erro no cron" }, { status: 500 })
  }
}