"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Users, Calendar, Send, Save } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input, Textarea, Select, Checkbox } from "@/components/ui"
import toast from "react-hot-toast"

const TEMPLATES = [
  { value:"listing-alert", label:"New Listing Alert" },
  { value:"price-drop", label:"Price Drop Notification" },
  { value:"open-house", label:"Open House Invitation" },
  { value:"market-update", label:"Market Update Newsletter" },
  { value:"custom", label:"Custom Template" },
]

export default function NewEmailCampaignPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name:"", subject:"", template:"listing-alert", recipients:"ALL",
    body:"", scheduleNow:true, scheduledAt:"", includePropertyLink:true, includeContactInfo:true,
  })
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)

  const set = (k: keyof typeof form, v: any) => setForm(p => ({ ...p, [k]:v }))

  const saveDraft = async () => {
    if (!form.name) return toast.error("Campaign name required")
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    toast.success("Saved as draft!")
  }

  const sendCampaign = async () => {
    if (!form.name || !form.subject) return toast.error("Complete all required fields")
    if (!form.body) return toast.error("Email body is required")
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    toast.success(form.scheduleNow ? "Campaign sent successfully!" : "Campaign scheduled!")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/agent/marketing/email-campaigns" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title flex items-center gap-2"><Mail className="w-7 h-7 text-blue-500"/>New Email Campaign</h1>
            <p className="page-subtitle">Create and send targeted emails to your buyer database.</p>
          </div>
        </div>

        {/* Campaign details */}
        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium">Campaign Details</h2>
          <Input label="Campaign Name *" value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Weekend Property Showcase"/>
          <Input label="Email Subject Line *" value={form.subject} onChange={e => set("subject", e.target.value)} placeholder="e.g. 🏠 Exclusive Listings — This Weekend Only"/>
          <Select label="Template" value={form.template} onChange={e => set("template", e.target.value)} options={TEMPLATES}/>
        </div>

        {/* Recipients */}
        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Users className="w-5 h-5"/>Recipients</h2>
          <Select label="Send to" value={form.recipients} onChange={e => set("recipients", e.target.value)} options={[
            { value:"ALL", label:"All Contacts (500)" },
            { value:"ACTIVE", label:"Active Buyers (180)" },
            { value:"HOT_LEADS", label:"Hot Leads (42)" },
            { value:"PAST_CLIENTS", label:"Past Clients (68)" },
            { value:"CUSTOM", label:"Custom Selection" },
          ]}/>
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm font-body text-blue-700">
              📧 Estimated recipients: <strong>{form.recipients === "ALL" ? "500" : form.recipients === "ACTIVE" ? "180" : form.recipients === "HOT_LEADS" ? "42" : "68"}</strong>
            </p>
          </div>
        </div>

        {/* Email body */}
        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium">Email Content</h2>
          <Textarea label="Email Body *" value={form.body} onChange={e => set("body", e.target.value)} rows={8}
            placeholder="Write your email content here. Use {{buyer_name}} for personalization, {{property_title}} for listing details..."/>
          <div className="flex flex-col gap-2">
            <Checkbox id="prop-link" label="Include property listing link" checked={form.includePropertyLink} onChange={v => set("includePropertyLink", v)}/>
            <Checkbox id="contact-info" label="Include my contact information footer" checked={form.includeContactInfo} onChange={v => set("includeContactInfo", v)}/>
          </div>
        </div>

        {/* Schedule */}
        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Calendar className="w-5 h-5"/>Sending Schedule</h2>
          <div className="flex gap-3">
            <button onClick={() => set("scheduleNow", true)}
              className={`flex-1 p-4 rounded-xl border-2 transition-all text-center ${form.scheduleNow ? "border-stone-900 bg-stone-50" : "border-stone-200 hover:border-stone-300"}`}>
              <p className="font-body font-semibold text-stone-900">Send Now</p>
              <p className="text-xs text-stone-400 mt-1">Immediately after review</p>
            </button>
            <button onClick={() => set("scheduleNow", false)}
              className={`flex-1 p-4 rounded-xl border-2 transition-all text-center ${!form.scheduleNow ? "border-stone-900 bg-stone-50" : "border-stone-200 hover:border-stone-300"}`}>
              <p className="font-body font-semibold text-stone-900">Schedule</p>
              <p className="text-xs text-stone-400 mt-1">Pick a future date & time</p>
            </button>
          </div>
          {!form.scheduleNow && (
            <Input label="Schedule Date & Time" type="datetime-local" value={form.scheduledAt} onChange={e => set("scheduledAt", e.target.value)}/>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={saveDraft} loading={saving}><Save className="w-4 h-4"/>Save Draft</Button>
          <Button variant="gold" onClick={sendCampaign} loading={sending}>
            {form.scheduleNow ? <><Send className="w-4 h-4"/>Send Now</> : <><Calendar className="w-4 h-4"/>Schedule</>}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
