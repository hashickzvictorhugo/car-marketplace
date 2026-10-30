import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { put, del } from "@vercel/blob"

async function getUserId() {
  const { userId } = await auth()
  return userId
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: `Arquivo ${file.name} excede 10MB` }, { status: 400 })
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `Tipo de arquivo não suportado: ${file.type}` }, { status: 400 })
      }

      const filename = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
      const blob = await put(filename, file, { access: "public", addRandomSuffix: true })
      uploadedUrls.push(blob.url)
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error("Error uploading files:", error)
    return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 })
    }

    // Verify the URL belongs to this user (basic check)
    if (!url.includes(`${userId}/`)) {
      return NextResponse.json({ error: "Não autorizado a excluir este arquivo" }, { status: 403 })
    }

    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Erro ao excluir arquivo" }, { status: 500 })
  }
}