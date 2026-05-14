"use client"
import Link from "next/link"
import { ArrowLeft, Building2, Home, Users, MessageSquare, BarChart2, TrendingUp, Clock, CheckCircle, Edit } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, StatCard } from "@/components/ui"
import { formatDate, formatCurrency } from "@/lib/utils"

const PROJECT = {
  id:"p1", name:"Karan Sky Residences", location:"Vesu, Surat, Gujarat", status:"UNDER_CONSTRUCTION",
  totalUnits:120, soldUnits:87, availableUnits:33, reservedUnits:0,
  minPrice:4500000, maxPrice:12000000, completionDate:new Date(Date.now()+180*86400000),
  launchDate:new Date(Date.now()-365*86400000),
  image:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop",
  amenities:["Swimming Pool","Gym","Club House","24/7 Security","Power Backup","Covered Parking","Jogging Track","Children's Play Area"],
  description:"A premium residential project offering 2, 3 and 4 BHK apartments with world-class amenities and stunning city views.",
  totalRevenue:391500000, targetRevenue:540000000,
  recentInquiries:24, brokers:8,
}

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const progressPct = Math.round(PROJECT.soldUnits / PROJECT.totalUnits * 100)
  const revenueProgress = Math.round(PROJECT.totalRevenue / PROJECT.targetRevenue * 100)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Link href="/dashboard/builder/projects" className="btn-icon mt-1"><ArrowLeft className="w-4 h-4"/></Link>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="page-title">{PROJECT.name}</h1>
                  <Badge variant="amber"><Clock className="w-3 h-3"/>Under Construction</Badge>
                </div>
                <p className="page-subtitle">📍 {PROJECT.location} · Launched {formatDate(PROJECT.launchDate)}</p>
              </div>
              <Link href={`/dashboard/builder/projects/${params.projectId}/edit`} className="btn-secondary"><Edit className="w-4 h-4"/>Edit Project</Link>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="rounded-2xl overflow-hidden h-56 lg:h-72 relative">
          <img src={PROJECT.image} alt="" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <p className="font-display text-2xl font-light">{formatCurrency(PROJECT.minPrice)} – {formatCurrency(PROJECT.maxPrice)}</p>
            <p className="text-white/70 text-sm">Price per unit</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Units" value={PROJECT.totalUnits} icon={<Home className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
          <StatCard label="Units Sold" value={PROJECT.soldUnits} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50" change={`${progressPct}% sold`} changeType="up"/>
          <StatCard label="Available" value={PROJECT.availableUnits} icon={<Home className="w-5 h-5 text-amber-500"/>} color="bg-amber-50"/>
          <StatCard label="Total Revenue" value={formatCurrency(PROJECT.totalRevenue)} icon={<TrendingUp className="w-5 h-5 text-violet-500"/>} color="bg-violet-50"/>
        </div>

        {/* Progress bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card-flat p-5">
            <div className="flex justify-between mb-2">
              <p className="font-body font-semibold text-stone-800">Sales Progress</p>
              <p className="text-sm font-body text-stone-500">{PROJECT.soldUnits}/{PROJECT.totalUnits} units</p>
            </div>
            <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all" style={{width:`${progressPct}%`}}/>
            </div>
            <p className="text-xs text-stone-400 mt-2">{progressPct}% sold · {PROJECT.availableUnits} units remaining</p>
          </div>
          <div className="card-flat p-5">
            <div className="flex justify-between mb-2">
              <p className="font-body font-semibold text-stone-800">Revenue Target</p>
              <p className="text-sm font-body text-stone-500">{formatCurrency(PROJECT.totalRevenue)} of {formatCurrency(PROJECT.targetRevenue)}</p>
            </div>
            <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full" style={{width:`${revenueProgress}%`}}/>
            </div>
            <p className="text-xs text-stone-400 mt-2">{revenueProgress}% achieved · Completes {formatDate(PROJECT.completionDate)}</p>
          </div>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label:"Properties", icon:Home, href:`/dashboard/builder/projects/${params.projectId}/properties`, count:PROJECT.totalUnits },
            { label:"Inquiries", icon:MessageSquare, href:`/dashboard/builder/projects/${params.projectId}/inquiries`, count:PROJECT.recentInquiries },
            { label:"Leads", icon:Users, href:`/dashboard/builder/projects/${params.projectId}/leads`, count:15 },
            { label:"Brokers", icon:Users, href:`/dashboard/builder/projects/${params.projectId}/broker-network`, count:PROJECT.brokers },
            { label:"Analytics", icon:BarChart2, href:`/dashboard/builder/projects/${params.projectId}/analytics`, count:null },
            { label:"Edit Project", icon:Edit, href:`/dashboard/builder/projects/${params.projectId}/edit`, count:null },
          ].map(n => (
            <Link key={n.label} href={n.href} className="card-flat p-4 text-center hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-2 group-hover:bg-stone-900 transition-colors">
                <n.icon className="w-5 h-5 text-stone-500 group-hover:text-white transition-colors"/>
              </div>
              <p className="text-xs font-body font-medium text-stone-700">{n.label}</p>
              {n.count !== null && <p className="text-lg font-display text-stone-900">{n.count}</p>}
            </Link>
          ))}
        </div>

        {/* Amenities */}
        <div className="card-flat p-6">
          <h2 className="font-display text-lg font-medium text-stone-900 mb-4">Project Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {PROJECT.amenities.map(a => (
              <span key={a} className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-full text-sm font-body">✓ {a}</span>
            ))}
          </div>
        </div>

        <div className="card-flat p-6">
          <h2 className="font-display text-lg font-medium text-stone-900 mb-3">About the Project</h2>
          <p className="text-sm font-body text-stone-600 leading-relaxed">{PROJECT.description}</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
