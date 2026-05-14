import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import Link from "next/link"
import { MOCK_BLOG_POSTS } from "@/lib/data/mock"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"
export const metadata: Metadata = { title:"Blog | PLOTIX Reality" }
const CATEGORIES = ["All","Buying Guide","Market Trends","Finance","Renting","Investment","News"]
export default function BlogPage() {
  return (<>
    <Navbar/>
    <main className="pt-16">
      <div className="bg-stone-50 border-b border-stone-100 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag block mb-3">Insights & Guides</span>
          <h1 className="font-display text-5xl font-light text-stone-900 mb-4">The PLOTIX <em className="not-italic text-gradient-gold">Blog</em></h1>
          <p className="font-body text-stone-500 max-w-md mx-auto">Expert insights on real estate trends, buying guides, investment tips, and market analysis.</p>
        </div>
      </div>
      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 flex-wrap mb-10">
            {CATEGORIES.map(c=>(
              <button key={c} className={`px-4 py-2 rounded-xl text-sm font-body font-medium border transition-all ${c==="All"?"bg-stone-900 text-white border-stone-900":"bg-white text-stone-600 border-stone-200 hover:border-stone-400"}`}>{c}</button>
            ))}
          </div>
          {/* Featured */}
          <Link href={`/blog/${MOCK_BLOG_POSTS[0].slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-0 card overflow-hidden mb-8 hover:shadow-xl transition-all">
            <div className="relative aspect-video lg:aspect-auto overflow-hidden">
              {MOCK_BLOG_POSTS[0].featuredImage && <Image src={MOCK_BLOG_POSTS[0].featuredImage} alt={MOCK_BLOG_POSTS[0].title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:1024px) 100vw,50vw"/>}
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="badge badge-amber mb-4 self-start">{MOCK_BLOG_POSTS[0].category}</span>
              <h2 className="font-display text-3xl font-light text-stone-900 leading-tight mb-4 group-hover:text-amber-700 transition-colors">{MOCK_BLOG_POSTS[0].title}</h2>
              <p className="font-body text-stone-500 mb-6 leading-relaxed">{MOCK_BLOG_POSTS[0].excerpt}</p>
              <div className="flex items-center gap-3">
                {MOCK_BLOG_POSTS[0].author?.avatar && <img src={MOCK_BLOG_POSTS[0].author.avatar} alt="" className="w-9 h-9 rounded-full object-cover"/>}
                <div><p className="font-body font-semibold text-stone-900 text-sm">{MOCK_BLOG_POSTS[0].author?.name}</p><p className="text-xs text-stone-400 font-body">{formatDate(MOCK_BLOG_POSTS[0].publishedAt)} · {MOCK_BLOG_POSTS[0].readTime} min read</p></div>
              </div>
            </div>
          </Link>
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_BLOG_POSTS.slice(1).map(post=>(
              <Link key={post.id} href={`/blog/${post.slug}`} className="group card block">
                <div className="relative aspect-video overflow-hidden bg-stone-100">
                  {post.featuredImage && <Image src={post.featuredImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw,33vw"/>}
                  <div className="absolute top-3 left-3"><span className="badge bg-white/90 text-stone-700 text-xs">{post.category}</span></div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs font-body text-stone-400 mb-3"><span>{formatDate(post.publishedAt)}</span><span>·</span><span>{post.readTime} min read</span></div>
                  <h3 className="font-display text-lg font-medium text-stone-900 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="font-body text-stone-500 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-stone-100">
                    {post.author?.avatar && <img src={post.author.avatar} alt="" className="w-6 h-6 rounded-full object-cover"/>}
                    <span className="text-xs font-body font-medium text-stone-600">{post.author?.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer/>
  </>)
}
