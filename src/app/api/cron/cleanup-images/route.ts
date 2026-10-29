import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Encontrar imagens órfãs (não associadas a nenhum anúncio ativo/pendente)
    const orphanImages = await prisma.listingImage.findMany({
      where: {
        listing: {
          status: { in: ["DELETED", "EXPIRED"] },
          updatedAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      },
      select: { id: true, url: true },
    })

    // TODO: Deletar do Vercel Blob usando as URLs
    // const { del } = await import('@vercel/blob')
    // await del(orphanImages.map(i => i.url))

    // Remover do banco
    const deleted = await prisma.listingImage.deleteMany({
      where: {
        id: { in: orphanImages.map(i => i.id) },
      },
    })

    return NextResponse.json({
      success: true,
      orphanFound: orphanImages.length,
      deleted: deleted.count,
    })
  } catch (error) {
    console.error("Cron cleanup-images error:", error)
    return NextResponse.json({ error: "Erro no cron" }, { status: 500 })
  }
}