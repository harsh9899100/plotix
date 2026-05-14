"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, Video, CheckCircle, AlertCircle, MessageSquare, Star } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui"
import { formatDateTime, formatTimeAgo } from "@/lib/utils"
import toast from "react-hot-toast"

const VIEWING = {
  id:"v1", propertyTitle:"Luxurious 4BHK Penthouse in Vesu",
  propertyImage:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=300&fit=crop",
  propertySlug:"luxurious-4bhk-penthouse-vesu-surat", propertyPrice:"₹3.85 Cr",
  agentName:"Priya Sharma", agentPhone:"+91 97654 32109",
  agentAvatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
  scheduledAt:new Date(Date.now()+86400000), duration:60, type:"IN_PERSON",
  status:"SCHEDULED", location:"Sky High Tower, Vesu, Surat, Gujarat 395007",
  notes:"Please bring a valid ID and arrive 5 minutes early.",
  directions:"Take the main gate entrance. Parking is available on Level B1.",
}

export default function ViewingDetailPage({ params }: { params: { id: string } }) {
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const isUpcoming = VIEWING.status === "SCHEDULED"
  const isCompleted = VIEWING.status === "COMPLETED"

  const submitFeedback = async () => {
    if (!feedbackRating) return toast.error("Please select a rating")
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setSubmitting(false)
    toast.success("Feedback submitted! Thank you.")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/buyer/viewings" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title">Viewing Details</h1>
            <p className="page-subtitle">{isUpcoming ? "Upcoming viewing appointment" : "Completed viewing"}</p>
          </div>
        </div>

        {/* Property banner */}
        <div className="card overflow-hidden">
          <div className="relative h-48">
            <img src={VIEWING.propertyImage} alt="" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
            <div className="absolute bottom-0 left-0 p-5 text-white">
              <h2 className="font-display text-xl font-medium">{VIEWING.propertyTitle}</h2>
              <p className="font-display text-amber-300 text-lg">{VIEWING.propertyPrice}</p>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant={isUpcoming ? "blue" : "green"}>
                {isUpcoming ? <Clock className="w-3 h-3"/> : <CheckCircle className="w-3 h-3"/>}
                {isUpcoming ? "Upcoming" : "Completed"}
              </Badge>
            </div>
          </div>
          <div className="p-5 flex flex-wrap gap-3">
            <Link href={`/properties/${VIEWING.propertySlug}`} className="btn-secondary text-sm">View Listing</Link>
            {isUpcoming && (
              <>
                <button className="btn-ghost text-sm" onClick={() => toast.success("Reschedule request sent!")}>Reschedule</button>
                <button className="btn-danger text-sm" onClick={() => toast.error("Viewing cancelled")}>Cancel</button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Details */}
          <div className="card-flat p-6 space-y-4">
            <h3 className="font-display text-lg font-medium text-stone-900">Appointment Info</h3>
            {[
              { icon:<Calendar className="w-4 h-4 text-blue-500"/>, label:"Date & Time", value:formatDateTime(VIEWING.scheduledAt) },
              { icon:<Clock className="w-4 h-4 text-amber-500"/>, label:"Duration", value:`${VIEWING.duration} minutes` },
              { icon:VIEWING.type === "VIRTUAL" ? <Video className="w-4 h-4 text-violet-500"/> : <MapPin className="w-4 h-4 text-rose-500"/>, label:"Type", value:VIEWING.type.replace("_"," ") },
              { icon:<MapPin className="w-4 h-4 text-stone-400"/>, label:"Location", value:VIEWING.location },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center flex-shrink-0">{f.icon}</div>
                <div>
                  <p className="text-xs text-stone-400 font-body">{f.label}</p>
                  <p className="text-sm font-body font-medium text-stone-800">{f.value}</p>
                </div>
              </div>
            ))}

            {VIEWING.notes && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs font-body font-semibold text-amber-700 mb-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/>Notes from Agent</p>
                <p className="text-sm font-body text-amber-800">{VIEWING.notes}</p>
              </div>
            )}
          </div>

          {/* Agent */}
          <div className="card-flat p-6 space-y-5">
            <h3 className="font-display text-lg font-medium text-stone-900">Your Agent</h3>
            <div className="flex items-center gap-3">
              <img src={VIEWING.agentAvatar} alt="" className="w-14 h-14 rounded-xl object-cover"/>
              <div>
                <p className="font-body font-semibold text-stone-900">{VIEWING.agentName}</p>
                <p className="text-xs text-stone-400">Licensed Real Estate Agent</p>
              </div>
            </div>
            <div className="space-y-2">
              <a href={`tel:${VIEWING.agentPhone}`} className="btn-secondary text-sm w-full flex items-center justify-center gap-2">
                📞 {VIEWING.agentPhone}
              </a>
              <Link href={`/dashboard/buyer/messages/agent-${params.id}`} className="btn-ghost text-sm w-full flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4"/> Message Agent
              </Link>
            </div>
          </div>
        </div>

        {/* Feedback (for completed viewings) */}
        {isCompleted && (
          <div className="card-flat p-6 space-y-4">
            <h3 className="font-display text-lg font-medium text-stone-900">Leave Feedback</h3>
            <div>
              <p className="label mb-2">How was the viewing experience?</p>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(r => (
                  <button key={r} onClick={() => setFeedbackRating(r)}
                    className={`text-3xl transition-all hover:scale-110 ${feedbackRating >= r ? "text-amber-400" : "text-stone-200"}`}>★</button>
                ))}
              </div>
            </div>
            <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)}
              rows={3} placeholder="Share your thoughts about the property and agent..." className="input resize-none"/>
            <button onClick={submitFeedback} disabled={submitting || !feedbackRating} className="btn-gold disabled:opacity-50">
              <Star className="w-4 h-4"/> Submit Feedback
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
