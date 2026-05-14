"use client"
import { useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name:"",email:"",phone:"",subject:"",message:"" })
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    await new Promise(r=>setTimeout(r,1200))
    setSent(true); setLoading(false)
    toast.success("Message sent! We'll get back to you within 24 hours.")
  }

  return (<>
    <Navbar/>
    <main className="pt-16">
      {/* Header */}
      <div className="bg-stone-50 border-b border-stone-100 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag block mb-3">Get in Touch</span>
          <h1 className="font-display text-5xl font-light text-stone-900 mb-4">Contact <em className="not-italic text-gradient-gold">Us</em></h1>
          <p className="font-body text-stone-500 max-w-md mx-auto">Have a question or need help? Our team typically responds within 2 hours.</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-light text-stone-900">Our Offices</h2>
              {[
                { icon:MapPin, title:"Surat HQ",   info:["Plot 42, Vesu Main Road","Surat, Gujarat 395007"] },
                { icon:Phone,  title:"Call Us",     info:["+91 800 000 0000","+91 261 000 0000"] },
                { icon:Mail,   title:"Email Us",    info:["hello@plotix.in","support@plotix.in"] },
                { icon:Clock,  title:"Working Hours",info:["Mon–Sat: 9am – 7pm","Sun: 10am – 4pm"] },
              ].map(item=>(
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0"><item.icon className="w-5 h-5 text-amber-700"/></div>
                  <div><p className="font-body font-semibold text-stone-900 text-sm mb-1">{item.title}</p>{item.info.map(line=><p key={line} className="font-body text-stone-500 text-sm">{line}</p>)}</div>
                </div>
              ))}
              {/* Map embed */}
              <div className="rounded-2xl overflow-hidden h-48 border border-stone-200">
                <iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDnIoG0enyntSAu8pL_FolU8_zSbyLPzC4&q=Vesu,Surat,Gujarat&zoom=13" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" title="Office Location"/>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {sent ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-emerald-500"/></div>
                  <h3 className="font-display text-2xl font-light text-stone-900 mb-2">Message Sent!</h3>
                  <p className="font-body text-stone-500 mb-6">We'll get back to you at {form.email} within 24 hours.</p>
                  <button onClick={()=>setSent(false)} className="btn-secondary">Send Another</button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <h2 className="font-display text-2xl font-light text-stone-900 mb-6">Send a Message</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div><label className="label">Full Name *</label><input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Rahul Mehta" className="input"/></div>
                    <div><label className="label">Email Address *</label><input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com" className="input"/></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div><label className="label">Phone Number</label><input type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+91 98765 43210" className="input"/></div>
                    <div>
                      <label className="label">Subject *</label>
                      <select required value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} className="select">
                        <option value="">Select topic</option>
                        {["General Inquiry","Property Listing","Agent Support","Technical Issue","Partnership","Other"].map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label className="label">Message *</label><textarea required rows={5} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Tell us how we can help you…" className="input resize-none"/></div>
                  <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 px-8 py-3.5 rounded-xl text-base">
                    {loading?<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Sending…</>:<><Send className="w-5 h-5"/>Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer/>
  </>)
}
