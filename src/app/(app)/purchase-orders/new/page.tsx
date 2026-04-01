import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PurchaseOrderForm } from '@/components/purchase-orders/purchase-order-form'

export default async function NewPurchaseOrderPage() {
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

  const [{ data: suppliers }, { data: locations }, { data: products }] = await Promise.all([
    supabase
      .from('suppliers')
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
      .select('id, sku, name, base_cost')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('created_at', { ascending: true }),
  ])

  return (
    <div className="space-y-8">
      <section>
        <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Purchase orders</div>
        <h1 className="mt-2 text-2xl font-semibold text-white">Create purchase order</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
          Build a draft PO with supplier, receiving location, line items, and totals.
        </p>
      </section>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <PurchaseOrderForm
          organizationId={organizationId}
          suppliers={(suppliers ?? []).map((row) => ({ id: row.id, name: row.name, code: row.code }))}
          locations={(locations ?? []).map((row) => ({ id: row.id, name: row.name, code: row.code }))}
          products={(products ?? []).map((row) => ({
            id: row.id,
            sku: row.sku,
            name: row.name,
            base_cost: Number(row.base_cost ?? 0),
          }))}
        />
      </div>
    </div>
  )
}