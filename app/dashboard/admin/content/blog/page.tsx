"use client"
import { useState } from "react"
import Link from "next/link"
import { BookOpen, Plus, Edit, Trash2, Eye, CheckCircle, EyeOff, MoreHorizontal } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, SearchInput, Tabs, Pagination, EmptyState, ConfirmDialog, StatCard } from "@/components/ui"
import { formatDate, cn } from "@/lib/utils"
import { MOCK_BLOG_POSTS } from "@/lib/data/mock"
import toast from "react-hot-toast"

const MOCK_ADMIN = { id:"admin1", firstName:"Admin", lastName:"User", role:"ADMIN", email:"admin@plotix.in" }
const ALL_POSTS = [...MOCK_BLOG_POSTS, ...MOCK_BLOG_POSTS.map((p,i)=>({...p,id:`b${i+10}`,title:`Draft: ${p.title}`,status:"DRAFT",viewCount:0}))]

export default function AdminBlogPage() {
  const [posts, setPosts] = useState(ALL_POSTS)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")
  const [page, setPage] = useState(1)
  const [menu, setMenu] = useState<string|null>(null)
  const [confirm, setConfirm] = useState<string|null>(null)
  const PER_PAGE = 6

  const filtered = posts.filter(p =>
    (tab==="all"||(tab==="published"&&p.status==="PUBLISHED")||(tab==="draft"&&p.status==="DRAFT")) &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()))
  )
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)
  const totalPages = Math.ceil(filtered.length/PER_PAGE)

  const toggle = (id: string) => { setPosts(p=>p.map(x=>x.id===id?{...x,status:x.status==="PUBLISHED"?"DRAFT":"PUBLISHED"}:x)); toast.success("Status updated"); setMenu(null) }
  const del = (id: string) => { setPosts(p=>p.filter(x=>x.id!==id)); toast.success("Post deleted"); setConfirm(null) }

  return (
    <DashboardLayout user={MOCK_ADMIN as any}>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div><h1 className="page-title flex items-center gap-2"><BookOpen className="w-7 h-7 text-blue-500"/>Blog Management</h1><p className="page-subtitle">{posts.filter(p=>p.status==="PUBLISHED").length} published · {posts.filter(p=>p.status==="DRAFT").length} drafts</p></div>
          <Link href="/dashboard/admin/content/blog/new" className="btn-gold"><Plus className="w-4 h-4"/>New Post</Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"Published",   value:posts.filter(p=>p.status==="PUBLISHED").length, icon:<CheckCircle className="w-5 h-5 text-emerald-500"/>, color:"bg-emerald-50" },
            { label:"Drafts",      value:posts.filter(p=>p.status==="DRAFT").length,     icon:<EyeOff className="w-5 h-5 text-stone-500"/>                                },
            { label:"Total Views", value:posts.reduce((s,p)=>s+(p.viewCount||0),0).toLocaleString("en-IN"), icon:<Eye className="w-5 h-5 text-blue-500"/>, color:"bg-blue-50" },
          ].map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        <div className="card-flat p-4 space-y-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search posts…" className="max-w-sm"/>
          <Tabs tabs={[{value:"all",label:"All",count:posts.length},{value:"published",label:"Published",count:posts.filter(p=>p.status==="PUBLISHED").length},{value:"draft",label:"Drafts",count:posts.filter(p=>p.status==="DRAFT").length}]}
            active={tab} onChange={v=>{setTab(v);setPage(1)}}/>
        </div>

        {paginated.length===0 ? (
          <EmptyState icon={<BookOpen className="w-8 h-8 text-stone-300"/>} title="No posts found" action={<Link href="/dashboard/admin/content/blog/new" className="btn-gold">Create First Post</Link>}/>
        ) : (
          <div className="space-y-3">
            {paginated.map(post=>(
              <div key={post.id} className="card p-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  {post.featuredImage && <img src={post.featuredImage} alt="" className="w-20 h-14 rounded-xl object-cover flex-shrink-0"/>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant={post.status==="PUBLISHED"?"green":"stone"} className="text-[10px]">{post.status}</Badge>
                      {post.category && <span className="text-[10px] font-body text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{post.category}</span>}
                    </div>
                    <p className="font-body font-semibold text-stone-900 truncate">{post.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-stone-400 font-body">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>{post.readTime} min read</span>
                      <span><Eye className="w-3 h-3 inline mr-0.5"/>{(post.viewCount||0).toLocaleString()} views</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="btn-icon p-1.5"><Eye className="w-4 h-4"/></Link>
                    <Link href={`/dashboard/admin/content/blog/${post.id}`} className="btn-icon p-1.5"><Edit className="w-4 h-4"/></Link>
                    <div className="relative">
                      <button onClick={()=>setMenu(menu===post.id?null:post.id)} className="btn-icon p-1.5"><MoreHorizontal className="w-4 h-4"/></button>
                      {menu===post.id&&(<>
                        <div className="fixed inset-0 z-10" onClick={()=>setMenu(null)}/>
                        <div className="absolute right-0 top-9 w-44 bg-white border border-stone-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                          <button onClick={()=>toggle(post.id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-stone-700 hover:bg-stone-50">
                            {post.status==="PUBLISHED"?<><EyeOff className="w-4 h-4"/>Unpublish</>:<><CheckCircle className="w-4 h-4"/>Publish</>}
                          </button>
                          <button onClick={()=>{setConfirm(post.id);setMenu(null)}} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-rose-600 hover:bg-rose-50">
                            <Trash2 className="w-4 h-4"/>Delete
                          </button>
                        </div>
                      </>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs font-body text-stone-400">{filtered.length} posts</p>
          <Pagination page={page} totalPages={totalPages} onChange={setPage}/>
        </div>

        <ConfirmDialog open={!!confirm} onClose={()=>setConfirm(null)} onConfirm={()=>confirm&&del(confirm)}
          title="Delete Post?" description="This blog post will be permanently deleted." confirmLabel="Delete" danger/>
      </div>
    </DashboardLayout>
  )
}
