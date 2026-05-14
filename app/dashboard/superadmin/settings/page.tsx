"use client"
import { useState } from "react"
import { Settings, Globe, DollarSign, Mail, Bell, Shield, Save } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input, Select, Checkbox, Textarea } from "@/components/ui"
import toast from "react-hot-toast"

export default function SuperAdminSettingsPage() {
  const [general, setGeneral] = useState({ siteName:"PLOTIX Reality", tagline:"Find Your Dream Property", supportEmail:"support@plotix.in", supportPhone:"+91 1800-PLOTIX", timezone:"Asia/Kolkata", currency:"INR", language:"en", maintenanceMode:false })
  const [commission, setCommission] = useState({ agentRate:"2.0", builderRate:"1.5", platformFee:"0.5", gstRate:"18", tdsRate:"10" })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true); await new Promise(r=>setTimeout(r,1000)); setSaving(false)
    toast.success("Settings saved successfully!")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-3xl space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Settings className="w-7 h-7 text-stone-500"/>Platform Settings</h1>
          <p className="page-subtitle">Manage global platform configuration and defaults.</p>
        </div>

        {/* General */}
        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Globe className="w-5 h-5"/>General Settings</h2>
          <div className="form-grid-2">
            <Input label="Platform Name" value={general.siteName} onChange={e=>setGeneral(p=>({...p,siteName:e.target.value}))}/>
            <Input label="Tagline" value={general.tagline} onChange={e=>setGeneral(p=>({...p,tagline:e.target.value}))}/>
          </div>
          <div className="form-grid-2">
            <Input label="Support Email" type="email" value={general.supportEmail} onChange={e=>setGeneral(p=>({...p,supportEmail:e.target.value}))}/>
            <Input label="Support Phone" value={general.supportPhone} onChange={e=>setGeneral(p=>({...p,supportPhone:e.target.value}))}/>
          </div>
          <div className="form-grid-2">
            <Select label="Timezone" value={general.timezone} onChange={e=>setGeneral(p=>({...p,timezone:e.target.value}))} options={[{value:"Asia/Kolkata",label:"Asia/Kolkata (IST)"},{value:"UTC",label:"UTC"},{value:"Asia/Dubai",label:"Asia/Dubai (GST)"}]}/>
            <Select label="Currency" value={general.currency} onChange={e=>setGeneral(p=>({...p,currency:e.target.value}))} options={[{value:"INR",label:"Indian Rupee (₹)"},{value:"USD",label:"US Dollar ($)"},{value:"AED",label:"UAE Dirham (AED)"}]}/>
          </div>
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <Checkbox id="maint-mode" label={<span className="font-semibold text-rose-700">Maintenance Mode — All public pages show maintenance notice</span>}
              checked={general.maintenanceMode} onChange={v => setGeneral(p=>({...p,maintenanceMode:v}))}/>
          </div>
        </div>

        {/* Commission rates */}
        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><DollarSign className="w-5 h-5"/>Commission & Fee Rates</h2>
          <p className="text-sm text-stone-400 font-body">These rates apply platform-wide unless overridden per user.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            <Input label="Agent Commission (%)" type="number" step="0.1" value={commission.agentRate} onChange={e=>setCommission(p=>({...p,agentRate:e.target.value}))}/>
            <Input label="Builder Rate (%)" type="number" step="0.1" value={commission.builderRate} onChange={e=>setCommission(p=>({...p,builderRate:e.target.value}))}/>
            <Input label="Platform Fee (%)" type="number" step="0.1" value={commission.platformFee} onChange={e=>setCommission(p=>({...p,platformFee:e.target.value}))}/>
            <Input label="GST Rate (%)" type="number" value={commission.gstRate} onChange={e=>setCommission(p=>({...p,gstRate:e.target.value}))}/>
            <Input label="TDS Rate (%)" type="number" value={commission.tdsRate} onChange={e=>setCommission(p=>({...p,tdsRate:e.target.value}))}/>
          </div>
        </div>

        {/* Security */}
        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Shield className="w-5 h-5"/>Security Settings</h2>
          <div className="space-y-3">
            {[
              { id:"2fa-required", label:"Require 2FA for all Admin accounts" },
              { id:"session-strict", label:"Strict session expiry (4 hours for admin, 8 hours for users)" },
              { id:"ip-whitelist", label:"Enable IP whitelist for Superadmin access" },
              { id:"audit-all", label:"Log all admin actions in audit trail" },
            ].map(opt => (
              <Checkbox key={opt.id} id={opt.id} label={opt.label} checked={true} onChange={()=>{}}/>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="gold" onClick={save} loading={saving}><Save className="w-4 h-4"/>Save Settings</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
