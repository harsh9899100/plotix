"use client"
import { useState } from "react"
import { Sliders, Home, MapPin, DollarSign, Bed, Bath, Save, RefreshCw } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Select, Checkbox } from "@/components/ui"
import toast from "react-hot-toast"


export default function BuyerPreferencesPage() {
  const [prefs, setPrefs] = useState({
    lookingFor:"BUY",
    propertyType:"Apartment",
    budgetMin:"5000000",
    budgetMax:"10000000",
    preferredCities:["Surat"],
    preferredLocalities:"Adajan, Vesu, Piplod",
    minBeds:"3",
    minBaths:"2",
    minArea:"1200",
    maxArea:"1800",
    possessionType:"READY_TO_MOVE",
    amenities:{ parking:true, elevator:true, security:true, garden:false, gym:false, swimmingPool:false, clubhouse:false },
    vastucompliant:false,
    petFriendly:false,
    weeklyDigest:true,
    instantMatch:true,
  })
  const [saving, setSaving] = useState(false)
  const set = (k: keyof typeof prefs, v: any) => setPrefs(p => ({ ...p, [k]:v }))
  const setAmenity = (k: keyof typeof prefs.amenities) => setPrefs(p => ({ ...p, amenities: { ...p.amenities, [k]: !p.amenities[k] } }))
  const toggleCity = (city: string) => setPrefs(p => ({ ...p, preferredCities: p.preferredCities.includes(city) ? p.preferredCities.filter(c => c !== city) : [...p.preferredCities, city] }))
  const save = async () => { setSaving(true); await new Promise(r => setTimeout(r, 900)); setSaving(false); toast.success("Preferences saved! We'll match new listings for you.") }

  const CITIES = ["Surat","Ahmedabad","Vadodara","Rajkot","Gandhinagar","Mumbai"]

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Sliders className="w-7 h-7 text-blue-500" />Property Preferences</h1>
            <p className="page-subtitle">Set your ideal property criteria to get personalised matches.</p>
          </div>
          <button onClick={() => { setPrefs(p => ({ ...p, weeklyDigest:true, instantMatch:true })); toast.success("Reset to defaults") }} className="btn-secondary text-sm">
            <RefreshCw className="w-4 h-4" />Reset
          </button>
        </div>

        {/* Looking for */}
        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><Home className="w-5 h-5" />What are you looking for?</h2>
          <div className="form-grid-2">
            <Select label="Purpose" value={prefs.lookingFor} onChange={e => set("lookingFor", e.target.value)}
              options={[{ value:"BUY", label:"Buy" }, { value:"RENT", label:"Rent" }, { value:"INVEST", label:"Invest / NRI" }]} />
            <Select label="Property Type" value={prefs.propertyType} onChange={e => set("propertyType", e.target.value)}
              options={["Apartment","Villa","Plot","Commercial","Office Space","Penthouse"].map(t => ({ value:t, label:t }))} />
          </div>
          <div className="form-grid-2">
            <Select label="Min Bedrooms" value={prefs.minBeds} onChange={e => set("minBeds", e.target.value)}
              options={["1","2","3","4","5+"].map(v => ({ value:v, label:`${v} BHK` }))} />
            <Select label="Possession" value={prefs.possessionType} onChange={e => set("possessionType", e.target.value)}
              options={[{ value:"READY_TO_MOVE", label:"Ready to Move" }, { value:"UNDER_CONSTRUCTION", label:"Under Construction" }, { value:"ANY", label:"Any" }]} />
          </div>
        </div>

        {/* Budget */}
        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><DollarSign className="w-5 h-5" />Budget Range</h2>
          <div className="form-grid-2">
            <div>
              <p className="label mb-2">Minimum Budget</p>
              <Select value={prefs.budgetMin} onChange={e => set("budgetMin", e.target.value)}
                options={[{ value:"1000000", label:"₹10 Lakh" }, { value:"2500000", label:"₹25 Lakh" }, { value:"5000000", label:"₹50 Lakh" }, { value:"7500000", label:"₹75 Lakh" }]} />
            </div>
            <div>
              <p className="label mb-2">Maximum Budget</p>
              <Select value={prefs.budgetMax} onChange={e => set("budgetMax", e.target.value)}
                options={[{ value:"5000000", label:"₹50 Lakh" }, { value:"10000000", label:"₹1 Crore" }, { value:"20000000", label:"₹2 Crore" }, { value:"50000000", label:"₹5 Crore+" }]} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card-flat p-6 space-y-5">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><MapPin className="w-5 h-5" />Preferred Location</h2>
          <div>
            <p className="label mb-3">Cities (select multiple)</p>
            <div className="flex gap-2 flex-wrap">
              {CITIES.map(city => (
                <button key={city} onClick={() => toggleCity(city)}
                  className={`px-4 py-2 rounded-full border text-sm font-body transition-all ${prefs.preferredCities.includes(city) ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 text-stone-600 hover:border-stone-400"}`}>
                  {city}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label mb-2">Preferred Localities / Micro-markets</label>
            <input value={prefs.preferredLocalities} onChange={e => set("preferredLocalities", e.target.value)}
              className="input w-full" placeholder="e.g. Adajan, Vesu, Piplod (comma separated)" />
          </div>
        </div>

        {/* Amenities */}
        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium">Must-Have Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.keys(prefs.amenities) as Array<keyof typeof prefs.amenities>).map(k => (
              <Checkbox key={k} id={`amen-${k}`} label={k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                checked={prefs.amenities[k]} onChange={() => setAmenity(k)} />
            ))}
          </div>
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <Checkbox id="vastu" label="Vastu Compliant only" checked={prefs.vastucompliant} onChange={() => set("vastucompliant", !prefs.vastucompliant)} />
            <Checkbox id="pet" label="Pet Friendly" checked={prefs.petFriendly} onChange={() => set("petFriendly", !prefs.petFriendly)} />
          </div>
        </div>

        {/* Matching prefs */}
        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium">Matching Alerts</h2>
          <Checkbox id="instant-match" label="Instant alerts when a matching property is listed" checked={prefs.instantMatch} onChange={() => set("instantMatch", !prefs.instantMatch)} />
          <Checkbox id="weekly-digest" label="Weekly digest of new matches every Monday" checked={prefs.weeklyDigest} onChange={() => set("weeklyDigest", !prefs.weeklyDigest)} />
        </div>

        <div className="flex justify-end">
          <Button variant="gold" onClick={save} loading={saving}><Save className="w-4 h-4" />Save Preferences</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
