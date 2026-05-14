import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import type { Metadata } from "next"
export const metadata: Metadata = { title:"Terms of Service | PLOTIX Reality" }
const sections = [
  { title:"1. Acceptance of Terms", content:"By accessing or using PLOTIX Reality's platform, mobile application, or any of our services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service." },
  { title:"2. User Accounts", content:"You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. PLOTIX Reality is not liable for any loss resulting from someone else using your password." },
  { title:"3. Property Listings", content:"All property listings on PLOTIX Reality are subject to verification. We reserve the right to remove any listing that violates our policies. Listing agents and owners are responsible for the accuracy of information provided." },
  { title:"4. Agent & Broker Conduct", content:"Verified agents must maintain RERA registration and comply with all applicable real estate laws. Misrepresentation, fraud, or unethical conduct will result in immediate account suspension and legal action." },
  { title:"5. Transaction Fees", content:"PLOTIX Reality charges platform fees on successful property transactions. Commission rates are clearly disclosed before listing. Fees are non-refundable once a transaction is completed." },
  { title:"6. Privacy & Data", content:"Your use of PLOTIX Reality is also governed by our Privacy Policy. We collect and process data as described therein. By using our service, you consent to such processing and warrant that all data you provide is accurate." },
  { title:"7. Intellectual Property", content:"The PLOTIX Reality platform, including its design, logo, and content, is owned by PLOTIX Reality Pvt. Ltd. You may not reproduce, distribute, or create derivative works without express written permission." },
  { title:"8. Limitation of Liability", content:"PLOTIX Reality provides the platform as-is and is not liable for any property transactions, disputes between users, or losses arising from use of the platform. We facilitate connections but do not guarantee transaction outcomes." },
  { title:"9. Dispute Resolution", content:"Any disputes arising from use of PLOTIX Reality will be resolved through binding arbitration under Indian Arbitration and Conciliation Act. The venue for all disputes shall be Surat, Gujarat." },
  { title:"10. Changes to Terms", content:"We reserve the right to modify these terms at any time. We will notify users of significant changes via email. Continued use of the platform after changes constitutes acceptance of the new terms." },
]
export default function TermsPage() {
  return (<>
    <Navbar/>
    <main className="pt-16">
      <div className="bg-stone-50 border-b border-stone-100 py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-light text-stone-900 mb-2">Terms of Service</h1>
          <p className="font-body text-stone-500 text-sm">Last updated: January 1, 2024 · Effective: January 1, 2024</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
          <p className="font-body text-amber-800 text-sm leading-relaxed"><strong>Important:</strong> Please read these Terms of Service carefully before using PLOTIX Reality. These terms constitute a legally binding agreement between you and PLOTIX Reality Pvt. Ltd.</p>
        </div>
        <div className="space-y-10">
          {sections.map(s=>(
            <div key={s.title}>
              <h2 className="font-display text-xl font-medium text-stone-900 mb-3">{s.title}</h2>
              <p className="font-body text-stone-600 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-stone-200">
          <p className="font-body text-stone-500 text-sm">For questions about these Terms, contact us at <a href="mailto:legal@plotix.in" className="text-amber-700 underline">legal@plotix.in</a> or write to PLOTIX Reality Pvt. Ltd., Vesu, Surat, Gujarat 395007, India.</p>
        </div>
      </div>
    </main>
    <Footer/>
  </>)
}
