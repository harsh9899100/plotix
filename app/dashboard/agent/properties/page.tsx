"use client"
import { useState } from "react"
import Link from "next/link"
import { Home, Plus, Eye, Edit, Trash2, MoreHorizontal, TrendingUp, MessageSquare } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Badge, SearchInput, Tabs, Pagination, EmptyState, ConfirmDialog, StatCard } from "@/components/ui"
import { formatPrice, formatDate, cn } from "@/lib/utils"
import { MOCK_PROPERTIES } from "@/lib/data/mock"
import toast from "react-hot-toast"

const MY_PROPS = MOCK_PROPERTIES.map((p, i) => ({
  ...p,
  status: (["ACTIVE","ACTIVE","ACTIVE","DRAFT","ACTIVE","SOLD"] as any[])[i] || "ACTIVE",
}))

const STATUS_COLORS: Record<string, any> = {
  ACTIVE: "green", DRAFT: "stone", PENDING_APPROVAL: "amber", INACTIVE: "stone", SOLD: "blue", ARCHIVED: "stone"
}

export default function AgentPropertiesPage() {
  const [props, setProps]   = useState(MY_PROPS)
  const [search, setSearch] = useState("")
  const [tab, setTab]       = useState("all")
  const [page, setPage]     = useState(1)
  const [menu, setMenu]     = useState<string|null>(null)
  const [confirm, setConfirm] = useState<string|null>(null)
  const PER_PAGE = 5

  const filtered = props.filter((p) => {
    const q = search.toLowerCase()
    return (!search || p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)) &&
           (tab === "all" || p.status === tab)
  })

  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const deleteProperty = (id: string) => {
    setProps((prev) => prev.filter((p) => p.id !== id))
    toast.success("Property deleted")
    setConfirm(null); setMenu(null)
  }

  const toggleStatus = (id: string) => {
    setProps((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : p))
    toast.success("Status updated")
    setMenu(null)
  }

  const stats = {
    total: props.length,
    active: props.filter((p) => p.status === "ACTIVE").length,
    sold: props.filter((p) => p.status === "SOLD").length,
    draft: props.filter((p) => p.status === "DRAFT").length,
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title flex items-center gap-2"><Home className="w-7 h-7 text-violet-500" />My Listings</h1>
            <p className="page-subtitle">{stats.active} active · {stats.sold} sold · {stats.draft} draft</p>
          </div>
          <Link href="/dashboard/agent/properties/new" className="btn-gold self-start">
            <Plus className="w-4 h-4" />New Listing
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Listings", value: stats.total,  icon: <Home className="w-5 h-5 text-stone-500" />,    color: "bg-stone-100" },
            { label: "Active",         value: stats.active, icon: <TrendingUp className="w-5 h-5 text-emerald-500" />, color: "bg-emerald-50" },
            { label: "Sold",           value: stats.sold,   icon: <Badge variant="blue" className="text-xs">SOLD</Badge>, color: "bg-blue-50" },
            { label: "Total Views",    value: props.reduce((s,p)=>s+p.views,0).toLocaleString("en-IN"), icon: <Eye className="w-5 h-5 text-amber-500" />, color: "bg-amber-50" },
          ].map((s) => <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} />)}
        </div>

        {/* Filters */}
        <div className="card-flat p-4 space-y-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search listings…" className="max-w-sm" />
          <Tabs
            tabs={[
              { value: "all",              label: "All",    count: props.length },
              { value: "ACTIVE",           label: "Active", count: stats.active },
              { value: "DRAFT",            label: "Draft",  count: stats.draft },
              { value: "PENDING_APPROVAL", label: "Pending",count: props.filter((p)=>p.status==="PENDING_APPROVAL").length },
              { value: "SOLD",             label: "Sold",   count: stats.sold },
            ]}
            active={tab} onChange={(v) => { setTab(v); setPage(1) }}
          />
        </div>

        {/* Listings */}
        {paginated.length === 0 ? (
          <EmptyState
            icon={<Home className="w-8 h-8 text-stone-300" />}
            title="No listings found"
            description="Create your first property listing to get started."
            action={<Link href="/dashboard/agent/properties/new" className="btn-gold">New Listing</Link>}
          />
        ) : (
          <div className="space-y-3">
            {paginated.map((p) => (
              <div key={p.id} className="card p-4 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant={STATUS_COLORS[p.status] || "stone"}>{p.status}</Badge>
                          <Badge variant={p.listingFor === "RENT" ? "blue" : "green"}>
                            {p.listingFor === "RENT" ? "Rent" : "Sale"}
                          </Badge>
                        </div>
                        <p className="font-body font-semibold text-stone-900 truncate">{p.title}</p>
                        <p className="text-xs text-stone-400 font-body mt-0.5">{p.locality}, {p.city} · {p.area.toLocaleString("en-IN")} sq.ft</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-display text-lg font-semibold text-stone-900">{formatPrice(p.price, p.listingFor)}</p>
                        <p className="text-xs text-stone-400 font-body">{formatDate(p.createdAt)}</p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-stone-500 font-body"><Eye className="w-3.5 h-3.5" />{p.views.toLocaleString()} views</span>
                      <span className="flex items-center gap-1 text-xs text-stone-500 font-body"><MessageSquare className="w-3.5 h-3.5" />{p.inquiryCount} inquiries</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link href={`/properties/${p.slug}`} target="_blank"
                      className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/dashboard/agent/properties/${p.id}`}
                      className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <div className="relative">
                      <button onClick={() => setMenu(menu === p.id ? null : p.id)}
                        className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menu === p.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenu(null)} />
                          <div className="absolute right-0 top-10 w-44 bg-white border border-stone-200 rounded-xl shadow-lg z-20 overflow-hidden">
                            <button onClick={() => toggleStatus(p.id)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-stone-700 hover:bg-stone-50">
                              {p.status === "ACTIVE" ? "Deactivate" : "Activate"}
                            </button>
                            <Link href={`/dashboard/agent/properties/${p.id}/images`}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-stone-700 hover:bg-stone-50">
                              Manage Images
                            </Link>
                            <Link href={`/dashboard/agent/properties/${p.id}/documents`}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-stone-700 hover:bg-stone-50">
                              Documents
                            </Link>
                            <button onClick={() => { setConfirm(p.id); setMenu(null) }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-rose-600 hover:bg-rose-50">
                              <Trash2 className="w-4 h-4" />Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs font-body text-stone-400">Showing {Math.min(filtered.length, PER_PAGE*(page-1)+1)}–{Math.min(filtered.length, PER_PAGE*page)} of {filtered.length}</p>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>

        <ConfirmDialog
          open={!!confirm}
          onClose={() => setConfirm(null)}
          onConfirm={() => confirm && deleteProperty(confirm)}
          title="Delete Property?"
          description="This will permanently remove the listing and all associated inquiries and viewings."
          confirmLabel="Delete"
          danger
        />
      </div>
    </DashboardLayout>
  )
}
