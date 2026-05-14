"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Zap, Phone, Mail, MessageSquare, TrendingUp, Clock, CheckCircle, Tag } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, Avatar, Textarea, Button, Select } from "@/components/ui"
import { formatDate, formatTimeAgo } from "@/lib/utils"
import toast from "react-hot-toast"

const LEAD = {
  id:"l1", name:"Amit Shah", email:"amit.shah@gmail.com", phone:"+91 93456 78901",
  avatar:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face",
  source:"Website Inquiry", status:"HOT", quality:85, assignedDate:new Date(Date.now()-7*86400000),
  propertyInterest:"3BHK Luxury Apartment", budget:"₹60L–₹90L", timeline:"2–3 months",
  city:"Surat", notes:"Very interested in Vesu area. Has financing pre-approved. Wife is the decision maker.",
  activities:[
    { type:"call", note:"First call — very responsive, confirmed budget range", date:new Date(Date.now()-5*86400000) },
    { type:"email", note:"Sent property brochure for Sky Tower and Prestige Heights", date:new Date(Date.now()-4*86400000) },
    { type:"viewing", note:"Showed Sky Tower 3BHK — liked it but wants to see one more", date:new Date(Date.now()-2*86400000) },
    { type:"note", note:"Mentioned wife prefers properties with garden", date:new Date(Date.now()-86400000) },
  ]
}

const ACTIVITY_ICONS: Record<string,string> = { call:"📞", email:"✉️", viewing:"🏠", note:"📝" }
const STATUS_OPTS = [
  {value:"HOT",label:"🔥 Hot"},{value:"WARM",label:"🌡️ Warm"},{value:"COLD",label:"❄️ Cold"},
  {value:"CONVERTED",label:"✅ Converted"},{value:"LOST",label:"❌ Lost"},
]

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState(LEAD.status)
  const [note, setNote] = useState("")
  const [activities, setActivities] = useState(LEAD.activities)

  const addNote = () => {
    if (!note.trim()) return
    setActivities(prev => [{ type:"note", note, date:new Date() }, ...prev])
    setNote("")
    toast.success("Note added!")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/agent/leads" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title">Lead Profile</h1>
            <p className="page-subtitle">Manage lead pipeline and communication history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Lead header */}
            <div className="card-flat p-5 flex items-start gap-4">
              <Avatar src={LEAD.avatar} name={LEAD.name} size="lg"/>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-display text-xl font-medium text-stone-900">{LEAD.name}</h2>
                  <Badge variant={status === "HOT" ? "rose" : status === "WARM" ? "amber" : status === "CONVERTED" ? "green" : "stone"}>
                    {status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-stone-500 font-body">
                  <span>📍 {LEAD.city}</span>
                  <span>🏠 {LEAD.propertyInterest}</span>
                  <span>💰 {LEAD.budget}</span>
                  <span>⏱ {LEAD.timeline}</span>
                </div>
              </div>
              <div className="text-center flex-shrink-0">
                <p className="text-3xl font-display text-amber-600">{LEAD.quality}</p>
                <p className="text-xs text-stone-400">Quality Score</p>
              </div>
            </div>

            {/* Notes */}
            {LEAD.notes && (
              <div className="card-flat p-5">
                <p className="font-body font-semibold text-stone-700 mb-2 text-sm">📌 Key Notes</p>
                <p className="text-sm font-body text-stone-600 bg-amber-50 border border-amber-100 rounded-xl p-3">{LEAD.notes}</p>
              </div>
            )}

            {/* Add note */}
            <div className="card-flat p-5 space-y-3">
              <p className="font-body font-semibold text-stone-900">Add Activity / Note</p>
              <Textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Log a call, email, note or activity..."/>
              <Button variant="gold" size="sm" onClick={addNote}><TrendingUp className="w-3.5 h-3.5"/>Log Activity</Button>
            </div>

            {/* Timeline */}
            <div className="card-flat p-5">
              <p className="font-body font-semibold text-stone-900 mb-4">Activity Timeline</p>
              <div className="space-y-4">
                {activities.map((a, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center flex-shrink-0 text-sm">{ACTIVITY_ICONS[a.type]}</div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm font-body text-stone-700">{a.note}</p>
                      <p className="text-xs text-stone-400 mt-1">{formatTimeAgo(a.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contact */}
            <div className="card-flat p-4 space-y-3">
              <p className="label">Contact</p>
              <a href={`tel:${LEAD.phone}`} className="flex items-center gap-2 text-sm font-body text-stone-700 p-2 rounded-xl hover:bg-stone-50 transition-colors">
                <Phone className="w-4 h-4 text-stone-400"/> {LEAD.phone}
              </a>
              <a href={`mailto:${LEAD.email}`} className="flex items-center gap-2 text-sm font-body text-stone-700 p-2 rounded-xl hover:bg-stone-50 transition-colors">
                <Mail className="w-4 h-4 text-stone-400"/> {LEAD.email}
              </a>
              <Link href={`/dashboard/agent/messages/buyer-${LEAD.id}`}
                className="btn-primary text-xs w-full flex items-center justify-center gap-2">
                <MessageSquare className="w-3.5 h-3.5"/> Send Message
              </Link>
            </div>

            {/* Pipeline Status */}
            <div className="card-flat p-4 space-y-3">
              <p className="label">Pipeline Status</p>
              <Select value={status} onChange={e => { setStatus(e.target.value); toast.success("Status updated") }}
                options={STATUS_OPTS}/>
            </div>

            {/* Lead info */}
            <div className="card-flat p-4 space-y-2">
              <p className="label">Lead Info</p>
              {[
                { label:"Source", value:LEAD.source },
                { label:"Assigned", value:formatDate(LEAD.assignedDate) },
                { label:"Budget", value:LEAD.budget },
                { label:"Timeline", value:LEAD.timeline },
              ].map(f => (
                <div key={f.label} className="flex justify-between text-xs font-body py-1 border-b border-stone-100 last:border-0">
                  <span className="text-stone-400">{f.label}</span>
                  <span className="text-stone-700 font-medium">{f.value}</span>
                </div>
              ))}
            </div>

            <button onClick={() => toast.success("Viewing scheduled!")} className="btn-gold w-full text-sm">Schedule Viewing</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
