"use client"
import { useState } from "react"
import { User, Camera, Save, Phone, Building, Award } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input, Textarea, Select } from "@/components/ui"
import toast from "react-hot-toast"

const INITIAL = {
  firstName:"Karan", lastName:"Builders", email:"karan@builders.com", phone:"+91 99876 54321",
  companyName:"Karan Developers Pvt Ltd", rera:"RERA-GUJ-DEV-2023-0045", gst:"24ABCDE1234F2Z5",
  city:"Surat", website:"https://karandevelopers.in",
  bio:"Leading real estate developer in Surat with 15+ years of experience and 20+ completed projects.",
  avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
}

export default function BuilderEditProfilePage() {
  const [form, setForm] = useState(INITIAL)
  const [saving, setSaving] = useState(false)
  const set = (k: keyof typeof INITIAL, v: string) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    setSaving(true); await new Promise(r=>setTimeout(r,1000)); setSaving(false)
    toast.success("Profile updated!")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6 max-w-3xl">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/builder/profile" className="btn-icon">←</Link>
          <div><h1 className="page-title flex items-center gap-2"><User className="w-7 h-7"/>Edit Builder Profile</h1><p className="page-subtitle">Update your company information and credentials.</p></div>
        </div>

        {/* Avatar */}
        <div className="card-flat p-6">
          <h2 className="font-display text-lg font-medium mb-4">Company Logo / Profile Photo</h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              <img src={form.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover"/>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center"><Camera className="w-4 h-4"/></button>
            </div>
            <div><p className="font-body font-medium text-stone-800 mb-1">Company logo or representative photo</p><p className="text-xs text-stone-400">PNG, JPG up to 5MB. Recommended: 400×400px</p></div>
          </div>
        </div>

        {/* Personal */}
        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium">Contact Person</h2>
          <div className="form-grid-2">
            <Input label="First Name" value={form.firstName} onChange={e => set("firstName", e.target.value)}/>
            <Input label="Last Name" value={form.lastName} onChange={e => set("lastName", e.target.value)}/>
          </div>
          <Input label="Email" type="email" value={form.email} onChange={e => set("email", e.target.value)}/>
          <Input label="Phone" value={form.phone} onChange={e => set("phone", e.target.value)} leftIcon={<Phone className="w-4 h-4"/>}/>
        </div>

        {/* Company */}
        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Building className="w-5 h-5"/>Company Details</h2>
          <Input label="Company Name" value={form.companyName} onChange={e => set("companyName", e.target.value)}/>
          <div className="form-grid-2">
            <Input label="RERA Registration" value={form.rera} onChange={e => set("rera", e.target.value)} leftIcon={<Award className="w-4 h-4"/>}/>
            <Input label="GST Number" value={form.gst} onChange={e => set("gst", e.target.value)}/>
          </div>
          <div className="form-grid-2">
            <Select label="Primary City" value={form.city} onChange={e => set("city", e.target.value)} options={["Surat","Ahmedabad","Vadodara","Rajkot","Mumbai","Pune"].map(c=>({value:c,label:c}))}/>
            <Input label="Website" value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://"/>
          </div>
          <Textarea label="Company Bio" value={form.bio} onChange={e => set("bio", e.target.value)} rows={4} placeholder="Tell buyers about your company, experience, and completed projects..."/>
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/dashboard/builder/profile" className="btn-secondary">Cancel</Link>
          <Button variant="gold" onClick={save} loading={saving}><Save className="w-4 h-4"/>Save Changes</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
