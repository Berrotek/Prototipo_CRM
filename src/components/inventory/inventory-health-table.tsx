type Row = {
  sku: string
  product_name: string
  location_name: string
  on_hand: number | string
  reserved_stock: number | string
  reorder_point: number | string
  stock_state: 'ok' | 'low_stock' | 'out_of_stock'
}

const rows: Row[] = []

export function InventoryHealthTable() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950">
      <div className="border-b border-neutral-800 p-5">
        <h2 className="text-base font-semibold text-white">Inventory by location</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Based on the current inventory view. Low-stock and out-of-stock rows should surface first.
        </p>
      </div>

      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-800 text-sm">
          <thead className="bg-neutral-950 text-left text-neutral-400">
            <tr>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">On hand</th>
              <th className="px-5 py-3 font-medium">Reserved</th>
              <th className="px-5 py-3 font-medium">Reorder point</th>
              <th className="px-5 py-3 font-medium">State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 bg-neutral-950">
            {rows.length ? rows.map((row) => (
              <tr key={`${row.sku}-${row.location_name}`}>
                <td className="px-5 py-3 text-neutral-200">{row.sku}</td>
                <td className="px-5 py-3 text-neutral-200">{row.product_name}</td>
                <td className="px-5 py-3 text-neutral-300">{row.location_name}</td>
                <td className="px-5 py-3 text-neutral-300">{row.on_hand}</td>
                <td className="px-5 py-3 text-neutral-300">{row.reserved_stock}</td>
                <td className="px-5 py-3 text-neutral-300">{row.reorder_point}</td>
                <td className="px-5 py-3 text-neutral-300">{row.stock_state}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-neutral-500">
                  No inventory rows yet. Create locations and products first, then load inventory levels.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
