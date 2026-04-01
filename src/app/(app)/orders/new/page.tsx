import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SalesOrderForm } from '@/components/sales-orders/sales-order-form'

export default async function NewOrderPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    redirect('/sign-in')
  }

  const { data: memberships } = await supabase
    .from('org_members')
    .select('organization_id')
    .eq('user_id', userData.user.id)
    .eq('status', 'active')
    .limit(1)

  const organizationId = memberships?.[0]?.organization_id
  if (!organizationId) redirect('/onboarding/organization')

  const [{ data: customers }, { data: locations }, { data: products }] = await Promise.all([
    supabase
      .from('customers')
      .select('id, name, code')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: true }),
    supabase
      .from('locations')
      .select('id, name, code')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: true }),
    supabase
      .from('products')
      .select('id, sku, name, base_price')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('created_at', { ascending: true }),
  ])

  return (
    <div className="space-y-8">
      <section>
        <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Sales orders</div>
        <h1 className="mt-2 text-2xl font-semibold text-white">Create order</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
          Build a draft order with customer, fulfillment location, line items, totals, and notes.
        </p>
      </section>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <SalesOrderForm
          organizationId={organizationId}
          customers={(customers ?? []).map((row) => ({
            id: row.id,
            name: row.name,
            code: row.code,
          }))}
          locations={(locations ?? []).map((row) => ({
            id: row.id,
            name: row.name,
            code: row.code,
          }))}
          products={(products ?? []).map((row) => ({
            id: row.id,
            sku: row.sku,
            name: row.name,
            base_price: Number(row.base_price ?? 0),
          }))}
        />
      </div>
    </div>
  )
}
