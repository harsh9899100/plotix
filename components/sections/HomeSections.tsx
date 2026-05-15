import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Quote, CheckCircle2, TrendingUp, Shield, Headphones } from 'lucide-react'
import { mockTestimonials, mockBlogPosts, CITIES } from '@/lib/mockData'
import { formatDate } from '@/lib/utils'

// ── Why Us ────────────────────────────────────────────────────────────────────
export function WhyUsSection() {
  const features = [
    {
      icon: Shield,
      title: 'Verified Listings',
      desc: 'Every property is verified by our expert team before going live, ensuring authenticity and accuracy.',
    },
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      desc: 'Access real-time price trends, area analytics, and investment insights to make smarter decisions.',
    },
    {
      icon: CheckCircle2,
      title: 'End-to-End Assistance',
      desc: 'From discovery to registration, our agents guide you through every step of the process.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      desc: 'Our dedicated support team is available round the clock to answer your questions.',
    },
  ]

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="section-tag">Why PLOTIX Reality</span>
            <h2 className="section-title mb-4">
              The Smarter Way <br />to{' '}
              <em className="not-italic text-gradient-gold">Buy & Sell</em>
            </h2>
            <div className="gold-bar" />
            <p className="font-body text-stone-500 text-base leading-relaxed mb-8 max-w-md">
              We combine cutting-edge technology with deep local expertise to deliver a real estate experience that's transparent, efficient, and deeply human.
            </p>
            <Link href="/about" className="btn-primary">
              About PLOTIX <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={f.title}
                className="p-6 bg-white rounded-2xl border border-stone-100 hover:border-stone-200 hover:shadow-card-hover transition-all duration-300 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg, #C9A07A22 0%, #C9A07A11 100%)' }}>
                  <f.icon className="w-5 h-5 text-amber-700" />
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

// ── Cities Section ─────────────────────────────────────────────────────────────
const CITY_IMAGES: Record<string, string> = {
  Surat: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop',
  Ahmedabad: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&h=400&fit=crop',
  Mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop',
  Bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&h=400&fit=crop',
  Pune: 'https://images.unsplash.com/photo-1600078893784-09c2cb30d41b?w=600&h=400&fit=crop',
  Gurgaon: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop',
  Noida: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=600&h=400&fit=crop',
  Rajkot: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
}

export function CitiesSection() {
  const featuredCities = CITIES.slice(0, 6)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="section-tag">Explore by Location</span>
            <h2 className="section-title">
              Top <em className="not-italic text-gradient-gold">Cities</em>
            </h2>
          </div>
          <Link href="/properties" className="btn-secondary self-start group">
            All Cities <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCities.map((city, i) => (
            <Link
              key={city}
              href={`/properties?city=${city}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-stone-200"
            >
              <Image
                src={CITY_IMAGES[city] || CITY_IMAGES['Surat']}
                alt={city}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="font-display text-white text-lg font-medium leading-tight">{city}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Stats Section ─────────────────────────────────────────────────────────────
export function StatsSection() {
  const stats = [
    { value: '12,400+', label: 'Properties Listed', sub: 'Across India' },
    { value: '₹2,800 Cr+', label: 'Transactions Closed', sub: 'In the last year' },
    { value: '28,000+', label: 'Happy Customers', sub: 'Verified reviews' },
    { value: '4.9/5', label: 'Average Rating', sub: 'From 8,000+ reviews' },
  ]

  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #1a2b4a 0%, #0f1e35 100%)' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl lg:text-5xl font-light text-white mb-1">
                {stat.value}
              </div>
              <div className="font-body font-semibold text-white/70 text-sm mb-0.5">{stat.label}</div>
              <div className="font-body text-white/30 text-xs">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials Section ───────────────────────────────────────────────────────
export function TestimonialsSection() {
  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-tag">Client Stories</span>
          <h2 className="section-title">
            What Our Clients <em className="not-italic text-gradient-gold">Say</em>
          </h2>
          <div className="gold-bar mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockTestimonials.map((t) => (
            <div key={t.id}
              className="bg-white rounded-2xl p-7 border border-stone-100 hover:border-stone-200 hover:shadow-card-hover transition-all duration-300 flex flex-col">
              <Quote className="w-8 h-8 text-amber-200 mb-4 flex-shrink-0" />
              <p className="font-body text-stone-600 text-sm leading-relaxed flex-1 mb-5">{t.message}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-200 flex-shrink-0">
                  <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="40px" />
                </div>
                <div className="min-w-0">
                  <div className="font-body font-semibold text-stone-900 text-sm truncate">{t.name}</div>
                  <div className="font-body text-stone-400 text-xs">{t.role}</div>
                </div>
                <div className="ml-auto flex items-center gap-0.5 flex-shrink-0">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Blog Section ───────────────────────────────────────────────────────────────
export function BlogSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="section-tag">Insights & Guides</span>
            <h2 className="section-title">
              Latest from the <em className="not-italic text-gradient-gold">Blog</em>
            </h2>
          </div>
          <Link href="/blog" className="btn-secondary self-start group">
            All Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockBlogPosts.map((post, i) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group card block">
              <div className="relative aspect-video overflow-hidden bg-stone-100">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="badge bg-white/90 text-stone-700 text-xs backdrop-blur-sm border border-stone-100">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs font-body text-stone-400 mb-3">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>·</span>
                  <span>{post.readTime} min read</span>
                </div>
                <h3 className="font-display text-lg font-medium text-stone-900 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="font-body text-stone-500 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-stone-100">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden bg-stone-200">
                    <Image src={post.authorAvatar} alt={post.author} fill className="object-cover" sizes="24px" />
                  </div>
                  <span className="text-xs font-body font-medium text-stone-600">{post.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA Section ────────────────────────────────────────────────────────────────
export function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1400&h=600&fit=crop"
              alt="CTA background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(26,43,74,0.95) 0%, rgba(26,43,74,0.85) 100%)' }} />
          </div>

          <div className="relative z-10 px-8 py-20 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/70 text-xs font-body font-medium uppercase tracking-wider mb-6">
              For Sellers & Agents
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-white mb-4">
              List Your Property <br />
              <em className="not-italic text-gradient-gold">Reach Millions</em>
            </h2>
            <p className="font-body text-white/60 text-base max-w-md mx-auto mb-10">
              Join 3,200+ verified agents and builders on PLOTIX Reality. Get enquiries, track performance, and close deals faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register?role=seller" className="btn-gold px-8 py-4 text-base rounded-xl">
                List for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/about" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body text-sm">
                Learn how it works →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
