import { OrdersSummary } from '@/components/sales-orders/orders-summary'
import { OrdersTable } from '@/components/sales-orders/orders-table'

export default function SalesOrdersPage() {
  return (
    <div className="space-y-6">
      <section>
        <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Sales orders</div>
        <h1 className="mt-2 text-2xl font-semibold text-white">Sales order flow</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-400">
          This is the next core workflow after master data. It will evolve into order entry, line items, fulfillment location selection, and status progress.
        </p>
      </section>

      <OrdersSummary />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <OrdersTable />

        <aside className="space-y-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <h2 className="text-base font-semibold text-white">Order creation</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Next you will add a proper order form with customer lookup, products, quantities, pricing, taxes, and fulfillment location.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <h2 className="text-base font-semibold text-white">Workflow scope</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-neutral-400">
              <li>Order draft and confirmation</li>
              <li>Line items and totals</li>
              <li>Reservation and fulfillment progress</li>
              <li>Shipment handoff</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  )
}
