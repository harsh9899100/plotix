"use client"
import { useState } from "react"
import { Plug, CheckCircle, AlertCircle, Settings, RefreshCw, ExternalLink } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui"
import toast from "react-hot-toast"

const INTEGRATIONS = [
  { id:"razorpay", name:"Razorpay", category:"Payment Gateway", desc:"Process payments, subscriptions, and payouts securely.", icon:"💳", status:"CONNECTED", href:"/dashboard/superadmin/integrations/payment-gateway", lastSync:"2 hours ago", plan:"Business Plan" },
  { id:"resend", name:"Resend", category:"Email Service", desc:"Transactional emails with high deliverability rates.", icon:"📧", status:"CONNECTED", href:"/dashboard/superadmin/integrations/email-service", lastSync:"5 minutes ago", plan:"Pro Plan" },
  { id:"googleMaps", name:"Google Maps Platform", category:"Maps & Geolocation", desc:"Property location maps and neighborhood insights.", icon:"🗺️", status:"CONNECTED", href:"/dashboard/superadmin/integrations/maps-api", lastSync:"1 hour ago", plan:"Pay-as-you-go" },
  { id:"cloudflareR2", name:"Cloudflare R2", category:"File Storage", desc:"Store property images and documents at scale.", icon:"☁️", status:"CONNECTED", href:"/dashboard/superadmin/integrations/storage", lastSync:"30 minutes ago", plan:"Standard Plan" },
  { id:"twilio", name:"Twilio SMS", category:"SMS Service", desc:"Send OTPs, alerts and notifications via SMS.", icon:"📱", status:"DEGRADED", href:"/dashboard/superadmin/integrations/third-party", lastSync:"12 hours ago", plan:"Pay-as-you-go" },
  { id:"firebase", name:"Firebase Push", category:"Push Notifications", desc:"Send push notifications to web and mobile apps.", icon:"🔔", status:"DISCONNECTED", href:"/dashboard/superadmin/integrations/third-party", lastSync:"Never", plan:"Not configured" },
  { id:"mixpanel", name:"Mixpanel", category:"Analytics", desc:"Track user behavior and funnel analytics.", icon:"📊", status:"CONNECTED", href:"/dashboard/superadmin/integrations/third-party", lastSync:"Real-time", plan:"Growth Plan" },
]

const STATUS_CFG: Record<string,{variant:any;label:string}> = {
  CONNECTED:    { variant:"green",  label:"Connected" },
  DEGRADED:     { variant:"amber",  label:"Degraded" },
  DISCONNECTED: { variant:"stone",  label:"Not Connected" },
}

export default function IntegrationsPage() {
  const [testing, setTesting] = useState<string|null>(null)

  const testConnection = async (id: string, name: string) => {
    setTesting(id)
    await new Promise(r => setTimeout(r, 1500))
    setTesting(null)
    toast.success(`${name} connection test passed!`)
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Plug className="w-7 h-7 text-stone-500"/>Integrations</h1>
          <p className="page-subtitle">Manage third-party services and API connections.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Connected", value:INTEGRATIONS.filter(i=>i.status==="CONNECTED").length, color:"bg-emerald-50" },
            { label:"Degraded", value:INTEGRATIONS.filter(i=>i.status==="DEGRADED").length, color:"bg-amber-50" },
            { label:"Disconnected", value:INTEGRATIONS.filter(i=>i.status==="DISCONNECTED").length, color:"bg-rose-50" },
            { label:"Total Services", value:INTEGRATIONS.length, color:"bg-stone-100" },
          ].map(s => (
            <div key={s.label} className={`card-flat p-4 ${s.color}`}>
              <p className="text-xs text-stone-400 uppercase font-body">{s.label}</p>
              <p className="font-display text-3xl font-light text-stone-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INTEGRATIONS.map(int => {
            const cfg = STATUS_CFG[int.status]
            return (
              <div key={int.id} className="card-flat p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{int.icon}</span>
                    <div>
                      <p className="font-body font-semibold text-stone-900">{int.name}</p>
                      <p className="text-xs text-stone-400">{int.category}</p>
                    </div>
                  </div>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </div>
                <p className="text-sm font-body text-stone-500 mb-3">{int.desc}</p>
                <div className="flex items-center justify-between text-xs text-stone-400 mb-4">
                  <span>Plan: {int.plan}</span>
                  <span>Synced: {int.lastSync}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={int.href} className="btn-secondary text-xs flex-1 flex items-center justify-center gap-1">
                    <Settings className="w-3.5 h-3.5"/> Configure
                  </Link>
                  <button onClick={() => testConnection(int.id, int.name)} disabled={testing === int.id}
                    className="btn-ghost text-xs flex-1 flex items-center justify-center gap-1">
                    {testing === int.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <CheckCircle className="w-3.5 h-3.5"/>}
                    {testing === int.id ? "Testing..." : "Test"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
