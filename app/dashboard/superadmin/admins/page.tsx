"use client"
import { useState } from "react"
import { Users, Plus, Eye, Ban, CheckCircle, Shield, Edit, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Avatar, Badge, SearchInput, StatCard, ConfirmDialog } from "@/components/ui"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

const ADMINS = [
  { id:"adm1", name:"Admin Panel", email:"admin@plotix.in", phone:"+91 90000 00001", avatar:"", role:"ADMIN", permissions:["properties","users","content","payments"], status:"ACTIVE", lastLogin:new Date(Date.now()-2*3600000), createdAt:new Date(Date.now()-365*86400000) },
  { id:"adm2", name:"Content Manager", email:"content@plotix.in", phone:"+91 90000 00002", avatar:"", role:"CONTENT_ADMIN", permissions:["content"], status:"ACTIVE", lastLogin:new Date(Date.now()-24*3600000), createdAt:new Date(Date.now()-180*86400000) },
  { id:"adm3", name:"Support Lead", email:"support@plotix.in", phone:"+91 90000 00003", avatar:"", role:"SUPPORT_ADMIN", permissions:["users","content"], status:"INACTIVE", lastLogin:new Date(Date.now()-10*86400000), createdAt:new Date(Date.now()-90*86400000) },
]

const ROLE_LABELS: Record<string,string> = { ADMIN:"Full Admin", CONTENT_ADMIN:"Content Admin", SUPPORT_ADMIN:"Support Admin" }

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState(ADMINS)
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [deleting, setDeleting] = useState<string|null>(null)

  const filtered = admins.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleStatus = (id: string) => {
    setAdmins(p => p.map(a => a.id === id ? { ...a, status: a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : a))
    toast.success("Admin status updated")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Shield className="w-7 h-7 text-blue-500"/>Admin Management</h1>
            <p className="page-subtitle">Manage admin accounts and their platform permissions.</p>
          </div>
          <button onClick={() => toast.success("Create admin modal — coming next")} className="btn-gold"><Plus className="w-4 h-4"/>Add Admin</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Admins" value={admins.length} icon={<Users className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
          <StatCard label="Active" value={admins.filter(a=>a.status==="ACTIVE").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Inactive" value={admins.filter(a=>a.status==="INACTIVE").length} icon={<Ban className="w-5 h-5 text-stone-400"/>} color="bg-stone-100"/>
          <StatCard label="Permission Groups" value={3} icon={<Shield className="w-5 h-5 text-violet-500"/>} color="bg-violet-50"/>
        </div>

        <SearchInput value={search} onChange={setSearch} placeholder="Search admins..." className="max-w-sm"/>

        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Admin</th><th>Role</th><th>Permissions</th><th>Status</th><th>Last Login</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={a.name} size="sm"/>
                      <div><p className="font-medium text-stone-900">{a.name}</p><p className="text-xs text-stone-400">{a.email}</p></div>
                    </div>
                  </td>
                  <td><Badge variant="blue">{ROLE_LABELS[a.role] || a.role}</Badge></td>
                  <td>
                    <div className="flex gap-1 flex-wrap max-w-[200px]">
                      {a.permissions.map(p => <span key={p} className="px-1.5 py-0.5 bg-stone-100 rounded text-[10px] text-stone-600 font-mono">{p}</span>)}
                    </div>
                  </td>
                  <td><Badge variant={a.status==="ACTIVE"?"green":"stone"}>{a.status}</Badge></td>
                  <td className="text-xs text-stone-400">{formatDate(a.lastLogin)}</td>
                  <td className="text-xs text-stone-400">{formatDate(a.createdAt)}</td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn-icon text-stone-400 hover:text-stone-700"><Edit className="w-4 h-4"/></button>
                      <button onClick={() => toggleStatus(a.id)} className={`btn-icon text-stone-400 ${a.status==="ACTIVE"?"hover:text-amber-600":"hover:text-emerald-600"}`}>
                        {a.status==="ACTIVE"?<Ban className="w-4 h-4"/>:<CheckCircle className="w-4 h-4"/>}
                      </button>
                      <button onClick={() => setDeleting(a.id)} className="btn-icon text-stone-400 hover:text-rose-600"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => { setAdmins(p=>p.filter(a=>a.id!==deleting)); setDeleting(null); toast.success("Admin removed") }}
        title="Remove Admin?" description="This will permanently remove this admin account and revoke all access." confirmLabel="Remove" danger/>
    </DashboardLayout>
  )
}
