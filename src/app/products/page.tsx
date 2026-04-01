import { createClient } from '@/lib/supabase/server'
import { MasterDataPage } from '@/components/master-data-page'
import { createProduct } from './actions'

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, sku, barcode, name, brand, base_price, track_inventory, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  const rows = (data ?? []) as Array<{
    id: string
    sku: string
    barcode: string | null
    name: string
    brand: string | null
    base_price: number
    track_inventory: boolean
    is_active: boolean
  }>

  return (
    <MasterDataPage
      title="Products"
      description="Inventory-aware sellable items with pricing, dimensions, tags, and operational metadata."
      stats={[
        { label: 'Products', value: rows.length },
        { label: 'Active', value: rows.filter((r) => r.is_active).length },
        { label: 'Tracked', value: rows.filter((r) => r.track_inventory).length },
        { label: 'Priced', value: rows.filter((r) => r.base_price > 0).length },
      ]}
      table={
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Existing products</h2>
            <p className="mt-1 text-sm text-neutral-400">Products anchor sales, procurement, inventory, and shipments. fileciteturn2file0turn2file15turn2file18</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-neutral-500">
                <tr className="border-b border-neutral-800">
                  <th className="py-3 pr-4">SKU</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Brand</th>
                  <th className="py-3 pr-4">Price</th>
                  <th className="py-3 pr-4">Tracked</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-neutral-900">
                    <td className="py-3 pr-4 text-neutral-300">{row.sku}</td>
                    <td className="py-3 pr-4 text-white">{row.name}</td>
                    <td className="py-3 pr-4 text-neutral-300">{row.brand ?? '—'}</td>
                    <td className="py-3 pr-4 text-neutral-300">{row.base_price}</td>
                    <td className="py-3 pr-4 text-neutral-300">{row.track_inventory ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
                {!rows.length ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">No products yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      }
      form={
        <form action={createProduct} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Create product</h2>
            <p className="mt-1 text-sm text-neutral-400">This is the item master that sales and stock both reference.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">SKU</label>
              <input name="sku" required className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Barcode</label>
              <input name="barcode" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Name</label>
            <input name="name" required className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Description</label>
            <textarea name="description" rows={3} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Category</label>
              <input name="category" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Brand</label>
              <input name="brand" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Unit of measure</label>
              <input name="unit_of_measure" defaultValue="pza" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Tags comma separated</label>
              <input name="tags" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" placeholder="fragile,heavy" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Base cost</label>
              <input name="base_cost" type="number" step="0.01" defaultValue="0" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Base price</label>
              <input name="base_price" type="number" step="0.01" defaultValue="0" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Weight</label>
              <input name="weight" type="number" step="0.000001" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Length</label>
              <input name="length" type="number" step="0.000001" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Width</label>
              <input name="width" type="number" step="0.000001" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Height</label>
              <input name="height" type="number" step="0.000001" className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Attributes JSON</label>
            <textarea name="attributes" rows={3} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Metadata JSON</label>
            <textarea name="metadata" rows={3} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white" />
          </div>

          <label className="flex items-center justify-between gap-4 text-sm text-neutral-300">
            <span>Track inventory</span>
            <input name="track_inventory" type="checkbox" defaultChecked className="h-4 w-4" />
          </label>

          <label className="flex items-center justify-between gap-4 text-sm text-neutral-300">
            <span>Active</span>
            <input name="is_active" type="checkbox" defaultChecked className="h-4 w-4" />
          </label>

          <button className="rounded-md bg-white px-4 py-2 font-medium text-black">Create product</button>
        </form>
      }
      help={
        <>
          <p>Products are the center of inventory valuation, reservations, movements, sales orders, purchase orders, and shipments. Your schema already includes SKU, barcode, pricing, dimensions, tags, and metadata. fileciteturn2file0turn2file6turn2file11turn2file15</p>
        </>
      }
    />
  )
}
