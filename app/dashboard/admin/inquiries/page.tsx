"use client"
import { useState } from "react"
import { MessageSquare, Eye, Clock, CheckCircle, XCircle, ArrowRight, Building2, User } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, Tabs, StatCard, SearchInput, Avatar } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"
import toast from "react-hot-toast"

const INQUIRIES = [
  { id:"i1", buyer:"Arjun Mehta", buyerAvatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", property:"Luxurious 4BHK Penthouse in Vesu", agent:"Priya Sharma", price:38500000, status:"NEW", time:new Date(Date.now()-1*3600000), message:"Interested in purchasing. Please share all details and can we arrange a viewing this weekend?" },
  { id:"i2", buyer:"Meera Patel", buyerAvatar:"", property:"3BHK in SG Highway", agent:"Rohan Mehta", price:12500000, status:"RESPONDED", time:new Date(Date.now()-6*3600000), message:"Is the price negotiable? I have pre-approved home loan from SBI." },
  { id:"i3", buyer:"Kiran Shah", buyerAvatar:"", property:"Villa in Alkapuri", agent:"Kavita Joshi", price:18000000, status:"CLOSED", time:new Date(Date.now()-3*86400000), message:"Looking for possession within 3 months. Is this possible?" },
]

const STATUS_CFG: Record<string, any> = { NEW:"amber", RESPONDED:"blue", CLOSED:"green" }

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState(INQUIRIES)
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = inquiries.filter(i => {
    const matchSearch = !search || i.buyer.toLowerCase().includes(search.toLowerCase()) || i.property.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === "all" || i.status === tab
    return matchSearch && matchTab
  })

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><MessageSquare className="w-7 h-7 text-violet-500" />Platform Inquiries</h1>
          <p className="page-subtitle">Monitor all buyer–agent property inquiries across the platform.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={inquiries.length} icon={<MessageSquare className="w-5 h-5 text-stone-400" />} color="bg-stone-100" />
          <StatCard label="New" value={inquiries.filter(i => i.status === "NEW").length} icon={<Clock className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
          <StatCard label="Responded" value={inquiries.filter(i => i.status === "RESPONDED").length} icon={<CheckCircle className="w-5 h-5 text-blue-500" />} color="bg-blue-50" />
          <StatCard label="Closed / Deals" value={inquiries.filter(i => i.status === "CLOSED").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50" />
        </div>

        <div className="flex gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search buyer or property..." className="flex-1 max-w-sm" />
          <Tabs tabs={[{ value:"all", label:"All" }, { value:"NEW", label:"New" }, { value:"RESPONDED", label:"Responded" }, { value:"CLOSED", label:"Closed" }]} active={tab} onChange={setTab} />
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Buyer</th><th>Property</th><th>Agent</th><th>Price</th><th>Status</th><th>Received</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar src={i.buyerAvatar} name={i.buyer} size="sm" />
                      <p className="font-medium text-stone-900">{i.buyer}</p>
                    </div>
                  </td>
                  <td className="text-sm text-stone-700 max-w-[180px] truncate">{i.property}</td>
                  <td className="text-sm text-stone-600">{i.agent}</td>
                  <td className="text-sm text-stone-700">₹{(i.price / 100000).toFixed(0)}L</td>
                  <td><Badge variant={STATUS_CFG[i.status]}>{i.status}</Badge></td>
                  <td className="text-xs text-stone-400">{formatTimeAgo(i.time)}</td>
                  <td>
                    <button onClick={() => toast.success(`Viewing inquiry from ${i.buyer}`)} className="btn-icon text-stone-400 hover:text-stone-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
