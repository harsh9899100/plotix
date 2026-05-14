"use client"
import { useState } from "react"
import { Lock, Eye, EyeOff, Shield } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input } from "@/components/ui"
import toast from "react-hot-toast"


export default function ChangePasswordPage() {
  const [form, setForm] = useState({ current: "", newPwd: "", confirm: "" })
  const [show, setShow] = useState({ current: false, newPwd: false, confirm: false })
  const [saving, setSaving] = useState(false)

  const toggle = (k: keyof typeof show) => setShow(prev => ({ ...prev, [k]: !prev[k] }))
  const set = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const strength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return score
  }
  const s = strength(form.newPwd)
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][s]
  const strengthColor = ["", "bg-rose-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"][s]

  const handleSubmit = async () => {
    if (!form.current) return toast.error("Enter your current password")
    if (form.newPwd.length < 8) return toast.error("Password must be at least 8 characters")
    if (form.newPwd !== form.confirm) return toast.error("Passwords do not match")
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    setSaving(false)
    toast.success("Password changed successfully!")
    setForm({ current: "", newPwd: "", confirm: "" })
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-lg">
        <div className="mb-6">
          <h1 className="page-title flex items-center gap-2"><Lock className="w-7 h-7 text-stone-500"/>Change Password</h1>
          <p className="page-subtitle">Keep your account secure with a strong password.</p>
        </div>

        <div className="card-flat p-6 space-y-5">
          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-sm font-body text-blue-700">Use at least 8 characters with a mix of letters, numbers & symbols.</p>
          </div>

          <div className="relative">
            <Input label="Current Password" type={show.current ? "text" : "password"}
              value={form.current} onChange={e => set("current", e.target.value)}
              leftIcon={<Lock className="w-4 h-4"/>} />
            <button type="button" onClick={() => toggle("current")}
              className="absolute right-3.5 top-9 text-stone-400 hover:text-stone-700">
              {show.current ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
            </button>
          </div>

          <div className="relative">
            <Input label="New Password" type={show.newPwd ? "text" : "password"}
              value={form.newPwd} onChange={e => set("newPwd", e.target.value)}
              leftIcon={<Lock className="w-4 h-4"/>} />
            <button type="button" onClick={() => toggle("newPwd")}
              className="absolute right-3.5 top-9 text-stone-400 hover:text-stone-700">
              {show.newPwd ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
            </button>
            {form.newPwd && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= s ? strengthColor : "bg-stone-200"}`}/>
                  ))}
                </div>
                <p className="text-xs font-body text-stone-500">Strength: <span className="font-semibold">{strengthLabel}</span></p>
              </div>
            )}
          </div>

          <div className="relative">
            <Input label="Confirm New Password" type={show.confirm ? "text" : "password"}
              value={form.confirm} onChange={e => set("confirm", e.target.value)}
              leftIcon={<Lock className="w-4 h-4"/>}
              error={form.confirm && form.newPwd !== form.confirm ? "Passwords don't match" : undefined} />
            <button type="button" onClick={() => toggle("confirm")}
              className="absolute right-3.5 top-9 text-stone-400 hover:text-stone-700">
              {show.confirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
            </button>
          </div>

          <Button variant="gold" className="w-full" onClick={handleSubmit} loading={saving}>
            <Lock className="w-4 h-4"/> Update Password
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
