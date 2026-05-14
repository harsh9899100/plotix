"use client"
import { useState } from "react"
import { Activity, Download, Filter, Search, Eye } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, SearchInput, Pagination, EmptyState } from "@/components/ui"
import { formatDateTime, cn } from "@/lib/utils"

const MOCK_ADMIN = { id:"admin1", firstName:"Admin", lastName:"User", role:"ADMIN", email:"admin@plotix.in" }

const ACTION_COLORS: Record<string,string> = {
  create:"green", update:"amber", delete:"rose", login:"blue", logout:"stone",
  approve:"green", reject:"rose", suspend:"amber", activate:"green", publish:"blue",
}

const MOCK_LOGS = [
  { id:"l1",  userId:"admin1", userName:"Admin Neha",    action:"approve",  entityType:"property", entityId:"p123", description:'Approved property "4BHK Penthouse Vesu"',       ipAddress:"103.21.44.1",  createdAt:new Date(Date.now()-300000) },
  { id:"l2",  userId:"u1",     userName:"Arjun Mehta",   action:"create",   entityType:"inquiry",  entityId:"inq45",description:'New inquiry on "Modern 3BHK Adajan"',           ipAddress:"49.36.142.8",  createdAt:new Date(Date.now()-900000) },
  { id:"l3",  userId:"admin2", userName:"Admin Raj",     action:"suspend",  entityType:"user",     entityId:"u99",  description:'Suspended user account: spam@test.com',           ipAddress:"103.21.44.2",  createdAt:new Date(Date.now()-1800000) },
  { id:"l4",  userId:"a1",     userName:"Priya Sharma",  action:"create",   entityType:"property", entityId:"p124", description:'Listed new property "Commercial Space Athwa"',   ipAddress:"49.36.142.9",  createdAt:new Date(Date.now()-3600000) },
  { id:"l5",  userId:"admin1", userName:"Admin Neha",    action:"publish",  entityType:"blog_post",entityId:"bp12", description:'Published blog: "Surat Real Estate Trends 2024"',ipAddress:"103.21.44.1",  createdAt:new Date(Date.now()-7200000) },
  { id:"l6",  userId:"u2",     userName:"Priya Desai",   action:"login",    entityType:"user",     entityId:"u2",   description:"User login from Ahmedabad",                       ipAddress:"117.197.3.12", createdAt:new Date(Date.now()-10800000) },
  { id:"l7",  userId:"admin2", userName:"Admin Raj",     action:"update",   entityType:"settings", entityId:"cfg1", description:"Updated commission rate: Agent 3% → 4%",          ipAddress:"103.21.44.2",  createdAt:new Date(Date.now()-14400000) },
  { id:"l8",  userId:"b1",     userName:"Vikram Patel",  action:"create",   entityType:"project",  entityId:"pr5",  description:'New project created: "Commerce Hub Surat"',       ipAddress:"202.134.4.5",  createdAt:new Date(Date.now()-18000000) },
  { id:"l9",  userId:"admin1", userName:"Admin Neha",    action:"reject",   entityType:"property", entityId:"p125", description:"Rejected property: fraudulent listing detected",   ipAddress:"103.21.44.1",  createdAt:new Date(Date.now()-21600000) },
  { id:"l10", userId:"u3",     userName:"Rahul Gupta",   action:"delete",   entityType:"inquiry",  entityId:"inq46",description:"Deleted inquiry on property",                      ipAddress:"49.36.142.10", createdAt:new Date(Date.now()-25200000) },
  { id:"l11", userId:"admin2", userName:"Admin Raj",     action:"activate", entityType:"user",     entityId:"u100", description:"Reactivated suspended user account",               ipAddress:"103.21.44.2",  createdAt:new Date(Date.now()-28800000) },
  { id:"l12", userId:"a2",     userName:"Rohan Mehta",   action:"update",   entityType:"property", entityId:"p120", description:"Updated property price: ₹92L → ₹88L",              ipAddress:"117.197.3.15", createdAt:new Date(Date.now()-32400000) },
]

const ACTION_OPTIONS = ["","create","update","delete","login","approve","reject","suspend","activate","publish"]
const ENTITY_OPTIONS = ["","property","user","inquiry","project","blog_post","settings"]

export default function AuditLogsPage() {
  const [search, setSearch]   = useState("")
  const [action, setAction]   = useState("")
  const [entity, setEntity]   = useState("")
  const [page, setPage]       = useState(1)
  const PER_PAGE = 8

  const filtered = MOCK_LOGS.filter(l =>
    (!search || l.description.toLowerCase().includes(search.toLowerCase()) || l.userName.toLowerCase().includes(search.toLowerCase())) &&
    (!action || l.action === action) &&
    (!entity || l.entityType === entity)
  )
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  return (
    <DashboardLayout user={MOCK_ADMIN as any}>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="page-title flex items-center gap-2"><Activity className="w-7 h-7 text-stone-500"/>Audit Logs</h1><p className="page-subtitle">Complete activity trail for all platform actions.</p></div>
          <button className="btn-secondary text-sm self-start"><Download className="w-4 h-4"/>Export Logs</button>
        </div>

        <div className="card-flat p-4 flex flex-col sm:flex-row gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search actions or users…" className="flex-1 max-w-sm"/>
          <div className="flex gap-2">
            <select value={action} onChange={e=>setAction(e.target.value)} className="select text-sm py-2 w-36">
              <option value="">All Actions</option>
              {ACTION_OPTIONS.filter(Boolean).map(a=><option key={a} value={a}>{a.charAt(0).toUpperCase()+a.slice(1)}</option>)}
            </select>
            <select value={entity} onChange={e=>setEntity(e.target.value)} className="select text-sm py-2 w-40">
              <option value="">All Entities</option>
              {ENTITY_OPTIONS.filter(Boolean).map(e=><option key={e} value={e}>{e.replace("_"," ")}</option>)}
            </select>
          </div>
        </div>

        {paginated.length === 0 ? (
          <EmptyState icon={<Activity className="w-8 h-8 text-stone-300"/>} title="No logs found" description="Try adjusting your filters."/>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Description</th>
                  <th className="hidden md:table-cell">Entity</th>
                  <th className="hidden lg:table-cell">User</th>
                  <th className="hidden xl:table-cell">IP Address</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(log=>(
                  <tr key={log.id}>
                    <td>
                      <Badge variant={(ACTION_COLORS[log.action]||"stone") as any} className="capitalize text-[10px]">
                        {log.action}
                      </Badge>
                    </td>
                    <td>
                      <p className="text-sm font-body text-stone-700 max-w-xs truncate">{log.description}</p>
                    </td>
                    <td className="hidden md:table-cell">
                      <span className="text-xs font-body font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full capitalize">{log.entityType.replace("_"," ")}</span>
                    </td>
                    <td className="hidden lg:table-cell">
                      <p className="text-sm font-body text-stone-700">{log.userName}</p>
                    </td>
                    <td className="hidden xl:table-cell">
                      <code className="text-xs text-stone-500">{log.ipAddress}</code>
                    </td>
                    <td>
                      <p className="text-xs font-body text-stone-500 whitespace-nowrap">{formatDateTime(log.createdAt)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs font-body text-stone-400">Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length} entries</p>
          <Pagination page={page} totalPages={totalPages} onChange={setPage}/>
        </div>
      </div>
    </DashboardLayout>
  )
}
