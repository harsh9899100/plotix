"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Paperclip, MoreHorizontal, Phone } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useDashboardUser } from "@/context/SessionContext"
import { Avatar } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"

const BUYER = { name:"Arjun Mehta", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", phone:"+91 98765 43210", status:"Online" }
const INITIAL = [
  { from:"buyer", text:"Hi, I saw your listing for the penthouse. Is it still available?", time:new Date(Date.now()-4*3600000) },
  { from:"agent", text:"Hello Arjun! Yes, the penthouse is still available. Would you like to schedule a viewing?", time:new Date(Date.now()-3*3600000) },
  { from:"buyer", text:"Yes! Can we do Saturday at 2pm?", time:new Date(Date.now()-2*3600000) },
  { from:"agent", text:"Perfect! I've scheduled you in for Saturday at 2:00 PM. Please bring a valid ID. Looking forward to meeting you!", time:new Date(Date.now()-1*3600000) },
]

export default function AgentChatPage({ params }: { params: { buyerId: string } }) {
  const user = useDashboardUser()
  const [messages, setMessages] = useState(INITIAL)
  const [text, setText] = useState("")
  const send = () => {
    if (!text.trim()) return
    setMessages(p => [...p, { from:"agent", text, time:new Date() }])
    setText("")
  }
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-56px)] flex flex-col">
        <div className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/agent/messages" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
            <div className="relative">
              <Avatar src={BUYER.avatar} name={BUYER.name} size="md"/>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"/>
            </div>
            <div>
              <p className="font-body font-semibold text-stone-900">{BUYER.name}</p>
              <p className="text-xs text-emerald-500 font-body">{BUYER.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`tel:${BUYER.phone}`} className="btn-icon"><Phone className="w-4 h-4"/></a>
            <button className="btn-icon"><MoreHorizontal className="w-4 h-4"/></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.from === "agent" ? "flex-row-reverse" : ""}`}>
              <div className="flex-shrink-0">
                {msg.from === "buyer" ? <Avatar src={BUYER.avatar} name={BUYER.name} size="sm"/> : <Avatar name={`${user.firstName} ${user.lastName}`} size="sm"/>}
              </div>
              <div className={`flex flex-col gap-1 ${msg.from === "agent" ? "items-end" : ""}`}>
                <div className={msg.from === "agent" ? "chat-bubble-sent" : "chat-bubble-recv"}>{msg.text}</div>
                <span className="text-[10px] text-stone-400 font-body px-1">{formatTimeAgo(msg.time)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white border-t border-stone-100 px-6 py-4 flex items-end gap-3 flex-shrink-0">
          <button className="btn-icon flex-shrink-0"><Paperclip className="w-4 h-4"/></button>
          <div className="flex-1">
            <textarea value={text} onChange={e=>setText(e.target.value)} rows={1} placeholder="Type a message…"
              className="input resize-none min-h-[44px] max-h-32"
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}}/>
          </div>
          <button onClick={send} disabled={!text.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white disabled:opacity-40"
            style={{background:"linear-gradient(135deg,#C9A07A,#A07850)"}}>
            <Send className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
