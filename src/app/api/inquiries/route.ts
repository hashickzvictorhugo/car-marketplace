import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

async function getUser() {
  const { userId } = await auth()
  if (!userId) return null
  return prisma.user.findUnique({ where: { clerkId: userId } })
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
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
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
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
    const user = await getUser()
    if (!user) {
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