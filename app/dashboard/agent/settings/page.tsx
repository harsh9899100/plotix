"use client"
import { useState } from "react"
import { Settings, Bell, Lock, Globe, Palette, Save, Eye, EyeOff } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Checkbox } from "@/components/ui"
import toast from "react-hot-toast"

const NOTIF_SETTINGS = [
  { id:"n1", label:"New inquiries on my properties",         key:"newInquiry",       default:true },
  { id:"n2", label:"Viewing schedule confirmations",          key:"viewingConfirm",   default:true },
  { id:"n3", label:"Message received from buyers/agents",    key:"messageReceived",  default:true },
  { id:"n4", label:"Price drop alerts on saved searches",    key:"priceAlert",       default:false },
  { id:"n5", label:"PLOTIX platform announcements",          key:"platformNews",     default:false },
]

export default function AgentSettingsPage() {
  const [notif, setNotif] = useState<Record<string,boolean>>(
    Object.fromEntries(NOTIF_SETTINGS.map(n => [n.key, n.default]))
  )
  const [privacy, setPrivacy] = useState({ showPhone: true, showEmail: false, profilePublic: true })
  const [showPwd, setShowPwd] = useState(false)
  const [pwd, setPwd] = useState({ current:"", newPwd:"", confirm:"" })

  const save = () => toast.success("Settings saved successfully!")

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6 max-w-2xl">
        <div>
          <h1 className="page-title flex items-center gap-2"><Settings className="w-7 h-7 text-stone-500" />Settings</h1>
          <p className="page-subtitle">Manage your account preferences, notifications, and privacy.</p>
        </div>

        {/* Notifications */}
        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Bell className="w-5 h-5 text-amber-500" />Notification Preferences</h2>
          {NOTIF_SETTINGS.map(n => (
            <Checkbox key={n.id} id={n.id} label={n.label} checked={notif[n.key]}
              onChange={v => setNotif(p => ({ ...p, [n.key]: v }))} />
          ))}
        </div>

        {/* Privacy */}
        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Globe className="w-5 h-5 text-blue-500" />Privacy & Visibility</h2>
          <Checkbox id="showPhone" label="Show phone number on listings" checked={privacy.showPhone} onChange={v => setPrivacy(p => ({ ...p, showPhone: v }))} />
          <Checkbox id="showEmail" label="Show email address on listings" checked={privacy.showEmail} onChange={v => setPrivacy(p => ({ ...p, showEmail: v }))} />
          <Checkbox id="profilePublic" label="Make my agent profile publicly searchable" checked={privacy.profilePublic} onChange={v => setPrivacy(p => ({ ...p, profilePublic: v }))} />
        </div>

        {/* Change Password */}
        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Lock className="w-5 h-5 text-stone-500" />Change Password</h2>
          {[
            { id:"cur", label:"Current Password", val:pwd.current, key:"current" },
            { id:"new", label:"New Password",     val:pwd.newPwd,  key:"newPwd" },
            { id:"con", label:"Confirm New Password", val:pwd.confirm, key:"confirm" },
          ].map(f => (
            <div key={f.id}>
              <label htmlFor={f.id} className="label">{f.label}</label>
              <div className="relative">
                <input id={f.id} type={showPwd ? "text" : "password"} value={f.val}
                  onChange={e => setPwd(p => ({ ...p, [f.key]: e.target.value }))}
                  className="input pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => toast.success("Password updated!")} className="btn-primary text-sm">Update Password</button>
        </div>

        <button onClick={save} className="btn-gold"><Save className="w-4 h-4" />Save All Settings</button>
      </div>
    </DashboardLayout>
  )
}
