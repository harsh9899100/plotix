"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Save, Eye, Send, ImageIcon } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input, Textarea, Select, Checkbox } from "@/components/ui"
import toast from "react-hot-toast"

const CATEGORIES = ["Market Trends","Buying Tips","Selling Guide","Investment","Home Decor","Legal & Finance","Developer News","Area Guides"]

export default function NewBlogPostPage() {
  const [form, setForm] = useState({ title:"", slug:"", category:"Market Trends", excerpt:"", content:"", coverImage:"", tags:"", status:"DRAFT", featured:false, allowComments:true })
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const set = (k: keyof typeof form, v: any) => setForm(p => ({ ...p, [k]: v }))
  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const saveDraft = async () => { if (!form.title) return toast.error("Title required"); setSaving(true); await new Promise(r=>setTimeout(r,800)); setSaving(false); toast.success("Saved as draft") }
  const publish = async () => { if (!form.title || !form.content) return toast.error("Title and content required"); setPublishing(true); await new Promise(r=>setTimeout(r,1000)); setPublishing(false); toast.success("Blog post published!") }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/content/blog" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div><h1 className="page-title flex items-center gap-2"><FileText className="w-7 h-7"/>New Blog Post</h1><p className="page-subtitle">Create content for your audience.</p></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="card-flat p-6 space-y-4">
              <Input label="Post Title *" value={form.title} onChange={e => { set("title", e.target.value); set("slug", autoSlug(e.target.value)) }} placeholder="e.g. Top 5 Investment Areas in Surat 2024"/>
              <Input label="URL Slug" value={form.slug} onChange={e => set("slug", e.target.value)} helperText="URL: /blog/your-slug"/>
              <Textarea label="Excerpt" value={form.excerpt} onChange={e => set("excerpt", e.target.value)} rows={2} placeholder="Short description for blog listings..."/>
            </div>
            <div className="card-flat p-6 space-y-4">
              <div className="flex items-center justify-between"><p className="font-display text-lg font-medium">Content *</p><button className="btn-ghost text-xs"><Eye className="w-3.5 h-3.5"/>Preview</button></div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-2 flex gap-2 flex-wrap text-xs">
                {["B","I","H1","H2","H3","Link","Image","Quote","UL","OL"].map(t=><button key={t} className="px-2 py-1 hover:bg-white hover:shadow-sm rounded font-medium text-stone-600 transition-all">{t}</button>)}
              </div>
              <textarea value={form.content} onChange={e => set("content", e.target.value)} rows={16} className="input resize-none font-mono text-sm" placeholder="Write your blog post content here...&#10;&#10;## Heading&#10;**Bold**, *italic*&#10;&#10;- List item"/>
            </div>
            <div className="card-flat p-5">
              <p className="label mb-2">Cover Image URL</p>
              <div className="flex gap-2">
                <input value={form.coverImage} onChange={e => set("coverImage", e.target.value)} className="input flex-1" placeholder="https://images.unsplash.com/..."/>
                <button className="btn-secondary text-sm"><ImageIcon className="w-4 h-4"/>Upload</button>
              </div>
              {form.coverImage && <img src={form.coverImage} alt="cover" className="mt-3 w-full h-36 object-cover rounded-xl"/>}
            </div>
          </div>
          <div className="space-y-5">
            <div className="card-flat p-5 space-y-4">
              <h3 className="font-display text-lg font-medium">Publish Settings</h3>
              <Select label="Status" value={form.status} onChange={e=>set("status",e.target.value)} options={[{value:"DRAFT",label:"Draft"},{value:"PUBLISHED",label:"Published"}]}/>
              <Select label="Category" value={form.category} onChange={e=>set("category",e.target.value)} options={CATEGORIES.map(c=>({value:c,label:c}))}/>
              <Input label="Tags" value={form.tags} onChange={e=>set("tags",e.target.value)} placeholder="surat, investment, tips"/>
              <Checkbox id="featured-cb" label="Feature on homepage" checked={form.featured} onChange={v=>set("featured",v)}/>
              <Checkbox id="comments-cb" label="Allow comments" checked={form.allowComments} onChange={v=>set("allowComments",v)}/>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="secondary" onClick={saveDraft} loading={saving} className="w-full"><Save className="w-4 h-4"/>Save Draft</Button>
              <Button variant="gold" onClick={publish} loading={publishing} className="w-full"><Send className="w-4 h-4"/>Publish</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
