"use client"
import { useState } from "react"
import { Settings, Bell, Shield, Globe, Save, Lock, Moon, Sun } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Select, Checkbox } from "@/components/ui"
import toast from "react-hot-toast"

export default function BuyerSettingsPage() {
  const [notifications, setNotifications] = useState({
    emailNewMatch:true, emailPriceChange:true, emailViewingReminder:true,
    emailNewsletter:false, smsViewing:true, pushAll:true,
  })
  const [privacy, setPrivacy] = useState({
    showProfileToAgents:true, allowContactFromBuilders:true, shareDataForInsights:false,
  })
  const [prefs, setPrefs] = useState({ language:"en", currency:"INR", theme:"light" })
  const [saving, setSaving] = useState(false)

  const setN = (k: keyof typeof notifications) => setNotifications(p => ({ ...p, [k]: !p[k] }))
  const setP = (k: keyof typeof privacy) => setPrivacy(p => ({ ...p, [k]: !p[k] }))
  const save = async () => { setSaving(true); await new Promise(r => setTimeout(r, 900)); setSaving(false); toast.success("Settings saved!") }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-2xl space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Settings className="w-7 h-7" />Settings</h1>
          <p className="page-subtitle">Manage your notifications, privacy, and preferences.</p>
        </div>

        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Bell className="w-5 h-5 text-amber-500" />Notification Preferences</h2>
          <div>
            <p className="text-xs text-stone-400 uppercase font-body mb-3">Email</p>
            <div className="space-y-2">
              <Checkbox id="b-email-match" label="New properties matching my saved searches" checked={notifications.emailNewMatch} onChange={() => setN("emailNewMatch")} />
              <Checkbox id="b-email-price" label="Price drop alerts for saved properties" checked={notifications.emailPriceChange} onChange={() => setN("emailPriceChange")} />
              <Checkbox id="b-email-view" label="Viewing reminders (24 hours before)" checked={notifications.emailViewingReminder} onChange={() => setN("emailViewingReminder")} />
              <Checkbox id="b-email-news" label="PLOTIX monthly newsletter" checked={notifications.emailNewsletter} onChange={() => setN("emailNewsletter")} />
            </div>
          </div>
          <div>
            <p className="text-xs text-stone-400 uppercase font-body mb-3">SMS & Push</p>
            <div className="space-y-2">
              <Checkbox id="b-sms-view" label="SMS reminder on day of viewing" checked={notifications.smsViewing} onChange={() => setN("smsViewing")} />
              <Checkbox id="b-push" label="Enable push notifications" checked={notifications.pushAll} onChange={() => setN("pushAll")} />
            </div>
          </div>
        </div>

        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Shield className="w-5 h-5 text-blue-500" />Privacy & Data</h2>
          <div className="space-y-2">
            <Checkbox id="b-show-agents" label="Allow agents to view my profile when I inquire" checked={privacy.showProfileToAgents} onChange={() => setP("showProfileToAgents")} />
            <Checkbox id="b-builders" label="Allow builders to contact me about new projects" checked={privacy.allowContactFromBuilders} onChange={() => setP("allowContactFromBuilders")} />
            <Checkbox id="b-data-share" label="Share anonymised usage data to improve recommendations" checked={privacy.shareDataForInsights} onChange={() => setP("shareDataForInsights")} />
          </div>
        </div>

        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Globe className="w-5 h-5 text-emerald-500" />Preferences</h2>
          <div className="form-grid-2">
            <Select label="Language" value={prefs.language} onChange={e => setPrefs(p => ({ ...p, language:e.target.value }))}
              options={[{ value:"en", label:"English" }, { value:"hi", label:"Hindi" }, { value:"gu", label:"Gujarati" }]} />
            <Select label="Currency" value={prefs.currency} onChange={e => setPrefs(p => ({ ...p, currency:e.target.value }))}
              options={[{ value:"INR", label:"₹ INR" }, { value:"USD", label:"$ USD" }, { value:"AED", label:"AED" }]} />
          </div>
          <div>
            <p className="label mb-2">Theme</p>
            <div className="flex gap-2">
              {["light", "dark"].map(t => (
                <button key={t} onClick={() => setPrefs(p => ({ ...p, theme:t }))}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border text-sm font-body transition-all ${prefs.theme === t ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600"}`}>
                  {t === "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card-flat p-5 flex items-center justify-between">
          <div>
            <p className="font-body font-semibold text-stone-900">Change Password</p>
            <p className="text-xs text-stone-400">Update your account password</p>
          </div>
          <Link href="/dashboard/buyer/change-password" className="btn-secondary text-sm flex items-center gap-1">
            <Lock className="w-4 h-4" />Change
          </Link>
        </div>

        <div className="flex justify-end">
          <Button variant="gold" onClick={save} loading={saving}><Save className="w-4 h-4" />Save Settings</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
