"use client"
import { useState } from "react"
import { Users, User, Building2, Home, TrendingUp, Search } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { StatCard, SearchInput } from "@/components/ui"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"


const MONTHLY_GROWTH = [
  { month:"Jun", buyers:320, agents:24, builders:4, owners:68 },
  { month:"Jul", buyers:380, agents:28, builders:5, owners:79 },
  { month:"Aug", buyers:410, agents:31, builders:5, owners:88 },
  { month:"Sep", buyers:460, agents:35, builders:6, owners:101 },
  { month:"Oct", buyers:510, agents:38, builders:7, owners:115 },
  { month:"Nov", buyers:580, agents:42, builders:8, owners:128 },
]

const ROLE_CARDS = [
  { title:"Buyers", total:580, active:512, growth:"+12%", icon:User, color:"bg-blue-50 text-blue-600", href:"/dashboard/admin/users/buyers" },
  { title:"Agents", total:42, active:38, growth:"+10%", icon:Users, color:"bg-violet-50 text-violet-600", href:"/dashboard/admin/users/agents" },
  { title:"Builders", total:8, active:7, growth:"+2", icon:Building2, color:"bg-amber-50 text-amber-600", href:"/dashboard/admin/users/builders" },
  { title:"Owners", total:128, active:119, growth:"+13", icon:Home, color:"bg-emerald-50 text-emerald-600", href:"/dashboard/admin/users/owners" },
]

export default function SuperAdminUsersPage() {
  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Users className="w-7 h-7 text-blue-500" />User Overview</h1>
          <p className="page-subtitle">Platform-wide user statistics and growth across all roles.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ROLE_CARDS.map(c => (
            <Link key={c.title} href={c.href} className="card-flat p-5 hover:shadow-md transition-all group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                <c.icon className="w-5 h-5" />
              </div>
              <p className="font-display text-3xl font-light text-stone-900">{c.total}</p>
              <p className="text-sm font-body text-stone-600">{c.title}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-stone-400">{c.active} active</p>
                <p className="text-xs text-emerald-600 font-medium">↑ {c.growth}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-5">User Growth Trend (6 Months)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={MONTHLY_GROWTH}>
              <defs>
                <linearGradient id="buyerGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                <linearGradient id="ownerGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4ade80" stopOpacity={0.2}/><stop offset="95%" stopColor="#4ade80" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="month" tick={{ fontSize:12, fill:"#78716c" }} />
              <YAxis tick={{ fontSize:11, fill:"#78716c" }} />
              <Tooltip contentStyle={{ borderRadius:"12px", border:"1px solid #e7e3dc" }} />
              <Area type="monotone" dataKey="buyers" stroke="#3b82f6" strokeWidth={2} fill="url(#buyerGrad)" name="Buyers" />
              <Area type="monotone" dataKey="owners" stroke="#4ade80" strokeWidth={2} fill="url(#ownerGrad)" name="Owners" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ROLE_CARDS.map(c => (
            <div key={c.title} className="card p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon className="w-5 h-5" /></div>
                <div><p className="font-body font-semibold text-stone-900">{c.title}</p><p className="text-xs text-stone-400">{c.active} active · {c.total - c.active} inactive</p></div>
              </div>
              <Link href={c.href} className="btn-secondary text-sm">Manage →</Link>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
