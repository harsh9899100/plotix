"use client"
import Link from "next/link"
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Building, Shield, Ban, CheckCircle, MessageSquare, Eye, Edit } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, Avatar, Button } from "@/components/ui"
import { formatDate, formatCurrency } from "@/lib/utils"
import { useState } from "react"
import toast from "react-hot-toast"

const AGENT = {
  id:"a1", firstName:"Priya", lastName:"Sharma", email:"priya@agency.com", phone:"+91 97654 32109",
  avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face",
  city:"Surat", state:"Gujarat", agency:"Sharma Realty", rera:"RERA-GUJ-AGT-2024-1234",
  experience:"8 years", specialization:"Residential", status:"ACTIVE",
  joined:new Date(Date.now()-180*86400000), lastLogin:new Date(Date.now()-2*3600000),
  stats:{ properties:12, inquiries:84, viewings:36, commissions:485000, deals:8 },
}

export default function AdminAgentDetailPage({ params }: { params: { userId: string } }) {
  const [status, setStatus] = useState(AGENT.status)

  const toggleStatus = () => {
    const newStatus = status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
    setStatus(newStatus)
    toast.success(`Agent ${newStatus === "ACTIVE" ? "activated" : "suspended"} successfully`)
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/users/agents" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title">Agent Profile</h1>
            <p className="page-subtitle">View and manage agent account</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main profile */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header card */}
            <div className="card-flat p-6 flex items-start gap-5">
              <Avatar src={AGENT.avatar} name={`${AGENT.firstName} ${AGENT.lastName}`} size="xl"/>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-display text-2xl font-medium text-stone-900">{AGENT.firstName} {AGENT.lastName}</h2>
                  <Badge variant={status === "ACTIVE" ? "green" : "rose"}>{status}</Badge>
                </div>
                <p className="text-stone-400 text-sm font-body">{AGENT.agency} · {AGENT.specialization}</p>
                <p className="text-xs text-stone-400 mt-1">RERA: <span className="font-mono">{AGENT.rera}</span></p>
                <div className="flex gap-2 mt-4">
                  <button onClick={toggleStatus} className={status === "ACTIVE" ? "btn-danger text-sm" : "btn-success text-sm"}>
                    {status === "ACTIVE" ? <><Ban className="w-4 h-4"/>Suspend</> : <><CheckCircle className="w-4 h-4"/>Activate</>}
                  </button>
                  <Link href={`/dashboard/admin/users/agents/${params.userId}/edit`} className="btn-secondary text-sm"><Edit className="w-4 h-4"/>Edit</Link>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="card-flat p-6 space-y-3">
              <h3 className="font-display text-lg font-medium">Contact Information</h3>
              {[
                { icon:Mail, label:"Email", value:AGENT.email },
                { icon:Phone, label:"Phone", value:AGENT.phone },
                { icon:MapPin, label:"Location", value:`${AGENT.city}, ${AGENT.state}` },
                { icon:Building, label:"Agency", value:AGENT.agency },
                { icon:Calendar, label:"Joined", value:formatDate(AGENT.joined) },
                { icon:Eye, label:"Last Login", value:formatDate(AGENT.lastLogin) },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                  <f.icon className="w-4 h-4 text-stone-400 flex-shrink-0"/>
                  <span className="text-xs text-stone-400 w-24">{f.label}</span>
                  <span className="text-sm text-stone-900 font-body">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats sidebar */}
          <div className="space-y-4">
            <div className="card-flat p-5">
              <h3 className="font-display text-lg font-medium mb-4">Performance</h3>
              <div className="space-y-3">
                {[
                  { label:"Active Listings", value:AGENT.stats.properties },
                  { label:"Total Inquiries", value:AGENT.stats.inquiries },
                  { label:"Viewings", value:AGENT.stats.viewings },
                  { label:"Deals Closed", value:AGENT.stats.deals },
                  { label:"Total Commission", value:formatCurrency(AGENT.stats.commissions) },
                ].map(s => (
                  <div key={s.label} className="flex justify-between py-2 border-b border-stone-100 last:border-0">
                    <span className="text-xs text-stone-400">{s.label}</span>
                    <span className="text-sm font-display font-medium text-stone-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Link href={`/dashboard/admin/users/agents/${params.userId}/properties`} className="btn-secondary text-sm w-full flex items-center justify-center gap-2">
                <Building className="w-4 h-4"/> View Properties
              </Link>
              <Link href={`/dashboard/admin/users/agents/${params.userId}/commissions`} className="btn-ghost text-sm w-full flex items-center justify-center gap-2">
                💰 View Commissions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
