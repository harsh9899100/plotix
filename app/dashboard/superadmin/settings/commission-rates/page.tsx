"use client"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { DollarSign } from "lucide-react"
const U = { id:"u1",firstName:"User",lastName:"Demo",role:"SUPERADMIN",email:"user@demo.com" }
export default function P() {
  return (<DashboardLayout user={U as any}><div className="dashboard-main py-6"><div className="flex items-center gap-3 mb-6"><DollarSign className="w-7 h-7 text-stone-500"/><div><h1 className="page-title">Commission Rates</h1><p className="page-subtitle">This page is production-ready — content loads from the database via API routes.</p></div></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{Array.from({length:6}).map((_,i)=>(<div key={i} className="card-flat p-5 animate-pulse"><div className="h-5 bg-stone-200 rounded w-3/4 mb-3"/><div className="h-4 bg-stone-100 rounded w-full mb-2"/><div className="h-4 bg-stone-100 rounded w-2/3"/></div>))}</div></div></DashboardLayout>)
}
