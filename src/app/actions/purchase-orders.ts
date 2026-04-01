'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { purchaseOrderFormSchema } from '@/lib/purchase-orders/schemas'

function buildPoNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `PO-${stamp}-${suffix}`
}

export async function createPurchaseOrder(formData: FormData) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    redirect('/sign-in')
  }

  const organizationId = String(formData.get('organization_id') ?? '')
  if (!organizationId) {
    throw new Error('Organization is required')
  }

  const raw = {
    supplier_id: String(formData.get('supplier_id') ?? ''),
    receiving_location_id: String(formData.get('receiving_location_id') ?? ''),
    currency: String(formData.get('currency') ?? 'MXN'),
    expected_at: String(formData.get('expected_at') ?? ''),
    notes: String(formData.get('notes') ?? ''),
    lines: JSON.parse(String(formData.get('lines_json') ?? '[]')),
  }

  const parsed = purchaseOrderFormSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid purchase order')
  }

  const subtotal = parsed.data.lines.reduce((sum, line) => sum + line.quantity * line.unit_cost, 0)
  const tax_total = parsed.data.lines.reduce(
    (sum, line) => sum + (line.quantity * line.unit_cost - line.discount_total) * line.tax_rate,
    0
  )
  const discount_total = parsed.data.lines.reduce((sum, line) => sum + line.discount_total, 0)
  const total = Math.round((subtotal - discount_total + tax_total) * 100) / 100

  const { data: po, error: poError } = await supabase
    .from('purchase_orders')
    .insert({
      organization_id: organizationId,
      po_number: buildPoNumber(),
      supplier_id: parsed.data.supplier_id,
      receiving_location_id: parsed.data.receiving_location_id || null,
      currency: parsed.data.currency,
      subtotal,
      tax_total,
      shipping_total: 0,
      discount_total,
      total,
      expected_at: parsed.data.expected_at || null,
      created_by: userData.user.id,
      status: 'draft',
    })
    .select('id')
    .single()

  if (poError || !po) {
    throw new Error(poError?.message ?? 'Failed to create purchase order')
  }

  const lines = parsed.data.lines.map((line, index) => ({
    organization_id: organizationId,
    purchase_order_id: po.id,
    line_number: index + 1,
    product_id: line.product_id,
    description: line.description || null,
    quantity: line.quantity,
    unit_cost: line.unit_cost,
    tax_rate: line.tax_rate,
    discount_total: line.discount_total,
    line_subtotal: Math.round(line.quantity * line.unit_cost * 100) / 100,
    line_tax: Math.round(((line.quantity * line.unit_cost) - line.discount_total) * line.tax_rate * 100) / 100,
    line_total: Math.round(
      ((line.quantity * line.unit_cost) -
        line.discount_total +
        ((line.quantity * line.unit_cost - line.discount_total) * line.tax_rate)) *
        100
    ) / 100,
  }))

  const { error: linesError } = await supabase.from('purchase_order_items').insert(lines)
  if (linesError) {
    throw new Error(linesError.message)
  }

  redirect(`/purchase-orders/${po.id}`)
}