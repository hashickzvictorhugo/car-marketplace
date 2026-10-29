import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Expirar anúncios antigos (60 dias sem atualização para ACTIVE, 30 para PENDING_REVIEW)
    const now = new Date()
    const activeExpiry = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    const pendingExpiry = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [expiredActive, expiredPending] = await Promise.all([
      prisma.listing.updateMany({
        where: {
          status: "ACTIVE",
          updatedAt: { lt: activeExpiry },
        },
        data: { status: "EXPIRED" },
      }),
      prisma.listing.updateMany({
        where: {
          status: "PENDING_REVIEW",
          updatedAt: { lt: pendingExpiry },
        },
        data: { status: "EXPIRED" },
      }),
    ])

    // Limpar rascunhos antigos (7 dias)
    const draftExpiry = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const deletedDrafts = await prisma.listing.deleteMany({
      where: {
        status: "DRAFT",
        updatedAt: { lt: draftExpiry },
      },
    })

    return NextResponse.json({
      success: true,
      expiredActive: expiredActive.count,
      expiredPending: expiredPending.count,
      deletedDrafts: deletedDrafts.count,
    })
  } catch (error) {
    console.error("Cron expire-listings error:", error)
    return NextResponse.json({ error: "Erro no cron" }, { status: 500 })
  }
}