'use client'

import { useState, useCallback } from 'react'
import {
  Search, SlidersHorizontal, X, ChevronDown, ChevronUp, RotateCcw
} from 'lucide-react'
import { PropertyFilters, PropertyType, ListingFor } from '@/types'
import { CITIES, AMENITIES_LIST } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const PROPERTY_TYPES: { value: PropertyType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'agricultural', label: 'Agricultural' },
  { value: 'mixed', label: 'Mixed Use' },
]

const BED_OPTIONS = ['', 1, 2, 3, 4, 5]
const BATH_OPTIONS = ['', 1, 2, 3, 4]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'area-asc', label: 'Area: Small → Large' },
  { value: 'area-desc', label: 'Area: Large → Small' },
]

const FURNISHING_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
]

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

interface FilterBarProps {
  filters: PropertyFilters
  onChange: (filters: PropertyFilters) => void
  resultCount: number
  isMobileOpen: boolean
  onMobileClose: () => void
}

export default function FilterBar({
  filters,
  onChange,
  resultCount,
  isMobileOpen,
  onMobileClose,
}: FilterBarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['search', 'listing', 'type', 'price', 'rooms'])
  )

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      next.has(section) ? next.delete(section) : next.add(section)
      return next
    })
  }

  const update = useCallback((partial: Partial<PropertyFilters>) => {
    onChange({ ...filters, ...partial })
  }, [filters, onChange])

  const resetFilters = () => onChange(DEFAULT_FILTERS)

  const activeFiltersCount = [
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

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities
    update({
      amenities: current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity],
    })
  }

  const SectionHeader = ({ id, label }: { id: string; label: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between py-2 text-left group"
    >
      <span className="text-xs font-body font-semibold uppercase tracking-widest text-stone-500 group-hover:text-stone-700 transition-colors">
        {label}
      </span>
      {expandedSections.has(id)
        ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
        : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
      }
    </button>
  )

  const content = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-stone-600" />
          <span className="font-body font-semibold text-stone-900 text-sm">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 bg-stone-900 text-white text-[10px] rounded-full flex items-center justify-center font-body font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-body text-stone-500 hover:text-stone-900 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
          <button onClick={onMobileClose} className="lg:hidden p-1.5 rounded-lg hover:bg-stone-100">
            <X className="w-4 h-4 text-stone-600" />
          </button>
        </div>
      </div>

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto filter-scroll px-4 pb-6 space-y-1">

        {/* Search */}
        <div className="pt-4">
          <SectionHeader id="search" label="Search" />
          {expandedSections.has('search') && (
            <div className="mt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by title, locality…"
                  value={filters.search}
                  onChange={(e) => update({ search: e.target.value })}
                  className="input pl-9 text-xs"
                />
                {filters.search && (
                  <button
                    onClick={() => update({ search: '' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-stone-100 pt-4">
          <SectionHeader id="listing" label="Listing Type" />
          {expandedSections.has('listing') && (
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {(['', 'sale', 'rent'] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => update({ listingFor: val })}
                  className={cn(
                    'py-2 px-2 rounded-xl text-xs font-body font-medium border transition-all',
                    filters.listingFor === val
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                  )}
                >
                  {val === '' ? 'All' : val === 'sale' ? 'Buy' : 'Rent'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* City */}
        <div className="border-t border-stone-100 pt-4">
          <SectionHeader id="city" label="City" />
          {expandedSections.has('city') && (
            <div className="mt-2 space-y-1">
              <button
                onClick={() => update({ city: '' })}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-xl text-xs font-body transition-all',
                  !filters.city ? 'bg-stone-900 text-white' : 'hover:bg-stone-50 text-stone-600'
                )}
              >
                All Cities
              </button>
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => update({ city })}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-xl text-xs font-body transition-all',
                    filters.city === city ? 'bg-stone-900 text-white' : 'hover:bg-stone-50 text-stone-600'
                  )}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Type */}
        <div className="border-t border-stone-100 pt-4">
          <SectionHeader id="type" label="Property Type" />
          {expandedSections.has('type') && (
            <div className="mt-2 space-y-1">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => update({ type: type.value })}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-xl text-xs font-body transition-all',
                    filters.type === type.value ? 'bg-stone-900 text-white' : 'hover:bg-stone-50 text-stone-600'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-t border-stone-100 pt-4">
          <SectionHeader id="price" label="Price Range" />
          {expandedSections.has('price') && (
            <div className="mt-2 space-y-2">
              <input
                type="number"
                placeholder="Min Price (₹)"
                value={filters.minPrice || ''}
                onChange={(e) => update({ minPrice: Number(e.target.value) })}
                className="input text-xs"
              />
              <input
                type="number"
                placeholder="Max Price (₹)"
                value={filters.maxPrice || ''}
                onChange={(e) => update({ maxPrice: Number(e.target.value) })}
                className="input text-xs"
              />
            </div>
          )}
        </div>

        {/* Area Range */}
        <div className="border-t border-stone-100 pt-4">
          <SectionHeader id="area" label="Area (sq.ft)" />
          {expandedSections.has('area') && (
            <div className="mt-2 space-y-2">
              <input
                type="number"
                placeholder="Min Area"
                value={filters.minArea || ''}
                onChange={(e) => update({ minArea: Number(e.target.value) })}
                className="input text-xs"
              />
              <input
                type="number"
                placeholder="Max Area"
                value={filters.maxArea || ''}
                onChange={(e) => update({ maxArea: Number(e.target.value) })}
                className="input text-xs"
              />
            </div>
          )}
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="border-t border-stone-100 pt-4">
          <SectionHeader id="rooms" label="Bedrooms" />
          {expandedSections.has('rooms') && (
            <div className="mt-2">
              <div className="flex gap-1.5 flex-wrap">
                {BED_OPTIONS.map((opt) => (
                  <button
                    key={String(opt)}
                    onClick={() => update({ bedrooms: opt })}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-body font-medium border transition-all',
                      filters.bedrooms === opt
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                    )}
                  >
                    {opt === '' ? 'Any' : `${opt}+`}
                  </button>
                ))}
              </div>

              <div className="mt-3">
                <span className="text-xs font-body text-stone-500 uppercase tracking-widest font-semibold">Bathrooms</span>
                <div className="flex gap-1.5 flex-wrap mt-2">
                  {BATH_OPTIONS.map((opt) => (
                    <button
                      key={String(opt)}
                      onClick={() => update({ bathrooms: opt })}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-body font-medium border transition-all',
                        filters.bathrooms === opt
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                      )}
                    >
                      {opt === '' ? 'Any' : `${opt}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Furnishing */}
        <div className="border-t border-stone-100 pt-4">
          <SectionHeader id="furnishing" label="Furnishing" />
          {expandedSections.has('furnishing') && (
            <div className="mt-2 space-y-1">
              {FURNISHING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update({ furnishing: opt.value })}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-xl text-xs font-body transition-all',
                    filters.furnishing === opt.value ? 'bg-stone-900 text-white' : 'hover:bg-stone-50 text-stone-600'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="border-t border-stone-100 pt-4">
          <SectionHeader id="amenities" label="Amenities" />
          {expandedSections.has('amenities') && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {AMENITIES_LIST.map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-[11px] font-body border transition-all',
                    filters.amenities.includes(amenity)
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                  )}
                >
                  {amenity}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer - Result count */}
      <div className="px-4 py-4 border-t border-stone-100 bg-white">
        <button
          onClick={onMobileClose}
          className="btn-primary w-full justify-center text-sm"
        >
          Show {resultCount} {resultCount === 1 ? 'Result' : 'Results'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-full bg-white border-r border-stone-100 rounded-2xl overflow-hidden shadow-card">
        {content}
      </div>

      {/* Mobile Drawer */}
      <div className={cn(
        'fixed inset-0 z-50 lg:hidden transition-all duration-300',
        isMobileOpen ? 'visible' : 'invisible'
      )}>
        <div
          className={cn(
            'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
            isMobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={onMobileClose}
        />
        <div className={cn(
          'absolute top-0 left-0 bottom-0 w-80 bg-white shadow-2xl transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          {content}
        </div>
      </div>
    </>
  )
}
