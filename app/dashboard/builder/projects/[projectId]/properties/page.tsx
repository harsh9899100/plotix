"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Home, Plus, Eye, Edit, Trash2, Filter } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, EmptyState, SearchInput, Tabs, StatCard, ConfirmDialog } from "@/components/ui"
import { formatCurrency, cn } from "@/lib/utils"
import toast from "react-hot-toast"

const UNITS = [
  { id:"u1", unitNo:"A-101", floor:1, type:"2BHK", area:1050, price:4800000, status:"AVAILABLE", beds:2, baths:2 },
  { id:"u2", unitNo:"A-201", floor:2, type:"3BHK", area:1450, price:6500000, status:"SOLD", beds:3, baths:2 },
  { id:"u3", unitNo:"A-301", floor:3, type:"3BHK", area:1450, price:6600000, status:"RESERVED", beds:3, baths:2 },
  { id:"u4", unitNo:"B-101", floor:1, type:"2BHK", area:1050, price:4900000, status:"AVAILABLE", beds:2, baths:2 },
  { id:"u5", unitNo:"B-401", floor:4, type:"4BHK", area:2100, price:9800000, status:"AVAILABLE", beds:4, baths:3 },
  { id:"u6", unitNo:"PH-1", floor:12, type:"Penthouse", area:3500, price:18000000, status:"SOLD", beds:5, baths:4 },
]

const STATUS_CFG: Record<string,{label:string;variant:any}> = {
  AVAILABLE: { label:"Available", variant:"green" },
  SOLD:      { label:"Sold",      variant:"stone" },
  RESERVED:  { label:"Reserved",  variant:"amber" },
  BLOCKED:   { label:"Blocked",   variant:"rose" },
}

export default function ProjectPropertiesPage({ params }: { params: { projectId: string } }) {
  const [units, setUnits] = useState(UNITS)
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string|null>(null)

  const filtered = units.filter(u => {
    const matchTab = tab === "all" || u.status === tab
    const matchSearch = !search || u.unitNo.toLowerCase().includes(search.toLowerCase()) || u.type.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/builder/projects/${params.projectId}`} className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
            <div>
              <h1 className="page-title flex items-center gap-2"><Home className="w-7 h-7 text-blue-500"/>Project Units</h1>
              <p className="page-subtitle">Manage all units in this project.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/builder/projects/${params.projectId}/properties/bulk-upload`} className="btn-secondary text-sm">Bulk Upload</Link>
            <Link href={`/dashboard/builder/projects/${params.projectId}/properties/new`} className="btn-gold"><Plus className="w-4 h-4"/>Add Unit</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Total", value:units.length, color:"bg-stone-100" },
            { label:"Available", value:units.filter(u=>u.status==="AVAILABLE").length, color:"bg-emerald-50" },
            { label:"Sold", value:units.filter(u=>u.status==="SOLD").length, color:"bg-stone-100" },
            { label:"Reserved", value:units.filter(u=>u.status==="RESERVED").length, color:"bg-amber-50" },
          ].map(s => (
            <div key={s.label} className={`card-flat p-4 ${s.color}`}>
              <p className="text-xs text-stone-400 uppercase font-body">{s.label}</p>
              <p className="font-display text-3xl font-light">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by unit no or type..." className="flex-1 max-w-xs"/>
          <Tabs tabs={[{value:"all",label:"All"},{value:"AVAILABLE",label:"Available"},{value:"SOLD",label:"Sold"},{value:"RESERVED",label:"Reserved"}]}
            active={tab} onChange={setTab}/>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Home className="w-8 h-8 text-stone-300"/>} title="No units found"
            action={<Link href={`/dashboard/builder/projects/${params.projectId}/properties/new`} className="btn-primary">Add Unit</Link>}/>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Unit</th><th>Type</th><th>Floor</th><th>Area</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td><p className="font-semibold text-stone-900">{u.unitNo}</p></td>
                    <td><span className="text-sm font-body text-stone-700">{u.type} · {u.beds}BHK</span></td>
                    <td className="text-sm text-stone-600">Floor {u.floor}</td>
                    <td className="text-sm text-stone-600">{u.area.toLocaleString()} sq.ft</td>
                    <td className="font-medium text-amber-700">{formatCurrency(u.price)}</td>
                    <td><Badge variant={STATUS_CFG[u.status].variant}>{STATUS_CFG[u.status].label}</Badge></td>
                    <td>
                      <div className="flex gap-1">
                        <Link href={`/dashboard/builder/projects/${params.projectId}/properties/${u.id}`} className="btn-icon text-stone-400 hover:text-stone-700"><Edit className="w-4 h-4"/></Link>
                        <button onClick={() => setDeleting(u.id)} className="btn-icon text-stone-400 hover:text-rose-600"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={() => { setUnits(p=>p.filter(u=>u.id!==deleting)); setDeleting(null); toast.success("Unit deleted") }}
        title="Delete Unit?" description="This will permanently remove this unit from the project." confirmLabel="Delete" danger/>
    </DashboardLayout>
  )
}
