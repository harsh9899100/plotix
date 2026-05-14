"use client"
import { useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import { Star, Quote, Plus } from "lucide-react"
import { MOCK_TESTIMONIALS } from "@/lib/data/mock"
import toast from "react-hot-toast"

const ALL_TESTIMONIALS = [...MOCK_TESTIMONIALS, ...MOCK_TESTIMONIALS.map((t,i)=>({...t,id:`t${i+10}`,displayName:["Kavitha Nair","Suresh Iyer","Ananya Roy","Mohammed Ali","Sanjay Sharma"][i%5],role:["IT Professional","Business Owner","Doctor","Investor","Teacher"][i%5]}))]

export default function TestimonialsPage() {
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [text, setText] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const filteredRating = useState(0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitted(true)
    toast.success("Thank you! Your review will be published after moderation.")
    setShowForm(false); setText(""); setRating(5)
  }

  return (<>
    <Navbar/>
    <main className="pt-16">
      <div className="bg-stone-50 border-b border-stone-100 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag block mb-3">Client Stories</span>
          <h1 className="font-display text-5xl font-light text-stone-900 mb-4">What Our Clients <em className="not-italic text-gradient-gold">Say</em></h1>
          <p className="font-body text-stone-500 max-w-md mx-auto mb-6">Over 28,000 families have found their dream home through PLOTIX Reality. Here's what they have to say.</p>
          <div className="flex items-center justify-center gap-2 text-sm font-body text-stone-600">
            {[1,2,3,4,5].map(i=><Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400"/>)}
            <span className="ml-1 font-semibold">4.9 / 5</span>
            <span className="text-stone-400">from 8,000+ verified reviews</span>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end mb-8">
            <button onClick={()=>setShowForm(!showForm)} className="btn-gold"><Plus className="w-4 h-4"/>Write a Review</button>
          </div>

          {showForm && (
            <div className="card p-6 mb-10 max-w-2xl">
              <h3 className="font-display text-xl font-medium mb-5">Share Your Experience</h3>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="label">Your Rating</label>
                  <div className="flex gap-2 mt-1">
                    {[1,2,3,4,5].map(r=>(
                      <button type="button" key={r} onClick={()=>setRating(r)} className={`text-3xl transition-all ${r<=rating?"text-amber-400":"text-stone-200 hover:text-amber-300"}`}>★</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Your Review *</label>
                  <textarea required value={text} onChange={e=>setText(e.target.value)} rows={4} placeholder="Share your experience buying, selling, or renting through PLOTIX Reality…" className="input resize-none"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">Display Name</label><input className="input" placeholder="How should we display your name?"/></div>
                  <div><label className="label">Your Role</label><input className="input" placeholder="e.g. Software Engineer, Surat"/></div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={()=>setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-gold flex-1">Submit Review</button>
                </div>
              </form>
            </div>
          )}

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {ALL_TESTIMONIALS.map(t=>(
              <div key={t.id} className="break-inside-avoid card p-6">
                <Quote className="w-8 h-8 text-amber-200 mb-3"/>
                <div className="flex mb-3">{Array.from({length:t.rating}).map((_,i)=><Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400"/>)}</div>
                <p className="font-body text-stone-600 text-sm leading-relaxed mb-5">{t.message}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-stone-200 flex-shrink-0">
                    {t.avatar && <Image src={t.avatar} alt={t.displayName||""} fill className="object-cover" sizes="36px"/>}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-stone-900 text-sm">{t.displayName}</p>
                    <p className="text-xs text-stone-400 font-body">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer/>
  </>)
}
