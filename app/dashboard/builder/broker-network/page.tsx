"use client"
import { useState } from "react"
import Link from "next/link"
import { Users, Building2, Network, Star, MapPin, Phone, Mail, Eye } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Avatar, Badge, SearchInput, StatCard } from "@/components/ui"
import toast from "react-hot-toast"

const BROKERS = [
  { id:"br1", name:"Priya Sharma", agency:"Sharma Realty", city:"Surat", phone:"+91 97654 32109", email:"priya@agency.com", avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face", rera:"RERA-GUJ-AGT-2024-1234", rating:4.8, deals:3, status:"PREFERRED", activeListings:4 },
  { id:"br2", name:"Rohan Mehta", agency:"MetroHomes Realty", city:"Ahmedabad", phone:"+91 98123 45678", email:"rohan@metrohomes.in", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", rera:"RERA-GUJ-AGT-2022-0890", rating:4.5, deals:2, status:"ACTIVE", activeListings:2 },
  { id:"br3", name:"Kavita Joshi", agency:"Dream Properties", city:"Vadodara", phone:"+91 96325 87410", email:"kavita@dream.com", avatar:"", rera:"RERA-GUJ-AGT-2023-1567", rating:4.2, deals:1, status:"ACTIVE", activeListings:1 },
]

export default function BuilderBrokerNetworkPage() {
  const [search, setSearch] = useState("")
  const [brokers, setBrokers] = useState(BROKERS)

  const filtered = brokers.filter(b =>
    !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.city.toLowerCase().includes(search.toLowerCase())
  )

  const setPreferred = (id: string) => {
    setBrokers(p => p.map(b => b.id === id ? { ...b, status:"PREFERRED" } : b.status === "PREFERRED" ? { ...b, status:"ACTIVE" } : b))
    toast.success("Preferred broker updated")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Network className="w-7 h-7 text-blue-500" />Broker Network</h1>
          <p className="page-subtitle">Manage your channel partner agents and commission agreements.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Brokers" value={brokers.length} icon={<Users className="w-5 h-5 text-blue-500" />} color="bg-blue-50" />
          <StatCard label="Preferred" value={brokers.filter(b => b.status === "PREFERRED").length} icon={<Star className="w-5 h-5 text-amber-400" />} color="bg-amber-50" />
          <StatCard label="Total Deals" value={brokers.reduce((a, b) => a + b.deals, 0)} icon={<Building2 className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50" />
          <StatCard label="Active Listings" value={brokers.reduce((a, b) => a + b.activeListings, 0)} icon={<Eye className="w-5 h-5 text-violet-500" />} color="bg-violet-50" />
        </div>

        <SearchInput value={search} onChange={setSearch} placeholder="Search brokers by name or city..." className="max-w-sm" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(broker => (
            <div key={broker.id} className={`card p-5 ${broker.status === "PREFERRED" ? "border-amber-300 bg-amber-50/10" : ""}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar src={broker.avatar} name={broker.name} size="md" />
                  <div>
                    <p className="font-body font-semibold text-stone-900">{broker.name}</p>
                    <p className="text-xs text-stone-400">{broker.agency}</p>
                  </div>
                </div>
                <Badge variant={broker.status === "PREFERRED" ? "amber" : "stone"}>
                  {broker.status === "PREFERRED" ? "⭐ Preferred" : "Active"}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />{broker.city}
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-400 font-mono">
                  RERA: {broker.rera}
                </div>
                <div className="flex gap-4 text-xs text-stone-500 pt-2 border-t border-stone-100">
                  <span>⭐ {broker.rating} rating</span>
                  <span>🤝 {broker.deals} deals</span>
                  <span>🏠 {broker.activeListings} listings</span>
                </div>
              </div>

              <div className="flex gap-2">
                <a href={`tel:${broker.phone}`} className="btn-icon text-stone-400 hover:text-stone-700 flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </a>
                <a href={`mailto:${broker.email}`} className="btn-icon text-stone-400 hover:text-stone-700 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </a>
                {broker.status !== "PREFERRED" && (
                  <button onClick={() => setPreferred(broker.id)} className="btn-secondary text-xs flex-1">
                    ⭐ Set as Preferred
                  </button>
                )}
                {broker.status === "PREFERRED" && (
                  <button className="btn-gold text-xs flex-1" onClick={() => toast.success("Channel agreement details")}>
                    View Agreement
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
