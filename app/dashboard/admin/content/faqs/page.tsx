"use client"
import { useState } from "react"
import Link from "next/link"
import { Plus, HelpCircle, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, EmptyState, ConfirmDialog } from "@/components/ui"
import toast from "react-hot-toast"

const INITIAL_FAQS = [
  { id:"f1", question:"How does PLOTIX Reality verify property listings?", answer:"All listings are reviewed by our admin team within 24–48 hours. We verify property details, ownership documents, and agent/builder credentials before publishing.", category:"Listings", status:"PUBLISHED", order:1 },
  { id:"f2", question:"What is the commission structure for agents?", answer:"Agents earn between 1.5% to 2.5% commission on each successful property transaction. The exact rate is agreed upon during listing and is deducted from the transaction value.", category:"Commission", status:"PUBLISHED", order:2 },
  { id:"f3", question:"How do I schedule a property viewing?", answer:"You can schedule viewings directly through the property page by clicking 'Schedule Viewing', or by contacting the listed agent/owner directly through the platform messaging system.", category:"Viewings", status:"PUBLISHED", order:3 },
  { id:"f4", question:"Is my personal data secure on PLOTIX?", answer:"Yes. We use bank-grade encryption (TLS 1.3) for all data transmission and AES-256 for data at rest. We are fully GDPR and India's DPDP Act compliant.", category:"Security", status:"DRAFT", order:4 },
]

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState(INITIAL_FAQS)
  const [expanded, setExpanded] = useState<string|null>(null)
  const [deleting, setDeleting] = useState<string|null>(null)

  const togglePublish = (id: string) => {
    setFaqs(p => p.map(f => f.id === id ? { ...f, status: f.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" } : f))
    toast.success("Status updated")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="page-title flex items-center gap-2"><HelpCircle className="w-7 h-7 text-amber-500"/>FAQs</h1><p className="page-subtitle">Manage frequently asked questions shown on the platform.</p></div>
          <Link href="/dashboard/admin/content/faqs/new" className="btn-gold"><Plus className="w-4 h-4"/>Add FAQ</Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="card-flat p-4 bg-emerald-50"><p className="text-xs text-stone-400 uppercase font-body">Published</p><p className="font-display text-3xl font-light">{faqs.filter(f=>f.status==="PUBLISHED").length}</p></div>
          <div className="card-flat p-4 bg-stone-100"><p className="text-xs text-stone-400 uppercase font-body">Drafts</p><p className="font-display text-3xl font-light">{faqs.filter(f=>f.status==="DRAFT").length}</p></div>
          <div className="card-flat p-4 bg-blue-50"><p className="text-xs text-stone-400 uppercase font-body">Categories</p><p className="font-display text-3xl font-light">{new Set(faqs.map(f=>f.category)).size}</p></div>
        </div>

        {faqs.length === 0 ? (
          <EmptyState icon={<HelpCircle className="w-8 h-8 text-stone-300"/>} title="No FAQs" action={<Link href="/dashboard/admin/content/faqs/new" className="btn-primary">Add FAQ</Link>}/>
        ) : (
          <div className="space-y-3">
            {faqs.sort((a,b)=>a.order-b.order).map(faq => (
              <div key={faq.id} className={`card overflow-hidden ${faq.status==="DRAFT"?"border-dashed border-stone-200":""}`}>
                <div className="flex items-start gap-3 p-4 cursor-pointer hover:bg-stone-50 transition-colors" onClick={()=>setExpanded(expanded===faq.id?null:faq.id)}>
                  <span className="text-stone-300 font-display text-lg mt-0.5">{String(faq.order).padStart(2,"0")}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="stone" className="text-[10px]">{faq.category}</Badge>
                      <Badge variant={faq.status==="PUBLISHED"?"green":"stone"}>{faq.status}</Badge>
                    </div>
                    <p className="font-body font-semibold text-stone-900">{faq.question}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-auto flex-shrink-0" onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>togglePublish(faq.id)} className={`btn-ghost text-xs py-1 px-2 ${faq.status==="PUBLISHED"?"text-amber-600":"text-emerald-600"}`}>{faq.status==="PUBLISHED"?"Unpublish":"Publish"}</button>
                    <Link href={`/dashboard/admin/content/faqs/${faq.id}/edit`} className="btn-icon text-stone-400 hover:text-stone-700"><Edit className="w-4 h-4"/></Link>
                    <button onClick={()=>setDeleting(faq.id)} className="btn-icon text-stone-400 hover:text-rose-600"><Trash2 className="w-4 h-4"/></button>
                    {expanded===faq.id?<ChevronUp className="w-4 h-4 text-stone-400"/>:<ChevronDown className="w-4 h-4 text-stone-400"/>}
                  </div>
                </div>
                {expanded===faq.id&&(
                  <div className="px-4 pb-4 border-t border-stone-100 pt-3">
                    <p className="text-sm font-body text-stone-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmDialog open={!!deleting} onClose={()=>setDeleting(null)}
        onConfirm={()=>{setFaqs(p=>p.filter(f=>f.id!==deleting));setDeleting(null);toast.success("FAQ deleted")}}
        title="Delete FAQ?" confirmLabel="Delete" danger/>
    </DashboardLayout>
  )
}
