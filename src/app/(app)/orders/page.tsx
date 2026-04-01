import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    return null
  }

  const { data: memberships } = await supabase
    .from('org_members')
    .select('organization_id')
    .eq('user_id', userData.user.id)
    .eq('status', 'active')
    .limit(1)

  const organizationId = memberships?.[0]?.organization_id ?? null

  const { data: orders } = organizationId
    ? await supabase
        .from('sales_orders')
        .select('id, order_number, status, currency, total, required_by, created_at')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(10)
    : { data: [] }

  return (
    <div className="space-y-8">
      <section className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Sales orders</div>
          <h1 className="mt-2 text-2xl font-semibold text-white">Orders</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
            This is the start of the outbound workflow. Draft orders, fulfillment location, and status progression will live here.
          </p>
        </div>

        <Link
          href="/orders/new"
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black"
        >
          New order
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Draft orders', value: '—' },
          { label: 'Open orders', value: '—' },
          { label: 'Fulfillment progress', value: '—' },
          { label: 'Daily order value', value: '—' },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <div className="text-sm text-neutral-400">{card.label}</div>
            <div className="mt-2 text-3xl font-semibold text-white">{card.value}</div>
          </div>
        ))}
      </section>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">Recent orders</h2>
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Latest 10</span>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-neutral-800">
          <table className="min-w-full divide-y divide-neutral-800 text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Order</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Currency</th>
                <th className="px-4 py-3 text-left font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 bg-neutral-950 text-neutral-300">
              {(orders ?? []).length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-neutral-500" colSpan={5}>
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders!.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3">
                      <Link href={`/orders/${order.id}`} className="text-white hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{order.status}</td>
                    <td className="px-4 py-3">{order.currency}</td>
                    <td className="px-4 py-3">{Number(order.total ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
