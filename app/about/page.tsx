import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import Link from "next/link"
import { Shield, TrendingUp, Heart, Award, ArrowRight, CheckCircle2 } from "lucide-react"
import type { Metadata } from "next"
export const metadata: Metadata = { title:"About Us | PLOTIX Reality" }
const VALUES = [
  { icon:Shield,     title:"Trust & Transparency", desc:"Every transaction, every listing, every interaction is built on complete transparency. We verify everything so you don't have to." },
  { icon:TrendingUp, title:"Data-Driven Insights",  desc:"Our platform harnesses real-time market data to empower buyers and sellers with intelligence that leads to smarter decisions." },
  { icon:Heart,      title:"Customer First",        desc:"We genuinely care about helping you find the right property or the right buyer. Your success is our mission." },
  { icon:Award,      title:"Excellence Always",     desc:"From our technology to our agent network, we hold ourselves to the highest standards in the real estate industry." },
]
const TEAM = [
  { name:"Rahul Mehta",   role:"CEO & Co-founder",   avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",bio:"Former VP at Godrej Properties. 18 years in real estate." },
  { name:"Priya Desai",   role:"COO & Co-founder",   avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",bio:"Ex-McKinsey. Built operations for PropTiger & 99acres." },
  { name:"Arjun Shah",    role:"CTO",                avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",bio:"Led engineering at Zomato. AI and ML specialist." },
  { name:"Nisha Kapoor",  role:"Head of Agents",     avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",bio:"Trained 5000+ agents across India over 12 years." },
]
export default function AboutPage() {
  return (<>
    <Navbar/>
    <main className="pt-16">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0"><Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=800&fit=crop" alt="" fill className="object-cover"/><div className="absolute inset-0 bg-stone-950/75"/></div>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-body font-semibold uppercase tracking-widest text-amber-400 mb-4">Our Story</span>
          <h1 className="font-display text-5xl lg:text-7xl font-light text-white mb-6">Redefining Real Estate<br/><em className="not-italic text-gradient-gold">in India</em></h1>
          <p className="font-body text-white/60 text-lg max-w-2xl mx-auto">Founded in 2020 in Surat, PLOTIX Reality was born from a simple belief: buying and selling property should be transparent, efficient, and stress-free.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-tag">Our Mission</span>
              <h2 className="section-title">Making Every Property<br/>Journey <em className="not-italic text-gradient-gold">Seamless</em></h2>
              <div className="gold-bar"/>
              <p className="font-body text-stone-600 leading-relaxed mb-6">We exist to democratise access to quality real estate information and connect serious buyers with credible sellers through verified listings, smart technology, and expert guidance.</p>
              <div className="space-y-3">
                {["12,400+ verified listings across India","3,200+ RERA-certified agents","₹2,800 Crore+ in transactions facilitated","28,000+ happy families housed"].map(item=>(
                  <div key={item} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0"/><span className="font-body text-stone-700 text-sm">{item}</span></div>
                ))}
              </div>
            </div>
            <div className="relative h-96 rounded-3xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop" alt="About PLOTIX" fill className="object-cover"/>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14"><span className="section-tag">Our Values</span><h2 className="section-title">What We Stand For</h2><div className="gold-bar mx-auto"/></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(v=>(
              <div key={v.title} className="bg-white rounded-2xl p-7 border border-stone-100 hover:shadow-card-hover transition-all duration-300">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-5"><v.icon className="w-6 h-6 text-amber-700"/></div>
                <h3 className="font-body font-bold text-stone-900 mb-2">{v.title}</h3>
                <p className="font-body text-stone-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14"><span className="section-tag">The Team</span><h2 className="section-title">Meet Our <em className="not-italic text-gradient-gold">Leaders</em></h2><div className="gold-bar mx-auto"/></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map(member=>(
              <div key={member.name} className="text-center group">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-stone-200 mx-auto mb-4 transition-transform duration-300 group-hover:scale-105">
                  <Image src={member.avatar} alt={member.name} fill className="object-cover" sizes="128px"/>
                </div>
                <h3 className="font-body font-bold text-stone-900 text-sm">{member.name}</h3>
                <p className="text-amber-700 font-body text-xs mb-2">{member.role}</p>
                <p className="font-body text-stone-500 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-navy">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl font-light text-white mb-4">Ready to Find Your Dream Property?</h2>
          <p className="font-body text-white/60 mb-8 max-w-md mx-auto">Join 28,000+ families who found their perfect home through PLOTIX Reality.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/properties" className="btn-gold px-8 py-3.5 text-base rounded-xl">Browse Properties<ArrowRight className="w-5 h-5"/></Link>
            <Link href="/contactus" className="px-8 py-3.5 rounded-xl text-white/80 hover:text-white border border-white/20 hover:border-white/40 font-body text-base transition-all">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
    <Footer/>
  </>)
}
