"use client"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, FunnelChart, Funnel, LabelList } from "recharts"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Props {
  data: { month: string; revenue: number; inquiries: number }[]
  pipeline: { stage: string; count: number; color: string }[]
}

export default function AgentAnalyticsCharts({ data, pipeline }: Props) {
  const [chartType, setChartType] = useState<"revenue" | "inquiries">("revenue")

  return (
    <div className="space-y-5">
      {/* Revenue / Inquiries Chart */}
      <div className="card-flat p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-medium">Performance Overview</h2>
          <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
            {(["revenue", "inquiries"] as const).map((t) => (
              <button key={t} onClick={() => setChartType(t)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all capitalize",
                  chartType === t ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700")}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "revenue" ? (
              <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "var(--font-dm-sans)", fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "var(--font-dm-sans)", fill: "#9ca3af" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000000).toFixed(1)}M`} />
                <Tooltip contentStyle={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, borderRadius: 12, border: "1px solid #e7e5e4", boxShadow: "0 8px 32px rgba(0,0,0,.1)" }}
                  formatter={(v: any) => [`₹${(v / 100000).toFixed(1)}L`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#C9A07A" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "var(--font-dm-sans)", fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "var(--font-dm-sans)", fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, borderRadius: 12, border: "1px solid #e7e5e4" }} />
                <Line dataKey="inquiries" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lead Pipeline */}
      <div className="card-flat p-5">
        <h2 className="font-display text-lg font-medium mb-5">Lead Pipeline</h2>
        <div className="space-y-2.5">
          {pipeline.map((stage) => {
            const max = pipeline[0].count
            const pct = Math.round((stage.count / max) * 100)
            return (
              <div key={stage.stage} className="flex items-center gap-3">
                <div className="w-36 text-xs font-body text-stone-600 text-right flex-shrink-0 truncate">{stage.stage}</div>
                <div className="flex-1 bg-stone-100 rounded-full h-7 relative overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500 flex items-center px-3"
                    style={{ width: `${pct}%`, background: stage.color }}>
                    <span className="text-white text-xs font-body font-semibold">{stage.count}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
