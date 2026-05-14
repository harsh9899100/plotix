"use client"
import { useState } from "react"
import { Star, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, Avatar, ConfirmDialog, Tabs, StatCard } from "@/components/ui"
import { formatDate, formatTimeAgo } from "@/lib/utils"
import toast from "react-hot-toast"

const TESTIMONIALS = [
  { id:"t1", name:"Priya Kapoor", city:"Surat", avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face", rating:5, role:"Buyer", text:"PLOTIX made our home buying journey incredibly smooth. The platform had extensive listings with detailed photos and clear pricing. Our agent was professional and responsive. Highly recommend!", status:"PUBLISHED", featured:true, submittedAt:new Date(Date.now()-30*86400000) },
  { id:"t2", name:"Rahul Gupta", city:"Ahmedabad", avatar:"", rating:5, role:"Agent", text:"As an agent, PLOTIX has transformed how I manage listings and client relationships. The lead management tools and inquiry system save me hours every week.", status:"PUBLISHED", featured:false, submittedAt:new Date(Date.now()-20*86400000) },
  { id:"t3", name:"Anjali Sharma", city:"Surat", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", rating:4, role:"Buyer", text:"Good platform with lots of properties. Wish the search filters were a bit more detailed, but overall the experience was great and we found our dream home!", status:"PENDING", featured:false, submittedAt:new Date(Date.now()-7*86400000) },
]

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(TESTIMONIALS)
  const [tab, setTab] = useState("all")
  const [deleting, setDeleting] = useState<string|null>(null)

  const filtered = tab === "all" ? testimonials : tab === "FEATURED" ? testimonials.filter(t=>t.featured) : testimonials.filter(t=>t.status===tab)

  const approve = (id: string) => { setTestimonials(p=>p.map(t=>t.id===id?{...t,status:"PUBLISHED"}:t)); toast.success("Testimonial published!") }
  const reject = (id: string) => { setTestimonials(p=>p.filter(t=>t.id!==id)); toast.success("Testimonial removed") }
  const toggleFeatured = (id: string) => { setTestimonials(p=>p.map(t=>t.id===id?{...t,featured:!t.featured}:t)); toast.success("Featured status updated") }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="page-title flex items-center gap-2"><Star className="w-7 h-7 text-amber-400"/>Testimonials</h1><p className="page-subtitle">Manage user reviews and testimonials displayed on the platform.</p></div>
          <button onClick={()=>toast.success("Add testimonial modal")} className="btn-gold"><Plus className="w-4 h-4"/>Add Testimonial</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={testimonials.length} icon={<Star className="w-5 h-5 text-amber-400"/>} color="bg-amber-50"/>
          <StatCard label="Published" value={testimonials.filter(t=>t.status==="PUBLISHED").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Pending" value={testimonials.filter(t=>t.status==="PENDING").length} icon={<Eye className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
          <StatCard label="Featured" value={testimonials.filter(t=>t.featured).length} icon={<Star className="w-5 h-5 text-violet-500"/>} color="bg-violet-50"/>
        </div>

        <Tabs tabs={[{value:"all",label:"All",count:testimonials.length},{value:"PENDING",label:"Pending Review",count:testimonials.filter(t=>t.status==="PENDING").length},{value:"PUBLISHED",label:"Published"},{value:"FEATURED",label:"Featured"}]}
          active={tab} onChange={setTab}/>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(t => (
            <div key={t.id} className={`card p-5 ${t.status==="PENDING"?"border-amber-200 bg-amber-50/10":""} ${t.featured?"border-violet-300 bg-violet-50/10":""}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar src={t.avatar} name={t.name} size="sm"/>
                  <div>
                    <p className="font-body font-semibold text-stone-900 text-sm">{t.name}</p>
                    <p className="text-xs text-stone-400">{t.role} · {t.city}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Badge variant={t.status==="PUBLISHED"?"green":t.status==="PENDING"?"amber":"stone"}>{t.status}</Badge>
                  {t.featured && <Badge variant="violet">⭐ Featured</Badge>}
                </div>
              </div>
              <div className="flex mb-3">{Array.from({length:t.rating}).map((_,i)=><Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400"/>)}</div>
              <p className="text-sm font-body text-stone-600 italic line-clamp-3 mb-4">"{t.text}"</p>
              <p className="text-xs text-stone-400 mb-3">{formatDate(t.submittedAt)}</p>
              <div className="flex gap-1.5 flex-wrap">
                {t.status==="PENDING"&&<button onClick={()=>approve(t.id)} className="btn-success text-xs"><CheckCircle className="w-3.5 h-3.5"/>Approve</button>}
                <button onClick={()=>toggleFeatured(t.id)} className="btn-secondary text-xs">{t.featured?"Unfeature":"Feature"}</button>
                <button onClick={()=>setDeleting(t.id)} className="btn-icon text-stone-400 hover:text-rose-600 ml-auto"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmDialog open={!!deleting} onClose={()=>setDeleting(null)} onConfirm={()=>{setTestimonials(p=>p.filter(t=>t.id!==deleting));setDeleting(null);toast.success("Deleted")}} title="Delete Testimonial?" confirmLabel="Delete" danger/>
    </DashboardLayout>
  )
}
