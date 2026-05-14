"use client"
import { useState } from "react"
import { BarChart2, TrendingUp, Users, Home, DollarSign, Eye, MapPin, Calendar } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Select } from "@/components/ui"
import { formatCurrency } from "@/lib/utils"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const MONTHLY = [
  { month:"Jun", users:89, properties:32, inquiries:142, deals:8 },
  { month:"Jul", users:112, properties:41, inquiries:188, deals:12 },
  { month:"Aug", users:98, properties:36, inquiries:165, deals:9 },
  { month:"Sep", users:134, properties:55, inquiries:221, deals:16 },
  { month:"Oct", users:121, properties:48, inquiries:198, deals:14 },
  { month:"Nov", users:158, properties:67, inquiries:258, deals:19 },
]

export default function AdminAnalyticsOverviewPage() {
  const [period, setPeriod] = useState("6months")

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><BarChart2 className="w-7 h-7 text-amber-500" />Analytics Overview</h1>
            <p className="page-subtitle">Monitor platform growth and key activity metrics.</p>
          </div>
          <Select value={period} onChange={e => setPeriod(e.target.value)}
            options={[{ value:"1month", label:"Last Month" }, { value:"3months", label:"3 Months" }, { value:"6months", label:"6 Months" }]} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"New Users", value:MONTHLY.reduce((a,m)=>a+m.users,0), icon:Users, color:"bg-blue-50" },
            { label:"New Listings", value:MONTHLY.reduce((a,m)=>a+m.properties,0), icon:Home, color:"bg-emerald-50" },
            { label:"Inquiries", value:MONTHLY.reduce((a,m)=>a+m.inquiries,0), icon:Eye, color:"bg-violet-50" },
            { label:"Deals Closed", value:MONTHLY.reduce((a,m)=>a+m.deals,0), icon:TrendingUp, color:"bg-amber-50" },
          ].map(s => (
            <div key={s.label} className={`card-flat p-4 ${s.color}`}>
              <p className="text-xs text-stone-400 uppercase font-body">{s.label}</p>
              <p className="font-display text-3xl font-light text-stone-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-5">User & Listing Growth</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={MONTHLY}>
              <defs>
                <linearGradient id="adUsersGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                <linearGradient id="adPropsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4ade80" stopOpacity={0.25}/><stop offset="95%" stopColor="#4ade80" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="month" tick={{ fontSize:12, fill:"#78716c" }} />
              <YAxis tick={{ fontSize:11, fill:"#78716c" }} />
              <Tooltip contentStyle={{ borderRadius:"12px", border:"1px solid #e7e3dc" }} />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fill="url(#adUsersGrad)" name="New Users" />
              <Area type="monotone" dataKey="properties" stroke="#4ade80" strokeWidth={2} fill="url(#adPropsGrad)" name="New Listings" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-5">Deals & Inquiries</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="month" tick={{ fontSize:12, fill:"#78716c" }} />
              <YAxis tick={{ fontSize:11, fill:"#78716c" }} />
              <Tooltip contentStyle={{ borderRadius:"12px", border:"1px solid #e7e3dc" }} />
              <Bar dataKey="inquiries" fill="#c4b5fd" radius={[4,4,0,0]} name="Inquiries" />
              <Bar dataKey="deals" fill="#C9A07A" radius={[4,4,0,0]} name="Deals" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  )
}
