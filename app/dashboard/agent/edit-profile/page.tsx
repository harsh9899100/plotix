"use client"
import { useState } from "react"
import { User, Camera, Save, Phone, MapPin, Award, Building } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input, Textarea, Select } from "@/components/ui"
import toast from "react-hot-toast"

const INITIAL = {
  firstName:"Priya", lastName:"Sharma", email:"priya@agency.com", phone:"+91 97654 32109",
  agencyName:"Sharma Realty", licenseNo:"RERA-GUJ-AGT-2024-1234", experience:"8",
  specialization:"Residential", city:"Surat", bio:"Passionate about helping families find their dream homes.",
  avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
}

export default function AgentEditProfilePage() {
  const [form, setForm] = useState(INITIAL)
  const [saving, setSaving] = useState(false)
  const set = (k: keyof typeof INITIAL, v: string) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    toast.success("Profile updated!")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6 max-w-3xl">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/agent/profile" className="btn-icon">←</Link>
          <div>
            <h1 className="page-title flex items-center gap-2"><User className="w-7 h-7"/>Edit Agent Profile</h1>
            <p className="page-subtitle">Update your professional information and credentials.</p>
          </div>
        </div>

        {/* Avatar */}
        <div className="card-flat p-6">
          <h2 className="font-display text-lg font-medium mb-4">Profile Photo</h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              <img src={form.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover"/>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <Camera className="w-4 h-4"/>
              </button>
            </div>
            <div>
              <p className="font-body font-medium text-stone-800 mb-1">Professional headshot</p>
              <p className="text-xs text-stone-400">High quality photo increases inquiries by 40%</p>
            </div>
          </div>
        </div>

        {/* Personal */}
        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium">Personal Information</h2>
          <div className="form-grid-2">
            <Input label="First Name" value={form.firstName} onChange={e => set("firstName", e.target.value)}/>
            <Input label="Last Name" value={form.lastName} onChange={e => set("lastName", e.target.value)}/>
          </div>
          <Input label="Email" type="email" value={form.email} onChange={e => set("email", e.target.value)}/>
          <Input label="Phone" value={form.phone} onChange={e => set("phone", e.target.value)} leftIcon={<Phone className="w-4 h-4"/>}/>
        </div>

        {/* Professional */}
        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Building className="w-5 h-5"/>Professional Details</h2>
          <div className="form-grid-2">
            <Input label="Agency / Firm Name" value={form.agencyName} onChange={e => set("agencyName", e.target.value)}/>
            <Input label="RERA License Number" value={form.licenseNo} onChange={e => set("licenseNo", e.target.value)} leftIcon={<Award className="w-4 h-4"/>}/>
          </div>
          <div className="form-grid-2">
            <Input label="Years of Experience" type="number" value={form.experience} onChange={e => set("experience", e.target.value)}/>
            <Select label="Specialization" value={form.specialization} onChange={e => set("specialization", e.target.value)}
              options={[{value:"Residential",label:"Residential"},{value:"Commercial",label:"Commercial"},{value:"Luxury",label:"Luxury"},{value:"Industrial",label:"Industrial"},{value:"Plots",label:"Plots & Land"}]}/>
          </div>
          <Select label="Primary City" value={form.city} onChange={e => set("city", e.target.value)}
            options={["Surat","Ahmedabad","Vadodara","Rajkot","Mumbai","Pune"].map(c=>({value:c,label:c}))}/>
          <Textarea label="Professional Bio" value={form.bio} onChange={e => set("bio", e.target.value)} rows={4}
            placeholder="Tell clients about your experience, specialization, and how you can help them..."/>
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/dashboard/agent/profile" className="btn-secondary">Cancel</Link>
          <Button variant="gold" onClick={save} loading={saving}><Save className="w-4 h-4"/>Save Changes</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
