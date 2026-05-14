"use client"
import { useState } from "react"
import Link from "next/link"
import { Home, CheckCircle, XCircle, Eye, Clock, Filter, Download, MoreHorizontal, MapPin, BedDouble, Maximize } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Badge, SearchInput, Tabs, Pagination, EmptyState, ConfirmDialog } from "@/components/ui"
import { formatDate, formatPrice, cn } from "@/lib/utils"
import { MOCK_PROPERTIES } from "@/lib/data/mock"
import toast from "react-hot-toast"

const MOCK_ADMIN = { id: "admin1", firstName: "Admin", lastName: "User", role: "ADMIN", email: "admin@plotix.in" }

const ALL_PROPS = [
  ...MOCK_PROPERTIES.map((p, i) => ({
    ...p,
    status: (["ACTIVE","PENDING_APPROVAL","ACTIVE","PENDING_APPROVAL","ACTIVE","PENDING_APPROVAL"] as any[])[i] || p.status,
    submittedBy: p.agentName,
    submittedAt: new Date(Date.now() - i * 86400000 * 1.5),
  }))
]

const STATUS_TABS = [
  { value: "all",              label: "All" },
  { value: "PENDING_APPROVAL", label: "Pending" },
  { value: "ACTIVE",           label: "Active" },
  { value: "INACTIVE",         label: "Inactive" },
  { value: "ARCHIVED",         label: "Archived" },
]

export default function AdminPropertiesPage() {
  const [props, setProps]     = useState(ALL_PROPS)
  const [search, setSearch]   = useState("")
  const [tab, setTab]         = useState("all")
  const [page, setPage]       = useState(1)
  const [selected, setSelect] = useState<string[]>([])
  const [confirm, setConfirm] = useState<{type:string; id?:string} | null>(null)
  const [menu, setMenu]       = useState<string|null>(null)
  const PER_PAGE = 6

  const filtered = props.filter((p) => {
    const q = search.toLowerCase()
    return (!search || p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)) &&
           (tab === "all" || p.status === tab)
  })

  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const approve = (id: string) => {
    setProps((prev) => prev.map((p) => p.id === id ? {...p, status: "ACTIVE"} : p))
    toast.success("Property approved ✓")
    setConfirm(null); setMenu(null)
  }

  const reject = (id: string) => {
    setProps((prev) => prev.map((p) => p.id === id ? {...p, status: "INACTIVE"} : p))
    toast.success("Property rejected")
    setConfirm(null); setMenu(null)
  }

  const STATUS_BADGE: Record<string, any> = {
    ACTIVE: "green", PENDING_APPROVAL: "amber", INACTIVE: "stone",
    DRAFT: "stone", ARCHIVED: "stone", SOLD: "blue",
  }

  return (
    <DashboardLayout user={MOCK_ADMIN as any}>
      <div className="dashboard-main py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title flex items-center gap-2"><Home className="w-7 h-7 text-violet-500" />Properties Management</h1>
            <p className="page-subtitle">Review, approve, and manage all platform listings.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/admin/properties/pending"
              className="btn-secondary text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              {props.filter((p) => p.status === "PENDING_APPROVAL").length} Pending
            </Link>
            <Button variant="secondary" size="sm"><Download className="w-4 h-4" />Export</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="card-flat p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search by title or city…" className="flex-1 max-w-sm" />
          </div>
          <Tabs
            tabs={STATUS_TABS.map((t) => ({
              ...t, count: t.value === "all" ? props.length : props.filter((p) => p.status === t.value).length
            }))}
            active={tab} onChange={(v) => { setTab(v); setPage(1) }}
          />
        </div>

        {/* Table */}
        {paginated.length === 0 ? (
          <EmptyState icon={<Home className="w-8 h-8 text-stone-300" />} title="No properties found" description="Try adjusting your search or filter." />
        ) : (
          <div className="space-y-3">
            {paginated.map((p) => (
              <div key={p.id} className="card p-4 hover:shadow-card-hover">
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                    <div className="absolute top-1.5 left-1.5">
                      <Badge variant={STATUS_BADGE[p.status] || "stone"} className="text-[10px] px-1.5 py-0.5">
                        {p.status.replace("_"," ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <p className="font-body font-semibold text-stone-900 truncate">{p.title}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-stone-500 font-body">
                            <MapPin className="w-3 h-3" />{p.locality}, {p.city}
                          </span>
                          {p.bedrooms > 0 && <span className="flex items-center gap-1 text-xs text-stone-500 font-body"><BedDouble className="w-3 h-3" />{p.bedrooms} Beds</span>}
                          <span className="flex items-center gap-1 text-xs text-stone-500 font-body"><Maximize className="w-3 h-3" />{p.area.toLocaleString("en-IN")} sq.ft</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs font-body text-stone-400">
                          <span>By <strong className="text-stone-600">{p.submittedBy}</strong></span>
                          <span>•</span>
                          <span>{formatDate(p.submittedAt)}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-display text-lg font-semibold text-stone-900">{formatPrice(p.price, p.listingFor)}</p>
                        <p className="text-xs text-stone-400 font-body">{p.type}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link href={`/properties/${p.slug}`} target="_blank"
                      className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                    {p.status === "PENDING_APPROVAL" && (
                      <>
                        <button onClick={() => approve(p.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-body font-semibold hover:bg-emerald-100 transition-colors">
                          <CheckCircle className="w-3.5 h-3.5" />Approve
                        </button>
                        <button onClick={() => setConfirm({type:"reject",id:p.id})}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-body font-semibold hover:bg-rose-100 transition-colors">
                          <XCircle className="w-3.5 h-3.5" />Reject
                        </button>
                      </>
                    )}
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
          open={confirm?.type === "reject"}
          onClose={() => setConfirm(null)}
          onConfirm={() => confirm?.id && reject(confirm.id)}
          title="Reject Property?"
          description="This property will be marked as inactive and the owner will be notified."
          confirmLabel="Reject"
        />
      </div>
    </DashboardLayout>
  )
}
