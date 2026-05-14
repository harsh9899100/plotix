"use client"
import { useState } from "react"
import { HardDrive, Download, RefreshCw, CheckCircle, Clock, Plus, Trash2, AlertCircle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, ConfirmDialog } from "@/components/ui"
import { formatDateTime } from "@/lib/utils"
import toast from "react-hot-toast"


const BACKUPS = [
  { id:"bk1", name:"auto-daily-2024-11-15", type:"AUTOMATIC", size:"2.4 GB", status:"SUCCESS", tables:24, rows:"1.2M", createdAt:new Date(Date.now()-3*3600000) },
  { id:"bk2", name:"auto-daily-2024-11-14", type:"AUTOMATIC", size:"2.3 GB", status:"SUCCESS", tables:24, rows:"1.18M", createdAt:new Date(Date.now()-27*3600000) },
  { id:"bk3", name:"manual-pre-migration-v2", type:"MANUAL", size:"2.2 GB", status:"SUCCESS", tables:24, rows:"1.1M", createdAt:new Date(Date.now()-3*86400000) },
  { id:"bk4", name:"auto-daily-2024-11-12", type:"AUTOMATIC", size:"2.1 GB", status:"FAILED", tables:24, rows:"N/A", createdAt:new Date(Date.now()-3.5*86400000) },
  { id:"bk5", name:"auto-weekly-2024-11-10", type:"AUTOMATIC", size:"2.0 GB", status:"SUCCESS", tables:24, rows:"1.05M", createdAt:new Date(Date.now()-5*86400000) },
]

export default function BackupsPage() {
  const [backups, setBackups] = useState(BACKUPS)
  const [creating, setCreating] = useState(false)
  const [restoring, setRestoring] = useState<string|null>(null)
  const [deleting, setDeleting] = useState<string|null>(null)

  const createBackup = async () => {
    setCreating(true)
    await new Promise(r => setTimeout(r, 2000))
    const newBk = { id:`bk${Date.now()}`, name:`manual-${new Date().toISOString().slice(0,10)}`, type:"MANUAL", size:"2.4 GB", status:"SUCCESS", tables:24, rows:"1.2M", createdAt:new Date() }
    setBackups(prev => [newBk, ...prev])
    setCreating(false)
    toast.success("Backup created successfully!")
  }

  const restore = async () => {
    await new Promise(r => setTimeout(r, 1000))
    toast.success(`Restore from ${restoring} initiated. This may take a few minutes.`)
    setRestoring(null)
  }

  const doDelete = () => {
    setBackups(prev => prev.filter(b => b.id !== deleting))
    setDeleting(null)
    toast.success("Backup deleted")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><HardDrive className="w-7 h-7 text-stone-500"/>Database Backups</h1>
            <p className="page-subtitle">Manage automated and manual database backups.</p>
          </div>
          <button onClick={createBackup} disabled={creating} className="btn-gold">
            {creating ? <><RefreshCw className="w-4 h-4 animate-spin"/>Creating...</> : <><Plus className="w-4 h-4"/>Create Backup</>}
          </button>
        </div>

        {/* Backup schedule info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:"Daily Backups", desc:"Every day at 2:00 AM IST", icon:"⏰", status:"Active" },
            { label:"Weekly Full Backup", desc:"Every Sunday at 1:00 AM IST", icon:"📅", status:"Active" },
            { label:"Retention Policy", desc:"Daily: 7 days · Weekly: 4 weeks", icon:"🗄️", status:"Configured" },
          ].map(s => (
            <div key={s.label} className="card-flat p-4 flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-body font-semibold text-stone-900 text-sm">{s.label}</p>
                <p className="text-xs text-stone-400">{s.desc}</p>
              </div>
              <Badge variant="green" className="ml-auto">{s.status}</Badge>
            </div>
          ))}
        </div>

        {/* Backup list */}
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Backup Name</th><th>Type</th><th>Size</th><th>Records</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {backups.map(b => (
                <tr key={b.id}>
                  <td>
                    <p className="font-medium font-mono text-sm text-stone-900">{b.name}</p>
                    <p className="text-xs text-stone-400">{b.tables} tables</p>
                  </td>
                  <td><Badge variant={b.type === "MANUAL" ? "blue" : "stone"}>{b.type}</Badge></td>
                  <td className="text-sm text-stone-600">{b.size}</td>
                  <td className="text-sm text-stone-600">{b.rows}</td>
                  <td>
                    <Badge variant={b.status === "SUCCESS" ? "green" : "rose"}>
                      {b.status === "SUCCESS" ? <CheckCircle className="w-3 h-3"/> : <AlertCircle className="w-3 h-3"/>}
                      {b.status}
                    </Badge>
                  </td>
                  <td className="text-xs text-stone-400">{formatDateTime(b.createdAt)}</td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn-icon text-stone-400 hover:text-stone-700" title="Download"><Download className="w-4 h-4"/></button>
                      {b.status === "SUCCESS" && (
                        <button onClick={() => setRestoring(b.name)} className="btn-icon text-stone-400 hover:text-blue-600" title="Restore">
                          <RefreshCw className="w-4 h-4"/>
                        </button>
                      )}
                      {b.type === "MANUAL" && (
                        <button onClick={() => setDeleting(b.id)} className="btn-icon text-stone-400 hover:text-rose-600" title="Delete">
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog open={!!restoring} onClose={() => setRestoring(null)} onConfirm={restore}
        title="Restore Database?" description={`This will restore the database from backup "${restoring}". All data since this backup will be lost. This action cannot be undone.`}
        confirmLabel="Restore" danger/>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={doDelete}
        title="Delete Backup?" description="This will permanently delete this backup file." confirmLabel="Delete" danger/>
    </DashboardLayout>
  )
}
