"use client"
import { useState } from "react"
import Link from "next/link"
import { Users, Plus, Filter, Download, MoreHorizontal, Eye, Ban, CheckCircle, Trash2, Search, ChevronDown } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button, Badge, SearchInput, Tabs, Pagination, Avatar, ConfirmDialog, EmptyState } from "@/components/ui"
import { formatDate, getInitials, getRoleBadgeColor, getStatusColor, cn } from "@/lib/utils"
import toast from "react-hot-toast"

const MOCK_ADMIN = { id: "admin1", firstName: "Admin", lastName: "User", role: "ADMIN", email: "admin@plotix.in" }

const MOCK_USERS = [
  { id: "u1", firstName: "Arjun",  lastName: "Mehta",  email: "arjun@demo.com",  phone: "9876543210", role: "BUYER",   status: "ACTIVE",    createdAt: new Date("2024-01-15"), lastSeen: new Date(Date.now() - 3600000),  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
  { id: "u2", firstName: "Priya",  lastName: "Sharma", email: "priya@demo.com",  phone: "9765432109", role: "AGENT",   status: "ACTIVE",    createdAt: new Date("2023-06-10"), lastSeen: new Date(Date.now() - 7200000),  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" },
  { id: "u3", firstName: "Vikram", lastName: "Patel",  email: "vikram@demo.com", phone: "9654321098", role: "BUILDER", status: "ACTIVE",    createdAt: new Date("2023-03-22"), lastSeen: new Date(Date.now() - 86400000), avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
  { id: "u4", firstName: "Nisha",  lastName: "Kapoor", email: "nisha@demo.com",  phone: "9543210987", role: "OWNER",   status: "SUSPENDED", createdAt: new Date("2024-02-08"), lastSeen: new Date(Date.now() - 172800000),avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
  { id: "u5", firstName: "Rahul",  lastName: "Gupta",  email: "rahul@demo.com",  phone: "9432109876", role: "BUYER",   status: "ACTIVE",    createdAt: new Date("2024-03-01"), lastSeen: new Date(Date.now() - 1800000),  avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&crop=face" },
  { id: "u6", firstName: "Kavya",  lastName: "Nair",   email: "kavya@demo.com",  phone: "9321098765", role: "BUYER",   status: "PENDING_VERIFICATION", createdAt: new Date("2024-03-15"), lastSeen: null, avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face" },
  { id: "u7", firstName: "Rohan",  lastName: "Shah",   email: "rohan@demo.com",  phone: "9210987654", role: "AGENT",   status: "ACTIVE",    createdAt: new Date("2023-11-05"), lastSeen: new Date(Date.now() - 3000000),  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
  { id: "u8", firstName: "Anita",  lastName: "Desai",  email: "anita@demo.com",  phone: "9109876543", role: "BUYER",   status: "INACTIVE",  createdAt: new Date("2023-09-20"), lastSeen: new Date(Date.now() - 2592000000), avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face" },
]

const ROLE_OPTIONS  = ["", "BUYER", "AGENT", "BUILDER", "OWNER", "ADMIN"]
const STATUS_OPTIONS = ["", "ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION"]

export default function AdminUsersPage() {
  const [users, setUsers]         = useState(MOCK_USERS)
  const [search, setSearch]       = useState("")
  const [roleFilter, setRole]     = useState("")
  const [statusFilter, setStatus] = useState("")
  const [page, setPage]           = useState(1)
  const [selected, setSelected]   = useState<string[]>([])
  const [confirm, setConfirm]     = useState<{ type: string; userId?: string } | null>(null)
  const [openMenu, setOpenMenu]   = useState<string | null>(null)
  const PER_PAGE = 6

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      (!search || u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (!roleFilter   || u.role === roleFilter) &&
      (!statusFilter || u.status === statusFilter)
    )
  })

  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const toggleSelect = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const handleSuspend = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" } : u))
    toast.success("User status updated")
    setConfirm(null); setOpenMenu(null)
  }

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    toast.success("User deleted")
    setConfirm(null); setOpenMenu(null)
  }

  const badgeForStatus = (s: string) => {
    const m: Record<string, any> = { ACTIVE: "green", INACTIVE: "stone", SUSPENDED: "rose", PENDING_VERIFICATION: "amber" }
    return <Badge variant={m[s] || "stone"}>{s.replace("_", " ")}</Badge>
  }

  return (
    <DashboardLayout user={MOCK_ADMIN as any}>
      <div className="dashboard-main py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title flex items-center gap-2"><Users className="w-7 h-7 text-blue-500" />User Management</h1>
            <p className="page-subtitle">{filtered.length} of {users.length} users shown</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm"><Download className="w-4 h-4" />Export</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="card-flat p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email…" className="flex-1 max-w-sm" />
            <div className="flex gap-2">
              <select value={roleFilter} onChange={(e) => { setRole(e.target.value); setPage(1) }}
                className="select text-sm py-2 px-3 w-36">
                <option value="">All Roles</option>
                {ROLE_OPTIONS.filter(Boolean).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={statusFilter} onChange={(e) => { setStatus(e.target.value); setPage(1) }}
                className="select text-sm py-2 px-3 w-44">
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.filter(Boolean).map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </div>
          </div>

          {selected.length > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
              <span className="text-xs font-body text-stone-500">{selected.length} selected</span>
              <Button variant="danger" size="sm" onClick={() => setConfirm({ type: "bulk-delete" })}>
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelected([])}>Clear</Button>
            </div>
          )}
        </div>

        {/* Table */}
        {paginated.length === 0 ? (
          <EmptyState icon={<Users className="w-8 h-8 text-stone-300" />} title="No users found" description="Try adjusting your search or filters." />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-10">
                    <input type="checkbox"
                      checked={selected.length === paginated.length && paginated.length > 0}
                      onChange={(e) => setSelected(e.target.checked ? paginated.map((u) => u.id) : [])}
                      className="w-4 h-4 rounded border-stone-300 accent-stone-900" />
                  </th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="hidden md:table-cell">Phone</th>
                  <th className="hidden lg:table-cell">Joined</th>
                  <th className="hidden xl:table-cell">Last Seen</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input type="checkbox" checked={selected.includes(user.id)} onChange={() => toggleSelect(user.id)}
                        className="w-4 h-4 rounded border-stone-300 accent-stone-900" />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} name={`${user.firstName} ${user.lastName}`} size="sm" />
                        <div className="min-w-0">
                          <p className="font-body font-semibold text-stone-900 text-sm">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-stone-400 font-body truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant={({ BUYER:"blue", AGENT:"violet", BUILDER:"amber", OWNER:"green", ADMIN:"rose" } as any)[user.role] || "stone"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>{badgeForStatus(user.status)}</td>
                    <td className="hidden md:table-cell text-sm font-body text-stone-600">{user.phone}</td>
                    <td className="hidden lg:table-cell text-sm font-body text-stone-500">{formatDate(user.createdAt)}</td>
                    <td className="hidden xl:table-cell text-sm font-body text-stone-500">
                      {user.lastSeen ? new Intl.RelativeTimeFormat("en",{numeric:"auto"}).format(-Math.round((Date.now()-user.lastSeen.getTime())/3600000),"hour") : "—"}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1 relative">
                        <Link href={`/dashboard/admin/users/${user.role.toLowerCase()}s/${user.id}`}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMenu === user.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-0 top-8 w-40 bg-white border border-stone-200 rounded-xl shadow-lg z-20 overflow-hidden">
                              <button onClick={() => setConfirm({ type: "suspend", userId: user.id })}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-stone-700 hover:bg-stone-50">
                                {user.status === "SUSPENDED" ? <><CheckCircle className="w-4 h-4 text-emerald-500" />Activate</> : <><Ban className="w-4 h-4 text-amber-500" />Suspend</>}
                              </button>
                              <button onClick={() => setConfirm({ type: "delete", userId: user.id })}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-rose-600 hover:bg-rose-50">
                                <Trash2 className="w-4 h-4" />Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-body text-stone-400">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>

        {/* Confirm dialogs */}
        <ConfirmDialog
          open={confirm?.type === "suspend"}
          onClose={() => setConfirm(null)}
          onConfirm={() => confirm?.userId && handleSuspend(confirm.userId)}
          title="Suspend User?"
          description="The user will lose access to their account until reactivated."
          confirmLabel="Suspend"
        />
        <ConfirmDialog
          open={confirm?.type === "delete"}
          onClose={() => setConfirm(null)}
          onConfirm={() => confirm?.userId && handleDelete(confirm.userId)}
          title="Delete User?"
          description="This action is permanent and cannot be undone. All user data will be removed."
          confirmLabel="Delete"
          danger
        />
        <ConfirmDialog
          open={confirm?.type === "bulk-delete"}
          onClose={() => setConfirm(null)}
          onConfirm={() => { setUsers((p) => p.filter((u) => !selected.includes(u.id))); setSelected([]); setConfirm(null); toast.success(`${selected.length} users deleted`) }}
          title={`Delete ${selected.length} Users?`}
          description="All selected users and their data will be permanently removed."
          confirmLabel="Delete All"
          danger
        />
      </div>
    </DashboardLayout>
  )
}
