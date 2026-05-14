"use client"
import { useState } from "react"
import { User, Camera, Save, Phone, MapPin, FileText } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input, Textarea, Select } from "@/components/ui"
import toast from "react-hot-toast"


const INITIAL = {
  firstName: "Arjun", lastName: "Mehta", email: "arjun@demo.com",
  phone: "+91 98765 43210", city: "Surat", state: "Gujarat",
  bio: "Looking for a modern 3BHK apartment in Surat or Ahmedabad.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
}

export default function EditProfilePage() {
  const [form, setForm] = useState(INITIAL)
  const [saving, setSaving] = useState(false)

  const set = (k: keyof typeof INITIAL, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const save = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    toast.success("Profile updated successfully!")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6 max-w-3xl">
        <div>
          <h1 className="page-title flex items-center gap-2"><User className="w-7 h-7 text-stone-500"/>Edit Profile</h1>
          <p className="page-subtitle">Update your personal information and preferences.</p>
        </div>

        {/* Avatar */}
        <div className="card-flat p-6">
          <h2 className="font-display text-lg font-medium text-stone-900 mb-5">Profile Photo</h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              <img src={form.avatar} alt="avatar" className="w-20 h-20 rounded-2xl object-cover" />
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-lg hover:bg-stone-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="font-body font-medium text-stone-800 mb-1">Upload a photo</p>
              <p className="text-xs text-stone-400 font-body">JPG, PNG or GIF. Max 2MB.</p>
              <button className="mt-2 text-xs font-body text-amber-700 hover:text-amber-900 underline underline-offset-2">Remove photo</button>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium text-stone-900">Personal Information</h2>
          <div className="form-grid-2">
            <Input label="First Name" value={form.firstName} onChange={e => set("firstName", e.target.value)} />
            <Input label="Last Name" value={form.lastName} onChange={e => set("lastName", e.target.value)} />
          </div>
          <Input label="Email Address" type="email" value={form.email} onChange={e => set("email", e.target.value)} leftIcon={<User className="w-4 h-4"/>} />
          <Input label="Phone Number" type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} leftIcon={<Phone className="w-4 h-4"/>} />
          <div className="form-grid-2">
            <Input label="City" value={form.city} onChange={e => set("city", e.target.value)} leftIcon={<MapPin className="w-4 h-4"/>} />
            <Select label="State" value={form.state} onChange={e => set("state", e.target.value)} options={[
              { value:"Gujarat", label:"Gujarat" }, { value:"Maharashtra", label:"Maharashtra" },
              { value:"Rajasthan", label:"Rajasthan" }, { value:"Karnataka", label:"Karnataka" },
              { value:"Delhi", label:"Delhi" }, { value:"Tamil Nadu", label:"Tamil Nadu" },
            ]} />
          </div>
          <Textarea label="Bio" value={form.bio} onChange={e => set("bio", e.target.value)} rows={3}
            placeholder="Tell agents & sellers a bit about yourself and what you're looking for..." />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setForm(INITIAL)}>Cancel</Button>
          <Button variant="gold" onClick={save} loading={saving}>
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
