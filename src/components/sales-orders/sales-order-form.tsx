'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { createSalesOrder } from '@/app/actions/sales-orders'

type Option = {
  id: string
  name: string
  code: string | null
}

type ProductOption = {
  id: string
  sku: string
  name: string
  base_price: number
}

type LineState = {
  product_id: string
  description: string
  quantity: string
  unit_price: string
  tax_rate: string
  discount_total: string
}

const emptyLine = (): LineState => ({
  product_id: '',
  description: '',
  quantity: '1',
  unit_price: '0',
  tax_rate: '0',
  discount_total: '0',
})

export function SalesOrderForm({
  organizationId,
  customers,
  locations,
  products,
}: {
  organizationId: string
  customers: Option[]
  locations: Option[]
  products: ProductOption[]
}) {
  const router = useRouter()
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? '')
  const [locationId, setLocationId] = useState(locations[0]?.id ?? '')
  const [currency, setCurrency] = useState('MXN')
  const [requiredBy, setRequiredBy] = useState('')
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState<LineState[]>([
    { ...emptyLine(), unit_price: String(products[0]?.base_price ?? 0), product_id: products[0]?.id ?? '' },
  ])

  const lineTotals = useMemo(() => {
    return lines.map((line) => {
      const quantity = Number(line.quantity || 0)
      const unitPrice = Number(line.unit_price || 0)
      const taxRate = Number(line.tax_rate || 0)
      const discount = Number(line.discount_total || 0)
      const subtotal = quantity * unitPrice
      const tax = (subtotal - discount) * taxRate
      const total = subtotal - discount + tax
      return { subtotal, tax, total }
    })
  }, [lines])

  const summary = useMemo(() => {
    const subtotal = lineTotals.reduce((sum, row) => sum + row.subtotal, 0)
    const tax_total = lineTotals.reduce((sum, row) => sum + row.tax, 0)
    const discount_total = lines.reduce((sum, row) => sum + Number(row.discount_total || 0), 0)
    const total = subtotal - discount_total + tax_total
    return { subtotal, tax_total, discount_total, total }
  }, [lineTotals, lines])

  const updateLine = (index: number, patch: Partial<LineState>) => {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)))
  }

  const removeLine = (index: number) => {
    setLines((prev) => prev.length === 1 ? prev : prev.filter((_, i) => i !== index))
  }

  const addLine = () => {
    setLines((prev) => [...prev, emptyLine()])
  }

  const linesJson = JSON.stringify(lines.map((line) => ({
    product_id: line.product_id,
    description: line.description,
    quantity: Number(line.quantity),
    unit_price: Number(line.unit_price),
    tax_rate: Number(line.tax_rate),
    discount_total: Number(line.discount_total),
  })))

  const selectedProduct = (productId: string) => products.find((p) => p.id === productId)

  return (
    <form action={createSalesOrder} className="space-y-6">
      <input type="hidden" name="organization_id" value={organizationId} />
      <input type="hidden" name="lines_json" value={linesJson} />

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Customer</label>
          <select
            name="customer_id"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
          >
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.code ? `${customer.code} — ${customer.name}` : customer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Fulfillment location</label>
          <select
            name="fulfillment_location_id"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.code ? `${location.code} — ${location.name}` : location.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Currency</label>
          <select
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
          >
            <option value="MXN">MXN</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Required by</label>
          <input
            name="required_by"
            type="date"
            value={requiredBy}
            onChange={(e) => setRequiredBy(e.target.value)}
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-white">Line items</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Products, quantity, price, tax, and discount.
            </p>
          </div>
          <button
            type="button"
            onClick={addLine}
            className="inline-flex items-center gap-2 rounded-md border border-neutral-800 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
          >
            <Plus className="h-4 w-4" />
            Add line
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {lines.map((line, index) => {
            const currentProduct = selectedProduct(line.product_id)
            return (
              <div key={index} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                <div className="grid gap-4 md:grid-cols-[1.3fr_1fr_0.8fr_0.8fr_0.8fr_auto]">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-neutral-500">Product</label>
                    <select
                      value={line.product_id}
                      onChange={(e) => {
                        const product = selectedProduct(e.target.value)
                        updateLine(index, {
                          product_id: e.target.value,
                          unit_price: String(product?.base_price ?? 0),
                          description: product?.name ?? '',
                        })
                      }}
                      className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.sku} — {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-neutral-500">Description</label>
                    <input
                      value={line.description}
                      onChange={(e) => updateLine(index, { description: e.target.value })}
                      className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
                      placeholder="Optional description"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-neutral-500">Qty</label>
                    <input
                      type="number"
                      min="0"
                      step="0.0001"
                      value={line.quantity}
                      onChange={(e) => updateLine(index, { quantity: e.target.value })}
                      className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-neutral-500">Unit price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.unit_price}
                      onChange={(e) => updateLine(index, { unit_price: e.target.value })}
                      className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-neutral-500">Tax rate</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={line.tax_rate}
                      onChange={(e) => updateLine(index, { tax_rate: e.target.value })}
                      className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-neutral-500">Discount</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.discount_total}
                      onChange={(e) => updateLine(index, { discount_total: e.target.value })}
                      className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-800 px-3 text-neutral-300 hover:bg-neutral-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                  <span>{currentProduct ? `Base price: ${currentProduct.base_price}` : 'No product selected'}</span>
                  <span>
                    Row total: {lineTotals[index] ? lineTotals[index].total.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1fr_320px]">
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Notes</label>
          <textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
            placeholder="Optional internal notes"
          />
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
          <h3 className="text-sm font-medium text-white">Order summary</h3>
          <div className="mt-4 space-y-2 text-sm text-neutral-300">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>{summary.discount_total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <span>{summary.tax_total.toFixed(2)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-neutral-800 pt-3 text-base font-semibold text-white">
              <span>Total</span>
              <span>{summary.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <button
              type="submit"
              className="rounded-md bg-white px-4 py-2 font-medium text-black"
            >
              Save draft
            </button>
            <button
              type="button"
              onClick={() => router.push('/orders')}
              className="rounded-md border border-neutral-800 px-4 py-2 text-sm text-neutral-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    </form>
  )
}
