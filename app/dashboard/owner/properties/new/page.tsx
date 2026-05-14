"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Home, Save, ImageIcon, FileText, MapPin, DollarSign, Bed, Bath, Square } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input, Textarea, Select, Checkbox } from "@/components/ui"
import toast from "react-hot-toast"

const AMENITIES_LIST = ["Parking","Garden","Security","Gym","Swimming Pool","Club House","Power Backup","Elevator","CCTV","Gated Community"]
const PROPERTY_TYPES = ["Apartment","Villa","Row House","Bungalow","Plot","Commercial","Shop"]

export default function NewOwnerPropertyPage() {
  const [form, setForm] = useState({
    title:"", description:"", type:"Apartment", listingFor:"SALE",
    price:"", area:"", beds:"", baths:"", parking:"",
    address:"", city:"", state:"Gujarat", pincode:"",
    amenities:[] as string[]
  })
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const set = (k: keyof typeof form, v: any) => setForm(p => ({ ...p, [k]:v }))
  const toggleAmenity = (a: string) => setForm(p => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x=>x!==a) : [...p.amenities, a] }))

  const validate = () => {
    if (!form.title) { toast.error("Property title required"); return false }
    if (!form.price) { toast.error("Price required"); return false }
    if (!form.area) { toast.error("Area required"); return false }
    if (!form.city) { toast.error("City required"); return false }
    return true
  }

  const saveDraft = async () => {
    if (!form.title) return toast.error("Add a title first")
    setSaving(true); await new Promise(r=>setTimeout(r,800)); setSaving(false)
    toast.success("Saved as draft!")
  }

  const publish = async () => {
    if (!validate()) return
    setPublishing(true); await new Promise(r=>setTimeout(r,1200)); setPublishing(false)
    toast.success("Property submitted for review!")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/owner/properties" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title flex items-center gap-2"><Home className="w-7 h-7 text-emerald-500"/>List New Property</h1>
            <p className="page-subtitle">Fill in the details to list your property on PLOTIX.</p>
          </div>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium">Property Information</h2>
          <Input label="Property Title *" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Spacious 3BHK Apartment with Terrace"/>
          <Textarea label="Description" value={form.description} onChange={e => set("description", e.target.value)} rows={4} placeholder="Describe your property..."/>
          <div className="form-grid-2">
            <Select label="Property Type" value={form.type} onChange={e => set("type", e.target.value)} options={PROPERTY_TYPES.map(t=>({value:t,label:t}))}/>
            <Select label="Listing For" value={form.listingFor} onChange={e => set("listingFor", e.target.value)} options={[{value:"SALE",label:"For Sale"},{value:"RENT",label:"For Rent"}]}/>
          </div>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><DollarSign className="w-5 h-5"/>Price & Size</h2>
          <div className="form-grid-2">
            <Input label="Price (₹) *" type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="e.g. 5500000"/>
            <Input label="Carpet Area (sq.ft) *" type="number" value={form.area} onChange={e => set("area", e.target.value)} leftIcon={<Square className="w-4 h-4"/>}/>
          </div>
          <div className="form-grid-3">
            <Input label="Bedrooms" type="number" value={form.beds} onChange={e => set("beds", e.target.value)} leftIcon={<Bed className="w-4 h-4"/>}/>
            <Input label="Bathrooms" type="number" value={form.baths} onChange={e => set("baths", e.target.value)} leftIcon={<Bath className="w-4 h-4"/>}/>
            <Input label="Parking Spots" type="number" value={form.parking} onChange={e => set("parking", e.target.value)}/>
          </div>
        </div>

        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><MapPin className="w-5 h-5"/>Location</h2>
          <Textarea label="Full Address *" value={form.address} onChange={e => set("address", e.target.value)} rows={2} placeholder="Building name, Street, Area..."/>
          <div className="form-grid-3">
            <Input label="City *" value={form.city} onChange={e => set("city", e.target.value)} placeholder="e.g. Surat"/>
            <Select label="State" value={form.state} onChange={e => set("state", e.target.value)} options={["Gujarat","Maharashtra","Rajasthan","Karnataka","Delhi"].map(s=>({value:s,label:s}))}/>
            <Input label="PIN Code" value={form.pincode} onChange={e => set("pincode", e.target.value)} placeholder="e.g. 395007"/>
          </div>
        </div>

        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AMENITIES_LIST.map(a => (
              <Checkbox key={a} id={`am-${a}`} label={a} checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)}/>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={saveDraft} loading={saving}><Save className="w-4 h-4"/>Save Draft</Button>
          <Button variant="gold" onClick={publish} loading={publishing}>Submit for Review</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
