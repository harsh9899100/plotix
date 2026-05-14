"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Save } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input, Textarea, Select, Checkbox } from "@/components/ui"
import toast from "react-hot-toast"

const PROPERTY_TYPES = ["Apartment","Villa","Row House","Bungalow","Plot","Commercial","Office","Shop"]
const CITIES = ["Surat","Ahmedabad","Vadodara","Rajkot","Gandhinagar","Mumbai","Pune","Bangalore","Delhi"]
const AMENITIES = ["Swimming Pool","Gym","Parking","Garden","Club House","Security","Elevator","Power Backup"]

export default function NewPropertyRequestPage() {
  const [form, setForm] = useState({
    title:"", description:"", propertyTypes:[] as string[],
    budgetMin:"", budgetMax:"", areaMin:"", areaMax:"",
    bedrooms:[] as string[], cities:[] as string[], amenities:[] as string[], urgency:"FLEXIBLE"
  })
  const [saving, setSaving] = useState(false)

  const toggleArr = (key: "propertyTypes"|"bedrooms"|"cities"|"amenities", val: string) =>
    setForm(prev => ({ ...prev, [key]: prev[key].includes(val) ? prev[key].filter(x=>x!==val) : [...prev[key], val] }))

  const handleSubmit = async () => {
    if (!form.title) return toast.error("Title is required")
    if (!form.budgetMax) return toast.error("Budget is required")
    if (form.cities.length === 0) return toast.error("Select at least one city")
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    toast.success("Property request created! Agents will start matching soon.")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/buyer/property-requests" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title flex items-center gap-2"><FileText className="w-7 h-7 text-amber-500"/>New Property Request</h1>
            <p className="page-subtitle">Describe your ideal property and let agents find you.</p>
          </div>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium text-stone-900">Basic Information</h2>
          <Input label="Request Title" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. 3BHK Apartment in Surat near schools"/>
          <Textarea label="Description" value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} rows={3} placeholder="Describe what you're looking for..."/>
          <Select label="Urgency" value={form.urgency} onChange={e => setForm(p=>({...p,urgency:e.target.value}))}
            options={[{value:"URGENT",label:"Urgent (within 1 month)"},{value:"SOON",label:"Soon (1–3 months)"},{value:"FLEXIBLE",label:"Flexible (3–6 months)"}]}/>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium text-stone-900">Property Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROPERTY_TYPES.map(t => (
              <button key={t} onClick={() => toggleArr("propertyTypes", t)}
                className={`px-3 py-2 rounded-xl text-sm font-body font-medium border transition-all ${form.propertyTypes.includes(t)?"bg-stone-900 text-white border-stone-900":"bg-white text-stone-600 border-stone-200 hover:border-stone-400"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium text-stone-900">Budget & Size</h2>
          <div className="form-grid-2">
            <Input label="Min Budget (₹)" type="number" value={form.budgetMin} onChange={e => setForm(p=>({...p,budgetMin:e.target.value}))} placeholder="e.g. 4500000"/>
            <Input label="Max Budget (₹)" type="number" value={form.budgetMax} onChange={e => setForm(p=>({...p,budgetMax:e.target.value}))} placeholder="e.g. 8000000"/>
          </div>
          <div className="form-grid-2">
            <Input label="Min Area (sq.ft)" type="number" value={form.areaMin} onChange={e => setForm(p=>({...p,areaMin:e.target.value}))} placeholder="e.g. 1000"/>
            <Input label="Max Area (sq.ft)" type="number" value={form.areaMax} onChange={e => setForm(p=>({...p,areaMax:e.target.value}))} placeholder="e.g. 2000"/>
          </div>
          <div>
            <p className="label mb-2">Bedrooms</p>
            <div className="flex gap-2 flex-wrap">
              {["1","2","3","4","5+"].map(b => (
                <button key={b} onClick={() => toggleArr("bedrooms", b)}
                  className={`px-4 py-2 rounded-xl text-sm font-body font-medium border transition-all ${form.bedrooms.includes(b)?"bg-stone-900 text-white border-stone-900":"bg-white text-stone-600 border-stone-200 hover:border-stone-400"}`}>
                  {b} BHK
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium text-stone-900">Location Preferences</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CITIES.map(c => (
              <button key={c} onClick={() => toggleArr("cities", c)}
                className={`px-3 py-2 rounded-xl text-sm font-body font-medium border transition-all ${form.cities.includes(c)?"bg-stone-900 text-white border-stone-900":"bg-white text-stone-600 border-stone-200 hover:border-stone-400"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium text-stone-900">Desired Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AMENITIES.map(a => (
              <Checkbox key={a} id={a} label={a} checked={form.amenities.includes(a)} onChange={() => toggleArr("amenities", a)}/>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/dashboard/buyer/property-requests" className="btn-secondary">Cancel</Link>
          <Button variant="gold" onClick={handleSubmit} loading={saving}><Save className="w-4 h-4"/> Submit Request</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
