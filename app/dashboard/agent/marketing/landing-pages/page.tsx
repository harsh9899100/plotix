"use client"
import Link from "next/link"
import { ArrowLeft, Globe, Plus, Edit, Eye, Trash2, TrendingUp, MousePointer } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, EmptyState } from "@/components/ui"
import { formatDate } from "@/lib/utils"
import { useState } from "react"
import toast from "react-hot-toast"


const PAGES = [
  { id:"lp1", title:"Karan Sky Residences — Luxury Apartments in Vesu", slug:"karan-sky-residences", propertyLink:"luxurious-4bhk-penthouse-vesu-surat", views:847, leads:12, status:"PUBLISHED", createdAt:new Date(Date.now()-14*86400000), thumbnail:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=180&fit=crop" },
  { id:"lp2", title:"Exclusive Weekend Open House — Adajan Apartments", slug:"open-house-adajan", propertyLink:"modern-3bhk-apartment-adajan-surat", views:312, leads:5, status:"PUBLISHED", createdAt:new Date(Date.now()-7*86400000), thumbnail:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=180&fit=crop" },
  { id:"lp3", title:"Premium Villas — Gated Community Launch", slug:"premium-villas-launch", propertyLink:"spectacular-villa-sg-highway-ahmedabad", views:0, leads:0, status:"DRAFT", createdAt:new Date(Date.now()-2*86400000), thumbnail:"" },
]

export default function LandingPagesPage() {
  const [pages, setPages] = useState(PAGES)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/agent/marketing" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
            <div>
              <h1 className="page-title flex items-center gap-2"><Globe className="w-7 h-7 text-emerald-500"/>Landing Pages</h1>
              <p className="page-subtitle">Custom landing pages to showcase your top listings.</p>
            </div>
          </div>
          <Link href="/dashboard/agent/marketing/landing-pages/new" className="btn-gold"><Plus className="w-4 h-4"/>Create Page</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card-flat p-4 bg-blue-50">
            <p className="text-xs text-stone-400 uppercase font-body">Total Views</p>
            <p className="font-display text-3xl font-light text-stone-900">{pages.reduce((a,p)=>a+p.views,0).toLocaleString()}</p>
          </div>
          <div className="card-flat p-4 bg-emerald-50">
            <p className="text-xs text-stone-400 uppercase font-body">Leads Generated</p>
            <p className="font-display text-3xl font-light text-stone-900">{pages.reduce((a,p)=>a+p.leads,0)}</p>
          </div>
          <div className="card-flat p-4 bg-amber-50">
            <p className="text-xs text-stone-400 uppercase font-body">Active Pages</p>
            <p className="font-display text-3xl font-light text-stone-900">{pages.filter(p=>p.status==="PUBLISHED").length}</p>
          </div>
        </div>

        {pages.length === 0 ? (
          <EmptyState icon={<Globe className="w-8 h-8 text-stone-300"/>} title="No landing pages"
            description="Create a landing page for your premium property listings."
            action={<Link href="/dashboard/agent/marketing/landing-pages/new" className="btn-primary">Create Page</Link>}/>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pages.map(page => (
              <div key={page.id} className="card overflow-hidden group">
                <div className="relative h-36 bg-stone-100">
                  {page.thumbnail ? (
                    <img src={page.thumbnail} alt="" className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Globe className="w-8 h-8 text-stone-300"/>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                    <Link href={`/dashboard/agent/marketing/landing-pages/${page.id}`} className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-stone-50">
                      <Edit className="w-4 h-4 text-stone-700"/>
                    </Link>
                    <a href={`/lp/${page.slug}`} target="_blank" className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-stone-50">
                      <Eye className="w-4 h-4 text-stone-700"/>
                    </a>
                    <button onClick={() => { setPages(p=>p.filter(x=>x.id!==page.id)); toast.success("Page deleted") }}
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-rose-50">
                      <Trash2 className="w-4 h-4 text-rose-500"/>
                    </button>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant={page.status==="PUBLISHED"?"green":"stone"}>{page.status}</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-body font-semibold text-stone-900 text-sm line-clamp-2 mb-3">{page.title}</h3>
                  <div className="flex items-center justify-between text-xs text-stone-400 font-body">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3"/>{page.views.toLocaleString()} views</span>
                    <span className="flex items-center gap-1"><MousePointer className="w-3 h-3"/>{page.leads} leads</span>
                    <span>{formatDate(page.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
