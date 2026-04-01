import { InventorySummary } from '@/components/inventory/inventory-summary'

export default function InventoryPage() {
  return (
    <div className="space-y-8">
      <section>
        <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Inventory</div>
        <h1 className="mt-2 text-2xl font-semibold text-white">Inventory visibility</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
          This screen will become the operational center for stock-by-location, reservations, and movement history.
        </p>
      </section>

      <InventorySummary />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-white">Stock by location</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Placeholder</span>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-neutral-800">
            <table className="min-w-full divide-y divide-neutral-800 text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">SKU</th>
                  <th className="px-4 py-3 text-left font-medium">Location</th>
                  <th className="px-4 py-3 text-left font-medium">On hand</th>
                  <th className="px-4 py-3 text-left font-medium">Reserved</th>
                  <th className="px-4 py-3 text-left font-medium">Reorder point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 bg-neutral-950 text-neutral-300">
                <tr>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <h2 className="text-sm font-medium text-white">Low stock queue</h2>
            <p className="mt-2 text-sm text-neutral-400">
              Later this will show products that need replenishment and the suggested action.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <h2 className="text-sm font-medium text-white">Recent movements</h2>
            <p className="mt-2 text-sm text-neutral-400">
              Stock adjustments, receipts, issues, transfers, and returns will appear here.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
