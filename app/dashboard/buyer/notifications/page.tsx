"use client"
import { useState } from "react"
import { Bell, MessageSquare, Heart, Calendar, TrendingUp, DollarSign, CheckCircle, Trash2, Settings } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, Tabs, EmptyState } from "@/components/ui"
import { formatTimeAgo, cn } from "@/lib/utils"
import toast from "react-hot-toast"
import Link from "next/link"

const NOTIF_CONFIG: Record<string,{icon:any;color:string;bg:string}> = {
  INQUIRY:       { icon:MessageSquare, color:"text-violet-500", bg:"bg-violet-50" },
  MESSAGE:       { icon:MessageSquare, color:"text-blue-500",   bg:"bg-blue-50" },
  VIEWING:       { icon:Calendar,      color:"text-emerald-500",bg:"bg-emerald-50" },
  PRICE_DROP:    { icon:TrendingUp,    color:"text-rose-500",   bg:"bg-rose-50" },
  NEW_LISTING:   { icon:Heart,         color:"text-amber-500",  bg:"bg-amber-50" },
  PROPERTY_MATCH:{ icon:CheckCircle,   color:"text-emerald-500",bg:"bg-emerald-50" },
  PAYMENT:       { icon:DollarSign,    color:"text-amber-500",  bg:"bg-amber-50" },
  SYSTEM:        { icon:Bell,          color:"text-stone-500",  bg:"bg-stone-100" },
}

const MOCK_NOTIFS = [
  { id:"n1",type:"MESSAGE",       title:"New message from Priya Sharma",      message:"Sure! The property is available this Saturday for viewing.",  isRead:false, createdAt:new Date(Date.now()-300000),   href:"/dashboard/buyer/messages" },
  { id:"n2",type:"PROPERTY_MATCH",title:"New property matches your request",  message:'A 3BHK apartment in Adajan matches your "3BHK in Surat" request.',isRead:false,createdAt:new Date(Date.now()-3600000),  href:"/properties/modern-3bhk-apartment-adajan-surat" },
  { id:"n3",type:"PRICE_DROP",    title:"Price drop alert!",                  message:'The price of "Luxurious 4BHK Penthouse in Vesu" dropped by ₹5L.',isRead:false,createdAt:new Date(Date.now()-7200000),  href:"/properties/luxurious-4bhk-penthouse-vesu-surat" },
  { id:"n4",type:"VIEWING",       title:"Viewing reminder",                   message:'Your viewing for "Modern 3BHK in Adajan" is tomorrow at 11 AM.',  isRead:true, createdAt:new Date(Date.now()-86400000), href:"/dashboard/buyer/viewings" },
  { id:"n5",type:"INQUIRY",       title:"Inquiry responded",                  message:'Agent Rohan Mehta responded to your inquiry on the SG Highway villa.',isRead:true,createdAt:new Date(Date.now()-172800000),href:"/dashboard/buyer/inquiries" },
  { id:"n6",type:"NEW_LISTING",   title:"New listing in your saved search",   message:'A new 4BHK villa was listed in Ahmedabad matching your saved search.',isRead:true,createdAt:new Date(Date.now()-259200000),href:"/properties" },
  { id:"n7",type:"SYSTEM",        title:"Profile verified",                   message:'Your email has been verified. Your account is fully active.',        isRead:true,createdAt:new Date(Date.now()-345600000),href:"/dashboard/buyer/profile" },
]

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS)
  const [tab, setTab] = useState("all")

  const unreadCount = notifs.filter(n=>!n.isRead).length
  const filtered = notifs.filter(n => tab==="all" || (tab==="unread" && !n.isRead) || (tab==="read" && n.isRead))

  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id===id ? {...n,isRead:true} : n))
  const markAllRead = () => { setNotifs(prev => prev.map(n => ({...n,isRead:true}))); toast.success("All marked as read") }
  const deleteNotif = (id: string) => { setNotifs(prev => prev.filter(n => n.id!==id)); toast.success("Notification removed") }
  const clearAll = () => { setNotifs([]); toast.success("All notifications cleared") }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Bell className="w-7 h-7 text-stone-500"/>Notifications
              {unreadCount>0 && <span className="w-6 h-6 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
            </h1>
            <p className="page-subtitle">{unreadCount} unread notifications</p>
          </div>
          <div className="flex gap-2">
            {unreadCount>0 && <button onClick={markAllRead} className="btn-secondary text-xs py-2 px-3"><CheckCircle className="w-3.5 h-3.5"/>Mark all read</button>}
            {notifs.length>0 && <button onClick={clearAll} className="btn-ghost text-xs py-2 px-3 text-rose-500 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5"/>Clear all</button>}
            <Link href="/dashboard/buyer/settings" className="btn-icon"><Settings className="w-5 h-5"/></Link>
          </div>
        </div>

        <Tabs
          tabs={[
            {value:"all",   label:"All",    count:notifs.length},
            {value:"unread",label:"Unread", count:unreadCount},
            {value:"read",  label:"Read",   count:notifs.length-unreadCount},
          ]}
          active={tab} onChange={setTab}
        />

        {filtered.length===0 ? (
          <EmptyState icon={<Bell className="w-8 h-8 text-stone-300"/>} title="All caught up!" description="No notifications to show right now."/>
        ) : (
          <div className="space-y-2">
            {filtered.map(n => {
              const cfg = NOTIF_CONFIG[n.type] || NOTIF_CONFIG.SYSTEM
              return (
                <div key={n.id}
                  className={cn("card p-4 hover:shadow-md transition-all cursor-pointer group", !n.isRead && "border-blue-200 bg-blue-50/20")}
                  onClick={()=>markRead(n.id)}>
                  <div className="flex items-start gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",cfg.bg)}>
                      <cfg.icon className={cn("w-5 h-5",cfg.color)}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className={cn("text-sm font-body font-semibold truncate",!n.isRead?"text-stone-900":"text-stone-700")}>{n.title}</p>
                          <p className="text-xs font-body text-stone-500 mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[10px] font-body text-stone-400 mt-1">{formatTimeAgo(n.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"/>}
                          <button onClick={e=>{e.stopPropagation();deleteNotif(n.id)}}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-3.5 h-3.5"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
