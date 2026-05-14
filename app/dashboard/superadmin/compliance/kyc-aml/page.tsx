"use client"
import { useState } from "react"
import { Shield, CheckCircle, Clock, AlertCircle, Filter, Download, Eye, Search } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, SearchInput, Tabs, StatCard } from "@/components/ui"
import { formatDateTime, formatTimeAgo } from "@/lib/utils"

const KYC_RECORDS = [
  { id:"k1", name:"Priya Sharma", role:"AGENT", email:"priya@agency.com", rera:"RERA-GUJ-AGT-2024-1234", doc:"Aadhaar + PAN + RERA Certificate", status:"VERIFIED", submittedAt:new Date(Date.now()-10*86400000), verifiedAt:new Date(Date.now()-9*86400000) },
  { id:"k2", name:"Karan Developers Ltd", role:"BUILDER", email:"karan@builders.com", rera:"RERA-GUJ-DEV-2023-0045", doc:"GST + Company Registration + RERA", status:"VERIFIED", submittedAt:new Date(Date.now()-30*86400000), verifiedAt:new Date(Date.now()-29*86400000) },
  { id:"k3", name:"Kavita Joshi", role:"AGENT", email:"kavita.j@estates.com", rera:"RERA-GUJ-AGT-2024-2210", doc:"Aadhaar + PAN + RERA Certificate", status:"PENDING", submittedAt:new Date(Date.now()-2*86400000), verifiedAt:null },
  { id:"k4", name:"Nexus Builders Pvt Ltd", role:"BUILDER", email:"nexus@builders.net", rera:"RERA-GUJ-DEV-2024-0099", doc:"GST + Company Registration", status:"UNDER_REVIEW", submittedAt:new Date(Date.now()-5*86400000), verifiedAt:null },
  { id:"k5", name:"Vijay Kumar", role:"AGENT", email:"vijay@homes.com", rera:"RERA-GUJ-AGT-2022-0234", doc:"Aadhaar + PAN", status:"REJECTED", submittedAt:new Date(Date.now()-15*86400000), verifiedAt:null },
]

const STATUS_CFG: Record<string,{variant:any;icon:any}> = {
  VERIFIED:      { variant:"green",  icon:CheckCircle },
  PENDING:       { variant:"amber",  icon:Clock },
  UNDER_REVIEW:  { variant:"blue",   icon:Eye },
  REJECTED:      { variant:"rose",   icon:AlertCircle },
}

export default function KycAmlPage() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = KYC_RECORDS.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === "all" || r.status === tab
    return matchSearch && matchTab
  })

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Shield className="w-7 h-7 text-blue-500"/>KYC / AML Compliance</h1>
            <p className="page-subtitle">Verify identities and ensure regulatory compliance for all professionals.</p>
          </div>
          <button className="btn-secondary text-sm"><Download className="w-4 h-4"/> Export Report</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Verified" value={KYC_RECORDS.filter(r=>r.status==="VERIFIED").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Pending" value={KYC_RECORDS.filter(r=>r.status==="PENDING").length} icon={<Clock className="w-5 h-5 text-amber-500"/>} color="bg-amber-50"/>
          <StatCard label="Under Review" value={KYC_RECORDS.filter(r=>r.status==="UNDER_REVIEW").length} icon={<Eye className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
          <StatCard label="Rejected" value={KYC_RECORDS.filter(r=>r.status==="REJECTED").length} icon={<AlertCircle className="w-5 h-5 text-rose-500"/>} color="bg-rose-50"/>
        </div>

        <div className="flex flex-wrap gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email..." className="flex-1 max-w-sm"/>
          <Tabs tabs={[{value:"all",label:"All"},{value:"PENDING",label:"Pending"},{value:"UNDER_REVIEW",label:"Review"},{value:"VERIFIED",label:"Verified"},{value:"REJECTED",label:"Rejected"}]}
            active={tab} onChange={setTab}/>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Name</th><th>Role</th><th>RERA / Reg</th><th>Documents</th><th>Status</th><th>Submitted</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(r => {
                const cfg = STATUS_CFG[r.status]
                return (
                  <tr key={r.id}>
                    <td>
                      <p className="font-medium text-stone-900">{r.name}</p>
                      <p className="text-xs text-stone-400">{r.email}</p>
                    </td>
                    <td><span className="text-sm font-body text-stone-600">{r.role}</span></td>
                    <td><span className="text-xs font-mono text-stone-500">{r.rera}</span></td>
                    <td><span className="text-xs text-stone-500">{r.doc}</span></td>
                    <td>
                      <Badge variant={cfg.variant}>
                        <cfg.icon className="w-3 h-3"/>{r.status.replace("_"," ")}
                      </Badge>
                    </td>
                    <td className="text-xs text-stone-400">{formatTimeAgo(r.submittedAt)}</td>
                    <td>
                      <div className="flex gap-2">
                        {r.status === "PENDING" || r.status === "UNDER_REVIEW" ? (
                          <>
                            <button className="btn-ghost text-xs py-1 px-2 text-emerald-600 hover:bg-emerald-50">Verify</button>
                            <button className="btn-ghost text-xs py-1 px-2 text-rose-600 hover:bg-rose-50">Reject</button>
                          </>
                        ) : (
                          <button className="btn-ghost text-xs py-1 px-2"><Eye className="w-3.5 h-3.5"/>View</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
