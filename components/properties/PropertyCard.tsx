"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, BedDouble, Bath, Maximize, MapPin, Eye, Car, Shield, Star } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { Badge, Avatar } from "@/components/ui"
import type { Property } from "@/types"

interface PropertyCardProps {
  property: Property
  viewMode?: "grid" | "list"
  highlighted?: boolean
  onHover?: (id: string | null) => void
  onFavorite?: (id: string, state: boolean) => void
  isFavorited?: boolean
}

export default function PropertyCard({ property, viewMode = "grid", highlighted, onHover, onFavorite, isFavorited: initFav = false }: PropertyCardProps) {
  const [favorited, setFavorited] = useState(initFav)
  const [imgErr, setImgErr]       = useState(false)

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const next = !favorited
    setFavorited(next)
    onFavorite?.(property.id, next)
  }

  const typeBadge: Record<string, string> = {
    RESIDENTIAL: "badge-violet", COMMERCIAL: "badge-amber",
    INDUSTRIAL: "badge-stone", AGRICULTURAL: "badge-green", MIXED: "badge-blue",
  }

  const price = formatPrice(property.price, property.listingFor)
  const img   = imgErr ? "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop" : (property.images?.[0] || "")

  if (viewMode === "list") {
    return (
      <div className={cn("card flex overflow-hidden group cursor-pointer", highlighted && "ring-2 ring-amber-400 shadow-lg")}
        onMouseEnter={() => onHover?.(property.id)} onMouseLeave={() => onHover?.(null)}>
        {/* Image */}
        <div className="relative w-52 lg:w-64 flex-shrink-0 bg-stone-100">
          {img && <Image src={img} alt={property.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" onError={() => setImgErr(true)} sizes="256px" />}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className={cn("badge", property.listingFor === "RENT" ? "badge-rent" : "badge-sale")}>
              For {property.listingFor === "RENT" ? "Rent" : "Sale"}
            </span>
            {property.featured && <span className="badge badge-gold">⭐ Featured</span>}
          </div>
          <button onClick={handleFav} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform">
            <Heart className={cn("w-4 h-4 transition-colors", favorited ? "fill-rose-500 text-rose-500" : "text-stone-500")} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <span className={cn("badge mb-2", typeBadge[property.type] || "badge-stone")}>{property.type}</span>
                <Link href={`/properties/${property.slug}`}>
                  <h3 className="font-display text-lg font-medium text-stone-900 truncate hover:text-amber-700 transition-colors">{property.title}</h3>
                </Link>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="font-display text-xl font-semibold text-stone-900">{price}</div>
                {property.pricePerSqFt && property.listingFor === "SALE" && (
                  <div className="text-xs text-stone-400 font-body">₹{property.pricePerSqFt.toLocaleString("en-IN")}/sq.ft</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500 text-xs font-body mb-3">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{property.locality}, {property.city}</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {property.bedrooms > 0 && <span className="flex items-center gap-1.5 text-sm text-stone-600 font-body"><BedDouble className="w-4 h-4 text-stone-400" />{property.bedrooms} Beds</span>}
              {property.bathrooms > 0 && <span className="flex items-center gap-1.5 text-sm text-stone-600 font-body"><Bath className="w-4 h-4 text-stone-400" />{property.bathrooms} Baths</span>}
              <span className="flex items-center gap-1.5 text-sm text-stone-600 font-body"><Maximize className="w-4 h-4 text-stone-400" />{property.area.toLocaleString("en-IN")} sq.ft</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <Avatar src={property.agentAvatar} name={property.agentName} size="sm" />
              <div>
                <div className="text-xs font-body font-semibold text-stone-700">{property.agentName}</div>
                {property.agentVerified && <div className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-body"><Shield className="w-2.5 h-2.5" />Verified</div>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-stone-400 font-body"><Eye className="w-3.5 h-3.5" />{property.views.toLocaleString()}</span>
              <Link href={`/properties/${property.slug}`} className="btn-primary text-xs px-4 py-2">View</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("card flex flex-col h-full group cursor-pointer", highlighted && "ring-2 ring-amber-400 shadow-xl")}
      onMouseEnter={() => onHover?.(property.id)} onMouseLeave={() => onHover?.(null)}>
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        {img && <Image src={img} alt={property.title} fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={() => setImgErr(true)} sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={cn("badge shadow-sm", property.listingFor === "RENT" ? "badge-rent" : "badge-sale")}>
            For {property.listingFor === "RENT" ? "Rent" : "Sale"}
          </span>
          {property.featured && <span className="badge badge-gold shadow-sm">⭐ Featured</span>}
          {property.status === "SOLD" && <span className="badge badge-rose shadow-sm">Sold</span>}
        </div>
        <button onClick={handleFav}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform">
          <Heart className={cn("w-4 h-4 transition-all", favorited ? "fill-rose-500 text-rose-500" : "text-stone-500")} />
        </button>
        {property.images?.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full font-body">
            +{property.images.length - 1}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={cn("badge text-xs", typeBadge[property.type] || "badge-stone")}>
            {property.type.charAt(0) + property.type.slice(1).toLowerCase()}
          </span>
          <div className="text-right flex-shrink-0">
            <div className="font-display text-lg font-semibold text-stone-900 leading-none">{price}</div>
            {property.pricePerSqFt && property.listingFor === "SALE" && (
              <div className="text-[10px] text-stone-400 font-body mt-0.5">₹{property.pricePerSqFt.toLocaleString("en-IN")}/sq.ft</div>
            )}
          </div>
        </div>

        <Link href={`/properties/${property.slug}`} className="group/t block mb-1.5">
          <h3 className="font-display text-base font-medium text-stone-900 leading-snug line-clamp-2 group-hover/t:text-amber-700 transition-colors">
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-stone-500 text-xs font-body mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{property.locality}, {property.city}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 flex-wrap pb-3 mb-3 border-b border-stone-100">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1 text-xs text-stone-600 font-body">
              <BedDouble className="w-3.5 h-3.5 text-stone-400" />{property.bedrooms}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1 text-xs text-stone-600 font-body">
              <Bath className="w-3.5 h-3.5 text-stone-400" />{property.bathrooms}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-stone-600 font-body">
            <Maximize className="w-3.5 h-3.5 text-stone-400" />{property.area.toLocaleString("en-IN")} sq.ft
          </span>
          {property.parking > 0 && (
            <span className="flex items-center gap-1 text-xs text-stone-600 font-body">
              <Car className="w-3.5 h-3.5 text-stone-400" />{property.parking}P
            </span>
          )}
        </div>

        {/* Amenities */}
        {property.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {property.amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-[10px] font-body text-stone-500 bg-stone-50 border border-stone-100 rounded-full px-2 py-0.5">{a}</span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[10px] font-body text-stone-400 bg-stone-50 border border-stone-100 rounded-full px-2 py-0.5">+{property.amenities.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <Avatar src={property.agentAvatar} name={property.agentName} size="sm" />
            <div className="min-w-0">
              <div className="text-xs font-body font-semibold text-stone-700 truncate max-w-[90px]">{property.agentName}</div>
              {property.agentVerified && (
                <div className="flex items-center gap-0.5 text-[9px] text-emerald-600 font-body"><Shield className="w-2 h-2" />Verified</div>
              )}
            </div>
          </div>
          <Link href={`/properties/${property.slug}`}
            className="text-xs font-body font-semibold text-stone-900 hover:text-amber-700 transition-colors">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
}
