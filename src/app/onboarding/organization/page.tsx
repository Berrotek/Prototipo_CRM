import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrganizationForm } from '@/components/onboarding/organization-form'

export default async function OrganizationOnboardingPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) redirect('/sign-in')

  const { data: membership } = await supabase
    .from('org_members')
    .select('id')
    .eq('user_id', userData.user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (membership) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-100">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold">Create your organization</h1>
            <p className="mt-2 text-sm text-neutral-400">
              Set up the first tenant, owner role, and workspace defaults before inviting the team.
            </p>
          </div>

          <div className="mt-8">
            <OrganizationForm />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-sm font-medium text-neutral-200">What gets created</h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-400">
              <li>Organization record with slug and billing defaults</li>
              <li>Owner role with full access permissions</li>
              <li>Your first active org membership</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-sm font-medium text-neutral-200">Core defaults</h2>
            <div className="mt-4 space-y-2 text-sm text-neutral-400">
              <p>Currency, timezone, and locale map directly to `organizations.settings`.</p>
              <p>Negative stock and analytics toggles also live in `settings`.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
