"use client"
import { useState } from "react"
import { MessageSquare, Mail, Phone, Clock, CheckCircle, Archive, Trash2, Reply, Eye } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, SearchInput, Tabs, StatCard, Avatar, ConfirmDialog } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"
import toast from "react-hot-toast"

const MESSAGES = [
  { id:"m1", name:"Ramesh Verma", email:"ramesh@gmail.com", phone:"+91 98765 12345", subject:"Partnership Inquiry", message:"Hi, I run a property consultancy firm in Surat and would love to explore a partnership with PLOTIX. We currently handle 50+ properties per month.", status:"UNREAD", sentAt:new Date(Date.now()-1*3600000), category:"PARTNERSHIP" },
  { id:"m2", name:"Nita Shah", email:"nita.shah@company.com", phone:"+91 87654 23456", subject:"Technical Issue with Listing Upload", message:"I'm facing an issue while uploading property photos. The upload keeps failing after 50% even though my internet is fine. Please help resolve this urgently.", status:"UNREAD", sentAt:new Date(Date.now()-3*3600000), category:"SUPPORT" },
  { id:"m3", name:"Jignesh Patel", email:"jignesh.p@email.com", phone:"+91 93456 34567", subject:"Feedback on Platform", message:"Overall a great platform! I have a few suggestions for the search filters — adding a 'vastu-compliant' option would be very useful for Gujarati buyers.", status:"READ", sentAt:new Date(Date.now()-24*3600000), category:"FEEDBACK" },
  { id:"m4", name:"Pooja Mehta", email:"pooja@realty.in", phone:"+91 96325 45678", subject:"Press / Media Inquiry", message:"I'm a journalist covering real estate for ET. I'd like to interview PLOTIX's founder for a feature article on prop-tech startups.", status:"REPLIED", sentAt:new Date(Date.now()-3*86400000), category:"PRESS" },
]

const STATUS_CFG: Record<string,any> = { UNREAD:"amber", READ:"stone", REPLIED:"green", ARCHIVED:"stone" }
const CAT_CFG: Record<string,any> = { PARTNERSHIP:"violet", SUPPORT:"rose", FEEDBACK:"blue", PRESS:"emerald", GENERAL:"stone" }

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState(MESSAGES)
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<typeof MESSAGES[0]|null>(null)
  const [deleting, setDeleting] = useState<string|null>(null)

  const filtered = messages.filter(m => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === "all" || m.status === tab
    return matchSearch && matchTab
  })

  const markReplied = (id: string) => { setMessages(p=>p.map(m=>m.id===id?{...m,status:"REPLIED"}:m)); toast.success("Marked as replied") }
  const archive = (id: string) => { setMessages(p=>p.map(m=>m.id===id?{...m,status:"ARCHIVED"}:m)); toast.success("Archived") }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><MessageSquare className="w-7 h-7 text-blue-500"/>Contact Messages</h1>
          <p className="page-subtitle">Manage all incoming messages from the contact form.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={messages.length} icon={<MessageSquare className="w-5 h-5 text-stone-500"/>} color="bg-stone-100"/>
          <StatCard label="Unread" value={messages.filter(m=>m.status==="UNREAD").length} icon={<Mail className="w-5 h-5 text-amber-500"/>} color="bg-amber-50"/>
          <StatCard label="Replied" value={messages.filter(m=>m.status==="REPLIED").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Archived" value={messages.filter(m=>m.status==="ARCHIVED").length} icon={<Archive className="w-5 h-5 text-stone-400"/>} color="bg-stone-50"/>
        </div>

        <div className="flex gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search messages..." className="flex-1 max-w-sm"/>
          <Tabs tabs={[{value:"all",label:"All"},{value:"UNREAD",label:"Unread",count:messages.filter(m=>m.status==="UNREAD").length},{value:"REPLIED",label:"Replied"}]} active={tab} onChange={setTab}/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message list */}
          <div className="space-y-3">
            {filtered.map(msg => (
              <div key={msg.id} onClick={()=>{setMessages(p=>p.map(m=>m.id===msg.id?{...m,status:m.status==="UNREAD"?"READ":m.status}:m)); setSelected(msg)}}
                className={`card p-4 cursor-pointer transition-all ${selected?.id===msg.id?"border-stone-400 shadow-md":""} ${msg.status==="UNREAD"?"bg-amber-50/20":""}`}>
                <div className="flex items-start gap-3">
                  <Avatar name={msg.name} size="sm"/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-body ${msg.status==="UNREAD"?"font-bold text-stone-900":"font-medium text-stone-800"}`}>{msg.name}</p>
                      <p className="text-[10px] text-stone-400">{formatTimeAgo(msg.sentAt)}</p>
                    </div>
                    <p className="text-sm font-body text-stone-700 truncate">{msg.subject}</p>
                    <p className="text-xs text-stone-400 truncate mt-1">{msg.message}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={STATUS_CFG[msg.status]}>{msg.status}</Badge>
                      <Badge variant={CAT_CFG[msg.category]}>{msg.category}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected message */}
          {selected ? (
            <div className="card-flat p-5 space-y-4 sticky top-24">
              <div className="flex items-start gap-3">
                <Avatar name={selected.name} size="md"/>
                <div className="flex-1">
                  <p className="font-body font-semibold text-stone-900">{selected.name}</p>
                  <p className="text-xs text-stone-400">{selected.email}</p>
                </div>
                <Badge variant={CAT_CFG[selected.category]}>{selected.category}</Badge>
              </div>
              <h3 className="font-body font-semibold text-stone-900">{selected.subject}</h3>
              <p className="text-sm font-body text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl">{selected.message}</p>
              <div className="flex gap-2">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} onClick={()=>markReplied(selected.id)}
                  className="btn-gold text-sm flex-1 flex items-center justify-center gap-1"><Reply className="w-4 h-4"/>Reply via Email</a>
                <button onClick={()=>archive(selected.id)} className="btn-secondary text-sm"><Archive className="w-4 h-4"/></button>
                <button onClick={()=>setDeleting(selected.id)} className="btn-icon text-rose-400 hover:text-rose-600"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ) : (
            <div className="card-flat p-8 flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-10 h-10 text-stone-200 mb-3"/>
              <p className="text-stone-400 font-body">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog open={!!deleting} onClose={()=>setDeleting(null)}
        onConfirm={()=>{setMessages(p=>p.filter(m=>m.id!==deleting));setSelected(null);setDeleting(null);toast.success("Deleted")}}
        title="Delete Message?" confirmLabel="Delete" danger/>
    </DashboardLayout>
  )
}
