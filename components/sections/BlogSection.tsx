import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { MOCK_BLOG_POSTS } from "@/lib/data/mock"
import { formatDate } from "@/lib/utils"
export default function BlogSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div><span className="section-tag">Insights & Guides</span><h2 className="section-title">Latest from the <em className="not-italic text-gradient-gold">Blog</em></h2></div>
          <Link href="/blog" className="btn-secondary self-start group">All Articles<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_BLOG_POSTS.map(post=>(
            <Link key={post.id} href={`/blog/${post.slug}`} className="group card block">
              <div className="relative aspect-video overflow-hidden bg-stone-100">
                {post.featuredImage && <Image src={post.featuredImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw,33vw"/>}
                <div className="absolute top-3 left-3"><span className="badge bg-white/90 text-stone-700 text-xs backdrop-blur-sm border border-stone-100">{post.category}</span></div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs font-body text-stone-400 mb-3">
                  <span>{formatDate(post.publishedAt)}</span><span>·</span><span>{post.readTime} min read</span>
                </div>
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
  )
}
