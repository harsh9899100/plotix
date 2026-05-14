"use client"
import Link from "next/link"
import { ArrowLeft, MessageSquare, Send, Clock, CheckCircle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useDashboardUser } from "@/context/SessionContext"
import { Badge, Avatar, Textarea } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"
import { useState } from "react"
import toast from "react-hot-toast"

const INQUIRY = {
  id:"iq1", propertyTitle:"3BHK Apartment in Adajan", propertyImage:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=180&fit=crop",
  buyerName:"Arjun Mehta", buyerEmail:"arjun@demo.com", buyerPhone:"+91 98765 43210",
  buyerAvatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
  message:"Hello! I'm interested in this property. Is the price negotiable? Also, what is the maintenance charge per month? Looking for a move-in ready property.",
  status:"NEW", sentAt:new Date(Date.now()-3*3600000),
}

export default function OwnerInquiryDetailPage({ params }: { params: { id: string } }) {
  const user = useDashboardUser()
  const [reply, setReply] = useState("")
  const [replies, setReplies] = useState<{text:string;time:Date}[]>([])
  const [sending, setSending] = useState(false)

  const sendReply = async () => {
    if (!reply.trim()) return
    setSending(true); await new Promise(r=>setTimeout(r,800))
    setReplies(p => [...p, { text:reply, time:new Date() }])
    setReply(""); setSending(false)
    toast.success("Reply sent!")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/owner/inquiries" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div><h1 className="page-title">Inquiry Details</h1><p className="page-subtitle">Respond to buyer inquiry</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="card-flat p-5">
              <div className="flex items-center gap-3 mb-4">
                <Avatar src={INQUIRY.buyerAvatar} name={INQUIRY.buyerName} size="md"/>
                <div><p className="font-semibold text-stone-900">{INQUIRY.buyerName}</p><p className="text-xs text-stone-400">{formatTimeAgo(INQUIRY.sentAt)}</p></div>
                <Badge variant="amber" className="ml-auto"><Clock className="w-3 h-3"/>NEW</Badge>
              </div>
              <div className="bg-stone-50 rounded-xl p-4"><p className="text-sm text-stone-700 leading-relaxed">{INQUIRY.message}</p></div>
            </div>

            {replies.map((r, i) => (
              <div key={i} className="card-flat p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={`${user.firstName} ${user.lastName}`} size="sm"/>
                  <div><p className="text-sm font-semibold text-stone-900">You (Owner)</p><p className="text-xs text-stone-400">{formatTimeAgo(r.time)}</p></div>
                  <Badge variant="blue" className="ml-auto">Reply</Badge>
                </div>
                <div className="bg-blue-50 rounded-xl p-4"><p className="text-sm text-stone-700">{r.text}</p></div>
              </div>
            ))}

            <div className="card-flat p-5 space-y-3">
              <p className="font-semibold text-stone-900">Send Reply</p>
              <Textarea value={reply} onChange={e=>setReply(e.target.value)} rows={4} placeholder="Type your response..."/>
              <div className="flex justify-end">
                <button onClick={sendReply} disabled={sending || !reply.trim()} className="btn-gold">
                  {sending ? "Sending..." : <><Send className="w-4 h-4"/>Send Reply</>}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card-flat overflow-hidden">
              <img src={INQUIRY.propertyImage} alt="" className="w-full h-32 object-cover"/>
              <div className="p-4"><p className="font-semibold text-sm text-stone-900 mb-2">{INQUIRY.propertyTitle}</p><Link href="/properties/modern-3bhk-apartment-adajan-surat" className="btn-secondary text-xs w-full flex items-center justify-center">View Listing</Link></div>
            </div>
            <div className="card-flat p-4 space-y-3">
              <p className="label">Buyer Contact</p>
              <a href={`tel:${INQUIRY.buyerPhone}`} className="flex items-center gap-2 text-sm text-stone-700 p-2 rounded-xl hover:bg-stone-50">📞 {INQUIRY.buyerPhone}</a>
              <a href={`mailto:${INQUIRY.buyerEmail}`} className="flex items-center gap-2 text-sm text-stone-700 p-2 rounded-xl hover:bg-stone-50">✉️ {INQUIRY.buyerEmail}</a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
