"use client"
import { useState, useTransition } from "react"
import { Settings, Save, Globe, Mail, Bell, Shield, Image as ImageIcon, AlertTriangle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Tabs, Badge } from "@/components/ui"
import toast from "react-hot-toast"

const MOCK_ADMIN = { id:"admin1", firstName:"Admin", lastName:"User", role:"ADMIN", email:"admin@plotix.in" }

export default function AdminSettingsPage() {
  const [tab, setTab] = useState("general")
  const [isPending, start] = useTransition()
  const [settings, setSettings] = useState({
    siteTitle:"PLOTIX Reality", siteDescription:"India's Premium Property Platform",
    supportEmail:"support@plotix.in", supportPhone:"+91 800 000 0000",
    maintenanceMode:false, maintenanceMsg:"We are performing scheduled maintenance. Back shortly!",
    maxFileSizeMB:10, maxImagesPerProperty:20, requirePropertyApproval:true,
    enableGuestInquiries:true, enableVirtualTours:true, enablePropertyComparison:true,
  })
  const [emailTemplates, setEmailTemplates] = useState({
    welcomeSubject:"Welcome to PLOTIX Reality!",
    welcomeBody:"Hi {{firstName}},\n\nWelcome to PLOTIX Reality — India's premium property platform.\n\nYour account is now active. Start exploring 12,000+ verified listings.\n\nBest regards,\nTeam PLOTIX",
    inquirySubject:"New Inquiry: {{propertyTitle}}",
    inquiryBody:"Hi {{agentName}},\n\nYou have received a new inquiry from {{buyerName}} regarding {{propertyTitle}}.\n\nMessage: {{message}}\n\nReply on your dashboard: {{dashboardUrl}}",
  })

  const save = () => start(async()=>{ await new Promise(r=>setTimeout(r,800)); toast.success("Settings saved!") })

  return (
    <DashboardLayout user={MOCK_ADMIN as any}>
      <div className="dashboard-main py-6 space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div><h1 className="page-title flex items-center gap-2"><Settings className="w-7 h-7 text-stone-500"/>Site Settings</h1><p className="page-subtitle">Configure platform-wide settings and preferences.</p></div>
          <Button variant="gold" onClick={save} loading={isPending}><Save className="w-4 h-4"/>Save All</Button>
        </div>

        <Tabs tabs={[
          {value:"general",  label:"General",        icon:<Globe className="w-4 h-4"/>},
          {value:"features", label:"Features",       icon:<Shield className="w-4 h-4"/>},
          {value:"email",    label:"Email Templates", icon:<Mail className="w-4 h-4"/>},
          {value:"danger",   label:"Danger Zone",    icon:<AlertTriangle className="w-4 h-4"/>},
        ]} active={tab} onChange={setTab}/>

        {/* General */}
        {tab==="general" && (
          <div className="space-y-5">
            <div className="card-flat p-6 space-y-5">
              <h3 className="font-body font-semibold text-stone-900">Site Information</h3>
              <div>
                <label className="label">Site Title</label>
                <input value={settings.siteTitle} onChange={e=>setSettings(s=>({...s,siteTitle:e.target.value}))} className="input"/>
              </div>
              <div>
                <label className="label">Site Description</label>
                <textarea value={settings.siteDescription} onChange={e=>setSettings(s=>({...s,siteDescription:e.target.value}))} rows={2} className="input resize-none"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Support Email</label>
                  <input type="email" value={settings.supportEmail} onChange={e=>setSettings(s=>({...s,supportEmail:e.target.value}))} className="input"/>
                </div>
                <div>
                  <label className="label">Support Phone</label>
                  <input value={settings.supportPhone} onChange={e=>setSettings(s=>({...s,supportPhone:e.target.value}))} className="input"/>
                </div>
              </div>
            </div>

            <div className="card-flat p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-body font-semibold text-stone-900">Maintenance Mode</h3>
                  <p className="text-xs font-body text-stone-400 mt-0.5">Temporarily close the platform for maintenance</p>
                </div>
                <button onClick={()=>setSettings(s=>({...s,maintenanceMode:!s.maintenanceMode}))}
                  className={`w-11 h-6 rounded-full transition-all relative ${settings.maintenanceMode?"bg-rose-500":"bg-stone-200"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings.maintenanceMode?"left-[22px]":"left-0.5"}`}/>
                </button>
              </div>
              {settings.maintenanceMode && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                  <p className="text-xs text-rose-600 font-body font-semibold mb-2">⚠ Maintenance mode is ACTIVE — users cannot access the site</p>
                  <textarea value={settings.maintenanceMsg} onChange={e=>setSettings(s=>({...s,maintenanceMsg:e.target.value}))} rows={2} className="input resize-none text-sm" placeholder="Maintenance message shown to visitors…"/>
                </div>
              )}
            </div>

            <div className="card-flat p-6 space-y-4">
              <h3 className="font-body font-semibold text-stone-900">Upload Limits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Max File Size (MB)</label>
                  <input type="number" value={settings.maxFileSizeMB} onChange={e=>setSettings(s=>({...s,maxFileSizeMB:Number(e.target.value)}))} className="input" min={1} max={50}/>
                </div>
                <div>
                  <label className="label">Max Images per Property</label>
                  <input type="number" value={settings.maxImagesPerProperty} onChange={e=>setSettings(s=>({...s,maxImagesPerProperty:Number(e.target.value)}))} className="input" min={1} max={50}/>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        {tab==="features" && (
          <div className="card-flat p-6 space-y-1">
            <h3 className="font-body font-semibold text-stone-900 mb-5">Platform Feature Toggles</h3>
            {[
              { key:"requirePropertyApproval", label:"Require Property Approval",    desc:"All new listings must be approved by admin before going live" },
              { key:"enableGuestInquiries",    label:"Allow Guest Inquiries",         desc:"Allow unregistered users to send property inquiries" },
              { key:"enableVirtualTours",      label:"Virtual Tours",                 desc:"Enable 3D/virtual tour embed feature on property pages" },
              { key:"enablePropertyComparison",label:"Property Comparison Tool",      desc:"Allow users to compare up to 10 properties side-by-side" },
            ].map(f=>(
              <div key={f.key} className="flex items-start justify-between gap-4 py-4 border-b border-stone-100 last:border-0">
                <div>
                  <p className="font-body font-medium text-stone-900 text-sm">{f.label}</p>
                  <p className="font-body text-stone-400 text-xs mt-0.5">{f.desc}</p>
                </div>
                <button onClick={()=>setSettings(s=>({...s,[f.key]:!s[f.key as keyof typeof s]}))}
                  className={`w-11 h-6 rounded-full transition-all flex-shrink-0 relative ${settings[f.key as keyof typeof settings]?"bg-stone-900":"bg-stone-200"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings[f.key as keyof typeof settings]?"left-[22px]":"left-0.5"}`}/>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Email Templates */}
        {tab==="email" && (
          <div className="space-y-5">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-body text-blue-800">Use <code className="bg-blue-100 px-1 rounded text-xs font-mono">{"{{variableName}}"}</code> for dynamic values. Available: firstName, lastName, propertyTitle, agentName, buyerName, message, dashboardUrl</p>
            </div>
            {[
              { label:"Welcome Email", subjKey:"welcomeSubject", bodyKey:"welcomeBody" },
              { label:"Inquiry Notification", subjKey:"inquirySubject", bodyKey:"inquiryBody" },
            ].map(tmpl=>(
              <div key={tmpl.label} className="card-flat p-6 space-y-3">
                <h3 className="font-body font-semibold text-stone-900">{tmpl.label}</h3>
                <div>
                  <label className="label">Subject Line</label>
                  <input value={emailTemplates[tmpl.subjKey as keyof typeof emailTemplates]} onChange={e=>setEmailTemplates(t=>({...t,[tmpl.subjKey]:e.target.value}))} className="input text-sm"/>
                </div>
                <div>
                  <label className="label">Email Body</label>
                  <textarea value={emailTemplates[tmpl.bodyKey as keyof typeof emailTemplates]} onChange={e=>setEmailTemplates(t=>({...t,[tmpl.bodyKey]:e.target.value}))} rows={6} className="input resize-none text-sm font-mono"/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Danger Zone */}
        {tab==="danger" && (
          <div className="space-y-4">
            {[
              { title:"Clear All Cache",           desc:"Force-clear all cached pages, API responses, and CDN cache.",     btn:"Clear Cache",     variant:"secondary" as const },
              { title:"Re-run Property Matching",  desc:"Re-process all property requests and re-send match notifications.", btn:"Run Matcher",     variant:"secondary" as const },
              { title:"Export All Data",           desc:"Export complete platform data as CSV/JSON for backup purposes.",   btn:"Export Data",     variant:"secondary" as const },
              { title:"Reset Platform Statistics", desc:"⚠ This will permanently delete all analytics data. Cannot be undone.", btn:"Reset Stats",  variant:"danger"    as const },
            ].map(a=>(
              <div key={a.title} className={`card-flat p-5 flex items-center justify-between gap-4 ${a.variant==="danger"?"border-rose-200 bg-rose-50/30":""}`}>
                <div>
                  <p className={`font-body font-semibold text-sm ${a.variant==="danger"?"text-rose-700":"text-stone-900"}`}>{a.title}</p>
                  <p className="font-body text-xs text-stone-500 mt-0.5">{a.desc}</p>
                </div>
                <Button variant={a.variant} size="sm" className="flex-shrink-0">{a.btn}</Button>
              </div>
            ))}
          </div>
        )}

        <Button variant="gold" onClick={save} loading={isPending} className="w-full justify-center"><Save className="w-4 h-4"/>Save Settings</Button>
      </div>
    </DashboardLayout>
  )
}
