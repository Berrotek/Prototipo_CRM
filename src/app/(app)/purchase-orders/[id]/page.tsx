import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function PurchaseOrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) redirect('/sign-in')

  const { data: memberships } = await supabase
    .from('org_members')
    .select('organization_id')
    .eq('user_id', userData.user.id)
    .eq('status', 'active')
    .limit(1)

  const organizationId = memberships?.[0]?.organization_id
  if (!organizationId) redirect('/onboarding/organization')

  const { data: po } = await supabase
    .from('purchase_orders')
    .select('id, po_number, supplier_id, receiving_location_id, status, currency, subtotal, tax_total, discount_total, shipping_total, total, expected_at, notes, created_at')
    .eq('id', params.id)
    .eq('organization_id', organizationId)
    .maybeSingle()

  if (!po) notFound()

  const { data: items } = await supabase
    .from('purchase_order_items')
    .select('id, line_number, description, quantity, unit_cost, tax_rate, discount_total, line_total, product_id')
    .eq('purchase_order_id', po.id)
    .order('line_number', { ascending: true })

  return (
    <div className="space-y-8">
      <section className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Purchase orders</div>
          <h1 className="mt-2 text-2xl font-semibold text-white">{po.po_number}</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Order detail shell for approval, receipt progress, and supplier coordination.
          </p>
        </div>

        <Link href="/purchase-orders" className="rounded-md border border-neutral-800 px-4 py-2 text-sm text-neutral-200">
          Back to purchase orders
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Status', po.status],
          ['Currency', po.currency],
          ['Total', Number(po.total ?? 0).toFixed(2)],
          ['Expected at', po.expected_at ?? '—'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <div className="text-sm text-neutral-400">{label}</div>
            <div className="mt-2 text-lg font-semibold text-white">{String(value)}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
          <h2 className="text-sm font-medium text-white">Line items</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-neutral-800">
            <table className="min-w-full divide-y divide-neutral-800 text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Line</th>
                  <th className="px-4 py-3 text-left font-medium">Description</th>
                  <th className="px-4 py-3 text-left font-medium">Qty</th>
                  <th className="px-4 py-3 text-left font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 bg-neutral-950 text-neutral-300">
                {(items ?? []).length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-neutral-500" colSpan={4}>
                      No line items.
                    </td>
                  </tr>
                ) : (
                  items!.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{item.line_number}</td>
                      <td className="px-4 py-3">{item.description ?? item.product_id}</td>
                      <td className="px-4 py-3">{Number(item.quantity).toFixed(4)}</td>
                      <td className="px-4 py-3">{Number(item.line_total ?? 0).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <h2 className="text-sm font-medium text-white">Notes</h2>
            <p className="mt-2 text-sm text-neutral-400">{po.notes ?? 'No notes provided.'}</p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <h2 className="text-sm font-medium text-white">Next actions</h2>
            <p className="mt-2 text-sm text-neutral-400">
              The next real workflow will be partial receiving and shipment linkage.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}