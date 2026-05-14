"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, DollarSign, CheckCircle, Clock, Download, TrendingUp } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui"
import { formatDate, formatCurrency } from "@/lib/utils"

const COMMISSION = {
  id:"com1", invoiceNo:"COM-2024-00091", propertyTitle:"Luxurious 4BHK Penthouse in Vesu",
  buyerName:"Arjun Mehta", salePrice:38500000, commissionRate:2,
  grossCommission:770000, tds:77000, netCommission:693000,
  status:"PAID", paidAt:new Date(Date.now()-5*86400000), transactionId:"NEFT20241110",
}

export default function CommissionDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/agent/commissions" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title">Commission Detail</h1>
            <p className="page-subtitle">#{COMMISSION.invoiceNo}</p>
          </div>
        </div>

        {/* Status banner */}
        <div className={`rounded-2xl p-5 flex items-center gap-4 ${COMMISSION.status === "PAID" ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-100"}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${COMMISSION.status === "PAID" ? "bg-emerald-100" : "bg-amber-100"}`}>
            {COMMISSION.status === "PAID" ? <CheckCircle className="w-6 h-6 text-emerald-600"/> : <Clock className="w-6 h-6 text-amber-600"/>}
          </div>
          <div className="flex-1">
            <p className={`font-display text-xl font-medium ${COMMISSION.status === "PAID" ? "text-emerald-800" : "text-amber-800"}`}>
              {COMMISSION.status === "PAID" ? "Commission Paid" : "Pending Payment"}
            </p>
            {COMMISSION.paidAt && <p className="text-sm text-stone-400">{formatDate(COMMISSION.paidAt)}</p>}
          </div>
          <div className="text-right">
            <p className="font-display text-3xl text-stone-900">{formatCurrency(COMMISSION.netCommission)}</p>
            <p className="text-xs text-stone-400">Net Commission</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="card-flat p-6 space-y-4">
          <h2 className="font-display text-lg font-medium flex items-center gap-2"><TrendingUp className="w-5 h-5"/>Commission Breakdown</h2>
          <div className="space-y-3">
            {[
              { label:"Property Sale Price", value:formatCurrency(COMMISSION.salePrice) },
              { label:`Commission Rate (${COMMISSION.commissionRate}%)`, value:formatCurrency(COMMISSION.grossCommission) },
              { label:"TDS Deducted (10%)", value:`-${formatCurrency(COMMISSION.tds)}`, className:"text-rose-600" },
            ].map(f => (
              <div key={f.label} className="flex justify-between text-sm font-body py-2 border-b border-stone-100">
                <span className="text-stone-500">{f.label}</span>
                <span className={`font-medium ${f.className || "text-stone-900"}`}>{f.value}</span>
              </div>
            ))}
            <div className="flex justify-between font-body font-semibold pt-2">
              <span>Net Commission</span>
              <span className="text-lg text-emerald-700">{formatCurrency(COMMISSION.netCommission)}</span>
            </div>
          </div>
        </div>

        {/* Property & Buyer */}
        <div className="card-flat p-6 space-y-3">
          <h2 className="font-display text-lg font-medium">Transaction Details</h2>
          {[
            { label:"Property", value:COMMISSION.propertyTitle },
            { label:"Buyer", value:COMMISSION.buyerName },
            { label:"Transaction ID", value:COMMISSION.transactionId || "—" },
            { label:"Invoice No", value:COMMISSION.invoiceNo },
            { label:"Status", value:<Badge variant="green"><CheckCircle className="w-3 h-3"/>Paid</Badge> },
          ].map(f => (
            <div key={f.label} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
              <span className="text-sm text-stone-400">{f.label}</span>
              <span className="text-sm text-stone-900 font-medium">{f.value}</span>
            </div>
          ))}
        </div>

        <button className="btn-secondary w-full flex items-center justify-center gap-2"><Download className="w-4 h-4"/>Download Commission Slip</button>
      </div>
    </DashboardLayout>
  )
}
