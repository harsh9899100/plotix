"use client"
import { useState } from "react"
import { Settings, Globe, Mail, Bell, DollarSign, Save, Sliders } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input, Select, Checkbox, Textarea } from "@/components/ui"
import toast from "react-hot-toast"


export default function AdminGeneralSettingsPage() {
  const [form, setForm] = useState({
    siteName:"PLOTIX Reality", supportEmail:"support@plotix.in", supportPhone:"+91 1800-PLOTIX",
    maxPropertyImages:"20", maxVideoSize:"100", defaultListingDuration:"90",
    autoApproveOwnerListings:false, requireAgentKYC:true, showAgentContact:true,
    enableReviews:true, enableBlog:true, enableTestimonials:true,
    footerText:"© 2024 PLOTIX Reality. All rights reserved.",
    googleAnalyticsId:"G-XXXXXXXXXX", facebookPixelId:""
  })
  const [saving, setSaving] = useState(false)
  const set = (k: keyof typeof form, v: any) => setForm(p => ({ ...p, [k]: v }))
  const save = async () => { setSaving(true); await new Promise(r=>setTimeout(r,1000)); setSaving(false); toast.success("Settings saved!") }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-3xl space-y-6">
        <div><h1 className="page-title flex items-center gap-2"><Settings className="w-7 h-7 text-stone-500"/>General Settings</h1><p className="page-subtitle">Manage global platform configuration.</p></div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Globe className="w-5 h-5"/>Platform Info</h2>
          <Input label="Platform Name" value={form.siteName} onChange={e=>set("siteName",e.target.value)}/>
          <div className="form-grid-2">
            <Input label="Support Email" type="email" value={form.supportEmail} onChange={e=>set("supportEmail",e.target.value)}/>
            <Input label="Support Phone" value={form.supportPhone} onChange={e=>set("supportPhone",e.target.value)}/>
          </div>
          <Textarea label="Footer Text" value={form.footerText} onChange={e=>set("footerText",e.target.value)} rows={2}/>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Sliders className="w-5 h-5"/>Listing Settings</h2>
          <div className="form-grid-2">
            <Input label="Max Property Images" type="number" value={form.maxPropertyImages} onChange={e=>set("maxPropertyImages",e.target.value)}/>
            <Input label="Listing Duration (days)" type="number" value={form.defaultListingDuration} onChange={e=>set("defaultListingDuration",e.target.value)}/>
          </div>
          <div className="space-y-2">
            <Checkbox id="auto-approve" label="Auto-approve owner property listings (no admin review)" checked={form.autoApproveOwnerListings} onChange={v=>set("autoApproveOwnerListings",v)}/>
            <Checkbox id="kyc-required" label="Require KYC verification for all agents before listing" checked={form.requireAgentKYC} onChange={v=>set("requireAgentKYC",v)}/>
            <Checkbox id="show-contact" label="Show agent/owner contact details on listing page" checked={form.showAgentContact} onChange={v=>set("showAgentContact",v)}/>
          </div>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium">Feature Toggles</h2>
          <div className="space-y-2">
            <Checkbox id="reviews-tog" label="Enable property and agent reviews" checked={form.enableReviews} onChange={v=>set("enableReviews",v)}/>
            <Checkbox id="blog-tog" label="Enable blog / articles section" checked={form.enableBlog} onChange={v=>set("enableBlog",v)}/>
            <Checkbox id="testimonials-tog" label="Show testimonials on homepage" checked={form.enableTestimonials} onChange={v=>set("enableTestimonials",v)}/>
          </div>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium">Analytics Integration</h2>
          <div className="form-grid-2">
            <Input label="Google Analytics ID" value={form.googleAnalyticsId} onChange={e=>set("googleAnalyticsId",e.target.value)} placeholder="G-XXXXXXXXXX"/>
            <Input label="Facebook Pixel ID" value={form.facebookPixelId} onChange={e=>set("facebookPixelId",e.target.value)} placeholder="1234567890"/>
          </div>
        </div>

        <div className="flex justify-end"><Button variant="gold" onClick={save} loading={saving}><Save className="w-4 h-4"/>Save Settings</Button></div>
      </div>
    </DashboardLayout>
  )
}
