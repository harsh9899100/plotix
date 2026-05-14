"use client"
import { useState } from "react"
import { Shield, Plus, CheckCircle, Clock, AlertCircle, Search, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, Tabs, StatCard, SearchInput, ConfirmDialog } from "@/components/ui"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"


const WARRANTIES = [
  { id:"w1", unitRef:"Unit 1204", project:"Sky Residences", ownerName:"Arjun Mehta", category:"STRUCTURE", description:"5-year structural warranty covering foundation, columns, beams, and slabs.", expiresAt:new Date(Date.now()+5*365*86400000), status:"ACTIVE" },
  { id:"w2", unitRef:"Unit 805", project:"Sky Residences", ownerName:"Kiran Shah", category:"WATERPROOFING", description:"2-year waterproofing warranty for terrace, bathroom, and kitchen areas.", expiresAt:new Date(Date.now()+2*365*86400000), status:"ACTIVE" },
  { id:"w3", unitRef:"Villa B-05", project:"Harmony Villas", ownerName:"Meera Patel", category:"FIXTURES", description:"1-year warranty on all bathroom fixtures, kitchen fittings, and door/window hardware.", expiresAt:new Date(Date.now()-30*86400000), status:"EXPIRED" },
  { id:"w4", unitRef:"Villa A-02", project:"Harmony Villas", ownerName:"Rajesh Kumar", category:"ELECTRICAL", description:"1-year warranty on all electrical wiring, panels, and installed fixtures.", expiresAt:new Date(Date.now()+180*86400000), status:"ACTIVE" },
]

const CAT_CFG: Record<string, any> = { STRUCTURE:"blue", WATERPROOFING:"violet", FIXTURES:"amber", ELECTRICAL:"emerald" }

export default function WarrantiesPage() {
  const [warranties, setWarranties] = useState(WARRANTIES)
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = warranties.filter(w => {
    const matchSearch = !search || w.ownerName.toLowerCase().includes(search.toLowerCase()) || w.unitRef.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === "all" || w.status === tab
    return matchSearch && matchTab
  })

  const getDaysRemaining = (date: Date) => Math.round((date.getTime() - Date.now()) / 86400000)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Shield className="w-7 h-7 text-emerald-500" />Warranties</h1>
            <p className="page-subtitle">Manage post-possession warranties for all sold units.</p>
          </div>
          <button onClick={() => toast.success("Add warranty dialog")} className="btn-gold"><Plus className="w-4 h-4" />Add Warranty</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={warranties.length} icon={<Shield className="w-5 h-5 text-stone-400" />} color="bg-stone-100" />
          <StatCard label="Active" value={warranties.filter(w => w.status === "ACTIVE").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50" />
          <StatCard label="Expired" value={warranties.filter(w => w.status === "EXPIRED").length} icon={<AlertCircle className="w-5 h-5 text-rose-500" />} color="bg-rose-50" />
          <StatCard label="Expiring Soon" value={warranties.filter(w => getDaysRemaining(w.expiresAt) < 90 && getDaysRemaining(w.expiresAt) > 0).length} icon={<Clock className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
        </div>

        <div className="flex gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by owner or unit..." className="flex-1 max-w-sm" />
          <Tabs tabs={[{ value:"all", label:"All" }, { value:"ACTIVE", label:"Active" }, { value:"EXPIRED", label:"Expired" }]} active={tab} onChange={setTab} />
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Unit</th><th>Owner</th><th>Category</th><th>Coverage</th><th>Expires</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map(w => {
                const days = getDaysRemaining(w.expiresAt)
                return (
                  <tr key={w.id}>
                    <td><p className="font-medium text-stone-900">{w.unitRef}</p><p className="text-xs text-stone-400">{w.project}</p></td>
                    <td className="text-sm text-stone-700">{w.ownerName}</td>
                    <td><Badge variant={CAT_CFG[w.category]}>{w.category}</Badge></td>
                    <td className="text-sm text-stone-500 max-w-[200px] truncate">{w.description}</td>
                    <td>
                      <p className="text-sm text-stone-700">{formatDate(w.expiresAt)}</p>
                      {days > 0 && days < 90 && <p className="text-xs text-amber-500 mt-0.5">⚠ {days}d remaining</p>}
                      {days <= 0 && <p className="text-xs text-rose-500 mt-0.5">Expired</p>}
                    </td>
                    <td><Badge variant={w.status === "ACTIVE" ? "green" : "stone"}>{w.status}</Badge></td>
                    <td>
                      <button onClick={() => setDeleting(w.id)} className="btn-icon text-stone-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => { setWarranties(p => p.filter(w => w.id !== deleting)); setDeleting(null); toast.success("Warranty deleted") }}
        title="Delete Warranty?" confirmLabel="Delete" danger />
    </DashboardLayout>
  )
}
