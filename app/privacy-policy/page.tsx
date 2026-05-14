import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import type { Metadata } from "next"
export const metadata: Metadata = { title:"Privacy Policy | PLOTIX Reality" }
const sections = [
  { title:"1. Information We Collect", content:"We collect information you provide directly (name, email, phone, address), information from your use of our services (search history, saved properties, inquiry data), and technical data (IP address, browser type, device information) through cookies and similar technologies." },
  { title:"2. How We Use Your Information", content:"We use your data to provide and improve our services, send property recommendations and alerts, process transactions and commissions, communicate important updates, prevent fraud and ensure platform safety, and comply with legal obligations." },
  { title:"3. Information Sharing", content:"We do not sell your personal data. We share information with verified agents/sellers when you make an inquiry, payment processors for transaction handling, service providers who assist our operations, and law enforcement when required by law." },
  { title:"4. Data Security", content:"We implement industry-standard security measures including AES-256 encryption, SSL/TLS for all data transmission, regular security audits, and access controls. However, no internet transmission is 100% secure." },
  { title:"5. Cookies", content:"We use essential cookies for platform functionality, analytics cookies to understand usage patterns, and preference cookies to remember your settings. You can control cookies through your browser settings." },
  { title:"6. Your Rights (DPDP Act)", content:"Under India's Digital Personal Data Protection Act, you have rights to: access your personal data, correct inaccurate data, erase your data, withdraw consent, and file complaints with the Data Protection Board of India." },
  { title:"7. Data Retention", content:"We retain your data for as long as your account is active and for 7 years after account closure for legal compliance. You may request deletion of your account and associated data at any time." },
  { title:"8. Contact", content:"For privacy concerns, contact our Data Protection Officer at privacy@plotix.in or write to PLOTIX Reality Pvt. Ltd., Vesu, Surat, Gujarat 395007. We will respond within 30 days." },
]
export default function PrivacyPage() {
  return (<>
    <Navbar/>
    <main className="pt-16">
      <div className="bg-stone-50 border-b border-stone-100 py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-light text-stone-900 mb-2">Privacy Policy</h1>
          <p className="font-body text-stone-500 text-sm">Last updated: January 1, 2024 · Compliant with DPDP Act 2023</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {sections.map(s=>(
          <div key={s.title}>
            <h2 className="font-display text-xl font-medium text-stone-900 mb-3">{s.title}</h2>
            <p className="font-body text-stone-600 leading-relaxed">{s.content}</p>
          </div>
        ))}
        <div className="mt-8 pt-8 border-t border-stone-200">
          <p className="font-body text-stone-500 text-sm">Contact our DPO: <a href="mailto:privacy@plotix.in" className="text-amber-700 underline">privacy@plotix.in</a></p>
        </div>
      </div>
    </main>
    <Footer/>
  </>)
}
