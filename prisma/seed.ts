// prisma/seed.ts — Full PLOTIX Reality seed
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding PLOTIX Reality database...")

  // ── Passwords ──────────────────────────────────────────────────────────────
  const userPwd  = await bcrypt.hash("aaBC@$12", 12)
  const adminPwd = await bcrypt.hash("aaBC@$12", 12)
  const now      = new Date()

  // ── Superadmin ─────────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where:  { email: "harsh.patel.softwaredev@gmail.com" },
    update: { role: "SUPERADMIN", status: "ACTIVE", emailVerified: now, password: adminPwd },
    create: {
      email: "harsh.patel.softwaredev@gmail.com", password: adminPwd,
      firstName: "Harsh", lastName: "Patel",
      phone: "9876540000", role: "SUPERADMIN", status: "ACTIVE", emailVerified: now,
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    },
  })
  console.log("✅ Superadmin created")

  // ── Admins ─────────────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where:  { email: "admin@plotix.in" },
    update: { status: "ACTIVE", emailVerified: now, password: adminPwd },
    create: {
      email: "admin@plotix.in", password: adminPwd,
      firstName: "Platform", lastName: "Admin",
      role: "ADMIN", status: "ACTIVE", emailVerified: now,
      profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face",
    },
  })

  await prisma.user.upsert({
    where:  { email: "neha.admin@plotix.in" },
    update: { status: "ACTIVE", emailVerified: now, password: adminPwd },
    create: {
      email: "neha.admin@plotix.in", password: adminPwd,
      firstName: "Neha", lastName: "Singh",
      role: "ADMIN", status: "ACTIVE", emailVerified: now,
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face",
    },
  })
  console.log("✅ Admins created (2)")

  // ── Agents ─────────────────────────────────────────────────────────────────
  const agentData = [
    { email: "priya.sharma@plotix.in", firstName: "Priya", lastName: "Sharma", phone: "9765432109",
      agency: "Sharma Realty", rera: "RERA-GJ-AGT-2022-1234", exp: 8, comm: 3.5, sales: 28, listings: 45, rating: 4.8,
      img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face" },
    { email: "rohan.mehta@plotix.in", firstName: "Rohan", lastName: "Mehta", phone: "9887654321",
      agency: "MetroHomes Realty", rera: "RERA-GJ-AGT-2021-0890", exp: 6, comm: 3.0, sales: 19, listings: 32, rating: 4.5,
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face" },
    { email: "kavita.joshi@plotix.in", firstName: "Kavita", lastName: "Joshi", phone: "9654321087",
      agency: "Dream Properties", rera: "RERA-GJ-AGT-2023-1567", exp: 4, comm: 2.5, sales: 11, listings: 18, rating: 4.2,
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face" },
  ]

  for (const a of agentData) {
    const agent = await prisma.user.upsert({
      where: { email: a.email },
      update: { status: "ACTIVE", emailVerified: now, password: userPwd },
      create: {
        email: a.email, password: userPwd, firstName: a.firstName, lastName: a.lastName,
        phone: a.phone, role: "AGENT", status: "ACTIVE", emailVerified: now, profileImage: a.img,
      },
    })
    await prisma.agentProfile.upsert({
      where: { userId: agent.id },
      update: {},
      create: {
        userId: agent.id, agencyName: a.agency, licenseNumber: a.rera,
        yearsExperience: a.exp, commissionRate: a.comm, verified: true,
        rating: a.rating, totalSales: a.sales, totalListings: a.listings,
      },
    })
  }
  console.log("✅ Agents created (3)")

  // ── Builders ───────────────────────────────────────────────────────────────
  const builderData = [
    { email: "karan.dev@plotix.in", firstName: "Karan", lastName: "Developers", phone: "9543210876",
      company: "Karan Build Corp", reg: "RERA-GJ-BLD-2018-001", yrs: 15, projects: 12, rating: 4.6,
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face" },
    { email: "skyline@plotix.in", firstName: "Skyline", lastName: "Infra", phone: "9432109765",
      company: "Skyline Infrastructure Ltd.", reg: "RERA-GJ-BLD-2015-002", yrs: 18, projects: 24, rating: 4.8,
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face" },
    { email: "greenpark@plotix.in", firstName: "GreenPark", lastName: "Homes", phone: "9321098654",
      company: "GreenPark Homes Pvt. Ltd.", reg: "RERA-GJ-BLD-2020-003", yrs: 8, projects: 6, rating: 4.3,
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face" },
    { email: "heritage@plotix.in", firstName: "Heritage", lastName: "Realty", phone: "9210987543",
      company: "Heritage Realty Group", reg: "RERA-GJ-BLD-2012-004", yrs: 22, projects: 38, rating: 4.9,
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face" },
  ]

  for (const b of builderData) {
    const builder = await prisma.user.upsert({
      where: { email: b.email },
      update: { status: "ACTIVE", emailVerified: now, password: userPwd },
      create: {
        email: b.email, password: userPwd, firstName: b.firstName, lastName: b.lastName,
        phone: b.phone, role: "BUILDER", status: "ACTIVE", emailVerified: now, profileImage: b.img,
      },
    })
    await prisma.builderProfile.upsert({
      where: { userId: builder.id },
      update: {},
      create: {
        userId: builder.id, companyName: b.company, registrationNumber: b.reg,
        yearsInBusiness: b.yrs, numberOfProjects: b.projects, verified: true, rating: b.rating,
      },
    })
  }
  console.log("✅ Builders created (4)")

  // ── Owners ─────────────────────────────────────────────────────────────────
  const ownerData = [
    { email: "suresh.owner@plotix.in", firstName: "Suresh", lastName: "Patel", phone: "9109876543",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face" },
    { email: "anita.owner@plotix.in", firstName: "Anita", lastName: "Shah", phone: "9098765432",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face" },
    { email: "deepak.owner@plotix.in", firstName: "Deepak", lastName: "Agarwal", phone: "9087654321",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face" },
    { email: "maya.owner@plotix.in", firstName: "Maya", lastName: "Desai", phone: "9076543210",
      img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face" },
    { email: "vikram.owner@plotix.in", firstName: "Vikram", lastName: "Trivedi", phone: "9065432109",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face" },
  ]

  for (const o of ownerData) {
    await prisma.user.upsert({
      where: { email: o.email },
      update: { status: "ACTIVE", emailVerified: now, password: userPwd },
      create: {
        email: o.email, password: userPwd, firstName: o.firstName, lastName: o.lastName,
        phone: o.phone, role: "OWNER", status: "ACTIVE", emailVerified: now, profileImage: o.img,
      },
    })
  }
  console.log("✅ Owners created (5)")

  // ── Buyers ─────────────────────────────────────────────────────────────────
  const buyerData = [
    { email: "arjun@plotix.in", firstName: "Arjun", lastName: "Mehta", phone: "9876543210",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face" },
    { email: "meera@plotix.in", firstName: "Meera", lastName: "Patel", phone: "9765432108",
      img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face" },
    { email: "kiran@plotix.in", firstName: "Kiran", lastName: "Shah", phone: "9654321097",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face" },
    { email: "rajesh@plotix.in", firstName: "Rajesh", lastName: "Kumar", phone: "9543210986",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face" },
    { email: "pooja@plotix.in", firstName: "Pooja", lastName: "Verma", phone: "9432109875",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face" },
  ]

  for (const b of buyerData) {
    await prisma.user.upsert({
      where: { email: b.email },
      update: { status: "ACTIVE", emailVerified: now, password: userPwd },
      create: {
        email: b.email, password: userPwd, firstName: b.firstName, lastName: b.lastName,
        phone: b.phone, role: "BUYER", status: "ACTIVE", emailVerified: now, profileImage: b.img,
      },
    })
  }
  console.log("✅ Buyers created (5)")

  // ── Feature Flags ──────────────────────────────────────────────────────────
  const flags = [
    { key: "virtual_tours",      name: "Virtual Tours",      description: "Enable 3D/VR property tours",           enabled: true,  rolloutPct: 100 },
    { key: "ai_recommendations", name: "AI Recommendations", description: "AI-powered property match engine",       enabled: true,  rolloutPct: 80  },
    { key: "escrow_payments",    name: "Escrow Payments",    description: "Secure escrow payment system",           enabled: false, rolloutPct: 0   },
    { key: "chat_support",       name: "Live Chat Support",  description: "Live chat support widget for users",     enabled: true,  rolloutPct: 100 },
    { key: "blockchain_title",   name: "Blockchain Titles",  description: "Property title verification on chain",   enabled: false, rolloutPct: 0   },
    { key: "nri_portal",         name: "NRI Portal",         description: "Dedicated NRI buyer onboarding portal",  enabled: true,  rolloutPct: 50  },
  ]
  for (const flag of flags) {
    await prisma.featureFlag.upsert({ where: { key: flag.key }, update: {}, create: flag })
  }
  console.log("✅ Feature flags seeded (6)")

  // ── Site Settings ──────────────────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteTitle: "PLOTIX Reality",
      siteDescription: "India's most trusted premium real estate platform — find, compare, and buy properties with confidence.",
      commissionRate: 2.0,
      supportEmail: "support@plotix.in",
    },
  })
  console.log("✅ Site settings seeded")

  // ── Leads (for agent Priya Sharma) ────────────────────────────────────────
  const agentUser = await prisma.user.findUnique({ where: { email: "priya.sharma@plotix.in" } })
  if (agentUser) {
    const leadsData = [
      { name: "Dhruv Shah",    email: "dhruv@lead.com", phone: "9321654780", source: "Website Inquiry",  temperature: "HOT",  score: 91, budget: 9500000, notes: "Ready to buy 3BHK in Vesu. Pre-approved home loan from HDFC.", cities: ["Surat"] },
      { name: "Sonal Jain",    email: "sonal@lead.com", phone: "9210543679", source: "Facebook Ad",       temperature: "HOT",  score: 85, budget: 6500000, notes: "2BHK looking for Adajan or Piplod. Looking to move within 2 months.", cities: ["Surat"] },
      { name: "Neel Parikh",   email: "neel@lead.com",  phone: "9109432568", source: "Agent Referral",    temperature: "WARM", score: 68, budget: 15000000, notes: "Investor buyer — wants 2 units in upcoming projects.", cities: ["Ahmedabad", "Surat"] },
      { name: "Isha Kothari",  email: "isha@lead.com",  phone: "9098321457", source: "Google Ad",         temperature: "WARM", score: 55, budget: 4500000, notes: "First-time buyer. Needs guidance on loan eligibility.", cities: ["Surat"] },
      { name: "Manish Tiwari", email: "manish@lead.com",phone: "9087210346", source: "Property Fair",     temperature: "COLD", score: 32, budget: 8000000, notes: "NRI based in UK. Interested but timing uncertain.", cities: ["Ahmedabad"] },
    ]
    for (const l of leadsData) {
      const existing = await prisma.lead.findFirst({ where: { agentId: agentUser.id, email: l.email } })
      if (!existing) {
        await prisma.lead.create({
          data: {
            agentId: agentUser.id, name: l.name, email: l.email, phone: l.phone,
            source: l.source, temperature: l.temperature as any, score: l.score,
            budget: l.budget, notes: l.notes, cities: l.cities, status: "NEW",
          },
        })
      }
    }
    console.log("✅ Leads seeded (5) for Priya Sharma")
  }

  console.log("\n🎉 Seed complete! All accounts use password: aaBC@$12\n")
  console.log("👤 SUPERADMIN : harsh.patel.softwaredev@gmail.com")
  console.log("🔐 ADMIN      : admin@plotix.in")
  console.log("🔐 ADMIN      : neha.admin@plotix.in")
  console.log("🏠 AGENTS     : priya.sharma@plotix.in | rohan.mehta@plotix.in | kavita.joshi@plotix.in")
  console.log("🏗️  BUILDERS   : karan.dev@plotix.in | skyline@plotix.in | greenpark@plotix.in | heritage@plotix.in")
  console.log("🏡 OWNERS     : suresh.owner@plotix.in | anita.owner@plotix.in | deepak.owner@plotix.in | maya.owner@plotix.in | vikram.owner@plotix.in")
  console.log("🛒 BUYERS     : arjun@plotix.in | meera@plotix.in | kiran@plotix.in | rajesh@plotix.in | pooja@plotix.in")
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
