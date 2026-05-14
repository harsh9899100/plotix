"use client"
import { useState } from "react"
import { MessageSquare, Send } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Avatar, SearchInput } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"

const CONVERSATIONS = [
  { id:"c1", participantName:"Arjun Mehta", participantAvatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", lastMessage:"Can you share the floor plan for 1204?", time:new Date(Date.now()-1*3600000), unread:2, messages:[
    { from:"buyer", text:"Hello, I'm interested in Unit 1204. Can you share the floor plan?", time:new Date(Date.now()-1*3600000) },
  ]},
  { id:"c2", participantName:"Priya Sharma", participantAvatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face", lastMessage:"My client is ready for the final visit.", time:new Date(Date.now()-3*3600000), unread:0, messages:[
    { from:"agent", text:"My client Meera Patel is ready for the final visit to Villa B-05.", time:new Date(Date.now()-3*3600000) },
    { from:"builder", text:"Great! Let's schedule for Saturday 11am?", time:new Date(Date.now()-2.5*3600000) },
  ]},
]

export default function BuilderMessagesPage() {
  const [conversations, setConversations] = useState(CONVERSATIONS)
  const [active, setActive] = useState(CONVERSATIONS[0])
  const [reply, setReply] = useState("")
  const [search, setSearch] = useState("")
  const filtered = conversations.filter(c => !search || c.participantName.toLowerCase().includes(search.toLowerCase()))

  const sendReply = () => {
    if (!reply.trim()) return
    const msg = { from:"builder", text:reply, time:new Date() }
    setConversations(p => p.map(c => c.id === active.id ? { ...c, lastMessage:reply, messages:[...c.messages, msg] } : c))
    setActive(p => ({ ...p, messages:[...p.messages, msg] }))
    setReply("")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6">
        <h1 className="page-title flex items-center gap-2 mb-5"><MessageSquare className="w-7 h-7 text-blue-500" />Messages</h1>
        <div className="card-flat overflow-hidden flex h-[70vh]">
          <div className="w-72 border-r border-stone-100 flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-stone-100"><SearchInput value={search} onChange={setSearch} placeholder="Search..." /></div>
            <div className="overflow-y-auto flex-1">
              {filtered.map(conv => (
                <div key={conv.id} onClick={() => { setActive(conv); setConversations(p => p.map(c => c.id === conv.id ? { ...c, unread:0 } : c)) }}
                  className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-stone-50 border-b border-stone-50 ${active.id === conv.id ? "bg-stone-100" : ""}`}>
                  <div className="relative flex-shrink-0">
                    <Avatar src={conv.participantAvatar} name={conv.participantName} size="md" />
                    {conv.unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">{conv.unread}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${conv.unread > 0 ? "font-bold text-stone-900" : "font-medium text-stone-700"}`}>{conv.participantName}</p>
                    <p className="text-xs text-stone-400 truncate">{conv.lastMessage}</p>
                    <p className="text-[10px] text-stone-300 mt-0.5">{formatTimeAgo(conv.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-stone-100 flex items-center gap-3">
              <Avatar src={active.participantAvatar} name={active.participantName} size="sm" />
              <p className="font-body font-semibold text-stone-900">{active.participantName}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {active.messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "builder" ? "justify-end" : "justify-start"}`}>
                  <div className={msg.from === "builder" ? "chat-bubble-sent" : "chat-bubble-recv"}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.from === "builder" ? "text-white/50" : "text-stone-400"}`}>{formatTimeAgo(msg.time)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-stone-100 flex gap-2">
              <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === "Enter" && sendReply()} placeholder="Type a message..." className="input flex-1 text-sm" />
              <button onClick={sendReply} disabled={!reply.trim()} className="btn-gold px-4"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
