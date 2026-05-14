"use client"
import { useState } from "react"
import Link from "next/link"
import { Briefcase, Plus, Eye, Edit, MoreHorizontal, TrendingUp, Home, Users } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { StatCard, Badge, SearchInput, Tabs, Pagination, EmptyState, ConfirmDialog } from "@/components/ui"
import { formatCurrency, formatDate, cn } from "@/lib/utils"
import toast from "react-hot-toast"

const MOCK_BUILDER = { id:"b1", firstName:"Vikram", lastName:"Patel", role:"BUILDER", email:"vikram@demo.com" }
const STATUS_COLORS: Record<string,any> = { PRE_LAUNCH:"amber", LAUNCHED:"green", SOLD_OUT:"blue", COMPLETED:"stone" }

const PROJECTS = [
  { id:"pr1", title:"Emerald Heights",   city:"Surat",      type:"RESIDENTIAL", status:"LAUNCHED",   totalUnits:120, unitsSold:89,  unitsAvailable:31,  revenue:890000000,  inquiries:342, startDate:new Date("2023-01-01"), completionDate:new Date("2025-06-30"), image:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&h=150&fit=crop" },
  { id:"pr2", title:"Royal Residences",  city:"Ahmedabad",  type:"RESIDENTIAL", status:"SOLD_OUT",   totalUnits:80,  unitsSold:80,  unitsAvailable:0,   revenue:640000000,  inquiries:198, startDate:new Date("2022-03-01"), completionDate:new Date("2024-12-31"), image:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=150&fit=crop" },
  { id:"pr3", title:"Sapphire Park",     city:"Surat",      type:"MIXED",       status:"LAUNCHED",   totalUnits:200, unitsSold:143, unitsAvailable:57,  revenue:1430000000, inquiries:521, startDate:new Date("2023-06-01"), completionDate:new Date("2026-03-31"), image:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=200&h=150&fit=crop" },
  { id:"pr4", title:"The Pearl",         city:"Vadodara",   type:"RESIDENTIAL", status:"PRE_LAUNCH", totalUnits:150, unitsSold:0,   unitsAvailable:150, revenue:0,          inquiries:89,  startDate:new Date("2024-09-01"), completionDate:new Date("2027-01-31"), image:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&h=150&fit=crop" },
  { id:"pr5", title:"Commerce Hub",      city:"Surat",      type:"COMMERCIAL",  status:"LAUNCHED",   totalUnits:60,  unitsSold:38,  unitsAvailable:22,  revenue:380000000,  inquiries:156, startDate:new Date("2023-09-01"), completionDate:new Date("2025-12-31"), image:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop" },
]

export default function BuilderProjectsPage() {
  const [projects, setProjects] = useState(PROJECTS)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")
  const [page, setPage] = useState(1)
  const [menu, setMenu] = useState<string|null>(null)
  const PER_PAGE = 5

  const filtered = projects.filter(p =>
    (tab==="all" || p.status===tab) &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase()))
  )
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const totals = { units: projects.reduce((s,p)=>s+p.totalUnits,0), sold: projects.reduce((s,p)=>s+p.unitsSold,0), revenue: projects.reduce((s,p)=>s+p.revenue,0), inquiries: projects.reduce((s,p)=>s+p.inquiries,0) }

  return (
    <DashboardLayout user={MOCK_BUILDER as any}>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="page-title flex items-center gap-2"><Briefcase className="w-7 h-7 text-violet-500"/>My Projects</h1><p className="page-subtitle">{projects.length} projects · {totals.units} total units</p></div>
          <Link href="/dashboard/builder/projects/new" className="btn-gold self-start"><Plus className="w-4 h-4"/>New Project</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Total Projects",  value:projects.length,                     icon:<Briefcase className="w-5 h-5 text-violet-500"/>, color:"bg-violet-50" },
            { label:"Units Sold",      value:`${totals.sold}/${totals.units}`,    icon:<Home className="w-5 h-5 text-emerald-500"/>,     color:"bg-emerald-50" },
            { label:"Total Revenue",   value:formatCurrency(totals.revenue),      icon:<TrendingUp className="w-5 h-5 text-amber-500"/>, color:"bg-amber-50" },
            { label:"Total Inquiries", value:totals.inquiries.toLocaleString("en-IN"),icon:<Users className="w-5 h-5 text-blue-500"/>,  color:"bg-blue-50" },
          ].map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        <div className="card-flat p-4 space-y-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search projects…" className="max-w-sm"/>
          <Tabs tabs={[
            { value:"all",        label:"All",       count:projects.length },
            { value:"PRE_LAUNCH", label:"Pre-Launch", count:projects.filter(p=>p.status==="PRE_LAUNCH").length },
            { value:"LAUNCHED",   label:"Launched",  count:projects.filter(p=>p.status==="LAUNCHED").length },
            { value:"SOLD_OUT",   label:"Sold Out",  count:projects.filter(p=>p.status==="SOLD_OUT").length },
            { value:"COMPLETED",  label:"Completed", count:projects.filter(p=>p.status==="COMPLETED").length },
          ]} active={tab} onChange={v=>{setTab(v);setPage(1)}}/>
        </div>

        {paginated.length === 0 ? (
          <EmptyState icon={<Briefcase className="w-8 h-8 text-stone-300"/>} title="No projects found" description="Create your first real estate project." action={<Link href="/dashboard/builder/projects/new" className="btn-gold">New Project</Link>}/>
        ) : (
          <div className="space-y-4">
            {paginated.map(p => {
              const soldPct = p.totalUnits > 0 ? Math.round((p.unitsSold/p.totalUnits)*100) : 0
              return (
                <div key={p.id} className="card p-5 hover:shadow-card-hover transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-28 h-22 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 relative">
                      <img src={p.image} alt="" className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-body font-semibold text-stone-900">{p.title}</h3>
                            <Badge variant={STATUS_COLORS[p.status]||"stone"}>{p.status.replace("_"," ")}</Badge>
                          </div>
                          <p className="text-xs text-stone-400 font-body">{p.city} · {p.type} · {formatDate(p.startDate)} → {formatDate(p.completionDate)}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-display text-xl font-semibold text-stone-900">{formatCurrency(p.revenue)}</p>
                          <p className="text-xs text-stone-400 font-body">{p.inquiries} inquiries</p>
                        </div>
                      </div>

                      {/* Units progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs font-body mb-1.5">
                          <span className="text-stone-600">{p.unitsSold} units sold of {p.totalUnits}</span>
                          <span className="font-semibold text-stone-900">{soldPct}%</span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                          <div className="h-2 bg-gradient-gold rounded-full transition-all duration-500" style={{width:`${soldPct}%`}}/>
                        </div>
                        <div className="flex gap-4 mt-1.5">
                          <span className="text-[10px] font-body text-emerald-600">{p.unitsSold} sold</span>
                          <span className="text-[10px] font-body text-amber-600">{p.unitsAvailable} available</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        <Link href={`/dashboard/builder/projects/${p.id}`} className="btn-secondary text-xs py-1.5 px-3"><Eye className="w-3.5 h-3.5"/>Overview</Link>
                        <Link href={`/dashboard/builder/projects/${p.id}/properties`} className="btn-secondary text-xs py-1.5 px-3"><Home className="w-3.5 h-3.5"/>Units</Link>
                        <Link href={`/dashboard/builder/projects/${p.id}/analytics`} className="btn-secondary text-xs py-1.5 px-3"><TrendingUp className="w-3.5 h-3.5"/>Analytics</Link>
                        <Link href={`/dashboard/builder/projects/${p.id}/broker-network`} className="btn-secondary text-xs py-1.5 px-3"><Users className="w-3.5 h-3.5"/>Brokers</Link>
                        <div className="relative">
                          <button onClick={()=>setMenu(menu===p.id?null:p.id)} className="btn-icon p-1.5 text-xs"><MoreHorizontal className="w-4 h-4"/></button>
                          {menu===p.id&&(<>
                            <div className="fixed inset-0 z-10" onClick={()=>setMenu(null)}/>
                            <div className="absolute right-0 top-8 w-40 bg-white border border-stone-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                              <Link href={`/dashboard/builder/projects/${p.id}/edit`} onClick={()=>setMenu(null)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-stone-700 hover:bg-stone-50"><Edit className="w-4 h-4"/>Edit Project</Link>
                              <Link href={`/dashboard/builder/projects/${p.id}/properties/bulk-upload`} onClick={()=>setMenu(null)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-stone-700 hover:bg-stone-50">Bulk Upload</Link>
                            </div>
                          </>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs font-body text-stone-400">Showing {Math.min(filtered.length,(page-1)*PER_PAGE+1)}–{Math.min(filtered.length,page*PER_PAGE)} of {filtered.length}</p>
          <Pagination page={page} totalPages={totalPages} onChange={setPage}/>
        </div>
      </div>
    </DashboardLayout>
  )
}
