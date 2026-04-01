'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createCustomer(formData: FormData) {
  const supabase = await createClient()

  const name = String(formData.get('name') ?? '').trim()
  if (!name) throw new Error('Customer name is required')

  const code = String(formData.get('code') ?? '').trim() || null
  const legal_name = String(formData.get('legal_name') ?? '').trim() || null
  const email = String(formData.get('email') ?? '').trim() || null
  const phone = String(formData.get('phone') ?? '').trim() || null
  const tax_id = String(formData.get('tax_id') ?? '').trim() || null
  const status = String(formData.get('status') ?? 'active')
  const payment_terms_days = Number(formData.get('payment_terms_days') ?? 0)
  const credit_limit = Number(formData.get('credit_limit') ?? 0)
  const billing_raw = String(formData.get('billing_address') ?? '').trim()
  const shipping_raw = String(formData.get('shipping_address') ?? '').trim()
  const metadata_raw = String(formData.get('metadata') ?? '').trim()

  const billing_address = billing_raw ? JSON.parse(billing_raw) : {}
  const shipping_address = shipping_raw ? JSON.parse(shipping_raw) : {}
  const metadata = metadata_raw ? JSON.parse(metadata_raw) : {}

  const { error } = await supabase.from('customers').insert({
    code,
    name,
    legal_name,
    email,
    phone,
    tax_id,
    status,
    payment_terms_days,
    credit_limit,
    billing_address,
    shipping_address,
    metadata,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/customers')
}
