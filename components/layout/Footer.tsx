import Link from "next/link"
import { Building2, MapPin, Phone, Mail, Instagram, Twitter, Linkedin, Facebook } from "lucide-react"

const LINKS = {
  company:    [["About Us","/about"],["Careers","/careers"],["Blog","/blog"],["Contact","/contactus"],["Press","/press"]],
  properties: [["Buy Property","/properties?listingFor=SALE"],["Rent Property","/properties?listingFor=RENT"],["New Projects","/properties?status=new"],["Commercial","/properties?type=COMMERCIAL"],["Featured","/properties?featured=true"]],
  support:    [["FAQs","/faqs"],["Terms","/terms"],["Privacy Policy","/privacy-policy"],["Testimonials","/testimonials"],["Sitemap","/sitemap.xml"]],
}

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-gold flex-shrink-0"><Building2 className="w-5 h-5 text-white"/></div>
              <div><div className="font-display text-xl font-semibold">PLOTIX</div><div className="text-[9px] text-white/40 uppercase tracking-[.2em] font-body">Reality</div></div>
            </Link>
            <p className="font-body text-stone-400 text-sm leading-relaxed mb-6 max-w-xs">India's premier real estate platform connecting buyers, sellers, and agents with cutting-edge technology and unparalleled service.</p>
            <div className="space-y-2.5 mb-6">
              <a href="tel:+918000000000" className="flex items-center gap-3 text-stone-400 hover:text-white transition-colors text-sm font-body"><Phone className="w-4 h-4 text-amber-500 flex-shrink-0"/>+91 800 000 0000</a>
              <a href="mailto:hello@plotix.in" className="flex items-center gap-3 text-stone-400 hover:text-white transition-colors text-sm font-body"><Mail className="w-4 h-4 text-amber-500 flex-shrink-0"/>hello@plotix.in</a>
              <div className="flex items-start gap-3 text-stone-400 text-sm font-body"><MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/>Vesu, Surat, Gujarat 395007, India</div>
            </div>
            <div className="flex items-center gap-2">
              {[[Instagram,"Instagram"],[Facebook,"Facebook"],[Twitter,"Twitter"],[Linkedin,"LinkedIn"]].map(([Icon,label]:any)=>(
                <a key={label} href="#" aria-label={label} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-all"><Icon className="w-4 h-4"/></a>
              ))}
            </div>
          </div>
          {Object.entries(LINKS).map(([section,links])=>(
            <div key={section}>
              <h4 className="font-body font-semibold text-white text-xs uppercase tracking-widest mb-5 capitalize">{section}</h4>
              <ul className="space-y-3">
                {links.map(([label,href])=>(
                  <li key={href}><Link href={href} className="font-body text-stone-400 hover:text-white text-sm transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-stone-500 text-xs">© {new Date().getFullYear()} PLOTIX Reality. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {["RERA Registered","ISO 9001:2015","SSL Secured"].map(t=><span key={t} className="font-body text-stone-500 text-xs">{t}</span>)}
          </div>
        </div>
      </div>
    </footer>
  )
}
