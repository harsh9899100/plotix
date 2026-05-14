import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { MapPin, BedDouble, Bath, Maximize, Car, Calendar, Building, Eye, MessageSquare, Share2, Heart, CheckCircle2, Phone, Mail, Shield, Star, ArrowLeft } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import PropertyCard from "@/components/properties/PropertyCard"
import { MOCK_PROPERTIES } from "@/lib/data/mock"
import { formatPrice, formatDate, cn } from "@/lib/utils"

interface PageProps { params: { slug: string } }

export async function generateStaticParams() {
  return MOCK_PROPERTIES.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = MOCK_PROPERTIES.find(p => p.slug === params.slug)
  if (!p) return { title: "Not Found" }
  return { title: `${p.title} | PLOTIX Reality`, description: p.description.slice(0, 160) }
}

export default function PropertyDetailPage({ params }: PageProps) {
  const p = MOCK_PROPERTIES.find(prop => prop.slug === params.slug)
  if (!p) notFound()

  const similar = MOCK_PROPERTIES.filter(x => x.id !== p.id && (x.city === p.city || x.type === p.type)).slice(0, 3)

  const specs = [
    { icon:BedDouble,   label:"Bedrooms",  value: p.bedrooms>0 ? String(p.bedrooms) : "N/A" },
    { icon:Bath,        label:"Bathrooms", value: p.bathrooms>0 ? String(p.bathrooms) : "N/A" },
    { icon:Maximize,    label:"Area",      value: `${p.area.toLocaleString("en-IN")} sq.ft` },
    { icon:Car,         label:"Parking",   value: p.parking>0 ? String(p.parking) : "None" },
    { icon:Building,    label:"Floor",     value: p.floor ? `${p.floor}/${p.totalFloors}` : "N/A" },
    { icon:Calendar,    label:"Built",     value: p.yearBuilt ? String(p.yearBuilt) : "N/A" },
  ]

  return (
    <>
      <Navbar/>
      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="border-b border-stone-100 bg-white">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm font-body text-stone-400">
              <Link href="/" className="hover:text-stone-700 transition-colors">Home</Link>
              <span>/</span><Link href="/properties" className="hover:text-stone-700 transition-colors">Properties</Link>
              <span>/</span><span className="text-stone-600 truncate max-w-xs">{p.title}</span>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery */}
              <div className="space-y-2">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100">
                  {p.images?.[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover" priority sizes="(max-width:1024px) 100vw,66vw"/>}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={cn("badge shadow", p.listingFor==="RENT"?"badge-rent":"badge-sale")}>For {p.listingFor==="RENT"?"Rent":"Sale"}</span>
                    {p.featured && <span className="badge badge-gold shadow">⭐ Featured</span>}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"><Share2 className="w-4 h-4 text-stone-600"/></button>
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"><Heart className="w-4 h-4 text-stone-600"/></button>
                  </div>
                </div>
                {p.images && p.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {p.images.slice(1, 4).map((img: string, i: number) => (
                      <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-stone-100">
                        <Image src={img} alt={`View ${i+2}`} fill className="object-cover" sizes="25vw"/>
                      </div>
                    ))}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-900 cursor-pointer flex items-center justify-center">
                      <span className="text-white text-sm font-body font-semibold">+{(p.images.length-4 > 0 ? p.images.length-4 : 0)+1} Photos</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="font-display text-3xl font-light text-stone-900 leading-tight">{p.title}</h1>
                    <div className="flex items-center gap-2 mt-2 text-stone-500 text-sm font-body"><MapPin className="w-4 h-4 text-amber-600"/>{p.address}</div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="font-display text-3xl font-semibold text-stone-900">{formatPrice(p.price, p.listingFor)}</div>
                    {p.pricePerSqFt && p.listingFor==="SALE" && <div className="text-sm text-stone-400 font-body mt-1">₹{p.pricePerSqFt.toLocaleString("en-IN")}/sq.ft</div>}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-stone-100 flex-wrap">
                  <span className="flex items-center gap-1.5 text-sm font-body text-stone-500"><Eye className="w-4 h-4"/>{p.views.toLocaleString()} views</span>
                  <span className="flex items-center gap-1.5 text-sm font-body text-stone-500"><MessageSquare className="w-4 h-4"/>{p.inquiryCount} inquiries</span>
                  <span className="flex items-center gap-1.5 text-sm font-body text-stone-500"><Calendar className="w-4 h-4"/>Listed {formatDate(p.createdAt)}</span>
                </div>
              </div>

              {/* Specs */}
              <div>
                <h2 className="font-display text-xl font-medium text-stone-900 mb-4">Property Specifications</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {specs.map(({ icon:Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100">
                      <Icon className="w-5 h-5 text-amber-700 flex-shrink-0"/>
                      <div><div className="text-xs font-body text-stone-400 uppercase tracking-wide">{label}</div><div className="text-sm font-body font-semibold text-stone-800">{value}</div></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-display text-xl font-medium text-stone-900 mb-3">About This Property</h2>
                <p className="font-body text-stone-600 leading-relaxed">{p.description}</p>
                {p.furnishing && <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-body text-amber-700 font-medium"><CheckCircle2 className="w-3.5 h-3.5"/>{p.furnishing.replace("_"," ")}</div>}
              </div>

              {/* Amenities */}
              {p.amenities && p.amenities.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-medium text-stone-900 mb-4">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {p.amenities.map((a: string) => (
                      <span key={a} className="flex items-center gap-1.5 px-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm font-body text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500"/>{a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              {p.latitude && p.longitude && (
                <div>
                  <h2 className="font-display text-xl font-medium text-stone-900 mb-4">Location</h2>
                  <div className="aspect-video rounded-2xl overflow-hidden border border-stone-200">
                    <iframe src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDnIoG0enyntSAu8pL_FolU8_zSbyLPzC4&q=${p.latitude},${p.longitude}&zoom=15`}
                      width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" title={`Map - ${p.title}`}/>
                  </div>
                  <p className="text-sm font-body text-stone-500 mt-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-600"/>{p.address}</p>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              <div className="sticky top-20 space-y-5">
                {/* Agent Card */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-card">
                  <h3 className="font-display text-lg font-medium text-stone-900 mb-5">Listed By</h3>
                  <div className="flex items-center gap-4 mb-5 pb-5 border-b border-stone-100">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                      {p.agentAvatar && <Image src={p.agentAvatar} alt={p.agentName||""} fill className="object-cover" sizes="56px"/>}
                    </div>
                    <div>
                      <div className="font-body font-semibold text-stone-900">{p.agentName}</div>
                      <div className="text-sm font-body text-stone-500">{p.agentAgency}</div>
                      {p.agentVerified && <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-body"><Shield className="w-3 h-3"/>Verified Agent</div>}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <a href={`tel:${p.agentPhone}`} className="btn-primary w-full justify-center gap-2 text-sm py-3 rounded-xl"><Phone className="w-4 h-4"/>{p.agentPhone}</a>
                    <a href={`mailto:${p.agentEmail}`} className="btn-secondary w-full justify-center gap-2 text-sm py-3 rounded-xl"><Mail className="w-4 h-4"/>Send Email</a>
                  </div>
                </div>

                {/* Inquiry Form */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-card">
                  <h3 className="font-display text-lg font-medium text-stone-900 mb-1">Send Enquiry</h3>
                  <p className="text-sm font-body text-stone-400 mb-5">Get more info or schedule a viewing</p>
                  <div className="space-y-3">
                    <input type="text" placeholder="Your Name" className="input text-sm"/>
                    <input type="email" placeholder="Email Address" className="input text-sm"/>
                    <input type="tel" placeholder="Phone Number" className="input text-sm"/>
                    <textarea placeholder={`I'm interested in ${p.title}. Please share more details.`} rows={3} className="input text-sm resize-none"/>
                    <button className="btn-gold w-full justify-center text-sm py-3 rounded-xl">Send Enquiry</button>
                    <p className="text-center text-xs font-body text-stone-400">By submitting, you agree to our <Link href="/terms" className="underline hover:text-stone-600">Terms</Link></p>
                  </div>
                </div>

                {/* EMI Calculator teaser */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                  <h3 className="font-body font-semibold text-stone-900 text-sm mb-2">EMI Calculator</h3>
                  <p className="text-xs text-stone-500 font-body mb-3">Estimate your monthly payment</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-body"><span className="text-stone-500">Property Price</span><span className="font-semibold text-stone-800">{formatPrice(p.price, "SALE")}</span></div>
                    <div className="flex justify-between text-xs font-body"><span className="text-stone-500">20% Down Payment</span><span className="font-semibold text-stone-800">₹{(p.price*0.2/100000).toFixed(1)}L</span></div>
                    <div className="flex justify-between text-xs font-body"><span className="text-stone-500">Est. EMI @8.5%/30yr</span><span className="font-semibold text-emerald-700">₹{Math.round(p.price*0.8*0.085/12/100*(1+0.085/12)/((Math.pow(1+0.085/12,360)-1))*100).toLocaleString("en-IN")}/mo</span></div>
                  </div>
                  <button className="btn-secondary w-full justify-center text-xs py-2 mt-3">Full Calculator →</button>
                </div>
              </div>
            </div>
          </div>

          {/* Similar */}
          {similar.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl font-light text-stone-900">Similar Properties</h2>
                <Link href={`/properties?city=${p.city}`} className="btn-secondary text-sm">View More</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map(sp => <PropertyCard key={sp.id} property={sp} viewMode="grid"/>)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer/>
    </>
  )
}
