"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Megaphone, Trash2, Edit, Send } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, EmptyState, ConfirmDialog, Tabs } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"
import toast from "react-hot-toast"

const ANNOUNCEMENTS = [
  { id:"an1", title:"🎉 Platform Maintenance — Dec 5, 2024", message:"The platform will be under scheduled maintenance on December 5th from 2:00 AM to 4:00 AM IST.", target:"ALL", status:"PUBLISHED", createdAt:new Date(Date.now()-2*86400000) },
  { id:"an2", title:"📣 New Feature: AI Property Matching", message:"We've launched AI-powered property matching for buyers! Head to your dashboard to try it out.", target:"BUYERS", status:"PUBLISHED", createdAt:new Date(Date.now()-7*86400000) },
  { id:"an3", title:"💼 Commission Rate Update Q1 2025", message:"Effective January 1, 2025, the standard commission rate will be updated to 2.5%.", target:"AGENTS", status:"DRAFT", createdAt:new Date(Date.now()-86400000) },
]
const TARGET_VARS: Record<string,any> = { ALL:"stone", BUYERS:"blue", AGENTS:"violet", BUILDERS:"amber" }

export default function AnnouncementsPage() {
  const [items, setItems] = useState(ANNOUNCEMENTS)
  const [tab, setTab] = useState("all")
  const [deleting, setDeleting] = useState<string|null>(null)
  const filtered = tab === "all" ? items : items.filter(a => a.status === tab)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="page-title flex items-center gap-2"><Megaphone className="w-7 h-7 text-amber-500"/>Announcements</h1><p className="page-subtitle">Send important announcements to users.</p></div>
          <Link href="/dashboard/admin/content/announcements/new" className="btn-gold"><Plus className="w-4 h-4"/>New Announcement</Link>
        </div>
        <Tabs tabs={[{value:"all",label:"All",count:items.length},{value:"PUBLISHED",label:"Published",count:items.filter(a=>a.status==="PUBLISHED").length},{value:"DRAFT",label:"Drafts",count:items.filter(a=>a.status==="DRAFT").length}]} active={tab} onChange={setTab}/>
        {filtered.length === 0 ? (
          <EmptyState icon={<Megaphone className="w-8 h-8 text-stone-300"/>} title="No announcements" action={<Link href="/dashboard/admin/content/announcements/new" className="btn-primary">Create</Link>}/>
        ) : (
          <div className="space-y-4">
            {filtered.map(ann => (
              <div key={ann.id} className={`card p-5 ${ann.status==="DRAFT"?"border-dashed":""}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={ann.status==="PUBLISHED"?"green":"stone"}>{ann.status}</Badge>
                    <Badge variant={TARGET_VARS[ann.target]}>To: {ann.target}</Badge>
                    <span className="text-xs text-stone-400">{formatTimeAgo(ann.createdAt)}</span>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/dashboard/admin/content/announcements/${ann.id}`} className="btn-icon text-stone-400 hover:text-stone-700"><Edit className="w-4 h-4"/></Link>
                    <button onClick={()=>setDeleting(ann.id)} className="btn-icon text-stone-400 hover:text-rose-600"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
                <h3 className="font-body font-semibold text-stone-900 mb-2">{ann.title}</h3>
                <p className="text-sm font-body text-stone-500 line-clamp-2">{ann.message}</p>
                {ann.status==="DRAFT"&&<button onClick={()=>{setItems(p=>p.map(a=>a.id===ann.id?{...a,status:"PUBLISHED"}:a));toast.success("Published!")}} className="btn-gold text-xs mt-3"><Send className="w-3.5 h-3.5"/>Publish Now</button>}
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmDialog open={!!deleting} onClose={()=>setDeleting(null)} onConfirm={()=>{setItems(p=>p.filter(a=>a.id!==deleting));setDeleting(null);toast.success("Deleted")}} title="Delete Announcement?" confirmLabel="Delete" danger/>
    </DashboardLayout>
  )
}
