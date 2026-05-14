"use client"
import Link from "next/link"
import { ArrowLeft, MessageSquare, CheckCircle, Clock, User, Phone, Mail, Home, Send } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui"
import { formatDateTime } from "@/lib/utils"
import { useState } from "react"
import toast from "react-hot-toast"

const MOCK_INQUIRY = {
  id:"iq1", propertyTitle:"Luxurious 4BHK Penthouse in Vesu", propertySlug:"luxurious-4bhk-penthouse-vesu-surat",
  propertyImage:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop",
  propertyPrice:"₹3.85 Cr", propertyLocation:"Vesu, Surat, Gujarat",
  agentName:"Priya Sharma", agentEmail:"priya@plotixrealty.com", agentPhone:"+91 97654 32109",
  agentAvatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
  status:"RESPONDED",
  messages:[
    { from:"buyer", text:"Hi, I'm very interested in this penthouse. Can we schedule a viewing this weekend?", time:new Date(Date.now()-5*3600000) },
    { from:"agent", text:"Hello Arjun! I'm glad you reached out. I'm available Saturday from 11am to 5pm and Sunday from 2pm to 6pm. Which slot works for you?", time:new Date(Date.now()-3*3600000) },
    { from:"buyer", text:"Saturday 2pm works perfectly for me!", time:new Date(Date.now()-2*3600000) },
    { from:"agent", text:"Great! I've scheduled the viewing for Saturday at 2pm. I'll send you the confirmation and directions shortly. Please bring a valid ID.", time:new Date(Date.now()-1*3600000) },
  ]
}

export default function InquiryDetailPage({ params }: { params: { id: string } }) {
  const [reply, setReply] = useState("")
  const [messages, setMessages] = useState(MOCK_INQUIRY.messages)
  const [sending, setSending] = useState(false)

  const sendReply = async () => {
    if (!reply.trim()) return
    setSending(true)
    await new Promise(r => setTimeout(r, 600))
    setMessages(prev => [...prev, { from:"buyer", text:reply, time:new Date() }])
    setReply("")
    setSending(false)
    toast.success("Message sent!")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/buyer/inquiries" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title">Inquiry Thread</h1>
            <p className="page-subtitle">Your inquiry conversation with the agent.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thread */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card-flat p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.from === "buyer" ? "flex-row-reverse" : ""}`}>
                  <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {msg.from === "agent"
                      ? <img src={MOCK_INQUIRY.agentAvatar} alt="" className="w-full h-full object-cover"/>
                      : <User className="w-4 h-4 text-stone-500"/>}
                  </div>
                  <div className={`max-w-[80%] ${msg.from === "buyer" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className={msg.from === "buyer" ? "chat-bubble-sent" : "chat-bubble-recv"}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-stone-400 font-body px-1">{formatDateTime(msg.time)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply box */}
            <div className="card-flat p-4">
              <p className="label mb-2">Send a message</p>
              <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3}
                placeholder="Type your message here..." className="input resize-none mb-3"
                onKeyDown={e => { if (e.key === "Enter" && e.metaKey) sendReply() }}/>
              <div className="flex justify-end">
                <button onClick={sendReply} disabled={!reply.trim() || sending}
                  className="btn-gold disabled:opacity-50">
                  <Send className="w-4 h-4"/> Send
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Property card */}
            <div className="card-flat overflow-hidden">
              <img src={MOCK_INQUIRY.propertyImage} alt="" className="w-full h-36 object-cover"/>
              <div className="p-4">
                <p className="font-body font-semibold text-stone-900 text-sm line-clamp-2 mb-1">{MOCK_INQUIRY.propertyTitle}</p>
                <p className="text-xs text-stone-400 font-body mb-2">{MOCK_INQUIRY.propertyLocation}</p>
                <p className="font-display text-lg text-amber-700">{MOCK_INQUIRY.propertyPrice}</p>
                <Link href={`/properties/${MOCK_INQUIRY.propertySlug}`}
                  className="btn-secondary text-xs w-full mt-3 flex items-center justify-center gap-1">
                  <Home className="w-3 h-3"/> View Property
                </Link>
              </div>
            </div>

            {/* Agent card */}
            <div className="card-flat p-4">
              <p className="label mb-3">Agent Details</p>
              <div className="flex items-center gap-3 mb-4">
                <img src={MOCK_INQUIRY.agentAvatar} alt="" className="w-12 h-12 rounded-xl object-cover"/>
                <div>
                  <p className="font-body font-semibold text-stone-900">{MOCK_INQUIRY.agentName}</p>
                  <p className="text-xs text-stone-400">Licensed Agent</p>
                </div>
              </div>
              <div className="space-y-2">
                <a href={`tel:${MOCK_INQUIRY.agentPhone}`} className="flex items-center gap-2 text-xs font-body text-stone-600 hover:text-stone-900">
                  <Phone className="w-3.5 h-3.5"/>{MOCK_INQUIRY.agentPhone}
                </a>
                <a href={`mailto:${MOCK_INQUIRY.agentEmail}`} className="flex items-center gap-2 text-xs font-body text-stone-600 hover:text-stone-900">
                  <Mail className="w-3.5 h-3.5"/>{MOCK_INQUIRY.agentEmail}
                </a>
              </div>
            </div>

            <div className="card-flat p-4">
              <p className="label mb-2">Status</p>
              <Badge variant="green"><CheckCircle className="w-3 h-3"/>Agent Responded</Badge>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
