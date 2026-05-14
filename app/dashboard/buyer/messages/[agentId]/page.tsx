"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MessageSquare, Send, Paperclip, Search, Phone, MoreHorizontal } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useDashboardUser } from "@/context/SessionContext"
import { Avatar } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"

const INITIAL_MSGS = [
  { from:"agent", text:"Hello Arjun! I saw you were interested in the penthouse. Would you like to schedule a viewing?", time:new Date(Date.now()-3*3600000) },
  { from:"buyer", text:"Yes absolutely! Can we do this Saturday around 2pm?", time:new Date(Date.now()-2*3600000) },
  { from:"agent", text:"Saturday 2pm works perfectly. I'll send you the address and access instructions.", time:new Date(Date.now()-1*3600000) },
  { from:"agent", text:"Also, please note that the property has a private terrace and pool — dress comfortably!", time:new Date(Date.now()-50*60000) },
]
const AGENT = { name:"Priya Sharma", avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face", status:"Online", phone:"+91 97654 32109" }

export default function ChatWithAgentPage({ params }: { params: { agentId: string } }) {
  const user = useDashboardUser()
  const [messages, setMessages] = useState(INITIAL_MSGS)
  const [text, setText] = useState("")

  const send = () => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { from:"buyer", text, time:new Date() }])
    setText("")
    setTimeout(() => {
      setMessages(prev => [...prev, { from:"agent", text:"I'll get back to you shortly on that.", time:new Date() }])
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-56px)] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/buyer/messages" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
            <div className="relative">
              <Avatar src={AGENT.avatar} name={AGENT.name} size="md"/>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"/>
            </div>
            <div>
              <p className="font-body font-semibold text-stone-900">{AGENT.name}</p>
              <p className="text-xs text-emerald-500 font-body">{AGENT.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`tel:${AGENT.phone}`} className="btn-icon" title="Call agent"><Phone className="w-4 h-4"/></a>
            <button className="btn-icon"><MoreHorizontal className="w-4 h-4"/></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.from === "buyer" ? "flex-row-reverse" : ""}`}>
              <div className="flex-shrink-0">
                {msg.from === "agent"
                  ? <Avatar src={AGENT.avatar} name={AGENT.name} size="sm"/>
                  : <Avatar name={`${user.firstName} ${user.lastName}`} size="sm"/>}
              </div>
              <div className={`flex flex-col gap-1 ${msg.from === "buyer" ? "items-end" : ""}`}>
                <div className={msg.from === "buyer" ? "chat-bubble-sent" : "chat-bubble-recv"}>{msg.text}</div>
                <span className="text-[10px] text-stone-400 font-body px-1">{formatTimeAgo(msg.time)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-stone-100 px-6 py-4 flex items-end gap-3 flex-shrink-0">
          <button className="btn-icon flex-shrink-0"><Paperclip className="w-4 h-4"/></button>
          <div className="flex-1 relative">
            <textarea value={text} onChange={e => setText(e.target.value)} rows={1} placeholder="Type a message…"
              className="input resize-none pr-12 min-h-[44px] max-h-32"
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}/>
          </div>
          <button onClick={send} disabled={!text.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-all flex-shrink-0"
            style={{background:"linear-gradient(135deg,#C9A07A,#A07850)"}}>
            <Send className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
