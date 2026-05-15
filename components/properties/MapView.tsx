'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import Script from 'next/script'
import Image from 'next/image'
import { MapPin, BedDouble, Bath, Maximize, X } from 'lucide-react'
import { Property } from '@/types'
import { formatPrice, cn } from '@/lib/utils'
import Link from 'next/link'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDnIoG0enyntSAu8pL_FolU8_zSbyLPzC4'

// Custom marker SVG
function createMarkerIcon(price: string, isHighlighted: boolean, listingFor: string): google.maps.Symbol {
  return {} as google.maps.Symbol // placeholder — we use overlay below
}

interface MapViewProps {
  properties: Property[]
  highlightedId?: string | null
  onMarkerClick?: (id: string) => void
  center?: { lat: number; lng: number }
}

declare global {
  interface Window {
    google: typeof google
    initPlotixMap: () => void
  }
}

export default function MapView({
  properties,
  highlightedId,
  onMarkerClick,
  center,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map())
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  const [mapsLoaded, setMapsLoaded] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  // Calculate map center from properties
  const mapCenter = center || (properties.length > 0
    ? {
        lat: properties.reduce((sum, p) => sum + p.latitude, 0) / properties.length,
        lng: properties.reduce((sum, p) => sum + p.longitude, 0) / properties.length,
      }
    : { lat: 21.1702, lng: 72.8311 } // Default: Surat
  )

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: properties.length === 1 ? 15 : 11,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      gestureHandling: 'cooperative',
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#f5f5f0' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f0' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#555555' }] },
        { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#333333' }] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#777777' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e8d4' }] },
        { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e8e8e8' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f8c967' }] },
        { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e9bc62' }] },
        { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#f2f2f2' }] },
        { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#999999' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e4f0' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
        { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#c9e4f0' }] },
        { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
      ],
    })

    mapInstanceRef.current = map

    // Create info window
    infoWindowRef.current = new window.google.maps.InfoWindow({
      maxWidth: 300,
    })

    // Add markers
    properties.forEach((property) => {
      addMarker(property, map)
    })

    // Fit bounds if multiple properties
    if (properties.length > 1) {
      const bounds = new window.google.maps.LatLngBounds()
      properties.forEach((p) => bounds.extend({ lat: p.latitude, lng: p.longitude }))
      map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 })
    }
  }, [properties, mapCenter])

  const addMarker = useCallback((property: Property, map: google.maps.Map) => {
    const priceLabel = formatPrice(property.price, property.listingFor)
    const isRent = property.listingFor === 'rent'

    // Price label marker
    const marker = new window.google.maps.Marker({
      position: { lat: property.latitude, lng: property.longitude },
      map,
      title: property.title,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 0,
        fillColor: 'transparent',
        fillOpacity: 0,
        strokeWeight: 0,
      },
      label: {
        text: ' ',
        color: 'transparent',
      },
      zIndex: 1,
    })

    // Custom HTML overlay using OverlayView
    const overlay = new window.google.maps.OverlayView()
    overlay.onAdd = function () {
      const div = document.createElement('div')
      div.className = 'map-price-marker'
      div.dataset.propertyId = property.id
      div.innerHTML = `
        <div class="marker-bubble ${isRent ? 'marker-rent' : 'marker-sale'}">
          <span class="marker-price">${priceLabel}</span>
        </div>
        <div class="marker-arrow ${isRent ? 'marker-arrow-rent' : 'marker-arrow-sale'}"></div>
      `
      div.style.cssText = `
        position: absolute;
        cursor: pointer;
        transform: translate(-50%, -100%);
        transition: transform 0.2s ease, z-index 0s;
        z-index: 1;
      `

      div.addEventListener('click', () => {
        setSelectedProperty(property)
        onMarkerClick?.(property.id)

        // Animate marker
        div.style.transform = 'translate(-50%, -100%) scale(1.15)'
        setTimeout(() => {
          div.style.transform = 'translate(-50%, -100%) scale(1.0)'
        }, 200)

        // Pan map to property
        map.panTo({ lat: property.latitude, lng: property.longitude })
      })

      div.addEventListener('mouseenter', () => {
        div.style.zIndex = '10'
        div.style.transform = 'translate(-50%, -100%) scale(1.05)'
      })
      div.addEventListener('mouseleave', () => {
        div.style.zIndex = '1'
        div.style.transform = 'translate(-50%, -100%) scale(1.0)'
      })

      const panes = this.getPanes()
      panes?.overlayMouseTarget.appendChild(div)
      ;(this as any)._div = div
    }

    overlay.draw = function () {
      const proj = this.getProjection()
      if (!proj) return
      const pos = proj.fromLatLngToDivPixel(
        new window.google.maps.LatLng(property.latitude, property.longitude)
      )
      if (pos) {
        const div = (this as any)._div as HTMLElement
        div.style.left = pos.x + 'px'
        div.style.top = pos.y + 'px'
      }
    }

    overlay.onRemove = function () {
      const div = (this as any)._div
      if (div?.parentNode) div.parentNode.removeChild(div)
    }

    overlay.setMap(map)
    ;(marker as any)._overlay = overlay
    markersRef.current.set(property.id, marker)
  }, [onMarkerClick])

  // Initialize map when script loads
  const handleScriptLoad = useCallback(() => {
    setMapsLoaded(true)
  }, [])

  useEffect(() => {
    if (mapsLoaded && window.google) {
      initMap()
    }
  }, [mapsLoaded, initMap])

  // Highlight markers when hoveredId changes
  useEffect(() => {
    if (!mapInstanceRef.current) return
    document.querySelectorAll('.map-price-marker').forEach((el) => {
      const div = el as HTMLElement
      const id = div.dataset.propertyId
      const bubble = div.querySelector('.marker-bubble') as HTMLElement
      if (!bubble) return
      if (id === highlightedId) {
        div.style.zIndex = '100'
        div.style.transform = 'translate(-50%, -100%) scale(1.15)'
        bubble.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)'
        bubble.style.border = '2px solid #C9A07A'
      } else {
        div.style.zIndex = '1'
        div.style.transform = 'translate(-50%, -100%) scale(1.0)'
        bubble.style.boxShadow = ''
        bubble.style.border = ''
      }
    })
  }, [highlightedId])

  return (
    <>
      {/* Google Maps Script */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=drawing,geometry`}
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />

      {/* Marker Styles */}
      <style jsx global>{`
        .map-price-marker { pointer-events: auto !important; }
        .marker-bubble {
          padding: 6px 12px;
          border-radius: 20px;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
          border: 1.5px solid transparent;
          transition: all 0.2s ease;
        }
        .marker-sale {
          background: #1a2b4a;
          color: white;
        }
        .marker-rent {
          background: white;
          color: #1a2b4a;
          border-color: #e8e3dc;
        }
        .marker-arrow {
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          margin: 0 auto;
        }
        .marker-arrow-sale {
          border-top: 6px solid #1a2b4a;
        }
        .marker-arrow-rent {
          border-top: 6px solid #e8e3dc;
        }
      `}</style>

      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-card border border-stone-200">
        {/* Map Container */}
        <div ref={mapRef} className="w-full h-full" />

        {/* Loading overlay */}
        {!mapsLoaded && (
          <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-body text-stone-500">Loading map…</p>
            </div>
          </div>
        )}

        {/* Property count badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-xl px-3 py-2 shadow-sm z-10">
          <span className="text-xs font-body font-semibold text-stone-700">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'}
          </span>
        </div>

        {/* Selected Property Popup Card */}
        {selectedProperty && (
          <div className="absolute bottom-4 left-4 right-4 z-20 animate-slide-in">
            <div className="bg-white rounded-2xl shadow-map-popup border border-stone-100 overflow-hidden">
              <div className="flex gap-0">
                {/* Image */}
                <div className="relative w-28 flex-shrink-0">
                  <Image
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                  <span className={cn(
                    'absolute top-2 left-2 badge text-[10px] shadow-sm',
                    selectedProperty.listingFor === 'rent' ? 'badge-rent' : 'badge-sale'
                  )}>
                    {selectedProperty.listingFor === 'rent' ? 'Rent' : 'Sale'}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 p-3 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-display text-base font-semibold text-stone-900 leading-tight line-clamp-1">
                      {formatPrice(selectedProperty.price, selectedProperty.listingFor)}
                    </div>
                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0"
                    >
                      <X className="w-3 h-3 text-stone-500" />
                    </button>
                  </div>

                  <p className="text-xs font-body text-stone-600 line-clamp-1 mb-1.5">
                    {selectedProperty.title}
                  </p>

                  <div className="flex items-center gap-1 text-stone-400 text-[10px] font-body mb-2">
                    <MapPin className="w-2.5 h-2.5" />
                    {selectedProperty.locality}, {selectedProperty.city}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedProperty.bedrooms > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-stone-500 font-body">
                          <BedDouble className="w-3 h-3" /> {selectedProperty.bedrooms}
                        </span>
                      )}
                      {selectedProperty.bathrooms > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-stone-500 font-body">
                          <Bath className="w-3 h-3" /> {selectedProperty.bathrooms}
                        </span>
                      )}
                      <span className="flex items-center gap-0.5 text-[10px] text-stone-500 font-body">
                        <Maximize className="w-3 h-3" /> {selectedProperty.area.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Link
                      href={`/properties/${selectedProperty.slug}`}
                      className="text-[10px] font-body font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
