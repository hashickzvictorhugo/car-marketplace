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

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get("listingId")
    const status = searchParams.get("status")

    const where: any = { userId: user.id }
    if (listingId) where.listingId = listingId
    if (status) where.status = status

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        listing: {
          include: {
            images: { where: { isCover: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return NextResponse.json({ error: "Erro ao buscar contatos" }, { status: 500 })
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

    const { listingId, message, phone, email } = await request.json()

    if (!listingId || !message || !email) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } })
    if (!listing) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 })
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        userId: user.id,
        listingId,
        message,
        phone,
        email,
        status: "NEW",
      },
    })

    await prisma.listing.update({
      where: { id: listingId },
      data: { inquiriesCount: { increment: 1 } },
    })

    // TODO: Send notification to seller (email/push)

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    console.error("Error creating inquiry:", error)
    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { inquiryId, status, reply } = await request.json()

    const inquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status, reply, updatedAt: new Date() },
    })

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error("Error updating inquiry:", error)
    return NextResponse.json({ error: "Erro ao atualizar contato" }, { status: 500 })
  }
}