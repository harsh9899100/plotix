"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, User, Phone, Mail, MapPin, DollarSign, Save, Tag } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input, Textarea, Select } from "@/components/ui"
import toast from "react-hot-toast"

export default function AddBuyerContactPage() {
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", phone:"", city:"", propertyInterest:"", budgetMin:"", budgetMax:"", timeline:"", notes:"", status:"WARM" })
  const [saving, setSaving] = useState(false)
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]:v }))

  const save = async () => {
    if (!form.firstName || !form.phone) return toast.error("Name and phone are required")
    setSaving(true)
    await new Promise(r => setTimeout(r, 900))
    setSaving(false)
    toast.success("Buyer contact added to database!")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/agent/buyer-database" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title flex items-center gap-2"><User className="w-7 h-7"/>Add Buyer Contact</h1>
            <p className="page-subtitle">Add a new buyer to your database for tracking and follow-up.</p>
          </div>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium">Contact Information</h2>
          <div className="form-grid-2">
            <Input label="First Name *" value={form.firstName} onChange={e => set("firstName", e.target.value)} leftIcon={<User className="w-4 h-4"/>}/>
            <Input label="Last Name" value={form.lastName} onChange={e => set("lastName", e.target.value)}/>
          </div>
          <Input label="Email Address" type="email" value={form.email} onChange={e => set("email", e.target.value)} leftIcon={<Mail className="w-4 h-4"/>}/>
          <Input label="Phone Number *" value={form.phone} onChange={e => set("phone", e.target.value)} leftIcon={<Phone className="w-4 h-4"/>}/>
          <Select label="City" value={form.city} onChange={e => set("city", e.target.value)} placeholder="Select city"
            options={["Surat","Ahmedabad","Vadodara","Rajkot","Mumbai","Pune"].map(c=>({value:c,label:c}))}/>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><DollarSign className="w-5 h-5"/>Property Preferences</h2>
          <Input label="Property Interest" value={form.propertyInterest} onChange={e => set("propertyInterest", e.target.value)} placeholder="e.g. 3BHK Apartment in Vesu"/>
          <div className="form-grid-2">
            <Input label="Min Budget (₹)" type="number" value={form.budgetMin} onChange={e => set("budgetMin", e.target.value)} placeholder="e.g. 5000000"/>
            <Input label="Max Budget (₹)" type="number" value={form.budgetMax} onChange={e => set("budgetMax", e.target.value)} placeholder="e.g. 9000000"/>
          </div>
          <Select label="Purchase Timeline" value={form.timeline} onChange={e => set("timeline", e.target.value)} placeholder="Select timeline"
            options={[{value:"1month",label:"Within 1 month"},{value:"3months",label:"1–3 months"},{value:"6months",label:"3–6 months"},{value:"1year",label:"Within 1 year"}]}/>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Tag className="w-5 h-5"/>Lead Status & Notes</h2>
          <Select label="Lead Status" value={form.status} onChange={e => set("status", e.target.value)}
            options={[{value:"HOT",label:"🔥 Hot"},{value:"WARM",label:"🌡️ Warm"},{value:"COLD",label:"❄️ Cold"}]}/>
          <Textarea label="Notes" value={form.notes} onChange={e => set("notes", e.target.value)} rows={3} placeholder="Add any notes about this buyer's preferences or requirements..."/>
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/dashboard/agent/buyer-database" className="btn-secondary">Cancel</Link>
          <Button variant="gold" onClick={save} loading={saving}><Save className="w-4 h-4"/>Add Contact</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
