import Link from 'next/link'
import { Building2, MapPin, Phone, Mail, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react'

const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  properties: [
    { label: 'Buy Property', href: '/properties?listingFor=sale' },
    { label: 'Rent Property', href: '/properties?listingFor=rent' },
    { label: 'New Projects', href: '/properties?status=new' },
    { label: 'Commercial', href: '/properties?type=commercial' },
    { label: 'Featured Listings', href: '/properties?featured=true' },
  ],
  support: [
    { label: 'FAQs', href: '/faqs' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Sitemap', href: '/sitemap.xml' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-white">
      {/* Top Section */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C9A07A 0%, #A07850 100%)' }}>
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-display text-xl font-semibold">PLOTIX</div>
                <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-body">Reality</div>
              </div>
            </Link>

            <p className="font-body text-stone-400 text-sm leading-relaxed mb-6 max-w-xs">
              India's premier real estate platform connecting buyers, sellers, and agents with cutting-edge technology and unparalleled service.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+918000000000" className="flex items-center gap-3 text-stone-400 hover:text-white transition-colors text-sm font-body group">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                +91 800 000 0000
              </a>
              <a href="mailto:hello@plotix.in" className="flex items-center gap-3 text-stone-400 hover:text-white transition-colors text-sm font-body">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                hello@plotix.in
              </a>
              <div className="flex items-start gap-3 text-stone-400 text-sm font-body">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Vesu, Surat, Gujarat 395007, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-body font-semibold text-white text-sm uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="font-body text-stone-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-white text-sm uppercase tracking-widest mb-5">Properties</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.properties.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="font-body text-stone-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-white text-sm uppercase tracking-widest mb-5">Support</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="font-body text-stone-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-stone-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} PLOTIX Reality. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-body text-stone-500 text-xs">RERA Registered</span>
            <span className="font-body text-stone-500 text-xs">ISO 9001:2015</span>
            <span className="font-body text-stone-500 text-xs">SSL Secured</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
