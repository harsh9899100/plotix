'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  Heart, BedDouble, Bath, Maximize, MapPin, Eye, Star,
  Zap, Car, Shield
} from 'lucide-react'
import { Property } from '@/types'
import { formatPrice, cn } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
  viewMode?: 'grid' | 'list'
  highlighted?: boolean
  onHover?: (id: string | null) => void
}

export default function PropertyCard({
  property,
  viewMode = 'grid',
  highlighted = false,
  onHover,
}: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const badgeClass = {
    residential: 'badge-residential',
    commercial: 'badge-commercial',
    industrial: 'badge-industrial',
    agricultural: 'badge-agricultural',
    mixed: 'badge-mixed',
  }[property.type]

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'card flex gap-0 group overflow-hidden',
          highlighted && 'ring-2 ring-amber-400 shadow-lg'
        )}
        onMouseEnter={() => onHover?.(property.id)}
        onMouseLeave={() => onHover?.(null)}
      >
        {/* Image */}
        <div className="relative w-56 lg:w-64 flex-shrink-0 overflow-hidden bg-stone-100">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className={cn(
              'object-cover transition-all duration-500 group-hover:scale-105',
              imgLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImgLoaded(true)}
            sizes="(max-width: 768px) 224px, 256px"
          />
          {!imgLoaded && (
            <div className="absolute inset-0 bg-stone-200 animate-pulse" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className={cn('badge text-xs', property.listingFor === 'rent' ? 'badge-rent' : 'badge-sale')}>
              For {property.listingFor === 'rent' ? 'Rent' : 'Sale'}
            </span>
            {property.featured && (
              <span className="badge badge-featured text-xs">⭐ Featured</span>
            )}
          </div>

          {/* Favorite */}
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 shadow"
          >
            <Heart className={cn('w-4 h-4 transition-colors', isFavorited ? 'fill-rose-500 text-rose-500' : 'text-stone-500')} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <span className={cn('badge text-xs mb-2', badgeClass)}>{property.type}</span>
                <Link href={`/properties/${property.slug}`}>
                  <h3 className="font-display text-lg font-medium text-stone-900 leading-tight truncate hover:text-amber-700 transition-colors">
                    {property.title}
                  </h3>
                </Link>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="font-display text-xl font-semibold text-stone-900">
                  {formatPrice(property.price, property.listingFor)}
                </div>
                {property.listingFor === 'sale' && (
                  <div className="text-xs text-stone-400 font-body">
                    ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-stone-500 text-sm font-body mb-3">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{property.locality}, {property.city}</span>
            </div>

            {/* Specs */}
            <div className="flex items-center gap-4 flex-wrap">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-1.5 text-sm text-stone-600 font-body">
                  <BedDouble className="w-4 h-4 text-stone-400" />
                  {property.bedrooms} Beds
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-1.5 text-sm text-stone-600 font-body">
                  <Bath className="w-4 h-4 text-stone-400" />
                  {property.bathrooms} Baths
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-stone-600 font-body">
                <Maximize className="w-4 h-4 text-stone-400" />
                {property.area.toLocaleString('en-IN')} sq.ft
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-stone-200 relative flex-shrink-0">
                <Image src={property.agent.avatar} alt={property.agent.name} fill className="object-cover" />
              </div>
              <div>
                <div className="text-xs font-body font-semibold text-stone-700">{property.agent.name}</div>
                <div className="text-xs text-stone-400 font-body">{property.agent.agency}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-400 font-body">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {property.views.toLocaleString()}</span>
              <Link href={`/properties/${property.slug}`} className="btn-primary text-xs px-4 py-2 rounded-lg">
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view (default)
  return (
    <div
      className={cn(
        'card group flex flex-col h-full',
        highlighted && 'ring-2 ring-amber-400 shadow-xl'
      )}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className={cn(
            'object-cover transition-all duration-500 group-hover:scale-107',
            imgLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImgLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300 animate-pulse" />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={cn('badge text-xs shadow-sm', property.listingFor === 'rent' ? 'badge-rent' : 'badge-sale')}>
            For {property.listingFor === 'rent' ? 'Rent' : 'Sale'}
          </span>
          {property.featured && (
            <span className="badge badge-featured text-xs shadow-sm">⭐ Featured</span>
          )}
          {property.status === 'sold' && (
            <span className="badge badge-sold text-xs shadow-sm">Sold</span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => { e.preventDefault(); setIsFavorited(!isFavorited) }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 shadow-md"
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn('w-4 h-4 transition-all', isFavorited ? 'fill-rose-500 text-rose-500 scale-110' : 'text-stone-500')} />
        </button>

        {/* Image count */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-body">
            +{property.images.length - 1} photos
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Type badge + Price */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={cn('badge text-xs', badgeClass)}>
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </span>
          <div className="text-right flex-shrink-0">
            <div className="font-display text-lg font-semibold text-stone-900 leading-none">
              {formatPrice(property.price, property.listingFor)}
            </div>
            {property.listingFor === 'sale' && property.pricePerSqFt > 0 && (
              <div className="text-xs text-stone-400 font-body mt-0.5">
                ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <Link href={`/properties/${property.slug}`} className="block mb-2 group/title">
          <h3 className="font-display text-base font-medium text-stone-900 leading-snug line-clamp-2 group-hover/title:text-amber-700 transition-colors">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1 text-stone-500 text-xs font-body mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{property.locality}, {property.city}</span>
        </div>

        {/* Specs Row */}
        <div className="flex items-center gap-3 flex-wrap pb-3 mb-3 border-b border-stone-100">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1 text-xs text-stone-600 font-body">
              <BedDouble className="w-3.5 h-3.5 text-stone-400" />
              {property.bedrooms} Bed
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1 text-xs text-stone-600 font-body">
              <Bath className="w-3.5 h-3.5 text-stone-400" />
              {property.bathrooms} Bath
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-stone-600 font-body">
            <Maximize className="w-3.5 h-3.5 text-stone-400" />
            {property.area.toLocaleString('en-IN')} sq.ft
          </span>
          {property.parking > 0 && (
            <span className="flex items-center gap-1 text-xs text-stone-600 font-body">
              <Car className="w-3.5 h-3.5 text-stone-400" />
              {property.parking}P
            </span>
          )}
        </div>

        {/* Amenity pills */}
        {property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {property.amenities.slice(0, 3).map((a) => (
              <span key={a} className="px-2 py-0.5 bg-stone-50 border border-stone-100 rounded-full text-[10px] font-body text-stone-500">
                {a}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="px-2 py-0.5 bg-stone-50 border border-stone-100 rounded-full text-[10px] font-body text-stone-400">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-stone-200 relative flex-shrink-0">
              <Image src={property.agent.avatar} alt={property.agent.name} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-body font-semibold text-stone-700 truncate max-w-[100px]">{property.agent.name}</div>
              {property.agent.verified && (
                <div className="flex items-center gap-0.5 text-[10px] text-emerald-600">
                  <Shield className="w-2.5 h-2.5" /> Verified
                </div>
              )}
            </div>
          </div>

          <Link
            href={`/properties/${property.slug}`}
            className="text-xs font-body font-semibold text-stone-900 hover:text-amber-700 flex items-center gap-1 transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
}
