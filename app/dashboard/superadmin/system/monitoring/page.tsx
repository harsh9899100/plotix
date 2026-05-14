"use client"
import { useState, useEffect } from "react"
import { Activity, Cpu, HardDrive, TrendingUp, TrendingDown, RefreshCw, AlertTriangle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const INITIAL_METRICS = Array.from({length:20},(_,i) => ({
  t: `${i}m`, cpu: Math.round(20+Math.random()*40), ram: Math.round(50+Math.random()*25),
  requests: Math.round(100+Math.random()*200), errors: Math.round(Math.random()*5)
}))

export default function SystemMonitoringPage() {
  const [metrics, setMetrics] = useState(INITIAL_METRICS)
  const [current, setCurrent] = useState({ cpu:34, ram:61, disk:47, activeUsers:127, reqPerSec:42, errorRate:0.3 })

  // Simulate live data
  useEffect(() => {
    const interval = setInterval(() => {
      const newCpu = Math.round(20 + Math.random() * 40)
      const newRam = Math.round(50 + Math.random() * 25)
      const newReq = Math.round(100 + Math.random() * 200)
      setCurrent(p => ({ ...p, cpu:newCpu, ram:newRam, reqPerSec:Math.round(30+Math.random()*30) }))
      setMetrics(p => [...p.slice(-19), { t:"now", cpu:newCpu, ram:newRam, requests:newReq, errors:Math.round(Math.random()*3) }])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Activity className="w-7 h-7 text-emerald-500"/>System Monitoring</h1>
            <p className="page-subtitle">Real-time platform infrastructure metrics.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>Live · updates every 3s
          </div>
        </div>

        {/* Live metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label:"CPU", value:`${current.cpu}%`, icon:Cpu, color: current.cpu>80?"text-rose-500":"text-blue-500" },
            { label:"RAM", value:`${current.ram}%`, icon:HardDrive, color: current.ram>90?"text-rose-500":"text-violet-500" },
            { label:"Disk", value:`${current.disk}%`, icon:HardDrive, color:"text-amber-500" },
            { label:"Active Users", value:current.activeUsers, icon:Activity, color:"text-emerald-500" },
            { label:"Req/sec", value:current.reqPerSec, icon:TrendingUp, color:"text-blue-500" },
            { label:"Error Rate", value:`${current.errorRate}%`, icon:AlertTriangle, color: current.errorRate>1?"text-rose-500":"text-stone-400" },
          ].map(m => (
            <div key={m.label} className="card-flat p-4 text-center">
              <m.icon className={`w-5 h-5 mx-auto mb-2 ${m.color}`}/>
              <p className="font-display text-2xl font-light text-stone-900">{m.value}</p>
              <p className="text-xs text-stone-400 mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* CPU/RAM chart */}
        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-5">CPU & RAM Usage (Last 20 updates)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8"/>
              <XAxis dataKey="t" tick={{fontSize:10,fill:"#78716c"}}/>
              <YAxis domain={[0,100]} tick={{fontSize:11,fill:"#78716c"}} tickFormatter={v=>`${v}%`}/>
              <Tooltip contentStyle={{borderRadius:"12px",border:"1px solid #e7e3dc"}}/>
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} dot={false} name="CPU %"/>
              <Line type="monotone" dataKey="ram" stroke="#8b5cf6" strokeWidth={2} dot={false} name="RAM %"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Requests chart */}
        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-5">Requests per Minute</h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={metrics}>
              <defs><linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/><stop offset="95%" stopColor="#4ade80" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8"/>
              <XAxis dataKey="t" tick={{fontSize:10,fill:"#78716c"}}/>
              <YAxis tick={{fontSize:11,fill:"#78716c"}}/>
              <Tooltip contentStyle={{borderRadius:"12px",border:"1px solid #e7e3dc"}}/>
              <Area type="monotone" dataKey="requests" stroke="#4ade80" strokeWidth={2} fill="url(#reqGrad)" name="Requests/min"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  )
}
