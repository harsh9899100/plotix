"use client"
import { useState } from "react"
import { Star, Plus, Edit, Trash2, Eye } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, EmptyState, ConfirmDialog, Tabs } from "@/components/ui"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"


const MY_REVIEWS = [
  { id:"r1", targetType:"PROPERTY", targetName:"Luxurious 4BHK Penthouse in Vesu", rating:5, review:"Absolutely stunning property. The views from the top floor are breathtaking and the build quality is exceptional. Priya made the whole process seamless.", status:"PUBLISHED", date:new Date(Date.now()-15*86400000) },
  { id:"r2", targetType:"AGENT", targetName:"Priya Sharma — Sharma Realty", rating:5, review:"Priya was incredibly professional and responsive throughout our property search. She understood exactly what we were looking for and never wasted our time.", status:"PUBLISHED", date:new Date(Date.now()-15*86400000) },
  { id:"r3", targetType:"PROPERTY", targetName:"Commercial Space in C.G. Road", rating:3, review:"The property was okay but some details in the listing were inaccurate. The area was smaller than listed. Still a decent location though.", status:"PENDING", date:new Date(Date.now()-2*86400000) },
]

export default function BuyerReviewsPage() {
  const [reviews, setReviews] = useState(MY_REVIEWS)
  const [tab, setTab] = useState("all")
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = tab === "all" ? reviews : reviews.filter(r => r.status === tab)

  const renderStars = (rating: number) => (
    <div className="flex">
      {Array.from({ length:5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-stone-200 fill-stone-200"}`} />
      ))}
    </div>
  )

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Star className="w-7 h-7 text-amber-400" />My Reviews</h1>
            <p className="page-subtitle">Reviews you've submitted for properties and agents.</p>
          </div>
          <button onClick={() => toast.success("Write a new review")} className="btn-gold">
            <Plus className="w-4 h-4" />Write Review
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="card-flat p-4 bg-stone-100"><p className="text-xs text-stone-400 uppercase font-body">Total Reviews</p><p className="font-display text-3xl font-light">{reviews.length}</p></div>
          <div className="card-flat p-4 bg-emerald-50"><p className="text-xs text-stone-400 uppercase font-body">Published</p><p className="font-display text-3xl font-light">{reviews.filter(r => r.status === "PUBLISHED").length}</p></div>
          <div className="card-flat p-4 bg-amber-50"><p className="text-xs text-stone-400 uppercase font-body">Avg Rating Given</p><p className="font-display text-3xl font-light">{(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)}</p></div>
        </div>

        <Tabs tabs={[{ value:"all", label:"All" }, { value:"PUBLISHED", label:"Published" }, { value:"PENDING", label:"Pending Review" }]} active={tab} onChange={setTab} />

        {filtered.length === 0 ? (
          <EmptyState icon={<Star className="w-8 h-8 text-stone-300" />} title="No reviews yet" description="Share your experience with properties and agents you've worked with." action={<button className="btn-primary" onClick={() => toast.success("Write a review")}>Write First Review</button>} />
        ) : (
          <div className="space-y-4">
            {filtered.map(r => (
              <div key={r.id} className={`card p-5 ${r.status === "PENDING" ? "border-amber-200 bg-amber-50/10" : ""}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={r.targetType === "PROPERTY" ? "blue" : "violet"}>{r.targetType}</Badge>
                      <Badge variant={r.status === "PUBLISHED" ? "green" : "amber"}>{r.status}</Badge>
                    </div>
                    <p className="font-body font-semibold text-stone-900">{r.targetName}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{formatDate(r.date)}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="btn-icon text-stone-400 hover:text-stone-700"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => setDeleting(r.id)} className="btn-icon text-stone-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {renderStars(r.rating)}
                <p className="text-sm font-body text-stone-600 mt-3 leading-relaxed italic">"{r.review}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => { setReviews(p => p.filter(r => r.id !== deleting)); setDeleting(null); toast.success("Review deleted") }}
        title="Delete Review?" description="This will permanently remove your review." confirmLabel="Delete" danger />
    </DashboardLayout>
  )
}
