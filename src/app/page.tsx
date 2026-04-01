import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BrandMark } from '@/components/brand-mark'
import { ArrowRight, BarChart3, Boxes, FileText, ShieldCheck } from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (data.user) {
    redirect('/dashboard')
  }

  const pillars = [
    {
      icon: Boxes,
      title: 'Inventory and master data',
      text: 'Locations, customers, suppliers, and products in a single tenant model.',
    },
    {
      icon: FileText,
      title: 'Orders and billing',
      text: 'Sales orders, purchase orders, shipments, invoices, and payments.',
    },
    {
      icon: ShieldCheck,
      title: 'Roles and access',
      text: 'Organization-level permissions with clean onboarding and invites.',
    },
    {
      icon: BarChart3,
      title: 'Operational visibility',
      text: 'Health snapshots, low-stock indicators, and trend-ready reporting.',
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <BrandMark />
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="rounded-md border border-neutral-800 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200"
          >
            Create account
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-16">
        <section className="max-w-2xl">
          <div className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">
            Minimal operations platform for SMB logistics
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Run inventory, sales, and procurement from one controlled workspace.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-neutral-400">
            A professional, low-clutter starting point for businesses that need clean tenant separation,
            predictable workflows, and room to grow into more operational modules.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 font-medium text-black hover:bg-neutral-200"
            >
              Enter workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-md border border-neutral-800 px-5 py-3 font-medium text-neutral-200 hover:bg-neutral-900"
            >
              Start with email
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {pillars.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                  <Icon className="h-5 w-5 text-neutral-200" />
                  <h2 className="mt-4 text-sm font-medium text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">{item.text}</p>
                </div>
              )
            })}
          </div>
        </section>

        <aside className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 lg:p-8">
          <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">What is next</div>
          <div className="mt-3 text-xl font-semibold text-white">Sales orders</div>
          <p className="mt-3 text-sm leading-6 text-neutral-400">
            The next planned module is the sales-order flow: line items, fulfillment location, status changes,
            and progress tracking.
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-300">
              Organization onboarding is already in place.
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-300">
              Role-aware navigation and access-denied states are already in place.
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-300">
              Inventory visibility is the current working module.
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
