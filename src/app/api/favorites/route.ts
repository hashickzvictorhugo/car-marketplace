import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId: session.user.id } })
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        listing: {
          include: {
            brand: true,
            model: true,
            seller: { select: { id: true, name: true, avatar: true, isVerified: true } },
            images: { where: { isCover: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(favorites.map(f => ({ ...f.listing, isFavorited: true })))
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ error: "Erro ao buscar favoritos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId: session.user.id } })
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const { listingId } = await request.json()

    const favorite = await prisma.favorite.upsert({
      where: { userId_listingId: { userId: user.id, listingId } },
      create: { userId: user.id, listingId },
      update: {},
    })

    await prisma.listing.update({
      where: { id: listingId },
      data: { favoritesCount: { increment: 1 } },
    })

    return NextResponse.json(favorite)
  } catch (error) {
    console.error("Error adding favorite:", error)
    return NextResponse.json({ error: "Erro ao adicionar favorito" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId: session.user.id } })
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get("listingId")

    if (!listingId) {
      return NextResponse.json({ error: "listingId é obrigatório" }, { status: 400 })
    }

    await prisma.favorite.delete({
      where: { userId_listingId: { userId: user.id, listingId } },
    })

    await prisma.listing.update({
      where: { id: listingId },
      data: { favoritesCount: { decrement: 1 } },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing favorite:", error)
    return NextResponse.json({ error: "Erro ao remover favorito" }, { status: 500 })
  }
}