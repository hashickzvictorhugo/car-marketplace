import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { SearchFilters } from "@/lib/types"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50)
    const skip = (page - 1) * limit

    const filters: SearchFilters = {
      query: searchParams.get("q") || undefined,
      brandId: searchParams.get("brand") || undefined,
      modelId: searchParams.get("model") || undefined,
      minPrice: searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : undefined,
      minYear: searchParams.get("minYear") ? parseInt(searchParams.get("minYear")!) : undefined,
      maxYear: searchParams.get("maxYear") ? parseInt(searchParams.get("maxYear")!) : undefined,
      maxMileage: searchParams.get("maxMileage") ? parseInt(searchParams.get("maxMileage")!) : undefined,
      fuelType: searchParams.getAll("fuelType"),
      transmission: searchParams.getAll("transmission"),
      bodyType: searchParams.getAll("bodyType"),
      colors: searchParams.getAll("color"),
      state: searchParams.get("state") || undefined,
      city: searchParams.get("city") || undefined,
      featured: searchParams.get("featured") === "true",
      sortBy: (searchParams.get("sort") as SearchFilters["sortBy"]) || "newest",
      page,
      limit,
    }

    const where: any = { status: "ACTIVE" }

    if (filters.query) {
      where.OR = [
        { title: { contains: filters.query, mode: "insensitive" } },
        { description: { contains: filters.query, mode: "insensitive" } },
        { brand: { name: { contains: filters.query, mode: "insensitive" } } },
        { model: { name: { contains: filters.query, mode: "insensitive" } } },
      ]
    }

    if (filters.brandId) where.brandId = filters.brandId
    if (filters.modelId) where.modelId = filters.modelId
    if (filters.minPrice || filters.maxPrice) {
      where.price = {}
      if (filters.minPrice) where.price.gte = filters.minPrice
      if (filters.maxPrice) where.price.lte = filters.maxPrice
    }
    if (filters.minYear || filters.maxYear) {
      where.year = {}
      if (filters.minYear) where.year.gte = filters.minYear
      if (filters.maxYear) where.year.lte = filters.maxYear
    }
    if (filters.maxMileage) where.mileage = { lte: filters.maxMileage }
    if (filters.fuelType.length > 0) where.fuelType = { in: filters.fuelType }
    if (filters.transmission.length > 0) where.transmission = { in: filters.transmission }
    if (filters.bodyType.length > 0) where.bodyType = { in: filters.bodyType }
    if (filters.colors.length > 0) where.color = { in: filters.colors }
    if (filters.state) where.state = filters.state
    if (filters.city) where.city = { contains: filters.city, mode: "insensitive" }
    if (filters.featured) where.featured = true

    let orderBy: any = { createdAt: "desc" }
    switch (filters.sortBy) {
      case "price_asc": orderBy = { price: "asc" }; break
      case "price_desc": orderBy = { price: "desc" }; break
      case "year_desc": orderBy = { year: "desc" }; break
      case "year_asc": orderBy = { year: "asc" }; break
      case "mileage_asc": orderBy = { mileage: "asc" }; break
      case "mileage_desc": orderBy = { mileage: "desc" }; break
      case "oldest": orderBy = { createdAt: "asc" }; break
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          brand: true,
          model: true,
          seller: { select: { id: true, name: true, avatar: true, phone: true, isVerified: true, createdAt: true } },
          images: { where: { isCover: true }, take: 1 },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      data: listings,
      meta: { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    })
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json({ error: "Erro ao buscar veículos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const listing = await prisma.listing.create({
      data: {
        ...body,
        sellerId: user.id,
        status: "PENDING_REVIEW",
      },
    })

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error("Error creating listing:", error)
    return NextResponse.json({ error: "Erro ao criar anúncio" }, { status: 500 })
  }
}