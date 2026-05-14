"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Star, Send, CheckCircle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input, Textarea, Select } from "@/components/ui"
import { MOCK_PROPERTIES } from "@/lib/data/mock"
import toast from "react-hot-toast"


export default function WriteReviewPage() {
  const [form, setForm] = useState({ propertyId:"", rating:0, title:"", comment:"", categories:{ property:0, agent:0, experience:0 } })
  const [hover, setHover] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  const rate = (key: "property"|"agent"|"experience", val: number) =>
    setForm(p => ({ ...p, categories: { ...p.categories, [key]: val } }))

  const submit = async () => {
    if (!form.propertyId) return toast.error("Select a property")
    if (!form.rating) return toast.error("Please give a rating")
    if (form.comment.length < 20) return toast.error("Comment must be at least 20 characters")
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    setSubmitted(true)
  }

  if (submitted) return (
    <DashboardLayout>
      <div className="dashboard-main py-16 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500"/>
        </div>
        <h2 className="font-display text-3xl font-light text-stone-900 mb-3">Review Submitted!</h2>
        <p className="font-body text-stone-500 mb-8">Thank you for your feedback. Your review helps others make informed decisions.</p>
        <div className="flex gap-3">
          <Link href="/dashboard/buyer/reviews" className="btn-secondary">View My Reviews</Link>
          <Link href="/properties" className="btn-gold">Browse Properties</Link>
        </div>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/buyer/reviews" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title flex items-center gap-2"><Star className="w-7 h-7 text-amber-400"/>Write a Review</h1>
            <p className="page-subtitle">Share your honest experience about a property.</p>
          </div>
        </div>

        <div className="card-flat p-6 space-y-5">
          <Select label="Select Property" value={form.propertyId} onChange={e => setForm(p=>({...p,propertyId:e.target.value}))}
            placeholder="Choose a property you visited..."
            options={MOCK_PROPERTIES.slice(0,6).map(p => ({ value:p.id, label:p.title }))}/>

          <div>
            <p className="label mb-2">Overall Rating *</p>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(r => (
                <button key={r} onMouseEnter={() => setHover(r)} onMouseLeave={() => setHover(0)}
                  onClick={() => setForm(p=>({...p,rating:r}))}
                  className="text-3xl transition-all hover:scale-110">
                  <span className={(hover || form.rating) >= r ? "text-amber-400" : "text-stone-200"}>★</span>
                </button>
              ))}
              {form.rating > 0 && (
                <span className="text-sm font-body text-stone-500 self-center ml-2">
                  {["","Terrible","Poor","Average","Good","Excellent"][form.rating]}
                </span>
              )}
            </div>
          </div>

          <Input label="Review Title" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))}
            placeholder="Summarize your experience in one line"/>
          <Textarea label="Your Review *" value={form.comment} onChange={e => setForm(p=>({...p,comment:e.target.value}))}
            rows={5} placeholder="Tell others about the property condition, the agent's service, the neighborhood, and anything else that would help..."/>
        </div>

        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium text-stone-900">Category Ratings</h2>
          {(["property","agent","experience"] as const).map(cat => (
            <div key={cat} className="flex items-center justify-between">
              <p className="text-sm font-body font-medium text-stone-700 capitalize">{cat === "experience" ? "Overall Experience" : cat === "agent" ? "Agent Service" : "Property Condition"}</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(r => (
                  <button key={r} onClick={() => rate(cat, r)} className={`text-xl transition-all ${form.categories[cat] >= r ? "text-amber-400" : "text-stone-200"}`}>★</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/dashboard/buyer/reviews" className="btn-secondary">Cancel</Link>
          <Button variant="gold" onClick={submit} loading={saving}><Send className="w-4 h-4"/>Submit Review</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
