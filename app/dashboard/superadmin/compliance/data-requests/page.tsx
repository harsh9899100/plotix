"use client"
import Link from "next/link"
import { ArrowLeft, FileText, Download, Clock, CheckCircle, AlertCircle, User } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, StatCard } from "@/components/ui"
import { formatDate, formatTimeAgo } from "@/lib/utils"
import { useState } from "react"
import toast from "react-hot-toast"


const REQUESTS = [
  { id:"dr1", userId:"u-7823", name:"Ramesh Singh", email:"ramesh.singh@hotmail.com", type:"DELETION", reason:"No longer want to use the platform", status:"PENDING", submittedAt:new Date(Date.now()-24*3600000) },
  { id:"dr2", userId:"u-3341", name:"Pooja Kapoor", email:"pooja.k@mail.com", type:"ACCESS", reason:"Want a copy of all my personal data", status:"COMPLETED", submittedAt:new Date(Date.now()-7*86400000), completedAt:new Date(Date.now()-5*86400000) },
  { id:"dr3", userId:"u-5521", name:"Arjun Mehta", email:"arjun@demo.com", type:"CORRECTION", reason:"My phone number and city are incorrect", status:"IN_PROGRESS", submittedAt:new Date(Date.now()-3*86400000) },
]

const TYPE_LABELS: Record<string,string> = { DELETION:"Data Deletion (Right to Erase)", ACCESS:"Data Access (Right to Access)", CORRECTION:"Data Correction (Right to Rectification)" }
const STATUS_CFG: Record<string,any> = { PENDING:"amber", IN_PROGRESS:"blue", COMPLETED:"green", REJECTED:"rose" }

export default function DataRequestsPage() {
  const [requests, setRequests] = useState(REQUESTS)

  const process = (id: string, action: "complete"|"reject") => {
    setRequests(p => p.map(r => r.id === id ? { ...r, status: action === "complete" ? "COMPLETED" : "REJECTED" } : r))
    toast.success(action === "complete" ? "Request completed. User notified." : "Request rejected.")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/superadmin/compliance" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title flex items-center gap-2"><FileText className="w-7 h-7 text-blue-500"/>Data Requests</h1>
            <p className="page-subtitle">Process user data rights requests under DPDP Act 2023 and GDPR.</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-sm font-body text-blue-800">
          📋 <strong>Compliance Note:</strong> All data requests must be processed within <strong>30 days</strong> as per the Digital Personal Data Protection Act (DPDP) 2023.
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={requests.length} icon={<FileText className="w-5 h-5 text-stone-400"/>} color="bg-stone-100"/>
          <StatCard label="Pending" value={requests.filter(r=>r.status==="PENDING").length} icon={<Clock className="w-5 h-5 text-amber-500"/>} color="bg-amber-50"/>
          <StatCard label="In Progress" value={requests.filter(r=>r.status==="IN_PROGRESS").length} icon={<AlertCircle className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
          <StatCard label="Completed" value={requests.filter(r=>r.status==="COMPLETED").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
        </div>

        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className={`card p-5 ${req.status==="PENDING"?"border-amber-200 bg-amber-50/10":""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-stone-400"/></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-body font-semibold text-stone-900">{req.name}</p>
                      <Badge variant={STATUS_CFG[req.status]}>{req.status.replace("_"," ")}</Badge>
                    </div>
                    <p className="text-xs text-stone-400">{req.email} · User ID: {req.userId}</p>
                    <p className="text-sm font-body text-amber-700 mt-2 font-medium">{TYPE_LABELS[req.type]}</p>
                    <p className="text-sm text-stone-500 mt-1 italic">"{req.reason}"</p>
                    <p className="text-xs text-stone-400 mt-2">Submitted {formatTimeAgo(req.submittedAt)}</p>
                  </div>
                </div>
                {(req.status === "PENDING" || req.status === "IN_PROGRESS") && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={()=>process(req.id,"complete")} className="btn-success text-sm"><CheckCircle className="w-4 h-4"/>Complete</button>
                    <button onClick={()=>process(req.id,"reject")} className="btn-danger text-sm">Reject</button>
                    {req.type === "ACCESS" && <button className="btn-secondary text-sm"><Download className="w-4 h-4"/>Export Data</button>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
