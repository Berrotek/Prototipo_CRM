'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { salesOrderFormSchema } from '@/lib/sales-orders/schemas'

function buildOrderNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `SO-${stamp}-${suffix}`
}

export async function createSalesOrder(formData: FormData) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    redirect('/sign-in')
  }

  const raw = {
    customer_id: String(formData.get('customer_id') ?? ''),
    fulfillment_location_id: String(formData.get('fulfillment_location_id') ?? ''),
    currency: String(formData.get('currency') ?? 'MXN'),
    required_by: String(formData.get('required_by') ?? ''),
    notes: String(formData.get('notes') ?? ''),
    lines: JSON.parse(String(formData.get('lines_json') ?? '[]')),
  }

  const parsed = salesOrderFormSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid sales order')
  }

  const subtotal = parsed.data.lines.reduce((sum, line) => sum + (line.quantity * line.unit_price), 0)
  const tax_total = parsed.data.lines.reduce(
    (sum, line) => sum + ((line.quantity * line.unit_price - line.discount_total) * line.tax_rate),
    0
  )
  const discount_total = parsed.data.lines.reduce((sum, line) => sum + line.discount_total, 0)
  const total = Math.round((subtotal - discount_total + tax_total) * 100) / 100

  const { data: order, error: orderError } = await supabase
    .from('sales_orders')
    .insert({
      organization_id: String(formData.get('organization_id') ?? ''),
      order_number: buildOrderNumber(),
      customer_id: parsed.data.customer_id,
      fulfillment_location_id: parsed.data.fulfillment_location_id || null,
      currency: parsed.data.currency,
      subtotal,
      tax_total,
      shipping_total: 0,
      discount_total,
      total,
      notes: parsed.data.notes || null,
      required_by: parsed.data.required_by || null,
      created_by: userData.user.id,
      status: 'draft',
    })
    .select('id')
    .single()

  if (orderError || !order) {
    throw new Error(orderError?.message ?? 'Failed to create sales order')
  }

  const lines = parsed.data.lines.map((line, index) => ({
    organization_id: String(formData.get('organization_id') ?? ''),
    sales_order_id: order.id,
    line_number: index + 1,
    product_id: line.product_id,
    description: line.description || null,
    quantity: line.quantity,
    unit_price: line.unit_price,
    tax_rate: line.tax_rate,
    discount_total: line.discount_total,
    line_subtotal: Math.round(line.quantity * line.unit_price * 100) / 100,
    line_tax: Math.round(((line.quantity * line.unit_price) - line.discount_total) * line.tax_rate * 100) / 100,
    line_total: Math.round(((line.quantity * line.unit_price) - line.discount_total + (((line.quantity * line.unit_price) - line.discount_total) * line.tax_rate)) * 100) / 100,
  }))

  const { error: linesError } = await supabase.from('sales_order_items').insert(lines)
  if (linesError) {
    throw new Error(linesError.message)
  }

  redirect(`/orders/${order.id}`)
}
