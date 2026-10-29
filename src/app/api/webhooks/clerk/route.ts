import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { Webhook } from "svix"
import { prisma } from "@/lib/prisma"

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET não configurado")
    return NextResponse.json({ error: "Webhook não configurado" }, { status: 500 })
  }

  const payload = await request.json()
  const headerPayload = headers()
  const svixId = headerPayload.get("svix-id")
  const svixTimestamp = headerPayload.get("svix-timestamp")
  const svixSignature = headerPayload.get("svix-signature")

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Headers inválidos" }, { status: 400 })
  }

  const wh = new Webhook(webhookSecret)
  let evt: any

  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    })
  } catch (err) {
    console.error("Erro ao verificar webhook:", err)
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 })
  }

  const { type, data } = evt

  try {
    switch (type) {
      case "user.created": {
        await prisma.user.create({
          data: {
            clerkId: data.id,
            email: data.email_addresses[0]?.email_address,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || null,
            phone: data.phone_numbers[0]?.phone_number || null,
            avatar: data.image_url,
            role: "BUYER",
          },
        })
        break
      }
      case "user.updated": {
        await prisma.user.update({
          where: { clerkId: data.id },
          data: {
            email: data.email_addresses[0]?.email_address,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || null,
            phone: data.phone_numbers[0]?.phone_number || null,
            avatar: data.image_url,
          },
        })
        break
      }
      case "user.deleted": {
        await prisma.user.delete({ where: { clerkId: data.id } })
        break
      }
    }
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Erro ao processar webhook:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}