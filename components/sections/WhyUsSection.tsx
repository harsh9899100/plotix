import { Shield, TrendingUp, CheckCircle2, Headphones } from "lucide-react"
import Link from "next/link"
const FEATURES = [
  { icon:Shield,      title:"Verified Listings",      desc:"Every property is verified by our expert team before going live, ensuring authenticity and accuracy." },
  { icon:TrendingUp,  title:"Market Intelligence",    desc:"Access real-time price trends, area analytics, and investment insights to make smarter decisions." },
  { icon:CheckCircle2,title:"End-to-End Assistance",  desc:"From discovery to registration, our agents guide you through every step of the process." },
  { icon:Headphones,  title:"24/7 Support",           desc:"Our dedicated support team is available round the clock to answer your questions." },
]
export default function WhyUsSection() {
  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="section-tag">Why PLOTIX Reality</span>
            <h2 className="section-title mb-4">The Smarter Way <br/>to <em className="not-italic text-gradient-gold">Buy & Sell</em></h2>
            <div className="gold-bar"/>
            <p className="font-body text-stone-500 text-base leading-relaxed mb-8 max-w-md">We combine cutting-edge technology with deep local expertise to deliver a real estate experience that's transparent, efficient, and deeply human.</p>
            <Link href="/about" className="btn-primary">About PLOTIX →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f,i)=>(
              <div key={f.title} className="p-6 bg-white rounded-2xl border border-stone-100 hover:border-stone-200 hover:shadow-card-hover transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{background:"linear-gradient(135deg,#C9A07A22,#C9A07A11)"}}>
                  <f.icon className="w-5 h-5 text-amber-700"/>
                </div>
                <h3 className="font-body font-semibold text-stone-900 mb-2 text-sm">{f.title}</h3>
                <p className="font-body text-stone-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
