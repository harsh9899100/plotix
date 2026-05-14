"use client"
import { BarChart2, Eye, Heart, MessageSquare, Phone, Download } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Select } from "@/components/ui"
import { useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const MONTHLY = [
  { month:"Jun", views:42, inquiries:3 }, { month:"Jul", views:68, inquiries:5 },
  { month:"Aug", views:55, inquiries:4 }, { month:"Sep", views:91, inquiries:8 },
  { month:"Oct", views:74, inquiries:6 }, { month:"Nov", views:112, inquiries:9 },
]
const PROPS = [
  { name:"3BHK in Adajan", views:342, inquiries:7, saved:28, calls:4 },
  { name:"2BHK in Piplod", views:187, inquiries:3, saved:14, calls:2 },
  { name:"Plot in Dumas", views:93, inquiries:1, saved:8, calls:0 },
]

export default function OwnerAnalyticsPage() {
  const [period, setPeriod] = useState("6months")
  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="page-title flex items-center gap-2"><BarChart2 className="w-7 h-7 text-amber-500"/>Property Analytics</h1><p className="page-subtitle">Track how your listings are performing.</p></div>
          <Select value={period} onChange={e=>setPeriod(e.target.value)} options={[{value:"1month",label:"Last Month"},{value:"3months",label:"3 Months"},{value:"6months",label:"6 Months"}]}/>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[{label:"Total Views",value:622,icon:Eye,color:"bg-blue-50"},{label:"Inquiries",value:11,icon:MessageSquare,color:"bg-violet-50"},{label:"Saved",value:50,icon:Heart,color:"bg-rose-50"},{label:"Phone Calls",value:6,icon:Phone,color:"bg-amber-50"}].map(s=>(
            <div key={s.label} className={`card-flat p-4 ${s.color}`}>
              <p className="text-xs text-stone-400 uppercase font-body">{s.label}</p>
              <p className="font-display text-3xl font-light text-stone-900">{s.value}</p>
              <p className="text-xs text-emerald-600 mt-1">↑ this month</p>
            </div>
          ))}
        </div>
        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-5">Views Over Time</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={MONTHLY}>
              <defs><linearGradient id="ownerViewsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A07A" stopOpacity={0.3}/><stop offset="95%" stopColor="#C9A07A" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8"/>
              <XAxis dataKey="month" tick={{fontSize:12,fill:"#78716c"}}/>
              <YAxis tick={{fontSize:11,fill:"#78716c"}}/>
              <Tooltip contentStyle={{borderRadius:"12px",border:"1px solid #e7e3dc"}}/>
              <Area type="monotone" dataKey="views" stroke="#C9A07A" strokeWidth={2.5} fill="url(#ownerViewsGrad)" name="Views"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-4">Performance by Property</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Property</th><th>Views</th><th>Inquiries</th><th>Saved</th><th>Calls</th><th>Conv. Rate</th></tr></thead>
              <tbody>
                {PROPS.map(p=>(
                  <tr key={p.name}>
                    <td className="font-medium text-stone-900">{p.name}</td>
                    <td>{p.views}</td><td>{p.inquiries}</td><td>{p.saved}</td><td>{p.calls}</td>
                    <td className="text-emerald-600 font-medium">{((p.inquiries/p.views)*100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
