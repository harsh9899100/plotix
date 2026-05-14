"use client"
import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Search, Phone, Video, MoreHorizontal, ArrowLeft, Star, Clock } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Avatar, Badge, SearchInput, cn } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"
import toast from "react-hot-toast"

const CONVERSATIONS = [
  { id:"c1", userId:"b1", name:"Vikram Desai",   role:"Buyer", avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", lastMsg:"Is the property still available for viewing this Sunday?", time:new Date(Date.now()-600000), unread:2, isOnline:true, property:"4BHK Penthouse Vesu" },
  { id:"c2", userId:"b2", name:"Sneha Patel",    role:"Buyer", avatar:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face", lastMsg:"Thank you for the brochure! I'll discuss with my family.", time:new Date(Date.now()-3600000), unread:0, isOnline:false, property:"Villa SG Highway" },
  { id:"c3", userId:"b3", name:"Rahul Gupta",    role:"Buyer", avatar:"https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&crop=face", lastMsg:"What's the final price you can offer?", time:new Date(Date.now()-7200000), unread:1, isOnline:true, property:"3BHK Adajan" },
  { id:"c4", userId:"b4", name:"Anita Shah",     role:"Buyer", avatar:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face", lastMsg:"The office space looks perfect. Can we meet tomorrow?", time:new Date(Date.now()-86400000), unread:0, isOnline:false, property:"Office Athwa" },
  { id:"c5", userId:"b5", name:"Rajesh Kumar",   role:"Buyer", avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", lastMsg:"Deal confirmed! When can we sign the papers?", time:new Date(Date.now()-172800000), unread:0, isOnline:false, property:"Villa SG Highway", isStarred:true },
]

const INITIAL_MESSAGES = [
  { id:"m1", senderId:"b1", text:"Hi Priya! I inquired about the 4BHK Penthouse in Vesu. Can you tell me more about the society charges?", time:new Date(Date.now()-7200000), isMine:false },
  { id:"m2", senderId:"a1", text:"Hi Vikram! Great to hear from you. The society maintenance is ₹8,500/month which includes gym, pool, and security. The property has excellent finishes — Italian marble flooring and a premium modular kitchen.", time:new Date(Date.now()-7000000), isMine:true },
  { id:"m3", senderId:"b1", text:"That sounds amazing! Can you share the floor plan? Also, is the price negotiable?", time:new Date(Date.now()-6500000), isMine:false },
  { id:"m4", senderId:"a1", text:"Absolutely! I'm attaching the floor plan. As for the price, the owner is open to a small negotiation for serious buyers. What's your budget range?", time:new Date(Date.now()-6000000), isMine:true },
  { id:"m5", senderId:"b1", text:"Our budget is around ₹1.8–2 Cr. We're serious buyers with home loan pre-approval ready. 🙌", time:new Date(Date.now()-3600000), isMine:false },
  { id:"m6", senderId:"a1", text:"Perfect! That aligns well. Let me speak to the owner and get back to you today. Would you like to schedule a site visit this weekend?", time:new Date(Date.now()-3400000), isMine:true },
  { id:"m7", senderId:"b1", text:"Is the property still available for viewing this Sunday?", time:new Date(Date.now()-600000), isMine:false },
]

export default function AgentMessagesPage() {
  const [activeConv, setActiveConv] = useState(CONVERSATIONS[0])
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")
  const [showList, setShowList] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }) }, [messages])

  const sendMsg = () => {
    if (!input.trim()) return
    const newMsg = { id:`m${Date.now()}`, senderId:"a1", text:input, time:new Date(), isMine:true }
    setMessages(prev => [...prev, newMsg])
    setInput("")
    setTimeout(() => {
      setMessages(prev => [...prev, { id:`m${Date.now()+1}`, senderId:activeConv.userId, text:"Thanks for your reply! I'll check my schedule and confirm.", time:new Date(), isMine:false }])
    }, 2000)
  }

  const quickReplies = ["Sure, Sunday works!","I'll share the documents shortly.","Let me check with the owner.","Would you like to schedule a visit?"]
  const filteredConvs = CONVERSATIONS.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.property.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-56px)] flex">
        {/* Sidebar */}
        <div className={cn("w-full sm:w-80 lg:w-96 flex-shrink-0 border-r border-stone-100 bg-white flex flex-col", !showList && "hidden sm:flex")}>
          <div className="p-4 border-b border-stone-100">
            <h2 className="font-display text-xl font-medium text-stone-900 mb-3">Messages</h2>
            <SearchInput value={search} onChange={setSearch} placeholder="Search conversations…"/>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.map(conv => (
              <button key={conv.id} onClick={() => { setActiveConv(conv); setShowList(false) }}
                className={cn("w-full flex items-start gap-3 px-4 py-3.5 hover:bg-stone-50 transition-colors text-left border-b border-stone-50", activeConv.id===conv.id && "bg-stone-50 border-l-2 border-l-stone-900")}>
                <div className="relative flex-shrink-0">
                  <img src={conv.avatar} alt="" className="w-11 h-11 rounded-full object-cover"/>
                  {conv.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"/>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-body font-semibold text-stone-900 text-sm">{conv.name}</span>
                      {(conv as any).isStarred && <Star className="w-3 h-3 fill-amber-400 text-amber-400"/>}
                    </div>
                    <span className="text-[10px] text-stone-400 font-body flex-shrink-0">{formatTimeAgo(conv.time)}</span>
                  </div>
                  <p className="text-[10px] text-amber-700 font-body mb-1 truncate">Re: {conv.property}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-stone-400 font-body truncate flex-1">{conv.lastMsg}</p>
                    {conv.unread > 0 && <span className="w-5 h-5 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 ml-2">{conv.unread}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className={cn("flex-1 flex flex-col bg-stone-50/30 min-w-0", showList && "hidden sm:flex")}>
          {/* Header */}
          <div className="bg-white border-b border-stone-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowList(true)} className="sm:hidden p-2 rounded-xl hover:bg-stone-100 text-stone-500"><ArrowLeft className="w-5 h-5"/></button>
              <div className="relative">
                <img src={activeConv.avatar} alt="" className="w-10 h-10 rounded-full object-cover"/>
                {activeConv.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"/>}
              </div>
              <div>
                <p className="font-body font-semibold text-stone-900">{activeConv.name}</p>
                <p className="text-xs font-body text-stone-400">{activeConv.role} · Re: {activeConv.property}</p>
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
            <div className="text-center"><span className="text-[10px] font-body text-stone-400 bg-stone-100 px-3 py-1 rounded-full">Today</span></div>
            {messages.map(msg => (
              <div key={msg.id} className={cn("flex items-end gap-2", msg.isMine ? "flex-row-reverse" : "flex-row")}>
                {!msg.isMine && <img src={activeConv.avatar} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1"/>}
                <div className={cn("flex flex-col gap-1", msg.isMine ? "items-end" : "items-start")}>
                  <div className={msg.isMine ? "chat-bubble-sent" : "chat-bubble-recv"}>{msg.text}</div>
                  <span className="text-[10px] font-body text-stone-400 px-1">{formatTimeAgo(msg.time)}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 bg-white border-t border-stone-100 flex gap-2 overflow-x-auto scrollbar-hide">
            {quickReplies.map(qr => (
              <button key={qr} onClick={() => setInput(qr)} className="flex-shrink-0 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-body rounded-full transition-colors whitespace-nowrap">{qr}</button>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white border-t border-stone-100 p-4">
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl hover:bg-stone-100 text-stone-400 transition-colors flex-shrink-0"><Paperclip className="w-5 h-5"/></button>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg()} }}
                placeholder="Type a message…" className="input flex-1 py-2.5"/>
              <button onClick={sendMsg} disabled={!input.trim()}
                className={cn("p-2.5 rounded-xl flex-shrink-0 transition-all", input.trim() ? "bg-stone-900 text-white hover:bg-stone-700" : "bg-stone-100 text-stone-400 cursor-not-allowed")}>
                <Send className="w-5 h-5"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
