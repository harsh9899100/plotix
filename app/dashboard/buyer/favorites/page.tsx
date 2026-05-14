"use client"
import { useState } from "react"
import Link from "next/link"
import { Heart, Search, Trash2, SlidersHorizontal, Grid, List } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import PropertyCard from "@/components/properties/PropertyCard"
import { Button, EmptyState, SearchInput, Tabs } from "@/components/ui"
import { MOCK_PROPERTIES } from "@/lib/data/mock"
import toast from "react-hot-toast"


export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(MOCK_PROPERTIES.slice(0, 5).map((p) => ({ ...p, isFav: true })))
  const [search, setSearch]       = useState("")
  const [viewMode, setViewMode]   = useState<"grid" | "list">("grid")
  const [filterTab, setFilterTab] = useState("all")

  const filtered = favorites.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase())
    const matchTab = filterTab === "all" || (filterTab === "sale" && p.listingFor === "SALE") || (filterTab === "rent" && p.listingFor === "RENT")
    return matchSearch && matchTab
  })

  const removeFav = (id: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id))
    toast.success("Removed from favorites")
  }

  const clearAll = () => {
    setFavorites([])
    toast.success("All favorites cleared")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title flex items-center gap-2"><Heart className="w-7 h-7 text-rose-500" /> My Favorites</h1>
            <p className="page-subtitle">{favorites.length} saved {favorites.length === 1 ? "property" : "properties"}</p>
          </div>
          {favorites.length > 0 && (
            <Button variant="secondary" size="sm" onClick={clearAll}>
              <Trash2 className="w-4 h-4" /> Clear All
            </Button>
          )}
        </div>

        {favorites.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-8 h-8 text-stone-300" />}
            title="No favorites yet"
            description="Start browsing properties and save the ones you love."
            action={<Link href="/properties" className="btn-primary">Browse Properties</Link>}
          />
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchInput value={search} onChange={setSearch} placeholder="Search favorites…" className="flex-1 max-w-sm" />
              <Tabs
                tabs={[
                  { value: "all",  label: "All",      count: favorites.length },
                  { value: "sale", label: "For Sale",  count: favorites.filter((p) => p.listingFor === "SALE").length },
                  { value: "rent", label: "For Rent",  count: favorites.filter((p) => p.listingFor === "RENT").length },
                ]}
                active={filterTab} onChange={setFilterTab}
              />
              <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
                {(["grid", "list"] as const).map((m) => (
                  <button key={m} onClick={() => setViewMode(m)}
                    className={`p-2 rounded-lg transition-all ${viewMode === m ? "bg-white shadow-sm text-stone-900" : "text-stone-400 hover:text-stone-600"}`}>
                    {m === "grid" ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState icon={<Search className="w-8 h-8 text-stone-300" />} title="No results found" description="Try a different search or filter." />
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" : "flex flex-col gap-4"}>
                {filtered.map((p) => (
                  <div key={p.id} className="relative group/card">
                    <PropertyCard property={p} viewMode={viewMode} isFavorited />
                    <button onClick={() => removeFav(p.id)}
                      className="absolute top-3 right-14 opacity-0 group-hover/card:opacity-100 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-rose-50 hover:text-rose-500 transition-all z-10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
