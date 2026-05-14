"use client"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Props {
  revenueData: { month: string; revenue: number; inquiries: number }[]
  userGrowth:  { month: string; buyers: number; agents: number; builders: number }[]
  typeDist:    { name: string; value: number; color: string }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-lg text-xs font-body">
      <p className="font-semibold text-stone-700 mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="font-semibold">{p.value?.toLocaleString("en-IN")}</span></p>
      ))}
    </div>
  )
}

export default function AdminOverviewCharts({ revenueData, userGrowth, typeDist }: Props) {
  const [activeTab, setActiveTab] = useState<"revenue" | "users">("revenue")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Main chart */}
      <div className="lg:col-span-2 card-flat p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-medium">Platform Trends</h2>
          <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
            {(["revenue","users"] as const).map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-body font-medium capitalize transition-all",
                  activeTab === t ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700")}>
                {t === "revenue" ? "Revenue" : "User Growth"}
              </button>
            ))}
          </div>
        </div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "revenue" ? (
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#C9A07A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C9A07A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "var(--font-dm-sans)", fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "var(--font-dm-sans)", fill: "#9ca3af" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `₹${(v/10000000).toFixed(1)}Cr`} />
                <Tooltip content={<CustomTooltip />} />
                <Area dataKey="revenue" stroke="#C9A07A" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue (₹)" />
              </AreaChart>
            ) : (
              <BarChart data={userGrowth} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "var(--font-dm-sans)", fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "var(--font-dm-sans)", fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-dm-sans)" }} />
                <Bar dataKey="buyers"   fill="#6366f1" radius={[4,4,0,0]} name="Buyers" />
                <Bar dataKey="agents"   fill="#f59e0b" radius={[4,4,0,0]} name="Agents" />
                <Bar dataKey="builders" fill="#10b981" radius={[4,4,0,0]} name="Builders" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie chart */}
      <div className="card-flat p-5">
        <h2 className="font-display text-lg font-medium mb-5">Property Types</h2>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={typeDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                dataKey="value" paddingAngle={3}>
                {typeDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, borderRadius: 12 }}
                formatter={(v: any) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 mt-2">
          {typeDist.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-xs font-body">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                <span className="text-stone-600">{d.name}</span>
              </div>
              <span className="font-semibold text-stone-800">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
