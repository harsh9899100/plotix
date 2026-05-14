"use client"
import { useState } from "react"
import Link from "next/link"
import { Megaphone, Mail, Share2, Globe, BarChart2, Plus, ArrowRight } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"


const TOOLS = [
  { title:"Email Campaigns", desc:"Send targeted emails to your buyer database with property updates.", icon:Mail, href:"email-campaigns", color:"bg-blue-50 text-blue-600", stats:"3 active campaigns" },
  { title:"Social Media Scheduler", desc:"Schedule posts to Facebook, Instagram and LinkedIn.", icon:Share2, href:"social-media", color:"bg-violet-50 text-violet-600", stats:"Next post: Tomorrow" },
  { title:"Landing Pages", desc:"Create dedicated landing pages for your premium listings.", icon:Globe, href:"landing-pages", color:"bg-emerald-50 text-emerald-600", stats:"2 published pages" },
]

const QUICK_STATS = [
  { label:"Email Open Rate", value:"34%", change:"+5%", color:"text-emerald-600" },
  { label:"Social Reach", value:"2.4K", change:"+18%", color:"text-emerald-600" },
  { label:"Landing Page Views", value:"847", change:"+31%", color:"text-emerald-600" },
  { label:"Leads Generated", value:"12", change:"+3", color:"text-emerald-600" },
]

export default function MarketingToolsPage() {
  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Megaphone className="w-7 h-7 text-violet-500"/>Marketing Tools</h1>
          <p className="page-subtitle">Grow your reach and attract more buyers with powerful marketing tools.</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {QUICK_STATS.map(s => (
            <div key={s.label} className="card-flat p-4">
              <p className="text-xs text-stone-400 font-body uppercase tracking-wide mb-1">{s.label}</p>
              <p className="font-display text-3xl font-light text-stone-900">{s.value}</p>
              <p className={`text-xs font-body mt-1 ${s.color}`}>↑ {s.change} this month</p>
            </div>
          ))}
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TOOLS.map(t => (
            <div key={t.title} className="card p-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${t.color}`}>
                <t.icon className="w-6 h-6"/>
              </div>
              <h3 className="font-display text-lg font-medium text-stone-900 mb-2">{t.title}</h3>
              <p className="text-sm font-body text-stone-500 mb-4 flex-1">{t.desc}</p>
              <p className="text-xs text-stone-400 font-body mb-4">{t.stats}</p>
              <Link href={`/dashboard/agent/marketing/${t.href}`} className="btn-primary text-sm w-full flex items-center justify-center gap-2">
                Open <ArrowRight className="w-4 h-4"/>
              </Link>
            </div>
          ))}
        </div>

        {/* Recent campaigns */}
        <div className="card-flat p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-medium">Recent Campaigns</h2>
            <Link href="/dashboard/agent/marketing/email-campaigns" className="text-xs text-amber-700 hover:text-amber-900">View all →</Link>
          </div>
          <div className="space-y-3">
            {[
              { name:"Weekend Property Showcase", type:"Email", sent:245, opens:83, clicks:31, date:"2 days ago", status:"Sent" },
              { name:"New Listing Alert — Vesu Penthouse", type:"Email", sent:180, opens:64, clicks:22, date:"5 days ago", status:"Sent" },
            ].map(c => (
              <div key={c.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-500"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-semibold text-stone-900 truncate">{c.name}</p>
                  <p className="text-xs text-stone-400">{c.sent} sent · {c.opens} opens · {c.clicks} clicks · {c.date}</p>
                </div>
                <span className="text-xs font-body text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
