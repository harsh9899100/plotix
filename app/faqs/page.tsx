"use client"
import { useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { ChevronDown, ChevronUp, Search } from "lucide-react"
import Link from "next/link"

const FAQS = [
  { cat:"Buying",   q:"How do I verify a property's legal status?",         a:"Always check the title deed, encumbrance certificate, and RERA registration. PLOTIX provides document verification for listed properties, and we recommend consulting a registered property lawyer before completing the purchase." },
  { cat:"Buying",   q:"What documents do I need to buy a property?",         a:"You'll typically need: PAN card, Aadhaar, income proof (salary slips or ITR), bank statements for 6 months, passport-size photos, and address proof. For home loans, the bank will require additional documents." },
  { cat:"Buying",   q:"How does PLOTIX verify listed properties?",           a:"Our team physically verifies each property, checks ownership documents, confirms RERA registration, and validates agent credentials before any listing goes live on the platform." },
  { cat:"Selling",  q:"How do I list my property on PLOTIX?",                a:"Register as a Seller or Agent, complete your profile, and use our step-by-step listing tool. Upload photos, add details, and submit for review. Our team approves listings within 24 hours." },
  { cat:"Selling",  q:"What is the commission structure?",                   a:"Agents earn 3–6% commission on sales. PLOTIX charges a platform fee of 1–2% on successful transactions. There are no upfront listing fees for verified agents." },
  { cat:"Agents",   q:"How do I become a verified agent on PLOTIX?",         a:"Submit your RERA registration number, license details, and identity documents. Our team verifies your credentials within 48 hours. Verified agents get priority listing placement and a verification badge." },
  { cat:"Agents",   q:"Can I list properties for multiple clients?",         a:"Yes, Agent and Broker accounts can list unlimited properties for multiple clients. You can manage all listings from a single dashboard." },
  { cat:"Payments", q:"What payment methods are accepted?",                   a:"We accept NEFT/RTGS, UPI, credit/debit cards, and net banking. For high-value transactions, we recommend bank transfers with proper documentation." },
  { cat:"Payments", q:"Is my payment secure on PLOTIX?",                     a:"Yes. All payments are processed through PCI-DSS compliant payment gateways. We also offer an escrow service for property transactions to protect both buyers and sellers." },
  { cat:"General",  q:"Is PLOTIX available across all Indian cities?",       a:"We currently operate in 85+ cities across India, with a strong presence in Gujarat, Maharashtra, Karnataka, and Delhi NCR. We're continuously expanding to new markets." },
  { cat:"General",  q:"How do I schedule a property viewing?",               a:"On any property listing, click 'Schedule Viewing' to choose from available time slots. You'll receive a confirmation via email and SMS, with reminders 24 hours and 1 hour before." },
  { cat:"General",  q:"Can I compare multiple properties?",                   a:"Yes! Add any property to your comparison cart (up to 10 properties) and view them side by side. Compare price, area, amenities, location scores, and investment metrics." },
]

const CATEGORIES = ["All", ...Array.from(new Set(FAQS.map(f => f.cat)))]

export default function FAQsPage() {
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState("All")
  const [open, setOpen] = useState<number|null>(null)

  const filtered = FAQS.filter(f =>
    (cat==="All" || f.cat===cat) &&
    (!search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
  )

  return (<>
    <Navbar/>
    <main className="pt-16">
      <div className="bg-stone-50 border-b border-stone-100 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag block mb-3">Help Center</span>
          <h1 className="font-display text-5xl font-light text-stone-900 mb-4">Frequently Asked <em className="not-italic text-gradient-gold">Questions</em></h1>
          <p className="font-body text-stone-500 max-w-md mx-auto mb-8">Find answers to the most common questions about buying, selling, and renting on PLOTIX.</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search questions…" className="input pl-12 py-4 text-base shadow-sm"/>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 flex-wrap mb-10 justify-center">
            {CATEGORIES.map(c=>(
              <button key={c} onClick={()=>setCat(c)} className={`px-4 py-2 rounded-xl text-sm font-body font-medium border transition-all ${cat===c?"bg-stone-900 text-white border-stone-900":"bg-white text-stone-600 border-stone-200 hover:border-stone-400"}`}>{c}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12"><p className="font-body text-stone-400">No questions matching your search. <button onClick={()=>{setSearch("");setCat("All")}} className="text-amber-700 underline">Clear filters</button></p></div>
          ) : (
            <div className="space-y-3">
              {filtered.map((faq, i) => (
                <div key={i} className="card overflow-hidden">
                  <button onClick={()=>setOpen(open===i?null:i)} className="w-full flex items-center justify-between p-5 text-left gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-body font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">{faq.cat}</span>
                      <h3 className="font-body font-semibold text-stone-900 text-sm">{faq.q}</h3>
                    </div>
                    {open===i ? <ChevronUp className="w-5 h-5 text-stone-400 flex-shrink-0"/> : <ChevronDown className="w-5 h-5 text-stone-400 flex-shrink-0"/>}
                  </button>
                  {open===i && (
                    <div className="px-5 pb-5 pt-0 border-t border-stone-100">
                      <p className="font-body text-stone-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-stone-50 rounded-2xl border border-stone-200 p-8 text-center">
            <h3 className="font-display text-xl font-medium text-stone-900 mb-2">Still have questions?</h3>
            <p className="font-body text-stone-500 text-sm mb-5">Our support team is available Monday–Saturday, 9am to 7pm IST.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/contactus" className="btn-primary">Contact Support</Link>
              <a href="tel:+918000000000" className="btn-secondary">Call Us</a>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer/>
  </>)
}
