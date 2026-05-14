"use client"
import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Search, Phone, Video, MoreHorizontal, ArrowLeft, Building2 } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Avatar, cn } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"

const CONVERSATIONS = [
  { id:"c1",userId:"a1",name:"Priya Sharma",role:"Agent",avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",lastMsg:"Sure! The property is available this Saturday for viewing.",time:new Date(Date.now()-300000),unread:2,isOnline:true },
  { id:"c2",userId:"a2",name:"Rohan Mehta",role:"Agent",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",lastMsg:"I've sent you the brochure for SG Highway villa.",time:new Date(Date.now()-3600000),unread:0,isOnline:false },
  { id:"c3",userId:"a3",name:"Arjun Patel",role:"Agent",avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",lastMsg:"The price is negotiable. When can you visit?",time:new Date(Date.now()-86400000),unread:1,isOnline:true },
  { id:"c4",userId:"a4",name:"Nisha Kapoor",role:"Owner",avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",lastMsg:"Thank you for your interest in the Piplod property.",time:new Date(Date.now()-172800000),unread:0,isOnline:false },
]

const INITIAL_MSGS = [
  { id:"m1",senderId:"a1",text:"Hello! I saw you inquired about the 4BHK Penthouse in Vesu. How can I help you?",time:new Date(Date.now()-7200000),isMine:false },
  { id:"m2",senderId:"u1",text:"Hi Priya! Yes, I'm very interested. Can you tell me more about the maintenance charges and availability?",time:new Date(Date.now()-7000000),isMine:true },
  { id:"m3",senderId:"a1",text:"Of course! The maintenance is ₹8,500/month. The property is ready for immediate possession. It comes fully furnished with premium Italian marble flooring.",time:new Date(Date.now()-6800000),isMine:false },
  { id:"m4",senderId:"u1",text:"That sounds great! Is the price negotiable? And can I schedule a viewing this weekend?",time:new Date(Date.now()-600000),isMine:true },
  { id:"m5",senderId:"a1",text:"Sure! The property is available this Saturday for viewing.",time:new Date(Date.now()-300000),isMine:false },
]

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(CONVERSATIONS[0])
  const [messages, setMessages] = useState(INITIAL_MSGS)
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")
  const [showList, setShowList] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const sendMsg = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { id:`m${Date.now()}`,senderId:"u1",text:input,time:new Date(),isMine:true }])
    setInput("")
    setTimeout(() => {
      setMessages(prev => [...prev, { id:`m${Date.now()+1}`,senderId:activeConv.userId,text:"Thanks for your message! I'll get back to you shortly.",time:new Date(),isMine:false }])
    }, 1500)
  }

  const filteredConvs = CONVERSATIONS.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-56px)] flex">
        {/* Sidebar */}
        <div className={cn("w-full sm:w-80 flex-shrink-0 border-r border-stone-100 bg-white flex flex-col", !showList && "hidden sm:flex")}>
          <div className="p-4 border-b border-stone-100">
            <h2 className="font-display text-xl font-medium text-stone-900 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations..." className="input pl-9 text-sm py-2"/>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.map(conv => (
              <button key={conv.id} onClick={() => { setActiveConv(conv); setShowList(false) }}
                className={cn("w-full flex items-center gap-3 px-4 py-3.5 hover:bg-stone-50 transition-colors text-left border-b border-stone-50",
                  activeConv.id===conv.id && "bg-stone-50")}>
                <div className="relative flex-shrink-0">
                  <img src={conv.avatar} alt="" className="w-10 h-10 rounded-full object-cover"/>
                  {conv.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"/>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-body font-semibold text-stone-900 text-sm truncate">{conv.name}</span>
                    <span className="text-[10px] text-stone-400 font-body flex-shrink-0 ml-2">{formatTimeAgo(conv.time)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-stone-400 font-body truncate">{conv.lastMsg}</p>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 ml-2">{conv.unread}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn("flex-1 flex flex-col bg-stone-50/50 min-w-0", showList && "hidden sm:flex")}>
          {/* Chat Header */}
          <div className="bg-white border-b border-stone-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowList(true)} className="sm:hidden p-2 rounded-xl hover:bg-stone-100 text-stone-500">
                <ArrowLeft className="w-5 h-5"/>
              </button>
              <div className="relative">
                <img src={activeConv.avatar} alt="" className="w-10 h-10 rounded-full object-cover"/>
                {activeConv.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"/>}
              </div>
              <div>
                <p className="font-body font-semibold text-stone-900">{activeConv.name}</p>
                <p className="text-xs font-body text-stone-400">{activeConv.role} · {activeConv.isOnline ? "Online" : "Offline"}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors"><Phone className="w-5 h-5"/></button>
              <button className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors"><Video className="w-5 h-5"/></button>
              <button className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors"><MoreHorizontal className="w-5 h-5"/></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-body text-stone-400 bg-stone-100 px-3 py-1 rounded-full">Today</span>
            </div>
            {messages.map(msg => (
              <div key={msg.id} className={cn("flex items-end gap-2", msg.isMine ? "flex-row-reverse" : "flex-row")}>
                {!msg.isMine && <img src={activeConv.avatar} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1"/>}
                <div className={cn("max-w-xs lg:max-w-md xl:max-w-lg", msg.isMine ? "items-end" : "items-start") + " flex flex-col gap-1"}>
                  <div className={msg.isMine ? "chat-bubble-sent" : "chat-bubble-recv"}>{msg.text}</div>
                  <span className="text-[10px] font-body text-stone-400 px-1">{formatTimeAgo(msg.time)}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div className="bg-white border-t border-stone-100 p-4">
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl hover:bg-stone-100 text-stone-400 transition-colors flex-shrink-0"><Paperclip className="w-5 h-5"/></button>
              <input value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg()} }}
                placeholder="Type a message..." className="input flex-1 py-2.5"/>
              <button onClick={sendMsg} disabled={!input.trim()}
                className={cn("p-2.5 rounded-xl flex-shrink-0 transition-all",
                  input.trim() ? "bg-stone-900 text-white hover:bg-stone-700" : "bg-stone-100 text-stone-400 cursor-not-allowed")}>
                <Send className="w-5 h-5"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
