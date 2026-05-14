"use client"
import { useState } from "react"
import { DollarSign, Download, CheckCircle, Clock, TrendingUp, Percent } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, StatCard, Tabs } from "@/components/ui"
import { formatDate, formatCurrency } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import toast from "react-hot-toast"


const COMMISSIONS = [
  { id:"c1", agent:"Priya Sharma", agency:"Sharma Realty", project:"Sky Residences", unit:"Unit 1204", salePrice:8500000, rate:2, gross:170000, tds:17000, net:153000, status:"PAID", paidAt:new Date(Date.now()-7*86400000) },
  { id:"c2", agent:"Rohan Mehta", agency:"MetroHomes", project:"Sky Residences", unit:"Unit 805", salePrice:6800000, rate:2, gross:136000, tds:13600, net:122400, status:"PENDING", paidAt:null },
  { id:"c3", agent:"Priya Sharma", agency:"Sharma Realty", project:"Harmony Villas", unit:"Villa B-05", salePrice:12000000, rate:2, gross:240000, tds:24000, net:216000, status:"PAID", paidAt:new Date(Date.now()-20*86400000) },
]

const MONTHLY_CHART = [
  { month:"Sep", commissions:122400 }, { month:"Oct", commissions:153000 },
  { month:"Nov", commissions:216000 }, { month:"Dec", commissions:0 },
]

export default function BuilderCommissionsPage() {
  const [tab, setTab] = useState("all")
  const filtered = tab === "all" ? COMMISSIONS : COMMISSIONS.filter(c => c.status === tab)
  const paidTotal = COMMISSIONS.filter(c => c.status === "PAID").reduce((a, c) => a + c.net, 0)
  const pendingTotal = COMMISSIONS.filter(c => c.status === "PENDING").reduce((a, c) => a + c.net, 0)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><DollarSign className="w-7 h-7 text-amber-500" />Agent Commissions</h1>
            <p className="page-subtitle">Track broker/agent commission payouts for unit sales.</p>
          </div>
          <button onClick={() => toast.success("Exporting commission statement...")} className="btn-secondary text-sm">
            <Download className="w-4 h-4" />Export
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Paid (Total)" value={formatCurrency(paidTotal)} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50" />
          <StatCard label="Pending" value={formatCurrency(pendingTotal)} icon={<Clock className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
          <StatCard label="Avg Rate" value="2%" icon={<Percent className="w-5 h-5 text-blue-500" />} color="bg-blue-50" />
          <StatCard label="Total Transactions" value={COMMISSIONS.length} icon={<TrendingUp className="w-5 h-5 text-violet-500" />} color="bg-violet-50" />
        </div>

        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-5">Monthly Commission Payouts</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="month" tick={{ fontSize:12, fill:"#78716c" }} />
              <YAxis tick={{ fontSize:11, fill:"#78716c" }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v:any) => formatCurrency(v)} contentStyle={{ borderRadius:"12px", border:"1px solid #e7e3dc" }} />
              <Bar dataKey="commissions" fill="#C9A07A" radius={[6,6,0,0]} name="Net Commission Paid" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <Tabs tabs={[{ value:"all", label:"All" }, { value:"PAID", label:"Paid" }, { value:"PENDING", label:"Pending" }]} active={tab} onChange={setTab} />

        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Agent</th><th>Unit</th><th>Sale Price</th><th>Commission</th><th>TDS</th><th>Net</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><p className="font-medium text-stone-900">{c.agent}</p><p className="text-xs text-stone-400">{c.agency}</p></td>
                  <td><p className="text-sm text-stone-700">{c.unit}</p><p className="text-xs text-stone-400">{c.project}</p></td>
                  <td className="text-sm">₹{(c.salePrice/100000).toFixed(0)}L</td>
                  <td className="text-sm">{formatCurrency(c.gross)} ({c.rate}%)</td>
                  <td className="text-sm text-rose-500">-{formatCurrency(c.tds)}</td>
                  <td className="font-medium text-emerald-700">{formatCurrency(c.net)}</td>
                  <td><Badge variant={c.status === "PAID" ? "green" : "amber"}>{c.status}</Badge></td>
                  <td className="text-xs text-stone-400">{c.paidAt ? formatDate(c.paidAt) : "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
