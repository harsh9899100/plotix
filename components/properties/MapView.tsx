"use client"
import { useEffect, useRef, useCallback, useState } from "react"
import Script from "next/script"
import { MapPin, BedDouble, Bath, Maximize, X } from "lucide-react"
import Link from "next/link"
import { formatPrice, cn } from "@/lib/utils"
import type { Property } from "@/types"

const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyDnIoG0enyntSAu8pL_FolU8_zSbyLPzC4"

interface MapViewProps {
  properties: Property[]
  highlightedId?: string | null
  onMarkerClick?: (id: string) => void
  center?: { lat: number; lng: number }
}

declare global {
  interface Window { google: any; _gmapsReady?: boolean }
}

export default function MapView({ properties, highlightedId, onMarkerClick, center }: MapViewProps) {
  const mapRef   = useRef<HTMLDivElement>(null)
  const mapInst  = useRef<any | null>(null)
  const overlays = useRef<Map<string, any>>(new Map())
  const [loaded, setLoaded]   = useState(false)
  const [selected, setSelected] = useState<Property | null>(null)

  const mapCenter = center || (properties.length > 0
    ? { lat: properties.reduce((s,p) => s + (p.latitude||0), 0) / properties.length,
        lng: properties.reduce((s,p) => s + (p.longitude||0), 0) / properties.length }
    : { lat: 21.1702, lng: 72.8311 })

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google) return
    const map = new window.google.maps.Map(mapRef.current, {
      center: mapCenter, zoom: properties.length === 1 ? 15 : 11,
      mapTypeControl: false, streetViewControl: false,
      gestureHandling: "cooperative", fullscreenControl: true,
      styles: [
        { elementType:"geometry", stylers:[{color:"#f5f5f0"}] },
        { elementType:"labels.text.fill", stylers:[{color:"#555"}] },
        { featureType:"road", elementType:"geometry", stylers:[{color:"#fff"}] },
        { featureType:"road.highway", elementType:"geometry", stylers:[{color:"#f8c967"}] },
        { featureType:"water", elementType:"geometry", stylers:[{color:"#c9e4f0"}] },
        { featureType:"poi.business", stylers:[{visibility:"off"}] },
        { featureType:"poi.park", elementType:"geometry", stylers:[{color:"#e5e8d4"}] },
      ],
    })
    mapInst.current = map

    properties.forEach(p => {
      if (!p.latitude || !p.longitude) return
      const marker = new window.google.maps.Marker({
        position: { lat: p.latitude, lng: p.longitude }, map,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 0, fillColor:"transparent", fillOpacity:0, strokeWeight:0 },
        zIndex: 1,
      })

      const overlay = new window.google.maps.OverlayView()
      overlay.onAdd = function () {
        const div = document.createElement("div")
        div.style.cssText = "position:absolute;cursor:pointer;transform:translate(-50%,-100%);z-index:1;transition:transform .2s ease"
        div.dataset.pid = p.id
        const price = formatPrice(p.price, p.listingFor)
        const isRent = p.listingFor === "RENT"
        div.innerHTML = `<div class="marker-bubble ${isRent?"marker-rent":"marker-sale"}">${price}</div><div class="marker-arrow ${isRent?"marker-arrow-rent":"marker-arrow-sale"}"></div>`
        div.addEventListener("click", () => { setSelected(p); onMarkerClick?.(p.id); map.panTo({ lat: p.latitude!, lng: p.longitude! }) })
        div.addEventListener("mouseenter", () => { div.style.transform = "translate(-50%,-100%) scale(1.08)"; div.style.zIndex = "10" })
        div.addEventListener("mouseleave", () => { div.style.transform = "translate(-50%,-100%) scale(1.0)"; div.style.zIndex = "1" })
        this.getPanes()?.overlayMouseTarget.appendChild(div)
        ;(this as any)._div = div
      }
      overlay.draw = function () {
        const proj = this.getProjection(); if (!proj) return
        const pos = proj.fromLatLngToDivPixel(new window.google.maps.LatLng(p.latitude!, p.longitude!))
        if (pos) { const d = (this as any)._div as HTMLElement; d.style.left = pos.x + "px"; d.style.top = pos.y + "px" }
      }
      overlay.onRemove = function () { const d = (this as any)._div; if (d?.parentNode) d.parentNode.removeChild(d) }
      overlay.setMap(map)
      overlays.current.set(p.id, { marker, overlay })
    })

    if (properties.length > 1) {
      const bounds = new window.google.maps.LatLngBounds()
      properties.forEach(p => p.latitude && p.longitude && bounds.extend({ lat: p.latitude, lng: p.longitude }))
      map.fitBounds(bounds, { top:60, right:60, bottom:60, left:60 })
    }
  }, [properties, mapCenter, onMarkerClick])

  useEffect(() => { if (loaded && window.google) initMap() }, [loaded, initMap])

  // Highlight effect
  useEffect(() => {
    document.querySelectorAll("[data-pid]").forEach(el => {
      const d = el as HTMLElement
      const bubble = d.querySelector(".marker-bubble") as HTMLElement
      if (!bubble) return
      if (d.dataset.pid === highlightedId) {
        d.style.zIndex = "100"; d.style.transform = "translate(-50%,-100%) scale(1.15)"
        bubble.style.boxShadow = "0 4px 20px rgba(0,0,0,.25)"; bubble.style.outline = "2px solid #C9A07A"
      } else {
        d.style.zIndex = "1"; d.style.transform = "translate(-50%,-100%) scale(1.0)"
        bubble.style.boxShadow = ""; bubble.style.outline = ""
      }
    })
  }, [highlightedId])

  return (
    <>
      <Script src={`https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&libraries=drawing,geometry`} onLoad={() => setLoaded(true)} strategy="afterInteractive"/>
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-card border border-stone-200">
        <div ref={mapRef} className="w-full h-full"/>
        {!loaded && (
          <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
            <div className="text-center"><div className="w-12 h-12 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin mx-auto mb-3"/><p className="text-sm font-body text-stone-500">Loading map…</p></div>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-xl px-3 py-1.5 shadow-sm z-10">
          <span className="text-xs font-body font-semibold text-stone-700">{properties.length} {properties.length===1?"property":"properties"}</span>
        </div>

        {/* Selected property popup */}
        {selected && (
          <div className="absolute bottom-4 left-4 right-4 z-20 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-map-popup border border-stone-100 overflow-hidden">
              <div className="flex gap-0">
                <div className="relative w-28 flex-shrink-0">
                  {selected.images?.[0] && <img src={selected.images[0]} alt="" className="w-full h-full object-cover"/>}
                  <span className={cn("absolute top-2 left-2 badge text-[10px]", selected.listingFor==="RENT"?"badge-rent":"badge-sale")}>{selected.listingFor==="RENT"?"Rent":"Sale"}</span>
                </div>
                <div className="flex-1 p-3 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-display text-base font-semibold text-stone-900 leading-none">{formatPrice(selected.price, selected.listingFor)}</div>
                    <button onClick={() => setSelected(null)} className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0"><X className="w-3 h-3 text-stone-500"/></button>
                  </div>
                  <p className="text-xs font-body text-stone-600 line-clamp-1 mb-1">{selected.title}</p>
                  <div className="flex items-center gap-1 text-stone-400 text-[10px] font-body mb-2"><MapPin className="w-2.5 h-2.5"/>{selected.locality}, {selected.city}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selected.bedrooms>0&&<span className="flex items-center gap-0.5 text-[10px] text-stone-500 font-body"><BedDouble className="w-3 h-3"/>{selected.bedrooms}</span>}
                      {selected.bathrooms>0&&<span className="flex items-center gap-0.5 text-[10px] text-stone-500 font-body"><Bath className="w-3 h-3"/>{selected.bathrooms}</span>}
                      <span className="flex items-center gap-0.5 text-[10px] text-stone-500 font-body"><Maximize className="w-3 h-3"/>{selected.area.toLocaleString("en-IN")}</span>
                    </div>
                    <Link href={`/properties/${selected.slug}`} className="text-[10px] font-body font-semibold text-amber-700 hover:text-amber-800 transition-colors">View →</Link>
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
