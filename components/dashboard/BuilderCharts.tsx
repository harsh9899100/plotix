"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Props { data: {month:string;revenue:number;inquiries:number}[] }

export default function BuilderCharts({ data }: Props) {
  const [view, setView] = useState<"revenue"|"units">("revenue")
  const unitData = data.map((d,i)=>({...d, sold: Math.floor(d.revenue/10000000*(0.8+i*0.02)), available: Math.floor(Math.random()*30+10) }))

  return (
    <div className="space-y-5">
      <div className="card-flat p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-medium">Portfolio Performance</h2>
          <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
            {(["revenue","units"] as const).map(v=>(
              <button key={v} onClick={()=>setView(v)} className={cn("px-3 py-1.5 rounded-lg text-xs font-body font-medium capitalize transition-all",view===v?"bg-white text-stone-900 shadow-sm":"text-stone-500 hover:text-stone-700")}>{v}</button>
            ))}
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            {view==="revenue" ? (
              <AreaChart data={data} margin={{top:4,right:4,bottom:0,left:0}}>
                <defs><linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:11,fontFamily:"var(--font-dm-sans)",fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fontFamily:"var(--font-dm-sans)",fill:"#9ca3af"}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/10000000).toFixed(0)}Cr`}/>
                <Tooltip contentStyle={{fontFamily:"var(--font-dm-sans)",fontSize:12,borderRadius:12,border:"1px solid #e7e5e4"}} formatter={(v:any)=>[`₹${(v/10000000).toFixed(2)}Cr`,"Revenue"]}/>
                <Area dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#bGrad)"/>
              </AreaChart>
            ) : (
              <BarChart data={unitData} margin={{top:4,right:4,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:11,fontFamily:"var(--font-dm-sans)",fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fontFamily:"var(--font-dm-sans)",fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{fontFamily:"var(--font-dm-sans)",fontSize:12,borderRadius:12,border:"1px solid #e7e5e4"}}/>
                <Bar dataKey="sold" fill="#10b981" radius={[4,4,0,0]} name="Units Sold"/>
                <Bar dataKey="available" fill="#e2e8f0" radius={[4,4,0,0]} name="Available"/>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
