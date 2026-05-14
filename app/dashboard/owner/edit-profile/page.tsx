"use client"
import { useState } from "react"
import { User, Camera, Save, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input, Textarea, Select } from "@/components/ui"
import toast from "react-hot-toast"

const INITIAL = {
  firstName:"Suresh", lastName:"Patel", email:"suresh@gmail.com", phone:"+91 93456 12345",
  city:"Surat", state:"Gujarat", bio:"Property owner with 3 residential units in Surat.",
  avatar:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
}

export default function OwnerEditProfilePage() {
  const [form, setForm] = useState(INITIAL)
  const [saving, setSaving] = useState(false)
  const set = (k: keyof typeof INITIAL, v: string) => setForm(p => ({ ...p, [k]: v }))
  const save = async () => { setSaving(true); await new Promise(r=>setTimeout(r,900)); setSaving(false); toast.success("Profile updated!") }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6 max-w-3xl">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/owner/profile" className="btn-icon">←</Link>
          <div><h1 className="page-title flex items-center gap-2"><User className="w-7 h-7"/>Edit Profile</h1><p className="page-subtitle">Update your account information.</p></div>
        </div>

        <div className="card-flat p-6">
          <h2 className="font-display text-lg font-medium mb-4">Profile Photo</h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              <img src={form.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover"/>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center"><Camera className="w-4 h-4"/></button>
            </div>
          </div>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium">Personal Information</h2>
          <div className="form-grid-2">
            <Input label="First Name" value={form.firstName} onChange={e=>set("firstName",e.target.value)}/>
            <Input label="Last Name" value={form.lastName} onChange={e=>set("lastName",e.target.value)}/>
          </div>
          <Input label="Email" type="email" value={form.email} onChange={e=>set("email",e.target.value)}/>
          <Input label="Phone" value={form.phone} onChange={e=>set("phone",e.target.value)} leftIcon={<Phone className="w-4 h-4"/>}/>
          <div className="form-grid-2">
            <Select label="City" value={form.city} onChange={e=>set("city",e.target.value)} options={["Surat","Ahmedabad","Vadodara","Rajkot","Mumbai","Pune"].map(c=>({value:c,label:c}))}/>
            <Select label="State" value={form.state} onChange={e=>set("state",e.target.value)} options={["Gujarat","Maharashtra","Rajasthan","Karnataka","Delhi"].map(s=>({value:s,label:s}))}/>
          </div>
          <Textarea label="Bio" value={form.bio} onChange={e=>set("bio",e.target.value)} rows={3} placeholder="Brief description about yourself as a property owner..."/>
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/dashboard/owner/profile" className="btn-secondary">Cancel</Link>
          <Button variant="gold" onClick={save} loading={saving}><Save className="w-4 h-4"/>Save Changes</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
