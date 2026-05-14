"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, CheckCircle, Download, Receipt } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui"
import { formatDateTime } from "@/lib/utils"

const PAYMENT = {
  id:"pay1", invoiceNo:"INV-2024-001247", amount:25000, tax:4500, total:29500,
  status:"SUCCESS", method:"UPI", upiId:"arjun@paytm",
  description:"Platform fee for property inquiry — Luxurious 4BHK Penthouse in Vesu",
  propertyTitle:"Luxurious 4BHK Penthouse in Vesu", propertySlug:"luxurious-4bhk-penthouse-vesu-surat",
  paidAt:new Date(Date.now()-2*86400000), transactionId:"TXN20241115125403ABCDE",
  refundable:false,
}

export default function PaymentDetailPage({ params }: { params: { id: string } }) {
  const [downloading, setDownloading] = useState(false)

  const downloadReceipt = async () => {
    setDownloading(true)
    await new Promise(r => setTimeout(r, 1500))
    setDownloading(false)
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/buyer/payments" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title">Payment Details</h1>
            <p className="page-subtitle">Transaction #{PAYMENT.invoiceNo}</p>
          </div>
        </div>

        {/* Status banner */}
        <div className={`rounded-2xl p-5 flex items-center gap-4 ${PAYMENT.status === "SUCCESS" ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200"}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${PAYMENT.status === "SUCCESS" ? "bg-emerald-100" : "bg-rose-100"}`}>
            {PAYMENT.status === "SUCCESS" ? <CheckCircle className="w-6 h-6 text-emerald-600"/> : <CreditCard className="w-6 h-6 text-rose-600"/>}
          </div>
          <div>
            <p className={`font-display text-xl font-medium ${PAYMENT.status === "SUCCESS" ? "text-emerald-800" : "text-rose-800"}`}>
              {PAYMENT.status === "SUCCESS" ? "Payment Successful" : "Payment Failed"}
            </p>
            <p className="text-sm font-body text-stone-500">{formatDateTime(PAYMENT.paidAt)}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-display text-3xl text-stone-900">₹{PAYMENT.total.toLocaleString()}</p>
            <p className="text-xs text-stone-400 font-body">Total Paid</p>
          </div>
        </div>

        {/* Invoice breakdown */}
        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium text-stone-900 flex items-center gap-2"><Receipt className="w-5 h-5"/>Invoice Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-body">
              <span className="text-stone-600">Platform Fee</span>
              <span className="text-stone-900">₹{PAYMENT.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-stone-600">GST (18%)</span>
              <span className="text-stone-900">₹{PAYMENT.tax.toLocaleString()}</span>
            </div>
            <div className="h-px bg-stone-200"/>
            <div className="flex justify-between font-body font-semibold">
              <span>Total</span>
              <span className="text-lg">₹{PAYMENT.total.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-stone-400 font-body italic">{PAYMENT.description}</p>
        </div>

        {/* Transaction details */}
        <div className="card-flat p-6 space-y-3">
          <h2 className="font-display text-lg font-medium text-stone-900">Transaction Details</h2>
          {[
            { label:"Transaction ID", value:PAYMENT.transactionId },
            { label:"Invoice Number", value:PAYMENT.invoiceNo },
            { label:"Payment Method", value:`${PAYMENT.method} · ${PAYMENT.upiId}` },
            { label:"Date & Time", value:formatDateTime(PAYMENT.paidAt) },
            { label:"Status", value:<Badge variant="green"><CheckCircle className="w-3 h-3"/>Successful</Badge> },
          ].map(f => (
            <div key={f.label} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
              <span className="text-sm text-stone-500 font-body">{f.label}</span>
              <span className="text-sm text-stone-900 font-body font-medium">{f.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={downloadReceipt} disabled={downloading}
            className="btn-secondary flex-1 flex items-center justify-center gap-2">
            <Download className="w-4 h-4"/>{downloading ? "Generating..." : "Download Receipt"}
          </button>
          <Link href={`/properties/${PAYMENT.propertySlug}`} className="btn-ghost flex-1 flex items-center justify-center">View Property</Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
