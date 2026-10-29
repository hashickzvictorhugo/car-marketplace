"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, Calendar, Gauge, Zap, Settings, Shield, CheckCircle } from "lucide-react"
import { cn, formatPrice, formatNumber, BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ListingWithRelations } from "@/lib/types"

interface CarCardProps {
  listing: ListingWithRelations
  variant?: "default" | "compact" | "featured"
  showSeller?: boolean
  onFavoriteToggle?: (listingId: string) => void
}

export function CarCard({ listing, variant = "default", showSeller = false, onFavoriteToggle }: CarCardProps) {
  const coverImage = listing.images.find((img) => img.isCover) || listing.images[0]
  const isFavorited = listing.isFavorited

  const specs = [
    { icon: Calendar, label: listing.year.toString(), value: listing.year },
    { icon: Gauge, label: `${formatNumber(listing.mileage)} km`, value: listing.mileage },
    { icon: Zap, label: FUEL_TYPES[listing.fuelType as keyof typeof FUEL_TYPES]?.label || listing.fuelType, value: listing.fuelType },
    { icon: Settings, label: TRANSMISSION_TYPES[listing.transmission as keyof typeof TRANSMISSION_TYPES]?.label || listing.transmission, value: listing.transmission },
  ]

  if (variant === "compact") {
    return (
      <Link href={`/veiculo/${listing.id}`} className="group flex gap-4 p-3 bg-card rounded-xl border hover:border-primary/50 transition-colors">
        <div className="relative h-24 w-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
          {coverImage ? (
            <Image
              src={coverImage.url}
              alt={coverImage.alt || `${listing.brand.name} ${listing.model.name}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="128px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {listing.featured && (
            <Badge className="absolute top-2 left-2" variant="default">Destaque</Badge>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavoriteToggle?.(listing.id) }}
                  className={cn(
                    "absolute top-2 right-2 p-1.5 rounded-full bg-background/90 backdrop-blur transition-all hover:bg-background",
                    isFavorited ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                  )}
                  aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  <Heart className={cn("h-4 w-4 transition-transform", isFavorited && "fill-current scale-110")} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end">
                {isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{listing.city}, {listing.state}</span>
            </div>
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {listing.brand.name} {listing.model.name} {listing.title.replace(`${listing.brand.name} ${listing.model.name}`, "").trim()}
            </h3>
            <p className="text-2xl font-bold text-primary mt-1">{formatPrice(listing.price)}</p>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {specs.slice(0, 3).map((spec) => (
              <span key={spec.label} className="inline-flex items-center space-x-1 text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">
                <spec.icon className="h-3 w-3" />
                <span>{spec.label}</span>
              </span>
            ))}
          </div>
        </div>
      </Link>
    )
  }

  if (variant === "featured") {
    return (
      <article className="group relative bg-card rounded-2xl border overflow-hidden transition-all hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage.url}
              alt={coverImage.alt || `${listing.brand.name} ${listing.model.name}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground bg-muted">
              <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <div className="flex items-center space-x-2">
              {listing.featured && (
                <Badge className="bg-yellow-500 text-yellow-500-foreground">Destaque</Badge>
              )}
              {listing.status === "ACTIVE" && (
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Disponível
                </Badge>
              )}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavoriteToggle?.(listing.id) }}
                    className={cn(
                      "p-2 rounded-full bg-background/90 backdrop-blur transition-all hover:bg-background",
                      isFavorited ? "text-red-500" : "text-white/80 hover:text-red-500"
                    )}
                    aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Heart className={cn("h-5 w-5 transition-transform", isFavorited && "fill-current scale-110")} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  {isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {specs.map((spec) => (
              <TooltipProvider key={spec.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-background/90 backdrop-blur rounded-full text-sm font-medium text-white shadow-lg">
                      <spec.icon className="h-4 w-4" />
                      <span>{spec.label}</span>
                    </TooltipTrigger>
                  </Tooltip>
                  <TooltipContent>
                    {spec.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">{listing.brand.name} {listing.model.name}</p>
              <h3 className="font-bold text-lg line-clamp-1">{listing.title}</h3>
            </div>
            <p className="text-2xl font-bold text-primary">{formatPrice(listing.price)}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{listing.city}, {listing.state}</span>
            </div>
            {showSeller && listing.seller && (
              <div className="flex items-center space-x-1">
                <Shield className={cn("h-4 w-4", listing.seller.isVerified ? "text-green-500" : "text-muted-foreground")} />
                <span>{listing.seller.name || "Vendedor"}</span>
              </div>
            )}
          </div>
        </div>
        <CardFooter className="p-5 pt-0 border-t">
          <Link href={`/veiculo/${listing.id}`} className="block">
            <Button className="w-full" size="lg">Ver Detalhes</Button>
          </Link>
        </CardFooter>
      </article>
    )
  }

  return (
    <article className="group bg-card rounded-xl border overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
      <Link href={`/veiculo/${listing.id}`} className="block relative aspect-[4/3] overflow-hidden" aria-label={`Ver detalhes do ${listing.title}`}>
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alt || `${listing.brand.name} ${listing.model.name}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground bg-muted">
            <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <div className="flex items-center space-x-2">
            {listing.featured && (
              <Badge className="bg-yellow-500 text-yellow-500-foreground">Destaque</Badge>
            )}
            {listing.status === "ACTIVE" && (
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Disponível
              </Badge>
            )}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavoriteToggle?.(listing.id) }}
                  className={cn(
                    "p-2 rounded-full bg-background/90 backdrop-blur transition-all hover:bg-background",
                    isFavorited ? "text-red-500" : "text-white/80 hover:text-red-500"
                  )}
                  aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  <Heart className={cn("h-5 w-5 transition-transform", isFavorited && "fill-current scale-110")} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end">
                {isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Link>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-1">{listing.brand.name} {listing.model.name}</p>
            <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
          </div>
          <p className="text-xl font-bold text-primary ml-4 flex-shrink-0">{formatPrice(listing.price)}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4" role="list" aria-label="Especificações do veículo">
          {specs.map((spec) => (
            <span key={spec.value} className="inline-flex items-center space-x-1 text-xs text-muted-foreground px-2 py-1 rounded bg-muted" role="listitem">
              <spec.icon className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              <span className="truncate max-w-[80px]">{spec.label}</span>
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-3 border-t">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{listing.city}, {listing.state}</span>
          </div>
          {showSeller && listing.seller && (
            <div className="flex items-center space-x-1">
              <Shield className={cn("h-4 w-4", listing.seller.isVerified ? "text-green-500" : "text-muted-foreground")} />
              <span className="truncate max-w-[100px]">{listing.seller.name || "Vendedor"}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/veiculo/${listing.id}`} className="block">
          <Button className="w-full" size="lg">Ver Detalhes</Button>
        </Link>
      </CardFooter>
    </article>
  )
}