"use client"
import { useState } from "react"
import { Activity, Filter, Download, Search, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, SearchInput, Select, Tabs } from "@/components/ui"
import { formatDateTime } from "@/lib/utils"

const LOGS = [
  { id:"l1", level:"INFO", service:"Auth", message:"User arjun@demo.com logged in successfully", ip:"103.21.44.1", timestamp:new Date(Date.now()-5*60000), userId:"u1" },
  { id:"l2", level:"WARN", service:"API", message:"Rate limit approaching for IP 182.71.30.5 — 85/100 requests", ip:"182.71.30.5", timestamp:new Date(Date.now()-12*60000), userId:null },
  { id:"l3", level:"ERROR", service:"Payment", message:"Payment gateway timeout — transaction TXN20241115 failed after 30s", ip:"10.0.0.1", timestamp:new Date(Date.now()-18*60000), userId:"u45" },
  { id:"l4", level:"INFO", service:"Property", message:"New property listing submitted for review — ID: prop-789", ip:"45.112.33.10", timestamp:new Date(Date.now()-25*60000), userId:"o12" },
  { id:"l5", level:"INFO", service:"Email", message:"Welcome email sent to priya@agency.com", ip:"10.0.0.1", timestamp:new Date(Date.now()-32*60000), userId:"a1" },
  { id:"l6", level:"ERROR", service:"Database", message:"Connection pool exhausted — 50/50 connections active", ip:"10.0.0.1", timestamp:new Date(Date.now()-45*60000), userId:null },
  { id:"l7", level:"INFO", service:"Auth", message:"Admin admin@plotix.in approved agent RERA-GUJ-AGT-2024-1234", ip:"192.168.1.5", timestamp:new Date(Date.now()-60*60000), userId:"adm1" },
  { id:"l8", level:"WARN", service:"Storage", message:"S3 bucket usage at 78% — approaching quota limit", ip:"10.0.0.1", timestamp:new Date(Date.now()-90*60000), userId:null },
  { id:"l9", level:"INFO", service:"Property", message:"Property prop-456 status changed to SOLD", ip:"103.21.44.1", timestamp:new Date(Date.now()-2*3600000), userId:"a3" },
  { id:"l10", level:"INFO", service:"Backup", message:"Automated daily backup completed — 2.4GB compressed", ip:"10.0.0.1", timestamp:new Date(Date.now()-3*3600000), userId:null },
]

const LEVEL_CFG: Record<string, { variant: any; icon: any }> = {
  INFO:  { variant:"blue",   icon:Info },
  WARN:  { variant:"amber",  icon:AlertTriangle },
  ERROR: { variant:"rose",   icon:AlertCircle },
  DEBUG: { variant:"stone",  icon:CheckCircle },
}

const SERVICES = ["All","Auth","API","Payment","Property","Email","Database","Storage","Backup"]

export default function SystemLogsPage() {
  const [search, setSearch] = useState("")
  const [level, setLevel] = useState("all")
  const [service, setService] = useState("All")

  const filtered = LOGS.filter(l => {
    const matchSearch = !search || l.message.toLowerCase().includes(search.toLowerCase()) || l.service.toLowerCase().includes(search.toLowerCase())
    const matchLevel = level === "all" || l.level === level
    const matchService = service === "All" || l.service === service
    return matchSearch && matchLevel && matchService
  })

  const counts = { errors: LOGS.filter(l=>l.level==="ERROR").length, warns: LOGS.filter(l=>l.level==="WARN").length }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Activity className="w-7 h-7 text-stone-500"/>System Logs</h1>
            <p className="page-subtitle">Real-time log stream from all platform services.</p>
          </div>
          <button className="btn-secondary text-sm"><Download className="w-4 h-4"/> Export Logs</button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Total Logs (24h)", value:LOGS.length, color:"bg-stone-100" },
            { label:"Errors", value:counts.errors, color:"bg-rose-50" },
            { label:"Warnings", value:counts.warns, color:"bg-amber-50" },
            { label:"Services Monitored", value:8, color:"bg-emerald-50" },
          ].map(s => (
            <div key={s.label} className={`card-flat p-4 ${s.color}`}>
              <p className="text-xs text-stone-400 uppercase font-body">{s.label}</p>
              <p className="font-display text-3xl font-light text-stone-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search logs..." className="flex-1 max-w-sm"/>
          <Tabs tabs={[{value:"all",label:"All"},{value:"ERROR",label:"Errors",count:counts.errors},{value:"WARN",label:"Warnings",count:counts.warns},{value:"INFO",label:"Info"}]}
            active={level} onChange={setLevel}/>
          <Select value={service} onChange={e => setService(e.target.value)}
            options={SERVICES.map(s => ({ value:s, label:s }))}/>
        </div>

        {/* Log stream */}
        <div className="card-flat overflow-hidden">
          <div className="bg-stone-900 text-stone-100 font-mono text-xs p-4 space-y-2 max-h-[60vh] overflow-y-auto">
            {filtered.map(log => {
              const cfg = LEVEL_CFG[log.level]
              const color = log.level === "ERROR" ? "text-rose-400" : log.level === "WARN" ? "text-amber-400" : "text-emerald-400"
              return (
                <div key={log.id} className="flex gap-3 items-start hover:bg-stone-800/50 px-2 py-1 rounded">
                  <span className="text-stone-500 flex-shrink-0">{log.timestamp.toTimeString().slice(0,8)}</span>
                  <span className={`flex-shrink-0 w-12 ${color}`}>[{log.level}]</span>
                  <span className="text-blue-400 flex-shrink-0 w-16">{log.service}</span>
                  <span className="text-stone-300 flex-1">{log.message}</span>
                  {log.ip && <span className="text-stone-600 flex-shrink-0">{log.ip}</span>}
                </div>
              )
            })}
            {filtered.length === 0 && (
              <p className="text-stone-500 text-center py-6">No logs matching current filters</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
