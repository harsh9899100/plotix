"use client"
import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, Video, User, CheckCircle, XCircle, MoreHorizontal, Plus } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, EmptyState, Tabs, StatCard } from "@/components/ui"
import { formatDateTime, cn } from "@/lib/utils"
import toast from "react-hot-toast"


const MOCK_VIEWINGS = [
  { id:"v1",propertyTitle:"Luxurious 4BHK Penthouse in Vesu",propertyImage:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=150&fit=crop",propertySlug:"luxurious-4bhk-penthouse-vesu-surat",agentName:"Priya Sharma",agentAvatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",agentPhone:"+91 97654 32109",scheduledAt:new Date(Date.now()+86400000),duration:60,type:"IN_PERSON",status:"SCHEDULED",location:"Sky High Tower, Vesu, Surat",notes:"Please bring your ID proof" },
  { id:"v2",propertyTitle:"Modern 3BHK Apartment in Adajan",propertyImage:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&h=150&fit=crop",propertySlug:"modern-3bhk-apartment-adajan-surat",agentName:"Rohan Mehta",agentAvatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",agentPhone:"+91 98765 43210",scheduledAt:new Date(Date.now()+3*86400000),duration:45,type:"VIRTUAL",status:"SCHEDULED",location:"Video call link will be shared",notes:"" },
  { id:"v3",propertyTitle:"Spectacular Villa in SG Highway",propertyImage:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=200&h=150&fit=crop",propertySlug:"spectacular-villa-sg-highway-ahmedabad",agentName:"Priya Sharma",agentAvatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",agentPhone:"+91 97654 32109",scheduledAt:new Date(Date.now()-2*86400000),duration:90,type:"IN_PERSON",status:"COMPLETED",location:"Prestige Villas, SG Highway, Ahmedabad",notes:"",feedback:"Great property! Loved the private pool and smart home features.",rating:5 },
  { id:"v4",propertyTitle:"Sea-View 4BHK in Worli",propertyImage:"https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=150&fit=crop",propertySlug:"sea-view-4bhk-worli-mumbai",agentName:"Rohan Mehta",agentAvatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",agentPhone:"+91 98765 43210",scheduledAt:new Date(Date.now()-5*86400000),duration:60,type:"IN_PERSON",status:"CANCELLED",location:"Sea View Tower, Worli, Mumbai",notes:"",cancelReason:"Agent unavailable" },
]

const TYPE_ICON = { IN_PERSON: MapPin, VIRTUAL: Video, VIDEO_CALL: Video }
const STATUS_CONFIG: Record<string,{label:string;variant:any;icon:any}> = {
  SCHEDULED:  { label:"Upcoming",  variant:"blue",  icon:Clock },
  COMPLETED:  { label:"Completed", variant:"green", icon:CheckCircle },
  CANCELLED:  { label:"Cancelled", variant:"rose",  icon:XCircle },
  NO_SHOW:    { label:"No Show",   variant:"stone", icon:XCircle },
}

export default function BuyerViewingsPage() {
  const [viewings, setViewings] = useState(MOCK_VIEWINGS)
  const [tab, setTab] = useState("all")
  const [feedbackModal, setFeedbackModal] = useState<string|null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackRating, setFeedbackRating] = useState(5)

  const filtered = viewings.filter(v => tab==="all" || v.status===tab)

  const cancel = (id: string) => {
    setViewings(prev => prev.map(v => v.id===id ? {...v,status:"CANCELLED"} : v))
    toast.success("Viewing cancelled")
  }

  const submitFeedback = (id: string) => {
    setViewings(prev => prev.map(v => v.id===id ? {...v,feedback:feedbackText,rating:feedbackRating} : v))
    toast.success("Feedback submitted!")
    setFeedbackModal(null); setFeedbackText(""); setFeedbackRating(5)
  }

  const stats = { upcoming: viewings.filter(v=>v.status==="SCHEDULED").length, completed: viewings.filter(v=>v.status==="COMPLETED").length, total: viewings.length }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="page-title flex items-center gap-2"><Calendar className="w-7 h-7 text-emerald-500"/>My Viewings</h1><p className="page-subtitle">{stats.upcoming} upcoming · {stats.completed} completed</p></div>
          <Link href="/properties" className="btn-gold"><Plus className="w-4 h-4"/>Book Viewing</Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            {label:"Upcoming",value:stats.upcoming,color:"bg-blue-50",icon:<Clock className="w-5 h-5 text-blue-500"/>},
            {label:"Completed",value:stats.completed,color:"bg-emerald-50",icon:<CheckCircle className="w-5 h-5 text-emerald-500"/>},
            {label:"Total",value:stats.total,color:"bg-stone-100",icon:<Calendar className="w-5 h-5 text-stone-500"/>},
          ].map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        <Tabs
          tabs={[{value:"all",label:"All",count:viewings.length},{value:"SCHEDULED",label:"Upcoming",count:stats.upcoming},{value:"COMPLETED",label:"Completed",count:stats.completed},{value:"CANCELLED",label:"Cancelled",count:viewings.filter(v=>v.status==="CANCELLED").length}]}
          active={tab} onChange={setTab}
        />

        {filtered.length===0 ? (
          <EmptyState icon={<Calendar className="w-8 h-8 text-stone-300"/>} title="No viewings found" description="Book a viewing for a property you're interested in." action={<Link href="/properties" className="btn-primary">Browse Properties</Link>}/>
        ) : (
          <div className="space-y-4">
            {filtered.map(v => {
              const cfg = STATUS_CONFIG[v.status]
              const TypeIcon = TYPE_ICON[v.type as keyof typeof TYPE_ICON] || MapPin
              const isUpcoming = v.status==="SCHEDULED"
              const isCompleted = v.status==="COMPLETED"
              return (
                <div key={v.id} className={cn("card p-5", isUpcoming && "border-blue-200 bg-blue-50/30")}>
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 relative">
                      <img src={v.propertyImage} alt="" className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                        <div>
                          <Link href={`/properties/${v.propertySlug}`} className="font-body font-semibold text-stone-900 hover:text-amber-700 transition-colors line-clamp-1">{v.propertyTitle}</Link>
                          <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-stone-500 font-body">
                            <span className="flex items-center gap-1"><TypeIcon className="w-3.5 h-3.5"/>{v.type.replace("_"," ")}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/>{v.duration} min</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/>{v.location}</span>
                          </div>
                        </div>
                        <Badge variant={cfg.variant}><cfg.icon className="w-3 h-3"/>{cfg.label}</Badge>
                      </div>

                      <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-body font-semibold mb-3", isUpcoming?"bg-blue-100 text-blue-800":"bg-stone-100 text-stone-700")}>
                        <Calendar className="w-4 h-4"/>
                        {formatDateTime(v.scheduledAt)}
                      </div>

                      <div className="flex items-center gap-3">
                        <img src={v.agentAvatar} alt="" className="w-7 h-7 rounded-full object-cover"/>
                        <div>
                          <p className="text-xs font-body font-semibold text-stone-700">{v.agentName}</p>
                          <a href={`tel:${v.agentPhone}`} className="text-[10px] text-stone-400 font-body hover:text-stone-600">{v.agentPhone}</a>
                        </div>
                      </div>

                      {v.notes && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mt-3 font-body">📌 {v.notes}</p>}
                      {isCompleted && v.feedback && (
                        <div className="mt-3 bg-stone-50 rounded-xl p-3">
                          <div className="flex items-center gap-1 mb-1">
                            {Array.from({length:5}).map((_,i)=><span key={i} className={i<(v.rating||0)?"text-amber-400":"text-stone-200"}>★</span>)}
                          </div>
                          <p className="text-xs font-body text-stone-600">{v.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-stone-100 flex-wrap">
                    {isUpcoming && (
                      <>
                        <button className="btn-secondary text-xs py-2">Reschedule</button>
                        <button onClick={()=>cancel(v.id)} className="btn-danger text-xs py-2">Cancel</button>
                      </>
                    )}
                    {isCompleted && !v.feedback && (
                      <button onClick={()=>setFeedbackModal(v.id)} className="btn-gold text-xs py-2">Leave Feedback</button>
                    )}
                    <Link href={`/properties/${v.propertySlug}`} className="btn-ghost text-xs py-2">View Property</Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Feedback Modal */}
        {feedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={()=>setFeedbackModal(null)}/>
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="font-display text-xl font-medium mb-4">Leave Viewing Feedback</h3>
              <div className="mb-4">
                <p className="label mb-2">Rating</p>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(r=>(
                    <button key={r} onClick={()=>setFeedbackRating(r)} className={cn("text-2xl transition-all",r<=feedbackRating?"text-amber-400":"text-stone-200 hover:text-amber-300")}>★</button>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <p className="label mb-1">Your Feedback</p>
                <textarea value={feedbackText} onChange={e=>setFeedbackText(e.target.value)} rows={3} placeholder="Share your experience..." className="input resize-none"/>
              </div>
              <div className="flex gap-3">
                <button onClick={()=>setFeedbackModal(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={()=>submitFeedback(feedbackModal)} className="btn-gold flex-1" disabled={!feedbackText.trim()}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
