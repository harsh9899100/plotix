"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, TrendingUp, Download, Eye, CheckCircle, Clock, XCircle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, SearchInput, Tabs, Pagination } from "@/components/ui"
import { formatDateTime, formatCurrency } from "@/lib/utils"


const TRANSACTIONS = [
  { id:"t1", ref:"TXN-2024-09841", user:"Arjun Mehta", email:"arjun@demo.com", type:"PLATFORM_FEE", amount:25000, tax:4500, total:29500, method:"UPI", status:"SUCCESS", date:new Date(Date.now()-2*3600000) },
  { id:"t2", ref:"TXN-2024-09842", user:"Priya Sharma", email:"priya@agency.com", type:"COMMISSION", amount:85000, tax:15300, total:100300, method:"NEFT", status:"SUCCESS", date:new Date(Date.now()-5*3600000) },
  { id:"t3", ref:"TXN-2024-09843", user:"Karan Developers", email:"karan@builders.com", type:"SUBSCRIPTION", amount:9999, tax:1800, total:11799, method:"CARD", status:"SUCCESS", date:new Date(Date.now()-8*3600000) },
  { id:"t4", ref:"TXN-2024-09844", user:"Rohan Mehta", email:"rohan@realty.in", type:"PLATFORM_FEE", amount:15000, tax:2700, total:17700, method:"UPI", status:"FAILED", date:new Date(Date.now()-12*3600000) },
  { id:"t5", ref:"TXN-2024-09845", user:"Meera Patel", email:"meera.patel@email.com", type:"FEATURED_LISTING", amount:4999, tax:900, total:5899, method:"CARD", status:"PENDING", date:new Date(Date.now()-24*3600000) },
]

const TYPE_CFG: Record<string,any> = { PLATFORM_FEE:"stone", COMMISSION:"amber", SUBSCRIPTION:"blue", FEATURED_LISTING:"violet" }
const STATUS_CFG: Record<string,{variant:any;icon:any}> = {
  SUCCESS: { variant:"green",  icon:CheckCircle },
  FAILED:  { variant:"rose",   icon:XCircle },
  PENDING: { variant:"amber",  icon:Clock },
}

export default function AdminTransactionsPage() {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")
  const [page, setPage] = useState(1)

  const filtered = TRANSACTIONS.filter(t => {
    const matchSearch = !search || t.user.toLowerCase().includes(search.toLowerCase()) || t.ref.includes(search)
    const matchTab = tab === "all" || t.status === tab
    return matchSearch && matchTab
  })

  const totalRevenue = TRANSACTIONS.filter(t=>t.status==="SUCCESS").reduce((a,t) => a+t.total, 0)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><CreditCard className="w-7 h-7 text-violet-500"/>Transactions</h1>
            <p className="page-subtitle">All platform payment transactions.</p>
          </div>
          <button className="btn-secondary text-sm"><Download className="w-4 h-4"/>Export</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Total Revenue", value:formatCurrency(totalRevenue), color:"bg-amber-50" },
            { label:"Successful", value:TRANSACTIONS.filter(t=>t.status==="SUCCESS").length, color:"bg-emerald-50" },
            { label:"Failed", value:TRANSACTIONS.filter(t=>t.status==="FAILED").length, color:"bg-rose-50" },
            { label:"Pending", value:TRANSACTIONS.filter(t=>t.status==="PENDING").length, color:"bg-blue-50" },
          ].map(s => (
            <div key={s.label} className={`card-flat p-4 ${s.color}`}>
              <p className="text-xs text-stone-400 uppercase font-body">{s.label}</p>
              <p className="font-display text-2xl font-light text-stone-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by user or reference..." className="flex-1 max-w-sm"/>
          <Tabs tabs={[{value:"all",label:"All"},{value:"SUCCESS",label:"Successful"},{value:"FAILED",label:"Failed"},{value:"PENDING",label:"Pending"}]}
            active={tab} onChange={setTab}/>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Reference</th><th>User</th><th>Type</th><th>Amount</th><th>Tax</th><th>Total</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {filtered.map(t => {
                const cfg = STATUS_CFG[t.status]
                return (
                  <tr key={t.id}>
                    <td><span className="font-mono text-xs text-stone-600">{t.ref}</span></td>
                    <td><p className="font-medium text-stone-900 text-sm">{t.user}</p><p className="text-xs text-stone-400">{t.email}</p></td>
                    <td><Badge variant={TYPE_CFG[t.type]}>{t.type.replace("_"," ")}</Badge></td>
                    <td className="text-sm text-stone-700">₹{t.amount.toLocaleString()}</td>
                    <td className="text-sm text-stone-400">₹{t.tax.toLocaleString()}</td>
                    <td className="font-medium text-stone-900">₹{t.total.toLocaleString()}</td>
                    <td><span className="text-xs text-stone-500">{t.method}</span></td>
                    <td><Badge variant={cfg.variant}><cfg.icon className="w-3 h-3"/>{t.status}</Badge></td>
                    <td className="text-xs text-stone-400">{formatDateTime(t.date)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center"><Pagination page={page} totalPages={5} onChange={setPage}/></div>
      </div>
    </DashboardLayout>
  )
}
