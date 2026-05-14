"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MessageSquare, Send, CheckCircle, Clock, XCircle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useDashboardUser } from "@/context/SessionContext"
import { Badge, Button, Textarea, Avatar } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"
import toast from "react-hot-toast"

const INQUIRY = {
  id:"iq1", propertyTitle:"Modern 3BHK Apartment in Adajan", propertyImage:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=180&fit=crop",
  propertySlug:"modern-3bhk-apartment-adajan-surat",
  buyerName:"Rajesh Kumar", buyerEmail:"rajesh@gmail.com", buyerPhone:"+91 98765 43210",
  buyerAvatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
  message:"Hello, I'm very interested in this apartment. I would like to know the exact maintenance charges and if there's a covered parking included. Also, is the price negotiable?",
  status:"NEW", sentAt:new Date(Date.now()-3*3600000),
}

const STATUS_OPTS = [
  { value:"NEW", label:"New" }, { value:"RESPONDED", label:"Responded" },
  { value:"VIEWED", label:"Viewed" }, { value:"CLOSED", label:"Closed" },
]

export default function AgentInquiryDetailPage({ params }: { params: { id: string } }) {
  const user = useDashboardUser()
  const [status, setStatus] = useState(INQUIRY.status)
  const [reply, setReply] = useState("")
  const [sending, setSending] = useState(false)
  const [replies, setReplies] = useState<{text:string;time:Date}[]>([])

  const sendReply = async () => {
    if (!reply.trim()) return
    setSending(true)
    await new Promise(r => setTimeout(r, 800))
    setReplies(prev => [...prev, { text:reply, time:new Date() }])
    setStatus("RESPONDED")
    setReply("")
    setSending(false)
    toast.success("Reply sent to buyer!")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/agent/inquiries" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title">Inquiry Details</h1>
            <p className="page-subtitle">Respond to buyer inquiry</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-4">
            {/* Buyer message */}
            <div className="card-flat p-5">
              <div className="flex items-center gap-3 mb-4">
                <Avatar src={INQUIRY.buyerAvatar} name={INQUIRY.buyerName} size="md"/>
                <div>
                  <p className="font-body font-semibold text-stone-900">{INQUIRY.buyerName}</p>
                  <p className="text-xs text-stone-400">{formatTimeAgo(INQUIRY.sentAt)}</p>
                </div>
                <div className="ml-auto">
                  <Badge variant={status === "NEW" ? "amber" : status === "RESPONDED" ? "green" : "stone"}>
                    {status === "NEW" ? <Clock className="w-3 h-3"/> : <CheckCircle className="w-3 h-3"/>}
                    {status}
                  </Badge>
                </div>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-sm font-body text-stone-700 leading-relaxed">{INQUIRY.message}</p>
              </div>
            </div>

            {/* Replies */}
            {replies.map((r, i) => (
              <div key={i} className="card-flat p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={`${user.firstName} ${user.lastName}`} size="sm"/>
                  <div>
                    <p className="text-sm font-body font-semibold text-stone-900">You (Agent)</p>
                    <p className="text-xs text-stone-400">{formatTimeAgo(r.time)}</p>
                  </div>
                  <Badge variant="blue" className="ml-auto">Reply</Badge>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm font-body text-stone-700">{r.text}</p>
                </div>
              </div>
            ))}

            {/* Reply form */}
            <div className="card-flat p-5 space-y-3">
              <p className="font-body font-semibold text-stone-900">Send Reply</p>
              <Textarea value={reply} onChange={e => setReply(e.target.value)} rows={4}
                placeholder="Type your response to the buyer..."/>
              <div className="flex gap-3 justify-end">
                <Button variant="secondary" size="sm" onClick={() => setStatus("CLOSED")}>Mark as Closed</Button>
                <Button variant="gold" size="sm" onClick={sendReply} loading={sending}><Send className="w-3.5 h-3.5"/>Send Reply</Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Property */}
            <div className="card-flat overflow-hidden">
              <img src={INQUIRY.propertyImage} alt="" className="w-full h-32 object-cover"/>
              <div className="p-4">
                <p className="font-body font-semibold text-sm text-stone-900 mb-2">{INQUIRY.propertyTitle}</p>
                <Link href={`/properties/${INQUIRY.propertySlug}`} className="btn-secondary text-xs w-full flex items-center justify-center">View Listing</Link>
              </div>
            </div>

            {/* Buyer contact */}
            <div className="card-flat p-4 space-y-3">
              <p className="label">Buyer Contact</p>
              <a href={`tel:${INQUIRY.buyerPhone}`} className="flex items-center gap-2 text-sm font-body text-stone-700 hover:text-stone-900 p-2 rounded-xl hover:bg-stone-50 transition-colors">
                📞 {INQUIRY.buyerPhone}
              </a>
              <a href={`mailto:${INQUIRY.buyerEmail}`} className="flex items-center gap-2 text-sm font-body text-stone-700 hover:text-stone-900 p-2 rounded-xl hover:bg-stone-50 transition-colors">
                ✉️ {INQUIRY.buyerEmail}
              </a>
              <button onClick={() => toast.success("Viewing request sent!")} className="btn-primary text-xs w-full">Schedule Viewing</button>
            </div>

            {/* Actions */}
            <div className="card-flat p-4 space-y-2">
              <p className="label">Quick Actions</p>
              <button onClick={() => { setStatus("CLOSED"); toast.success("Marked as closed") }} className="btn-secondary text-xs w-full">Close Inquiry</button>
              <Link href={`/dashboard/agent/messages/buyer-${INQUIRY.id}`} className="btn-ghost text-xs w-full flex items-center justify-center gap-2"><MessageSquare className="w-3.5 h-3.5"/>Chat with Buyer</Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
