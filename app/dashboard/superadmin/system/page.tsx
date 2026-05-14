"use client"
import { useState } from "react"
import Link from "next/link"
import { Server, Database, Activity, HardDrive, RefreshCw, AlertTriangle, CheckCircle, Cpu, MemoryStick, Globe } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui"
import toast from "react-hot-toast"

const SERVICES = [
  { name:"API Server", status:"ONLINE", uptime:"99.97%", responseTime:"42ms", color:"emerald" },
  { name:"Database (PostgreSQL)", status:"ONLINE", uptime:"99.99%", responseTime:"8ms", color:"emerald" },
  { name:"Redis Cache", status:"ONLINE", uptime:"100%", responseTime:"2ms", color:"emerald" },
  { name:"File Storage (S3)", status:"ONLINE", uptime:"99.95%", responseTime:"120ms", color:"emerald" },
  { name:"Email Service", status:"DEGRADED", uptime:"98.2%", responseTime:"350ms", color:"amber" },
  { name:"Payment Gateway", status:"ONLINE", uptime:"99.98%", responseTime:"180ms", color:"emerald" },
  { name:"SMS Service", status:"ONLINE", uptime:"99.5%", responseTime:"95ms", color:"emerald" },
  { name:"Search Engine", status:"ONLINE", uptime:"99.8%", responseTime:"25ms", color:"emerald" },
]

const METRICS = [
  { label:"CPU Usage", value:34, unit:"%", icon:Cpu, color:"blue" },
  { label:"RAM Usage", value:61, unit:"%", icon:MemoryStick, color:"violet" },
  { label:"Disk Usage", value:47, unit:"%", icon:HardDrive, color:"amber" },
  { label:"Network I/O", value:82, unit:"Mbps", icon:Globe, color:"emerald" },
]

const QUICK_LINKS = [
  { label:"System Logs", href:"/dashboard/superadmin/system/logs", icon:Activity },
  { label:"Database", href:"/dashboard/superadmin/system/database", icon:Database },
  { label:"Backups", href:"/dashboard/superadmin/system/backups", icon:HardDrive },
  { label:"Monitoring", href:"/dashboard/superadmin/system/monitoring", icon:Server },
]

export default function SuperAdminSystemPage() {
  const [restarting, setRestarting] = useState(false)

  const restartService = async (name: string) => {
    setRestarting(true)
    await new Promise(r => setTimeout(r, 1500))
    setRestarting(false)
    toast.success(`${name} restarted successfully`)
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Server className="w-7 h-7 text-stone-500"/>System Management</h1>
            <p className="page-subtitle">Monitor and manage platform infrastructure.</p>
          </div>
          <button onClick={() => toast.success("System status refreshed")} className="btn-secondary">
            <RefreshCw className="w-4 h-4"/> Refresh
          </button>
        </div>

        {/* Overall status */}
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0"/>
          <div>
            <p className="font-body font-semibold text-emerald-800">All Systems Operational</p>
            <p className="text-xs text-emerald-600">Last checked: just now · 7/8 services healthy</p>
          </div>
          <Link href="/dashboard/superadmin/system/monitoring" className="ml-auto btn-secondary text-xs">View Status Page</Link>
        </div>

        {/* Server metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {METRICS.map(m => (
            <div key={m.label} className="card-flat p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-stone-400 uppercase tracking-wide font-body">{m.label}</p>
                <m.icon className={`w-4 h-4 text-${m.color}-500`}/>
              </div>
              <p className="font-display text-3xl font-light text-stone-900">{m.value}<span className="text-base text-stone-400">{m.unit}</span></p>
              <div className="mt-2 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div className={`h-full bg-${m.color}-500 rounded-full`} style={{width:`${m.value}%`}}/>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_LINKS.map(ql => (
            <Link key={ql.label} href={ql.href} className="card-flat p-4 flex items-center gap-3 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                <ql.icon className="w-5 h-5 text-stone-500 group-hover:text-white transition-colors"/>
              </div>
              <span className="text-sm font-body font-medium text-stone-700">{ql.label}</span>
            </Link>
          ))}
        </div>

        {/* Services table */}
        <div className="card-flat">
          <div className="p-5 border-b border-stone-100">
            <h2 className="font-display text-lg font-medium">Service Health</h2>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Service</th><th>Status</th><th>Uptime</th><th>Response</th><th>Actions</th></tr></thead>
              <tbody>
                {SERVICES.map(s => (
                  <tr key={s.name}>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full bg-${s.color}-400`}/>
                        <span className="font-medium text-stone-900">{s.name}</span>
                      </div>
                    </td>
                    <td><Badge variant={s.status === "ONLINE" ? "green" : s.status === "DEGRADED" ? "amber" : "rose"}>{s.status}</Badge></td>
                    <td className="text-sm text-stone-600">{s.uptime}</td>
                    <td className="text-sm text-stone-600">{s.responseTime}</td>
                    <td>
                      <button onClick={() => restartService(s.name)} disabled={restarting}
                        className="btn-ghost text-xs py-1 px-3 text-stone-500 hover:text-stone-900">
                        <RefreshCw className="w-3 h-3"/> Restart
                      </button>
                    </td>
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
