import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
export default function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1400&h=600&fit=crop" alt="" fill className="object-cover"/>
            <div className="absolute inset-0" style={{background:"linear-gradient(135deg,rgba(26,43,74,.95),rgba(26,43,74,.85))"}}/>
          </div>
          <div className="relative z-10 px-8 py-20 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/70 text-xs font-body font-medium uppercase tracking-wider mb-6">For Sellers & Agents</span>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-white mb-4">List Your Property<br/><em className="not-italic text-gradient-gold">Reach Millions</em></h2>
            <p className="font-body text-white/60 text-base max-w-md mx-auto mb-10">Join 3,200+ verified agents and builders on PLOTIX Reality. Get enquiries, track performance, and close deals faster.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register?role=seller" className="btn-gold px-8 py-4 text-base rounded-xl">List for Free<ArrowRight className="w-5 h-5"/></Link>
              <Link href="/about" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body text-sm">Learn how it works →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
