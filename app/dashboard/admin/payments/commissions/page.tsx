"use client"
import { useState } from "react"
import { DollarSign, Download, TrendingUp, CheckCircle, Clock, Eye } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, Tabs, SearchInput, StatCard } from "@/components/ui"
import { formatDate, formatCurrency } from "@/lib/utils"

const COMMISSIONS = [
  { id:"c1", agent:"Priya Sharma", agentCity:"Surat", property:"Luxurious 4BHK Penthouse in Vesu", buyer:"Arjun Mehta", salePrice:38500000, rate:2, gross:770000, tds:77000, net:693000, status:"PAID", paidAt:new Date(Date.now()-5*86400000) },
  { id:"c2", agent:"Rohan Mehta", agentCity:"Ahmedabad", property:"3BHK in SG Highway", buyer:"Meera Patel", salePrice:12500000, rate:2, gross:250000, tds:25000, net:225000, status:"PAID", paidAt:new Date(Date.now()-12*86400000) },
  { id:"c3", agent:"Kavita Joshi", agentCity:"Vadodara", property:"Villa in Alkapuri", buyer:"Rajesh Kumar", salePrice:18000000, rate:2, gross:360000, tds:36000, net:324000, status:"PENDING", paidAt:null },
  { id:"c4", agent:"Priya Sharma", agentCity:"Surat", property:"2BHK in Adajan", buyer:"Kiran Kapoor", salePrice:5500000, rate:2, gross:110000, tds:11000, net:99000, status:"PROCESSING", paidAt:null },
]

const STATUS_CFG: Record<string,any> = { PAID:"green", PENDING:"amber", PROCESSING:"blue" }

export default function AdminCommissionsPage() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = COMMISSIONS.filter(c => {
    const matchSearch = !search || c.agent.toLowerCase().includes(search.toLowerCase()) || c.property.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === "all" || c.status === tab
    return matchSearch && matchTab
  })

  const totalNet = COMMISSIONS.filter(c=>c.status==="PAID").reduce((a,c)=>a+c.net,0)
  const pending = COMMISSIONS.filter(c=>c.status!=="PAID").reduce((a,c)=>a+c.net,0)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="page-title flex items-center gap-2"><DollarSign className="w-7 h-7 text-amber-500"/>Commissions</h1><p className="page-subtitle">Track and manage all agent commission payouts.</p></div>
          <button className="btn-secondary text-sm"><Download className="w-4 h-4"/>Export</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Paid (This Month)" value={formatCurrency(totalNet)} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Pending Payout" value={formatCurrency(pending)} icon={<Clock className="w-5 h-5 text-amber-500"/>} color="bg-amber-50"/>
          <StatCard label="Paid Records" value={COMMISSIONS.filter(c=>c.status==="PAID").length} icon={<DollarSign className="w-5 h-5 text-violet-500"/>} color="bg-violet-50"/>
          <StatCard label="Total Transactions" value={COMMISSIONS.length} icon={<TrendingUp className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
        </div>

        <div className="flex gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search agent or property..." className="flex-1 max-w-sm"/>
          <Tabs tabs={[{value:"all",label:"All"},{value:"PAID",label:"Paid"},{value:"PENDING",label:"Pending"},{value:"PROCESSING",label:"Processing"}]} active={tab} onChange={setTab}/>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Agent</th><th>Property</th><th>Buyer</th><th>Sale Price</th><th>Commission</th><th>TDS</th><th>Net Payout</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><p className="font-medium text-stone-900">{c.agent}</p><p className="text-xs text-stone-400">{c.agentCity}</p></td>
                  <td className="text-sm text-stone-700 max-w-[200px] truncate">{c.property}</td>
                  <td className="text-sm text-stone-600">{c.buyer}</td>
                  <td className="text-sm text-stone-700">₹{(c.salePrice/100000).toFixed(0)}L</td>
                  <td className="text-sm text-stone-600">{formatCurrency(c.gross)} ({c.rate}%)</td>
                  <td className="text-sm text-rose-500">-{formatCurrency(c.tds)}</td>
                  <td className="font-medium text-emerald-700">{formatCurrency(c.net)}</td>
                  <td><Badge variant={STATUS_CFG[c.status]}>{c.status}</Badge></td>
                  <td className="text-xs text-stone-400">{c.paidAt ? formatDate(c.paidAt) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
