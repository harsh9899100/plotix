"use client"
import { useState, useTransition, useRef } from "react"
import { User, Camera, Bell, Lock, CheckCircle, Mail, MapPin, Shield } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useDashboardUser } from "@/context/SessionContext"
import { Button, Avatar, Badge, Tabs } from "@/components/ui"
import { getRoleBadgeColor } from "@/lib/utils"
import toast from "react-hot-toast"

/**
 * Universal Profile Page — works for any role.
 * Reads the session via useDashboardUser() and shows:
 *   - Profile tab (edit name, email, phone, bio, address + avatar upload)
 *   - Preferences tab (notification toggles)
 *   - Security tab (change password, active sessions, danger zone)
 */
export default function ProfilePage() {
  const user = useDashboardUser()
  const [tab, setTab] = useState("profile")
  const [isPending, start] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    phone: "",
    bio: "",
    address: "",
  })

  const [prefs, setPrefs] = useState({
    emailNotifs: true, smsNotifs: false, priceAlerts: true,
    newListings: true, inquiryReplies: true, viewingReminders: true, weeklyDigest: false,
  })

  const [passwords, setPasswords] = useState({ current: "", newPwd: "", confirm: "" })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return }
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
    toast.success("Photo selected — click Save Changes to apply")
  }

  const saveProfile = () => start(async () => {
    await new Promise(r => setTimeout(r, 800))
    toast.success("Profile updated!")
  })

  const savePrefs = () => start(async () => {
    await new Promise(r => setTimeout(r, 600))
    toast.success("Preferences saved!")
  })

  const changePwd = () => {
    if (!passwords.current) { toast.error("Enter current password"); return }
    if (passwords.newPwd !== passwords.confirm) { toast.error("Passwords don't match"); return }
    if (passwords.newPwd.length < 8) { toast.error("Password must be 8+ characters"); return }
    start(async () => {
      await new Promise(r => setTimeout(r, 800))
      toast.success("Password changed!")
      setPasswords({ current: "", newPwd: "", confirm: "" })
    })
  }

  const roleBadge = user.role === "SUPERADMIN" ? "Superadmin"
    : user.role === "ADMIN" ? "Admin"
    : user.role === "AGENT" ? "Agent"
    : user.role === "BUILDER" ? "Builder"
    : user.role === "OWNER" ? "Owner"
    : "Buyer"

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6 max-w-3xl">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <User className="w-7 h-7 text-stone-500" />Account Settings
          </h1>
          <p className="page-subtitle">Manage your profile, notifications, and security.</p>
        </div>

        <Tabs
          tabs={[
            { value: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
            { value: "prefs", label: "Preferences", icon: <Bell className="w-4 h-4" /> },
            { value: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
          ]}
          active={tab}
          onChange={setTab}
        />

        {/* ── Profile Tab ── */}
        {tab === "profile" && (
          <div className="space-y-5">
            {/* Avatar + basic info */}
            <div className="card-flat p-6 flex items-center gap-6">
              <div className="relative flex-shrink-0">
                <Avatar
                  src={avatarPreview ?? user.profileImage}
                  name={`${user.firstName} ${user.lastName}`}
                  size="xl"
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center hover:bg-stone-700 transition-colors shadow-md"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <h3 className="font-body font-semibold text-stone-900 text-lg">
                  {form.firstName} {form.lastName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-body font-semibold px-2.5 py-0.5 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                    {roleBadge}
                  </span>
                  <Badge variant="green"><CheckCircle className="w-3 h-3" />Verified</Badge>
                </div>
                <p className="text-xs font-body text-stone-400 mt-2">{user.email}</p>
              </div>
            </div>

            {/* Edit form */}
            <div className="card-flat p-6 space-y-5">
              <h3 className="font-body font-semibold text-stone-900">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="input" placeholder="First name" />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="input" placeholder="Last name" />
                </div>
              </div>
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input pl-10" placeholder="Email" />
                </div>
              </div>
              <div>
                <label className="label">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-body text-stone-500">+91</span>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input pl-12" placeholder="Mobile number" />
                </div>
              </div>
              <div>
                <label className="label">Bio (Optional)</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className="input resize-none" placeholder="A few words about yourself…" />
              </div>
              <div>
                <label className="label">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="input pl-10" placeholder="Current address" />
                </div>
              </div>
              <Button variant="gold" onClick={saveProfile} loading={isPending}>Save Changes</Button>
            </div>
          </div>
        )}

        {/* ── Preferences Tab ── */}
        {tab === "prefs" && (
          <div className="card-flat p-6 space-y-6">
            <h3 className="font-body font-semibold text-stone-900">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: "emailNotifs",      label: "Email Notifications",    desc: "Receive updates and alerts via email" },
                { key: "smsNotifs",        label: "SMS Notifications",      desc: "Get time-sensitive alerts via SMS" },
                { key: "priceAlerts",      label: "Price Drop Alerts",      desc: "Notify when a saved property drops in price" },
                { key: "newListings",      label: "New Listing Alerts",     desc: "Alert when new properties match your saved searches" },
                { key: "inquiryReplies",   label: "Inquiry Replies",        desc: "Notify when someone responds to an inquiry" },
                { key: "viewingReminders", label: "Viewing Reminders",      desc: "Get reminders before scheduled viewings" },
                { key: "weeklyDigest",     label: "Weekly Digest",          desc: "Weekly email with platform activity summary" },
              ].map(pref => (
                <div key={pref.key} className="flex items-start justify-between gap-4 py-4 border-b border-stone-100 last:border-0">
                  <div>
                    <p className="font-body font-medium text-stone-900 text-sm">{pref.label}</p>
                    <p className="font-body text-stone-400 text-xs mt-0.5">{pref.desc}</p>
                  </div>
                  <button
                    onClick={() => setPrefs(p => ({ ...p, [pref.key]: !p[pref.key as keyof typeof p] }))}
                    className={`w-11 h-6 rounded-full transition-all flex-shrink-0 relative ${prefs[pref.key as keyof typeof prefs] ? "bg-stone-900" : "bg-stone-200"}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${prefs[pref.key as keyof typeof prefs] ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
            <Button variant="gold" onClick={savePrefs} loading={isPending}>Save Preferences</Button>
          </div>
        )}

        {/* ── Security Tab ── */}
        {tab === "security" && (
          <div className="space-y-5">
            <div className="card-flat p-6 space-y-5">
              <h3 className="font-body font-semibold text-stone-900">Change Password</h3>
              <div>
                <label className="label">Current Password</label>
                <input type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} className="input" placeholder="Enter current password" />
              </div>
              <div>
                <label className="label">New Password</label>
                <input type="password" value={passwords.newPwd} onChange={e => setPasswords(p => ({ ...p, newPwd: e.target.value }))} className="input" placeholder="8+ characters" />
                {passwords.newPwd && (
                  <div className="flex gap-1 mt-2">
                    {[
                      passwords.newPwd.length >= 8,
                      /[A-Z]/.test(passwords.newPwd),
                      /[0-9]/.test(passwords.newPwd),
                      /[^a-zA-Z0-9]/.test(passwords.newPwd),
                    ].map((ok, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${ok ? "bg-emerald-400" : "bg-stone-200"}`} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} className="input" placeholder="Repeat new password" />
              </div>
              <Button variant="primary" onClick={changePwd} loading={isPending}>Update Password</Button>
            </div>

            <div className="card-flat p-6">
              <h3 className="font-body font-semibold text-stone-900 mb-4">Active Sessions</h3>
              {[
                { device: "Windows PC — Chrome", location: "Surat, Gujarat", time: "Now (current session)", isCurrent: true },
                { device: "iPhone 15 — Safari", location: "Surat, Gujarat", time: "2 hours ago", isCurrent: false },
              ].map((s, i) => (
                <div key={i} className={`flex items-center justify-between gap-3 py-3 ${i === 0 ? "" : "border-t border-stone-100"}`}>
                  <div>
                    <p className="font-body font-medium text-stone-900 text-sm">{s.device}</p>
                    <p className="text-xs text-stone-400 font-body">{s.location} · {s.time}</p>
                  </div>
                  {s.isCurrent
                    ? <Badge variant="green">Current</Badge>
                    : <button className="text-xs font-body text-rose-500 hover:text-rose-600 transition-colors">Revoke</button>}
                </div>
              ))}
            </div>

            <div className="card-flat p-6 border-rose-200 bg-rose-50/30">
              <h3 className="font-body font-semibold text-rose-700 mb-2">Danger Zone</h3>
              <p className="text-sm font-body text-stone-500 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button className="btn-danger text-sm">Delete My Account</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
