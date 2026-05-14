"use client"
import { useState } from "react"
import { DollarSign, TrendingUp, Download, Clock, CheckCircle, AlertCircle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, StatCard, Tabs, Pagination } from "@/components/ui"
import { formatCurrency, formatDate, cn } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"


const COMMISSIONS = [
  { id:"c1", propertyTitle:"Luxurious 4BHK Penthouse Vesu",       salePrice:18500000, rate:4, amount:740000,  status:"PAID",    paidAt:new Date(Date.now()-7*86400000),   transactionId:"TXN-2024-001" },
  { id:"c2", propertyTitle:"Spectacular Villa SG Highway",          salePrice:45000000, rate:4, amount:1800000, status:"PAID",    paidAt:new Date(Date.now()-21*86400000),  transactionId:"TXN-2024-002" },
  { id:"c3", propertyTitle:"Modern 3BHK Apartment Adajan",         salePrice:9200000,  rate:4, amount:368000,  status:"PENDING", paidAt:null,                              transactionId:"TXN-2024-003" },
  { id:"c4", propertyTitle:"Premium Office Space Athwa",           salePrice:25000000, rate:3, amount:750000,  status:"PAID",    paidAt:new Date(Date.now()-45*86400000),  transactionId:"TXN-2024-004" },
  { id:"c5", propertyTitle:"Row House Baner Pune",                  salePrice:16500000, rate:4, amount:660000,  status:"PENDING", paidAt:null,                              transactionId:"TXN-2024-005" },
  { id:"c6", propertyTitle:"Sea-View 4BHK Worli Mumbai",           salePrice:120000000,rate:3, amount:3600000, status:"PAID",    paidAt:new Date(Date.now()-60*86400000),  transactionId:"TXN-2024-006" },
  { id:"c7", propertyTitle:"IT Office Koramangala Bangalore",      salePrice:75000,    rate:5, amount:3750,    status:"CANCELLED",paidAt:null,                             transactionId:"TXN-2024-007" },
]

const MONTHLY = [
  { month:"Jul", amount:740000 },{ month:"Aug", amount:1800000 },{ month:"Sep", amount:368000 },
  { month:"Oct", amount:750000 },{ month:"Nov", amount:660000  },{ month:"Dec", amount:3600000 },
]

const STATUS_CONFIG: Record<string,{variant:any; icon:any}> = {
  PAID:      { variant:"green",  icon:CheckCircle },
  PENDING:   { variant:"amber",  icon:Clock },
  CANCELLED: { variant:"rose",   icon:AlertCircle },
}

export default function AgentCommissionsPage() {
  const [tab, setTab] = useState("all")
  const [page, setPage] = useState(1)
  const PER_PAGE = 5

  const filtered = COMMISSIONS.filter(c => tab==="all" || c.status===tab)
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)
  const totalPages = Math.ceil(filtered.length/PER_PAGE)

  const totals = {
    paid:    COMMISSIONS.filter(c=>c.status==="PAID").reduce((s,c)=>s+c.amount,0),
    pending: COMMISSIONS.filter(c=>c.status==="PENDING").reduce((s,c)=>s+c.amount,0),
    total:   COMMISSIONS.reduce((s,c)=>s+(c.status!=="CANCELLED"?c.amount:0),0),
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="page-title flex items-center gap-2"><DollarSign className="w-7 h-7 text-emerald-600"/>Commission Tracking</h1><p className="page-subtitle">Track all earned and pending commissions.</p></div>
          <button className="btn-secondary text-sm self-start"><Download className="w-4 h-4"/>Export Statement</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"Total Earned",   value:formatCurrency(totals.paid),    change:"All time",    changeType:"up" as const, icon:<CheckCircle className="w-5 h-5 text-emerald-500"/>, color:"bg-emerald-50" },
            { label:"Pending Payout", value:formatCurrency(totals.pending), change:"Awaiting",    changeType:"neutral" as const, icon:<Clock className="w-5 h-5 text-amber-500"/>,    color:"bg-amber-50" },
            { label:"Total Pipeline", value:formatCurrency(totals.total),   change:"Incl. pending",changeType:"up" as const, icon:<TrendingUp className="w-5 h-5 text-blue-500"/>,   color:"bg-blue-50" },
          ].map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        {/* Chart */}
        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-5">Monthly Commission (Last 6 months)</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY} margin={{top:4,right:4,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:11,fontFamily:"var(--font-dm-sans)",fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fontFamily:"var(--font-dm-sans)",fill:"#9ca3af"}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/100000).toFixed(0)}L`}/>
                <Tooltip contentStyle={{fontFamily:"var(--font-dm-sans)",fontSize:12,borderRadius:12,border:"1px solid #e7e5e4"}} formatter={(v:any)=>[`₹${(v/100000).toFixed(2)}L`,"Commission"]}/>
                <Bar dataKey="amount" fill="#C9A07A" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="card-flat p-5">
          <div className="mb-4">
            <Tabs tabs={[
              {value:"all",       label:"All",       count:COMMISSIONS.length},
              {value:"PAID",      label:"Paid",      count:COMMISSIONS.filter(c=>c.status==="PAID").length},
              {value:"PENDING",   label:"Pending",   count:COMMISSIONS.filter(c=>c.status==="PENDING").length},
              {value:"CANCELLED", label:"Cancelled", count:COMMISSIONS.filter(c=>c.status==="CANCELLED").length},
            ]} active={tab} onChange={v=>{setTab(v);setPage(1)}}/>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th className="hidden md:table-cell">Sale Price</th>
                  <th className="hidden sm:table-cell">Rate</th>
                  <th>Commission</th>
                  <th>Status</th>
                  <th className="hidden lg:table-cell">Date Paid</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(c=>{
                  const cfg = STATUS_CONFIG[c.status]
                  return (
                    <tr key={c.id}>
                      <td>
                        <p className="font-body font-medium text-stone-900 text-sm truncate max-w-[200px]">{c.propertyTitle}</p>
                        <p className="text-[10px] font-mono text-stone-400 mt-0.5">{c.transactionId}</p>
                      </td>
                      <td className="hidden md:table-cell text-sm font-body text-stone-600">{formatCurrency(c.salePrice)}</td>
                      <td className="hidden sm:table-cell"><span className="text-xs font-body font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">{c.rate}%</span></td>
                      <td><span className="font-body font-bold text-stone-900">{formatCurrency(c.amount)}</span></td>
                      <td><Badge variant={cfg.variant}><cfg.icon className="w-3 h-3"/>{c.status}</Badge></td>
                      <td className="hidden lg:table-cell text-sm font-body text-stone-500">{c.paidAt ? formatDate(c.paidAt) : "—"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs font-body text-stone-400">{filtered.length} records</p>
            <Pagination page={page} totalPages={totalPages} onChange={setPage}/>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
