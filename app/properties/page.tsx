'use client'

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  SlidersHorizontal, LayoutGrid, List, Map, ChevronDown,
  ArrowUpDown, X, Sparkles
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FilterBar from '@/components/properties/FilterBar'
import PropertyCard from '@/components/properties/PropertyCard'
import MapView from '@/components/properties/MapView'
import { mockProperties } from '@/lib/mockData'
import { PropertyFilters, ViewMode } from '@/types'
import { cn } from '@/lib/utils'

const DEFAULT_FILTERS: PropertyFilters = {
  search: '',
  city: '',
  type: '',
  listingFor: '',
  minPrice: 0,
  maxPrice: 0,
  minArea: 0,
  maxArea: 0,
  bedrooms: '',
  bathrooms: '',
  furnishing: '',
  amenities: [],
  status: '',
  sortBy: 'newest',
}

const SORT_LABELS: Record<string, string> = {
  newest: 'Newest First',
  'price-asc': 'Price ↑',
  'price-desc': 'Price ↓',
  popular: 'Popular',
  'area-asc': 'Area ↑',
  'area-desc': 'Area ↓',
}

function PropertiesPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [filters, setFilters] = useState<PropertyFilters>(() => ({
    ...DEFAULT_FILTERS,
    city: searchParams.get('city') || '',
    type: (searchParams.get('type') as PropertyFilters['type']) || '',
    listingFor: (searchParams.get('listingFor') as PropertyFilters['listingFor']) || '',
  }))

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showMap, setShowMap] = useState(true)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [mobileSortOpen, setMobileSortOpen] = useState(false)
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  // Filter + sort properties
  const filteredProperties = useMemo(() => {
    let result = [...mockProperties]

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    // City
    if (filters.city) {
      result = result.filter((p) => p.city === filters.city)
    }

    // Type
    if (filters.type) {
      result = result.filter((p) => p.type === filters.type)
    }

    // Listing for (sale/rent)
    if (filters.listingFor) {
      result = result.filter((p) => p.listingFor === filters.listingFor)
    }

    // Price range
    if (filters.minPrice > 0) {
      result = result.filter((p) => p.price >= filters.minPrice)
    }
    if (filters.maxPrice > 0) {
      result = result.filter((p) => p.price <= filters.maxPrice)
    }

    // Area
    if (filters.minArea > 0) {
      result = result.filter((p) => p.area >= filters.minArea)
    }
    if (filters.maxArea > 0) {
      result = result.filter((p) => p.area <= filters.maxArea)
    }

    // Bedrooms
    if (filters.bedrooms !== '') {
      result = result.filter((p) => p.bedrooms >= Number(filters.bedrooms))
    }

    // Bathrooms
    if (filters.bathrooms !== '') {
      result = result.filter((p) => p.bathrooms >= Number(filters.bathrooms))
    }

    // Furnishing
    if (filters.furnishing) {
      result = result.filter((p) => p.furnishing === filters.furnishing)
    }

    // Amenities
    if (filters.amenities.length > 0) {
      result = result.filter((p) =>
        filters.amenities.every((a) => p.amenities.includes(a))
      )
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        result.sort((a, b) => b.views - a.views)
        break
      case 'area-asc':
        result.sort((a, b) => a.area - b.area)
        break
      case 'area-desc':
        result.sort((a, b) => b.area - a.area)
        break
      case 'newest':
      default:
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }

    return result
  }, [filters])

  const activeFilterCount = useMemo(() => {
    return [
      filters.search,
      filters.city,
      filters.type,
      filters.listingFor,
      filters.minPrice,
      filters.maxPrice,
      filters.minArea,
      filters.maxArea,
      filters.bedrooms,
      filters.bathrooms,
      filters.furnishing,
      ...filters.amenities,
    ].filter(Boolean).length
  }, [filters])

  const handleFilterChange = useCallback((newFilters: PropertyFilters) => {
    setFilters(newFilters)
  }, [])

  const removeFilter = (key: keyof PropertyFilters) => {
    if (key === 'amenities') {
      setFilters((f) => ({ ...f, amenities: [] }))
    } else {
      setFilters((f) => ({
        ...f,
        [key]: DEFAULT_FILTERS[key],
      }))
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="pt-[72px] border-b border-stone-100 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title */}
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-light text-stone-900">
                {filters.listingFor === 'rent'
                  ? 'Properties for Rent'
                  : filters.listingFor === 'sale'
                  ? 'Properties for Sale'
                  : 'All Properties'}
                {filters.city && (
                  <span className="text-stone-400"> in {filters.city}</span>
                )}
              </h1>
              <p className="font-body text-stone-500 text-sm mt-1">
                {filteredProperties.length === 0
                  ? 'No properties found'
                  : `${filteredProperties.length.toLocaleString()} ${filteredProperties.length === 1 ? 'property' : 'properties'} found`}
              </p>
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className={cn(
                  'lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-body font-medium transition-all',
                  activeFilterCount > 0
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMobileSortOpen(!mobileSortOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm font-body font-medium text-stone-700 hover:border-stone-400 transition-all"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="hidden sm:inline">{SORT_LABELS[filters.sortBy]}</span>
                  <span className="sm:hidden">Sort</span>
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', mobileSortOpen && 'rotate-180')} />
                </button>

                {mobileSortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMobileSortOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-stone-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                      {Object.entries(SORT_LABELS).map(([val, label]) => (
                        <button
                          key={val}
                          onClick={() => {
                            setFilters((f) => ({ ...f, sortBy: val as PropertyFilters['sortBy'] }))
                            setMobileSortOpen(false)
                          }}
                          className={cn(
                            'w-full text-left px-4 py-2.5 text-sm font-body transition-colors',
                            filters.sortBy === val
                              ? 'bg-stone-50 font-semibold text-stone-900'
                              : 'text-stone-600 hover:bg-stone-50'
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* View Mode */}
              <div className="flex items-center bg-stone-100 rounded-xl p-1 gap-0.5">
                {([
                  { mode: 'grid', icon: LayoutGrid },
                  { mode: 'list', icon: List },
                ] as const).map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      'p-2 rounded-lg transition-all',
                      viewMode === mode
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-500 hover:text-stone-700'
                    )}
                    aria-label={`${mode} view`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* Map Toggle */}
              <button
                onClick={() => setShowMap(!showMap)}
                className={cn(
                  'hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-body font-medium transition-all',
                  showMap
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                )}
              >
                <Map className="w-4 h-4" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-100">
              <span className="text-xs font-body text-stone-400 flex items-center">Active filters:</span>
              {filters.search && (
                <FilterTag label={`"${filters.search}"`} onRemove={() => removeFilter('search')} />
              )}
              {filters.city && (
                <FilterTag label={filters.city} onRemove={() => removeFilter('city')} />
              )}
              {filters.type && (
                <FilterTag label={filters.type} onRemove={() => removeFilter('type')} />
              )}
              {filters.listingFor && (
                <FilterTag label={`For ${filters.listingFor}`} onRemove={() => removeFilter('listingFor')} />
              )}
              {filters.bedrooms !== '' && (
                <FilterTag label={`${filters.bedrooms}+ Beds`} onRemove={() => removeFilter('bedrooms')} />
              )}
              {filters.bathrooms !== '' && (
                <FilterTag label={`${filters.bathrooms}+ Baths`} onRemove={() => removeFilter('bathrooms')} />
              )}
              {filters.furnishing && (
                <FilterTag label={filters.furnishing} onRemove={() => removeFilter('furnishing')} />
              )}
              {filters.amenities.map((a) => (
                <FilterTag
                  key={a}
                  label={a}
                  onRemove={() =>
                    setFilters((f) => ({ ...f, amenities: f.amenities.filter((x) => x !== a) }))
                  }
                />
              ))}
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-xs font-body text-rose-500 hover:text-rose-600 transition-colors ml-1 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Layout ───────────────────────────────────────────────────── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={cn(
          'flex gap-6',
          showMap ? 'lg:grid lg:grid-cols-[280px_1fr_1fr]' : 'lg:grid lg:grid-cols-[280px_1fr]'
        )}>

          {/* ── Filter Sidebar ─────────────────────────────────────────── */}
          <div className="hidden lg:block h-[calc(100vh-200px)] sticky top-[88px]">
            <FilterBar
              filters={filters}
              onChange={handleFilterChange}
              resultCount={filteredProperties.length}
              isMobileOpen={mobileFilterOpen}
              onMobileClose={() => setMobileFilterOpen(false)}
            />
          </div>

          {/* Mobile Filter (no hidden needed, handled inside FilterBar) */}
          <div className="lg:hidden">
            <FilterBar
              filters={filters}
              onChange={handleFilterChange}
              resultCount={filteredProperties.length}
              isMobileOpen={mobileFilterOpen}
              onMobileClose={() => setMobileFilterOpen(false)}
            />
          </div>

          {/* ── Map View ───────────────────────────────────────────────── */}
          {showMap && (
            <div className="hidden lg:block h-[calc(100vh-200px)] sticky top-[88px]">
              <MapView
                properties={filteredProperties}
                highlightedId={highlightedId}
                onMarkerClick={(id) => {
                  const el = document.getElementById(`property-${id}`)
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  setHighlightedId(id)
                  setTimeout(() => setHighlightedId(null), 3000)
                }}
              />
            </div>
          )}

          {/* ── Property Grid / List ───────────────────────────────────── */}
          <div className={cn(
            'properties-scroll',
            showMap ? '' : 'col-span-1'
          )}>
            {filteredProperties.length === 0 ? (
              <EmptyState onReset={() => setFilters(DEFAULT_FILTERS)} />
            ) : (
              <>
                <div className={cn(
                  viewMode === 'grid'
                    ? 'grid gap-5 grid-cols-1 sm:grid-cols-2' + (showMap ? '' : ' xl:grid-cols-3')
                    : 'flex flex-col gap-4'
                )}>
                  {filteredProperties.map((property, i) => (
                    <div
                      key={property.id}
                      id={`property-${property.id}`}
                      className={cn(
                        'animate-fade-up',
                        i === 0 && 'animation-delay-100',
                        i === 1 && 'animation-delay-200',
                        i === 2 && 'animation-delay-300',
                      )}
                    >
                      <PropertyCard
                        property={property}
                        viewMode={viewMode}
                        highlighted={highlightedId === property.id}
                        onHover={setHighlightedId}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination placeholder */}
                <div className="mt-10 flex justify-center pb-6">
                  <nav className="flex items-center gap-1">
                    {[1, 2, 3].map((p) => (
                      <button
                        key={p}
                        className={cn(
                          'w-9 h-9 rounded-xl text-sm font-body font-medium transition-all',
                          p === 1
                            ? 'bg-stone-900 text-white'
                            : 'text-stone-600 border border-stone-200 hover:border-stone-400'
                        )}
                      >
                        {p}
                      </button>
                    ))}
                    <span className="px-2 text-stone-400 text-sm">…</span>
                    <button className="w-9 h-9 rounded-xl text-sm font-body font-medium text-stone-600 border border-stone-200 hover:border-stone-400 transition-all">
                      8
                    </button>
                  </nav>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full text-xs font-body text-stone-700">
      {label}
      <button onClick={onRemove} className="hover:text-rose-500 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-5">
        <Sparkles className="w-8 h-8 text-stone-300" />
      </div>
      <h3 className="font-display text-2xl font-light text-stone-800 mb-2">No properties found</h3>
      <p className="font-body text-stone-400 text-sm mb-6 max-w-xs">
        Try adjusting or clearing your filters to discover more properties.
      </p>
      <button onClick={onReset} className="btn-primary">
        Clear All Filters
      </button>
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="font-body text-stone-500 text-sm">Loading properties…</p>
        </div>
      </div>
    }>
      <PropertiesPageContent />
    </Suspense>
  )
}
