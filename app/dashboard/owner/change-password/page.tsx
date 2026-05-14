"use client"
import { useState } from "react"
import { Lock, Eye, EyeOff, Shield } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input } from "@/components/ui"
import toast from "react-hot-toast"

export default function OwnerChangePasswordPage() {
  const [form, setForm] = useState({ current:"", newPwd:"", confirm:"" })
  const [show, setShow] = useState({ current:false, newPwd:false, confirm:false })
  const [saving, setSaving] = useState(false)
  const toggle = (k: keyof typeof show) => setShow(p => ({ ...p, [k]:!p[k] }))
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]:v }))
  const s = [form.newPwd.length>=8, /[A-Z]/.test(form.newPwd), /[0-9]/.test(form.newPwd), /[^A-Za-z0-9]/.test(form.newPwd)].filter(Boolean).length
  const handleSubmit = async () => {
    if (!form.current) return toast.error("Enter current password")
    if (form.newPwd.length < 8) return toast.error("Min 8 characters")
    if (form.newPwd !== form.confirm) return toast.error("Passwords don't match")
    setSaving(true); await new Promise(r=>setTimeout(r,1000)); setSaving(false)
    toast.success("Password updated!"); setForm({current:"",newPwd:"",confirm:""})
  }
  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-lg">
        <h1 className="page-title flex items-center gap-2 mb-1"><Lock className="w-7 h-7"/>Change Password</h1>
        <p className="page-subtitle mb-6">Secure your owner account with a strong password.</p>
        <div className="card-flat p-6 space-y-5">
          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl"><Shield className="w-5 h-5 text-blue-500 flex-shrink-0"/><p className="text-sm font-body text-blue-700">Use at least 8 characters with mixed case, numbers & symbols.</p></div>
          {(["current","newPwd","confirm"] as const).map(k => (
            <div key={k} className="relative">
              <Input label={k==="current"?"Current Password":k==="newPwd"?"New Password":"Confirm Password"} type={show[k]?"text":"password"} value={form[k]} onChange={e=>set(k,e.target.value)} leftIcon={<Lock className="w-4 h-4"/>} error={k==="confirm"&&form.confirm&&form.newPwd!==form.confirm?"Passwords don't match":undefined}/>
              <button type="button" onClick={()=>toggle(k)} className="absolute right-3.5 top-9 text-stone-400 hover:text-stone-700">{show[k]?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
              {k==="newPwd"&&form.newPwd&&(<div className="mt-2"><div className="flex gap-1 mb-1">{[1,2,3,4].map(i=><div key={i} className={`h-1.5 flex-1 rounded-full ${i<=s?["","bg-rose-500","bg-amber-500","bg-blue-500","bg-emerald-500"][s]:"bg-stone-200"}`}/>)}</div><p className="text-xs text-stone-500">Strength: <b>{["","Weak","Fair","Good","Strong"][s]}</b></p></div>)}
            </div>
          ))}
          <Button variant="gold" className="w-full" onClick={handleSubmit} loading={saving}><Lock className="w-4 h-4"/>Update Password</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
