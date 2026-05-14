import Image from "next/image"
import { Quote, Star } from "lucide-react"
import { MOCK_TESTIMONIALS } from "@/lib/data/mock"
export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-tag">Client Stories</span>
          <h2 className="section-title">What Our Clients <em className="not-italic text-gradient-gold">Say</em></h2>
          <div className="gold-bar mx-auto"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_TESTIMONIALS.map(t=>(
            <div key={t.id} className="bg-white rounded-2xl p-7 border border-stone-100 hover:border-stone-200 hover:shadow-card-hover transition-all duration-300 flex flex-col">
              <Quote className="w-8 h-8 text-amber-200 mb-4 flex-shrink-0"/>
              <p className="font-body text-stone-600 text-sm leading-relaxed flex-1 mb-5">{t.message}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-200 flex-shrink-0">
                  {t.avatar && <Image src={t.avatar} alt={t.displayName||""} fill className="object-cover" sizes="40px"/>}
                </div>
                <div className="min-w-0">
                  <div className="font-body font-semibold text-stone-900 text-sm truncate">{t.displayName}</div>
                  <div className="font-body text-stone-400 text-xs">{t.role}</div>
                </div>
                <div className="ml-auto flex items-center gap-0.5 flex-shrink-0">
                  {Array.from({length:t.rating}).map((_,i)=><Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400"/>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
