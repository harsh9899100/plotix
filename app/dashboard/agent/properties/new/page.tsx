"use client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Upload, X, Plus, MapPin, Check, Image as ImageIcon, FileText } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Input, Textarea, Select, Checkbox } from "@/components/ui"
import { PropertySchema, type PropertyInput } from "@/lib/validations/auth"
import { AMENITIES_LIST, CITIES } from "@/lib/data/mock"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

const PROPERTY_TYPES = [
  { value: "RESIDENTIAL", label: "Residential" }, { value: "COMMERCIAL", label: "Commercial" },
  { value: "INDUSTRIAL",  label: "Industrial" },  { value: "AGRICULTURAL", label: "Agricultural" },
  { value: "MIXED",       label: "Mixed Use" },
]
const LISTING_FOR  = [{ value: "SALE", label: "For Sale" }, { value: "RENT", label: "For Rent" }]
const FURNISHINGS  = [{ value: "FURNISHED", label: "Furnished" }, { value: "SEMI_FURNISHED", label: "Semi-Furnished" }, { value: "UNFURNISHED", label: "Unfurnished" }]
const STATES       = [{ value: "Gujarat", label: "Gujarat" }, { value: "Maharashtra", label: "Maharashtra" }, { value: "Karnataka", label: "Karnataka" }, { value: "Delhi", label: "Delhi" }, { value: "Haryana", label: "Haryana" }]
const STEPS        = ["Basic Info", "Location", "Features", "Media", "Review"]

export default function NewPropertyPage() {
  const router = useRouter()
  const [step, setStep]           = useState(0)
  const [images, setImages]       = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [isPending, startTrans]   = useTransition()
  const [isDraft, setIsDraft]     = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PropertyInput>({
    resolver: zodResolver(PropertySchema),
    defaultValues: { bedrooms: 0, bathrooms: 0, kitchens: 1, parking: 0, amenities: [] },
  })

  const watchedType  = watch("type")
  const watchedPrice = watch("price")

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a])

  const handleImageAdd = () => {
    const url = `https://images.unsplash.com/photo-${Math.floor(Math.random()*9000000+1000000)}?w=800&h=600&fit=crop`
    setImages((prev) => [...prev, url])
    toast.success("Image added (demo)")
  }

  const onSubmit = (data: PropertyInput) => {
    startTrans(async () => {
      await new Promise((r) => setTimeout(r, 1200))
      toast.success(isDraft ? "Saved as draft!" : "Property submitted for review!")
      router.push("/dashboard/agent/properties")
    })
  }

  const isResidential = watchedType === "RESIDENTIAL"

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/agent/properties" className="btn-icon"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="page-title">New Property Listing</h1>
            <p className="page-subtitle">Fill in the details to list your property</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8 overflow-x-auto scrollbar-hide">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-shrink-0">
              <button onClick={() => i < step && setStep(i)}
                className={cn("flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-body font-medium transition-all",
                  i === step ? "bg-stone-900 text-white" : i < step ? "text-emerald-600 hover:bg-emerald-50" : "text-stone-400")}>
                <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                  i < step ? "bg-emerald-500 text-white" : i === step ? "bg-white text-stone-900" : "bg-stone-200 text-stone-500")}>
                  {i < step ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                <span className="hidden sm:block">{s}</span>
              </button>
              {i < STEPS.length - 1 && <div className={cn("w-8 h-0.5 mx-1", i < step ? "bg-emerald-300" : "bg-stone-200")} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 0 – Basic Info */}
          {step === 0 && (
            <div className="card-flat p-6 space-y-5">
              <h2 className="font-display text-xl font-medium text-stone-900">Basic Information</h2>
              <div>
                <label className="label">Property Title *</label>
                <input {...register("title")} placeholder="e.g. Luxurious 3BHK Apartment in Adajan" className={`input ${errors.title ? "border-rose-400" : ""}`} />
                {errors.title && <p className="error-msg">{errors.title.message}</p>}
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea {...register("description")} rows={4} placeholder="Describe the property in detail…" className={`input resize-none ${errors.description ? "border-rose-400" : ""}`} />
                {errors.description && <p className="error-msg">{errors.description.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Property Type *</label>
                  <div className="relative">
                    <select {...register("type")} className={`select pr-10 ${errors.type ? "border-rose-400" : ""}`}>
                      <option value="">Select type</option>
                      {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  {errors.type && <p className="error-msg">{errors.type.message}</p>}
                </div>
                <div>
                  <label className="label">Listing For *</label>
                  <select {...register("listingFor")} className={`select ${errors.listingFor ? "border-rose-400" : ""}`}>
                    <option value="">Select</option>
                    {LISTING_FOR.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                  {errors.listingFor && <p className="error-msg">{errors.listingFor.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price (₹) *</label>
                  <input {...register("price", { valueAsNumber: true })} type="number" placeholder="e.g. 9500000"
                    className={`input ${errors.price ? "border-rose-400" : ""}`} />
                  {errors.price && <p className="error-msg">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="label">Area (sq.ft) *</label>
                  <input {...register("area", { valueAsNumber: true })} type="number" placeholder="e.g. 1200"
                    className={`input ${errors.area ? "border-rose-400" : ""}`} />
                  {errors.area && <p className="error-msg">{errors.area.message}</p>}
                </div>
              </div>
              {isResidential && (
                <div>
                  <label className="label">Furnishing Status</label>
                  <select {...register("furnishing")} className="select">
                    <option value="">Select</option>
                    {FURNISHINGS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 1 – Location */}
          {step === 1 && (
            <div className="card-flat p-6 space-y-5">
              <h2 className="font-display text-xl font-medium text-stone-900">Location Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City *</label>
                  <select {...register("city")} className={`select ${errors.city ? "border-rose-400" : ""}`}>
                    <option value="">Select city</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="error-msg">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="label">State *</label>
                  <select {...register("state")} className={`select ${errors.state ? "border-rose-400" : ""}`}>
                    <option value="">Select state</option>
                    {STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  {errors.state && <p className="error-msg">{errors.state.message}</p>}
                </div>
              </div>
              <div>
                <label className="label">Locality / Area</label>
                <input {...register("locality")} placeholder="e.g. Vesu, Adajan, SG Highway" className="input" />
              </div>
              <div>
                <label className="label">Full Address *</label>
                <textarea {...register("address")} rows={2} placeholder="Building name, street, landmark…" className={`input resize-none ${errors.address ? "border-rose-400" : ""}`} />
                {errors.address && <p className="error-msg">{errors.address.message}</p>}
              </div>
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                <div className="flex items-center gap-2 text-sm font-body text-stone-600 mb-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span className="font-medium">Map Pin (Optional)</span>
                </div>
                <p className="text-xs text-stone-400 font-body">You can click on the map to set the exact location. This helps buyers find the property easily.</p>
                <div className="w-full h-32 bg-stone-200 rounded-xl mt-3 flex items-center justify-center">
                  <p className="text-xs text-stone-400 font-body">Google Maps will render here</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 – Features */}
          {step === 2 && (
            <div className="card-flat p-6 space-y-5">
              <h2 className="font-display text-xl font-medium text-stone-900">Property Features</h2>
              {isResidential && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Bedrooms",  name: "bedrooms"  as const },
                    { label: "Bathrooms", name: "bathrooms" as const },
                    { label: "Kitchens",  name: "kitchens"  as const },
                    { label: "Parking",   name: "parking"   as const },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="label">{f.label}</label>
                      <input {...register(f.name, { valueAsNumber: true })} type="number" min={0} className="input text-center" />
                    </div>
                  ))}
                </div>
              )}
              <div>
                <label className="label mb-3">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_LIST.map((a) => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={cn("px-3 py-1.5 rounded-full text-xs font-body font-medium border transition-all",
                        amenities.includes(a) ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400")}>
                      {a}
                    </button>
                  ))}
                </div>
                {amenities.length > 0 && (
                  <p className="text-xs text-stone-500 font-body mt-2">{amenities.length} amenities selected</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3 – Media */}
          {step === 3 && (
            <div className="card-flat p-6 space-y-5">
              <h2 className="font-display text-xl font-medium text-stone-900">Photos & Documents</h2>
              <div>
                <label className="label">Property Photos</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                      {i === 0 && <div className="absolute bottom-1 left-1 bg-stone-900 text-white text-[9px] px-1.5 py-0.5 rounded-full font-body">Cover</div>}
                    </div>
                  ))}
                  <button type="button" onClick={handleImageAdd}
                    className="aspect-square rounded-xl border-2 border-dashed border-stone-300 hover:border-stone-500 bg-stone-50 hover:bg-stone-100 flex flex-col items-center justify-center gap-1 transition-all">
                    <Plus className="w-6 h-6 text-stone-400" />
                    <span className="text-[10px] text-stone-400 font-body">Add Photo</span>
                  </button>
                </div>
                <p className="text-xs text-stone-400 font-body">Upload up to 20 photos. First photo will be the cover image.</p>
              </div>
              <div>
                <label className="label">Documents (Optional)</label>
                <div className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center hover:border-stone-400 transition-colors cursor-pointer bg-stone-50">
                  <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-body text-stone-500">Upload title deed, survey, NOC, or other documents</p>
                  <p className="text-xs text-stone-400 font-body mt-1">PDF, JPG, PNG — Max 10MB each</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 – Review */}
          {step === 4 && (
            <div className="card-flat p-6 space-y-5">
              <h2 className="font-display text-xl font-medium text-stone-900">Review & Submit</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-body text-amber-800">
                  After submission, your property will be reviewed by our team within 24 hours.
                  You'll receive an email notification once it's approved.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Images uploaded", ok: images.length > 0, detail: `${images.length} photos` },
                  { label: "Amenities added",  ok: amenities.length > 0, detail: `${amenities.length} selected` },
                ].map((c) => (
                  <div key={c.label} className={cn("flex items-center gap-3 p-3 rounded-xl border", c.ok ? "bg-emerald-50 border-emerald-200" : "bg-stone-50 border-stone-200")}>
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0", c.ok ? "bg-emerald-500" : "bg-stone-300")}>
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-body font-medium text-stone-700 flex-1">{c.label}</span>
                    <span className="text-xs font-body text-stone-500">{c.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button type="button" variant="secondary" onClick={() => setStep((s) => Math.max(0, s-1))} disabled={step === 0}>
              <ArrowLeft className="w-4 h-4" />Back
            </Button>
            <div className="flex gap-2">
              {step === STEPS.length - 1 ? (
                <>
                  <Button type="submit" variant="secondary" onClick={() => setIsDraft(true)} loading={isPending && isDraft}>
                    Save Draft
                  </Button>
                  <Button type="submit" variant="gold" onClick={() => setIsDraft(false)} loading={isPending && !isDraft}>
                    Submit for Review
                  </Button>
                </>
              ) : (
                <Button type="button" variant="primary" onClick={() => setStep((s) => Math.min(STEPS.length-1, s+1))}>
                  Continue
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
