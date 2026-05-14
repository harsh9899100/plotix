"use client"
import { useState } from "react"
import { Settings, Bell, Shield, Globe, Save, Lock, Home, Eye } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Select, Checkbox } from "@/components/ui"
import toast from "react-hot-toast"


export default function OwnerSettingsPage() {
  const [notifications, setNotifications] = useState({
    emailNewInquiry:true, emailViewing:true, emailPriceAlert:false, smsInquiry:true, pushAll:true,
  })
  const [privacy, setPrivacy] = useState({
    showPhone:true, showEmail:false, publicProfile:true, allowAgentContact:true,
  })
  const [prefs, setPrefs] = useState({ language:"en", currency:"INR" })
  const [saving, setSaving] = useState(false)
  const setN = (k: keyof typeof notifications) => setNotifications(p => ({ ...p, [k]: !p[k] }))
  const setP = (k: keyof typeof privacy) => setPrivacy(p => ({ ...p, [k]: !p[k] }))
  const save = async () => { setSaving(true); await new Promise(r => setTimeout(r, 900)); setSaving(false); toast.success("Settings saved!") }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-2xl space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Settings className="w-7 h-7" />Settings</h1>
          <p className="page-subtitle">Manage your account preferences and notification settings.</p>
        </div>

        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Bell className="w-5 h-5 text-amber-500" />Notifications</h2>
          <div className="space-y-2">
            <Checkbox id="o-email-inq" label="Email when someone inquires on my property" checked={notifications.emailNewInquiry} onChange={() => setN("emailNewInquiry")} />
            <Checkbox id="o-email-view" label="Email when a viewing is scheduled" checked={notifications.emailViewing} onChange={() => setN("emailViewing")} />
            <Checkbox id="o-email-price" label="Market price alerts for my neighbourhood" checked={notifications.emailPriceAlert} onChange={() => setN("emailPriceAlert")} />
            <Checkbox id="o-sms-inq" label="SMS for urgent new inquiries" checked={notifications.smsInquiry} onChange={() => setN("smsInquiry")} />
          </div>
        </div>

        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Shield className="w-5 h-5 text-blue-500" />Privacy</h2>
          <div className="space-y-2">
            <Checkbox id="o-show-phone" label="Display my phone number on listings" checked={privacy.showPhone} onChange={() => setP("showPhone")} />
            <Checkbox id="o-show-email" label="Display my email on listings" checked={privacy.showEmail} onChange={() => setP("showEmail")} />
            <Checkbox id="o-public" label="Make owner profile publicly visible" checked={privacy.publicProfile} onChange={() => setP("publicProfile")} />
            <Checkbox id="o-agent" label="Allow agents to contact me about listing their services" checked={privacy.allowAgentContact} onChange={() => setP("allowAgentContact")} />
          </div>
        </div>

        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Globe className="w-5 h-5 text-emerald-500" />Preferences</h2>
          <div className="form-grid-2">
            <Select label="Language" value={prefs.language} onChange={e => setPrefs(p => ({ ...p, language:e.target.value }))}
              options={[{ value:"en", label:"English" }, { value:"hi", label:"Hindi" }, { value:"gu", label:"Gujarati" }]} />
            <Select label="Currency" value={prefs.currency} onChange={e => setPrefs(p => ({ ...p, currency:e.target.value }))}
              options={[{ value:"INR", label:"₹ INR" }, { value:"USD", label:"$ USD" }]} />
          </div>
        </div>

        <div className="card-flat p-5 flex items-center justify-between">
          <div>
            <p className="font-body font-semibold text-stone-900">Change Password</p>
            <p className="text-xs text-stone-400">Update your login password</p>
          </div>
          <Link href="/dashboard/owner/change-password" className="btn-secondary text-sm flex items-center gap-1">
            <Lock className="w-4 h-4" />Change
          </Link>
        </div>

        <div className="card-flat p-6 border-rose-200">
          <h2 className="font-display text-lg font-medium text-rose-700 mb-3">Danger Zone</h2>
          <p className="text-sm font-body text-stone-500 mb-4">Delete your account and all property listings. This cannot be undone.</p>
          <button className="btn-danger text-sm" onClick={() => toast.error("Please contact support to delete your account.")}>Delete Account</button>
        </div>

        <div className="flex justify-end">
          <Button variant="gold" onClick={save} loading={saving}><Save className="w-4 h-4" />Save Settings</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
