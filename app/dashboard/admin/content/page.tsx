"use client"
import Link from "next/link"
import { FileText, Megaphone, HelpCircle, MessageSquare, Star, ArrowRight, PlusCircle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"

const SECTIONS = [
  { title:"Blog Posts", desc:"Create and manage educational content, market insights, and guides for buyers and sellers.", icon:FileText, href:"/dashboard/admin/content/blog", color:"bg-blue-50 text-blue-600", stats:{ total:24, published:18, draft:6 } },
  { title:"Announcements", desc:"Send platform-wide announcements to specific user groups or all users.", icon:Megaphone, href:"/dashboard/admin/content/announcements", color:"bg-amber-50 text-amber-600", stats:{ total:5, published:3, draft:2 } },
  { title:"FAQs", desc:"Manage frequently asked questions displayed on the platform and help center.", icon:HelpCircle, href:"/dashboard/admin/content/faqs", color:"bg-violet-50 text-violet-600", stats:{ total:12, published:10, draft:2 } },
  { title:"Contact Messages", desc:"View and respond to messages submitted through the contact form.", icon:MessageSquare, href:"/dashboard/admin/content/contact-messages", color:"bg-emerald-50 text-emerald-600", stats:{ total:8, unread:3, replied:5 } },
  { title:"Testimonials", desc:"Moderate user reviews and testimonials. Feature the best ones on the homepage.", icon:Star, href:"/dashboard/admin/content/testimonials", color:"bg-rose-50 text-rose-600", stats:{ total:31, published:28, pending:3 } },
]

export default function AdminContentPage() {
  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title">Content Management</h1>
          <p className="page-subtitle">Manage all platform content including blog posts, announcements, FAQs, and user testimonials.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECTIONS.map(s => (
            <div key={s.title} className="card p-6 flex flex-col">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                <s.icon className="w-6 h-6"/>
              </div>
              <h2 className="font-display text-xl font-medium text-stone-900 mb-2">{s.title}</h2>
              <p className="text-sm font-body text-stone-500 mb-4 flex-1">{s.desc}</p>
              <div className="flex gap-3 text-xs text-stone-400 font-body mb-5">
                {Object.entries(s.stats).map(([k,v]) => (
                  <span key={k}><b className="text-stone-700">{v}</b> {k}</span>
                ))}
              </div>
              <div className="flex gap-2 mt-auto">
                <Link href={s.href} className="btn-primary text-sm flex-1 flex items-center justify-center gap-1">
                  Manage <ArrowRight className="w-3.5 h-3.5"/>
                </Link>
                <Link href={`${s.href}/new`} className="btn-icon text-stone-500 hover:text-stone-900" title="Create new">
                  <PlusCircle className="w-5 h-5"/>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
