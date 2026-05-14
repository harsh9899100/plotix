"use client"
import { useState } from "react"
import Link from "next/link"
import { MessageSquare, Clock, CheckCircle, AlertCircle, ArrowRight, Send } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, EmptyState, Tabs, StatCard } from "@/components/ui"
import { formatTimeAgo, cn } from "@/lib/utils"


const MOCK_INQUIRIES = [
  { id:"iq1", propertyTitle:"Luxurious 4BHK Penthouse in Vesu", propertySlug:"luxurious-4bhk-penthouse-vesu-surat",
    propertyImage:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=120&h=80&fit=crop",
    agentName:"Priya Sharma", status:"RESPONDED", sentAt:new Date(Date.now()-2*3600000),
    message:"Hi, I'm interested in this property. Can I schedule a viewing?",
    response:"Hello! Absolutely. I'm available on weekdays between 10am–6pm. Shall we schedule for Saturday?",
    responseAt:new Date(Date.now()-3600000) },
  { id:"iq2", propertyTitle:"Modern 3BHK Apartment in Adajan", propertySlug:"modern-3bhk-apartment-adajan-surat",
    propertyImage:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&h=80&fit=crop",
    agentName:"Rohan Mehta", status:"NEW", sentAt:new Date(Date.now()-5*3600000),
    message:"What is the maintenance charge per month?", response:null, responseAt:null },
  { id:"iq3", propertyTitle:"Commercial Space in C.G. Road", propertySlug:"commercial-space-cg-road-ahmedabad",
    propertyImage:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&h=80&fit=crop",
    agentName:"Meera Patel", status:"CLOSED", sentAt:new Date(Date.now()-3*86400000),
    message:"Is this space available for a co-working setup?",
    response:"Yes, it's suitable. The open floor plan can accommodate 30+ workstations.",
    responseAt:new Date(Date.now()-2*86400000) },
]

const STATUS_CONFIG: Record<string,{label:string;variant:any;icon:any}> = {
  NEW:       { label:"Awaiting Reply", variant:"amber",  icon:Clock },
  VIEWED:    { label:"Viewed",         variant:"blue",   icon:AlertCircle },
  RESPONDED: { label:"Responded",      variant:"green",  icon:CheckCircle },
  CLOSED:    { label:"Closed",         variant:"stone",  icon:CheckCircle },
}

export default function BuyerInquiriesPage() {
  const [tab, setTab] = useState("all")
  const filtered = tab === "all" ? MOCK_INQUIRIES : MOCK_INQUIRIES.filter(i => i.status === tab)
  const stats = {
    total: MOCK_INQUIRIES.length,
    pending: MOCK_INQUIRIES.filter(i => i.status === "NEW").length,
    responded: MOCK_INQUIRIES.filter(i => i.status === "RESPONDED").length,
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><MessageSquare className="w-7 h-7 text-violet-500"/>My Inquiries</h1>
            <p className="page-subtitle">Track all your property inquiries and responses.</p>
          </div>
          <Link href="/properties" className="btn-gold"><Send className="w-4 h-4"/> New Inquiry</Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total" value={stats.total} icon={<MessageSquare className="w-5 h-5 text-violet-500"/>} color="bg-violet-50"/>
          <StatCard label="Awaiting Reply" value={stats.pending} icon={<Clock className="w-5 h-5 text-amber-500"/>} color="bg-amber-50"/>
          <StatCard label="Responded" value={stats.responded} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
        </div>

        <Tabs tabs={[
          { value:"all", label:"All", count:MOCK_INQUIRIES.length },
          { value:"NEW", label:"Pending", count:stats.pending },
          { value:"RESPONDED", label:"Responded", count:stats.responded },
          { value:"CLOSED", label:"Closed", count:MOCK_INQUIRIES.filter(i=>i.status==="CLOSED").length },
        ]} active={tab} onChange={setTab}/>

        {filtered.length === 0 ? (
          <EmptyState icon={<MessageSquare className="w-8 h-8 text-stone-300"/>}
            title="No inquiries" description="Make an inquiry on any property listing to get started."
            action={<Link href="/properties" className="btn-primary">Browse Properties</Link>}/>
        ) : (
          <div className="space-y-4">
            {filtered.map(inq => {
              const cfg = STATUS_CONFIG[inq.status]
              return (
                <Link key={inq.id} href={`/dashboard/buyer/inquiries/${inq.id}`}
                  className="card p-5 flex gap-4 hover:shadow-md transition-all group">
                  <div className="w-24 h-18 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
                    <img src={inq.propertyImage} alt="" className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="font-body font-semibold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">{inq.propertyTitle}</p>
                        <p className="text-xs text-stone-400 font-body mt-0.5">Agent: {inq.agentName} · {formatTimeAgo(inq.sentAt)}</p>
                      </div>
                      <Badge variant={cfg.variant}><cfg.icon className="w-3 h-3"/>{cfg.label}</Badge>
                    </div>
                    <p className="text-sm font-body text-stone-600 line-clamp-2 bg-stone-50 rounded-lg px-3 py-2">
                      "{inq.message}"
                    </p>
                    {inq.response && (
                      <p className="text-xs font-body text-emerald-700 mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3"/> Agent replied · {formatTimeAgo(inq.responseAt!)}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-600 transition-colors flex-shrink-0 self-center"/>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
