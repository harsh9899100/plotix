import { notFound } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import Link from "next/link"
import { MOCK_BLOG_POSTS } from "@/lib/data/mock"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"
interface Props { params:{ slug:string } }
export async function generateStaticParams() { return MOCK_BLOG_POSTS.map(p=>({slug:p.slug})) }
export async function generateMetadata({params}:Props): Promise<Metadata> {
  const p = MOCK_BLOG_POSTS.find(p=>p.slug===params.slug)
  return p ? { title:`${p.title} | PLOTIX Blog`, description:p.excerpt } : { title:"Not Found" }
}
export default function BlogDetailPage({params}:Props) {
  const post = MOCK_BLOG_POSTS.find(p=>p.slug===params.slug)
  if (!post) notFound()
  const related = MOCK_BLOG_POSTS.filter(p=>p.id!==post.id&&p.category===post.category).slice(0,2)
  return (<>
    <Navbar/>
    <main className="pt-16">
      <article className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/blog" className="text-xs font-body text-stone-400 hover:text-stone-700 flex items-center gap-1 mb-6">← Back to Blog</Link>
            <span className="badge badge-amber mb-4 inline-block">{post.category}</span>
            <h1 className="font-display text-4xl lg:text-5xl font-light text-stone-900 leading-tight mb-6">{post.title}</h1>
            <div className="flex items-center gap-4 pb-8 border-b border-stone-100">
              {post.author?.avatar && <img src={post.author.avatar} alt="" className="w-12 h-12 rounded-full object-cover"/>}
              <div>
                <p className="font-body font-semibold text-stone-900">{post.author?.name}</p>
                <p className="text-sm text-stone-400 font-body">{formatDate(post.publishedAt)} · {post.readTime} min read · {post.viewCount.toLocaleString()} views</p>
              </div>
            </div>
          </div>
          {post.featuredImage && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-10">
              <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority sizes="(max-width:768px) 100vw,800px"/>
            </div>
          )}
          <div className="prose prose-stone max-w-none">
            {post.excerpt && <p className="font-display text-xl font-light text-stone-700 leading-relaxed mb-6">{post.excerpt}</p>}
            <div className="font-body text-stone-600 leading-relaxed space-y-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-stone-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:text-stone-600 [&_p]:leading-relaxed" dangerouslySetInnerHTML={{__html: post.content || `<p>${post.excerpt}</p><p>Full article content will be loaded from the CMS in production. This is a demo rendering of the blog post excerpt to demonstrate the layout and typography of the PLOTIX Reality blog.</p><h2>Key Takeaways</h2><p>The real estate market in India continues to evolve rapidly. Buyers and investors need to stay informed about regulatory changes, market trends, and investment strategies.</p><p>PLOTIX Reality provides expert guidance and verified listings to help you make the most informed property decisions.</p>`}}/>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-16 bg-stone-50 border-t border-stone-100">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-light text-stone-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map(p=>(
                <Link key={p.id} href={`/blog/${p.slug}`} className="group card flex gap-4 p-4 hover:shadow-md">
                  <div className="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
                    {p.featuredImage && <Image src={p.featuredImage} alt={p.title} fill className="object-cover" sizes="96px"/>}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-body text-amber-700 font-semibold uppercase">{p.category}</span>
                    <h3 className="font-body font-semibold text-stone-900 text-sm mt-1 group-hover:text-amber-700 transition-colors line-clamp-2">{p.title}</h3>
                    <p className="text-xs text-stone-400 font-body mt-1">{formatDate(p.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
    <Footer/>
  </>)
}
