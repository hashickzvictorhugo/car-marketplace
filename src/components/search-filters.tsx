"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { X, Filter, SlidersHorizontal, ChevronDown, ChevronUp, MapPin, Calendar, DollarSign, Gauge, Zap, Settings, LayoutGrid, List, Shield } from "lucide-react"
import { cn, formatPrice, formatNumber, FUEL_TYPES, TRANSMISSION_TYPES, BODY_TYPES, STATES_BR } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { SearchFilters } from "@/lib/types"

const BRANDS = [
  { id: "1", name: "Chevrolet" },
  { id: "2", name: "Volkswagen" },
  { id: "3", name: "Fiat" },
  { id: "4", name: "Hyundai" },
  { id: "5", name: "Toyota" },
  { id: "6", name: "Ford" },
  { id: "7", name: "Honda" },
  { id: "8", name: "Renault" },
  { id: "9", name: "Nissan" },
  { id: "10", name: "Jeep" },
  { id: "11", name: "Caoa Chery" },
  { id: "12", name: "Peugeot" },
  { id: "13", name: "Citroën" },
  { id: "14", name: "Mitsubishi" },
  { id: "15", name: "Kia" },
]

const COLORS = [
  "Branco", "Preto", "Prata", "Cinza", "Vermelho", "Azul", "Verde", "Amarelo", "Laranja", "Marrom", "Bege", "Dourado", "Rosa", "Roxo"
]

interface SearchFiltersProps {
  initialFilters?: SearchFilters
  brands?: { id: string; name: string }[]
  models?: { id: string; name: string }[]
  onSearch?: (filters: SearchFilters) => void
  className?: string
}

export function SearchFiltersComponent({
  initialFilters = {},
  brands = BRANDS,
  models = [],
  onSearch,
  className,
}: SearchFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") || initialFilters.query || "",
    brandId: searchParams.get("brand") || initialFilters.brandId || "",
    modelId: searchParams.get("model") || initialFilters.modelId || "",
    minPrice: searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : initialFilters.minPrice,
    maxPrice: searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : initialFilters.maxPrice,
    minYear: searchParams.get("minYear") ? parseInt(searchParams.get("minYear")!) : initialFilters.minYear,
    maxYear: searchParams.get("maxYear") ? parseInt(searchParams.get("maxYear")!) : initialFilters.maxYear,
    maxMileage: searchParams.get("maxMileage") ? parseInt(searchParams.get("maxMileage")!) : initialFilters.maxMileage,
    fuelType: searchParams.getAll("fuelType").length > 0 ? searchParams.getAll("fuelType") : initialFilters.fuelType || [],
    transmission: searchParams.getAll("transmission").length > 0 ? searchParams.getAll("transmission") : initialFilters.transmission || [],
    bodyType: searchParams.getAll("bodyType").length > 0 ? searchParams.getAll("bodyType") : initialFilters.bodyType || [],
    colors: searchParams.getAll("color").length > 0 ? searchParams.getAll("color") : initialFilters.colors || [],
    state: searchParams.get("state") || initialFilters.state || "",
    city: searchParams.get("city") || initialFilters.city || "",
    featured: searchParams.get("featured") === "true" || initialFilters.featured || false,
    sortBy: (searchParams.get("sort") as SearchFilters["sortBy"]) || initialFilters.sortBy || "newest",
    page: 1,
    limit: 12,
  })

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    advanced: false,
    location: false,
    features: false,
  })

  const [priceRange, setPriceRange] = useState<[number, number]>([filters.minPrice || 0, filters.maxPrice || 500000])
  const [yearRange, setYearRange] = useState<[number, number]>([filters.minYear || 2010, filters.maxYear || new Date().getFullYear()])
  const [mileageValue, setMileageValue] = useState<number[]>([filters.maxMileage || 200000])

  const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === "page" || key === "limit" || key === "sortBy") return count
    if (Array.isArray(value)) return count + value.length
    if (value !== undefined && value !== "" && value !== false && value !== 0) return count + 1
    return count
  }, 0)

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (key === "page" || key === "limit") return
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else if (value !== undefined && value !== "" && value !== false && value !== 0) {
        params.set(key, String(value))
      }
    })

    router.push(`${pathname}?${params.toString()}`)
    onSearch?.(filters)
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      brandId: "",
      modelId: "",
      minPrice: undefined,
      maxPrice: undefined,
      minYear: undefined,
      maxYear: undefined,
      maxMileage: undefined,
      fuelType: [],
      transmission: [],
      bodyType: [],
      colors: [],
      state: "",
      city: "",
      featured: false,
      sortBy: "newest",
      page: 1,
      limit: 12,
    })
    setPriceRange([0, 500000])
    setYearRange([2010, new Date().getFullYear()])
    setMileageValue([200000])
    router.push(pathname)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const renderMultiSelect = ({
    label,
    name,
    options,
    selected,
    onChange,
    icon,
  }: {
    label: string
    name: string
    options: { value: string; label: string }[]
    selected: string[]
    onChange: (value: string[]) => void
    icon?: React.ReactNode
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center space-x-2">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
        {selected.length > 0 && (
          <Badge variant="secondary" className="ml-auto">{selected.length}</Badge>
        )}
      </Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={selected.includes(option.value)}
              onCheckedChange={(checked) => {
                const newSelected = checked
                  ? [...selected, option.value]
                  : selected.filter((v) => v !== option.value)
                onChange(newSelected)
              }}
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center space-x-2 text-lg font-semibold">
          <Filter className="h-5 w-5" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-2">{activeFiltersCount}</Badge>
          )}
        </h2>
        {activeFiltersCount > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <Separator />

      <Collapsible open={expandedSections.basic} onOpenChange={() => toggleSection("basic")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left font-medium hover:text-primary transition-colors">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filtros Principais</span>
          </div>
          {expandedSections.basic ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2 animate-slide-down">
          <div>
            <Label htmlFor="query">Busca</Label>
            <Input
              id="query"
              placeholder="Modelo, versão, cor..."
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Marca</Label>
              <Select value={filters.brandId} onValueChange={(value) => updateFilters({ brandId: value, modelId: "" })}>
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as marcas</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="model">Modelo</Label>
              <Select value={filters.modelId} onValueChange={(value) => updateFilters({ modelId: value })} disabled={!filters.brandId}>
                <SelectTrigger id="model">
                  <SelectValue placeholder={filters.brandId ? "Todos os modelos" : "Selecione uma marca primeiro"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os modelos</SelectItem>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minPrice">Preço Mínimo</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="Mín"
                value={filters.minPrice || ""}
                onChange={(e) => updateFilters({ minPrice: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Preço Máximo</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="Máx"
                value={filters.maxPrice || ""}
                onChange={(e) => updateFilters({ maxPrice: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label className="flex items-center justify-between">
              <span>Faixa de Preço</span>
              <span className="text-sm font-medium text-primary">{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
            </Label>
            <Slider
              max={500000}
              step={5000}
              value={priceRange}
              onValueChange={([min, max]) => {
                setPriceRange([min, max])
                updateFilters({ minPrice: min > 0 ? min : undefined, maxPrice: max < 500000 ? max : undefined })
              }}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={expandedSections.advanced} onOpenChange={() => toggleSection("advanced")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left font-medium hover:text-primary transition-colors">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Especificações</span>
          </div>
          {expandedSections.advanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2 animate-slide-down">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minYear">Ano Mínimo</Label>
              <Input
                id="minYear"
                type="number"
                placeholder="Mín"
                value={filters.minYear || ""}
                onChange={(e) => updateFilters({ minYear: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="maxYear">Ano Máximo</Label>
              <Input
                id="maxYear"
                type="number"
                placeholder="Máx"
                value={filters.maxYear || ""}
                onChange={(e) => updateFilters({ maxYear: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label className="flex items-center justify-between">
              <span>Ano</span>
              <span className="text-sm font-medium text-primary">{yearRange[0]} - {yearRange[1]}</span>
            </Label>
            <Slider
              max={new Date().getFullYear()}
              min={2010}
              step={1}
              value={yearRange}
              onValueChange={([min, max]) => {
                setYearRange([min, max])
                updateFilters({ minYear: min > 2010 ? min : undefined, maxYear: max < new Date().getFullYear() ? max : undefined })
              }}
            />
          </div>

          <div>
            <Label htmlFor="maxMileage">Quilometragem Máxima</Label>
            <Input
              id="maxMileage"
              type="number"
              placeholder="Ex: 100000"
              value={filters.maxMileage || ""}
              onChange={(e) => updateFilters({ maxMileage: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full"
            />
          </div>

          <div>
            <Label className="flex items-center justify-between">
              <span>Até {formatNumber(mileageValue[0])} km</span>
            </Label>
            <Slider
              max={300000}
              step={10000}
              value={mileageValue}
              onValueChange={([val]) => {
                setMileageValue([val])
                updateFilters({ maxMileage: val < 300000 ? val : undefined })
              }}
            />
          </div>

          {renderMultiSelect({
            label: "Combustível",
            name: "fuelType",
            options: Object.entries(FUEL_TYPES).map(([key, value]) => ({ value: key, label: `${value.icon} ${value.label}` })),
            selected: filters.fuelType,
            onChange: (value) => updateFilters({ fuelType: value }),
            icon: <Zap className="h-4 w-4" />,
          })}

          {renderMultiSelect({
            label: "Transmissão",
            name: "transmission",
            options: Object.entries(TRANSMISSION_TYPES).map(([key, value]) => ({ value: key, label: `${value.icon} ${value.label}` })),
            selected: filters.transmission,
            onChange: (value) => updateFilters({ transmission: value }),
            icon: <Settings className="h-4 w-4" />,
          })}

          {renderMultiSelect({
            label: "Carroceria",
            name: "bodyType",
            options: Object.entries(BODY_TYPES).map(([key, value]) => ({ value: key, label: `${value.icon} ${value.label}` })),
            selected: filters.bodyType || [],
            onChange: (value) => updateFilters({ bodyType: value }),
            icon: <LayoutGrid className="h-4 w-4" />,
          })}

          {renderMultiSelect({
            label: "Cor",
            name: "color",
            options: COLORS.map((c) => ({ value: c, label: c })),
            selected: filters.colors || [],
            onChange: (value) => updateFilters({ colors: value }),
            icon: <List className="h-4 w-4" />,
          })}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={expandedSections.location} onOpenChange={() => toggleSection("location")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left font-medium hover:text-primary transition-colors">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Localização</span>
          </div>
          {expandedSections.location ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2 animate-slide-down">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">Estado</Label>
              <Select value={filters.state} onValueChange={(value) => updateFilters({ state: value, city: "" })}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Todos os estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os estados</SelectItem>
                  {STATES_BR.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="Digite a cidade"
                value={filters.city}
                onChange={(e) => updateFilters({ city: e.target.value })}
                disabled={!filters.state}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={expandedSections.features} onOpenChange={() => toggleSection("features")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left font-medium hover:text-primary transition-colors">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Recursos Extras</span>
          </div>
          {expandedSections.features ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2 animate-slide-down">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={filters.featured}
              onCheckedChange={(checked: boolean) => updateFilters({ featured: checked })}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Apenas veículos em destaque
            </Label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex items-center justify-between pt-4 border-t">
        <Label htmlFor="sortBy">Ordenar por</Label>
        <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value as SearchFilters["sortBy"] })}>
          <SelectTrigger id="sortBy" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais Recentes</SelectItem>
            <SelectItem value="oldest">Mais Antigos</SelectItem>
            <SelectItem value="price_asc">Menor Preço</SelectItem>
            <SelectItem value="price_desc">Maior Preço</SelectItem>
            <SelectItem value="year_desc">Ano Decrescente</SelectItem>
            <SelectItem value="year_asc">Ano Crescente</SelectItem>
            <SelectItem value="mileage_asc">Menor Km</SelectItem>
            <SelectItem value="mileage_desc">Maior Km</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1" size="lg">
          <Filter className="h-4 w-4 mr-2" />
          Aplicar Filtros
        </Button>
        {activeFiltersCount > 0 && (
          <Button type="button" variant="outline" onClick={clearFilters} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>
    </form>
  )
}