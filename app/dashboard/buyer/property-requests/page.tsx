"use client"
import { useState } from "react"
import Link from "next/link"
import { FileText, Plus, Edit, Trash2, Eye, CheckCircle, Clock } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, Button, EmptyState, Tabs, StatCard, ConfirmDialog } from "@/components/ui"
import { formatDate, cn } from "@/lib/utils"
import toast from "react-hot-toast"

const MOCK_REQUESTS = [
  { id:"pr1", title:"3BHK Apartment in Surat", propertyTypes:["APARTMENT"], budget:{min:4500000,max:8000000},
    bedrooms:[3], area:{min:1200,max:1800}, cities:["Surat"], status:"OPEN",
    createdAt:new Date(Date.now()-5*86400000), matchedCount:12, description:"Looking for a modern 3BHK near schools and hospitals." },
  { id:"pr2", title:"Villa or Row House in Ahmedabad", propertyTypes:["VILLA","ROW_HOUSE"], budget:{min:10000000,max:20000000},
    bedrooms:[4,5], area:{min:2500,max:4000}, cities:["Ahmedabad"], status:"MATCHED",
    createdAt:new Date(Date.now()-15*86400000), matchedCount:5, description:"Preferring gated community with pool." },
  { id:"pr3", title:"2BHK for Rent", propertyTypes:["APARTMENT"], budget:{min:15000,max:25000},
    bedrooms:[2], area:{min:900,max:1200}, cities:["Surat","Vadodara"], status:"COMPLETED",
    createdAt:new Date(Date.now()-30*86400000), matchedCount:8, description:"Near IT park preferred." },
]

const STATUS_CFG: Record<string,{label:string;variant:any}> = {
  OPEN:      { label:"Open",      variant:"blue" },
  MATCHED:   { label:"Matched",   variant:"green" },
  COMPLETED: { label:"Completed", variant:"stone" },
  CLOSED:    { label:"Closed",    variant:"rose" },
}

function formatBudget(min:number,max:number){
  const fmt=(n:number)=>n>=10000000?`₹${(n/10000000).toFixed(1)}Cr`:n>=100000?`₹${(n/100000).toFixed(0)}L`:`₹${n.toLocaleString()}`
  return `${fmt(min)} – ${fmt(max)}`
}

export default function PropertyRequestsPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS)
  const [tab, setTab] = useState("all")
  const [deleting, setDeleting] = useState<string|null>(null)

  const filtered = tab === "all" ? requests : requests.filter(r => r.status === tab)

  const doDelete = () => {
    setRequests(prev => prev.filter(r => r.id !== deleting))
    setDeleting(null)
    toast.success("Request deleted")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><FileText className="w-7 h-7 text-amber-500"/>Property Requests</h1>
            <p className="page-subtitle">Post what you're looking for and let agents find you.</p>
          </div>
          <Link href="/dashboard/buyer/property-requests/new" className="btn-gold"><Plus className="w-4 h-4"/>New Request</Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Active" value={requests.filter(r=>r.status==="OPEN").length} icon={<Clock className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
          <StatCard label="Matched" value={requests.filter(r=>r.status==="MATCHED").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Total" value={requests.length} icon={<FileText className="w-5 h-5 text-stone-500"/>} color="bg-stone-100"/>
        </div>

        <Tabs tabs={[
          { value:"all", label:"All", count:requests.length },
          { value:"OPEN", label:"Open", count:requests.filter(r=>r.status==="OPEN").length },
          { value:"MATCHED", label:"Matched", count:requests.filter(r=>r.status==="MATCHED").length },
          { value:"COMPLETED", label:"Completed", count:requests.filter(r=>r.status==="COMPLETED").length },
        ]} active={tab} onChange={setTab}/>

        {filtered.length === 0 ? (
          <EmptyState icon={<FileText className="w-8 h-8 text-stone-300"/>}
            title="No requests yet" description="Create a property request and let agents match you with the perfect home."
            action={<Link href="/dashboard/buyer/property-requests/new" className="btn-primary">Create Request</Link>}/>
        ) : (
          <div className="space-y-4">
            {filtered.map(r => (
              <div key={r.id} className={cn("card p-5", r.status==="MATCHED" && "border-emerald-200 bg-emerald-50/20")}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-body font-semibold text-stone-900">{r.title}</h3>
                      <Badge variant={STATUS_CFG[r.status].variant}>{STATUS_CFG[r.status].label}</Badge>
                    </div>
                    <p className="text-xs text-stone-400 font-body">{formatDate(r.createdAt)}</p>
                  </div>
                  {r.matchedCount > 0 && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-display font-light text-emerald-600">{r.matchedCount}</p>
                      <p className="text-xs text-stone-400 font-body">matches</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { label:"Budget", value:formatBudget(r.budget.min, r.budget.max) },
                    { label:"Bedrooms", value:r.bedrooms.join(", ")+" BHK" },
                    { label:"Area", value:`${r.area.min}–${r.area.max} sq.ft` },
                    { label:"Cities", value:r.cities.join(", ") },
                  ].map(f => (
                    <div key={f.label} className="bg-stone-50 rounded-xl px-3 py-2.5">
                      <p className="text-[10px] text-stone-400 uppercase tracking-wide font-body">{f.label}</p>
                      <p className="text-sm font-body font-semibold text-stone-800 mt-0.5">{f.value}</p>
                    </div>
                  ))}
                </div>

                <p className="text-sm font-body text-stone-500 line-clamp-1 mb-4">{r.description}</p>

                <div className="flex gap-2 flex-wrap pt-3 border-t border-stone-100">
                  <Link href={`/dashboard/buyer/property-requests/${r.id}`} className="btn-secondary text-xs py-2"><Eye className="w-3.5 h-3.5"/>View Matches</Link>
                  {r.status !== "COMPLETED" && (
                    <>
                      <Link href={`/dashboard/buyer/property-requests/${r.id}/edit`} className="btn-ghost text-xs py-2"><Edit className="w-3.5 h-3.5"/>Edit</Link>
                      <Link href={`/dashboard/buyer/property-requests/${r.id}/complete`} className="btn-ghost text-xs py-2"><CheckCircle className="w-3.5 h-3.5"/>Complete</Link>
                    </>
                  )}
                  <button onClick={() => setDeleting(r.id)} className="btn-ghost text-xs py-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 className="w-3.5 h-3.5"/>Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={doDelete}
        title="Delete Request?" description="This will permanently delete your property request and remove all matched listings." confirmLabel="Delete" danger/>
    </DashboardLayout>
  )
}
