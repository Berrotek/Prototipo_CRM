'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const sku = String(formData.get('sku') ?? '').trim()
  const name = String(formData.get('name') ?? '').trim()
  if (!sku) throw new Error('SKU is required')
  if (!name) throw new Error('Product name is required')

  const barcode = String(formData.get('barcode') ?? '').trim() || null
  const description = String(formData.get('description') ?? '').trim() || null
  const category = String(formData.get('category') ?? '').trim() || null
  const brand = String(formData.get('brand') ?? '').trim() || null
  const unit_of_measure = String(formData.get('unit_of_measure') ?? 'pza')
  const track_inventory = formData.get('track_inventory') === 'on'
  const is_active = formData.get('is_active') !== 'off'
  const base_cost = Number(formData.get('base_cost') ?? 0)
  const base_price = Number(formData.get('base_price') ?? 0)
  const weight = String(formData.get('weight') ?? '').trim()
  const length = String(formData.get('length') ?? '').trim()
  const width = String(formData.get('width') ?? '').trim()
  const height = String(formData.get('height') ?? '').trim()
  const attributes_raw = String(formData.get('attributes') ?? '').trim()
  const metadata_raw = String(formData.get('metadata') ?? '').trim()
  const tags_raw = String(formData.get('tags') ?? '').trim()

  const attributes = attributes_raw ? JSON.parse(attributes_raw) : {}
  const metadata = metadata_raw ? JSON.parse(metadata_raw) : {}
  const tags = tags_raw ? tags_raw.split(',').map((t) => t.trim()).filter(Boolean) : []

  const payload: Record<string, unknown> = {
    sku,
    barcode,
    name,
    description,
    category,
    brand,
    unit_of_measure,
    track_inventory,
    is_active,
    base_cost,
    base_price,
    attributes,
    metadata,
    tags,
  }

  if (weight) payload.weight = Number(weight)
  if (length) payload.length = Number(length)
  if (width) payload.width = Number(width)
  if (height) payload.height = Number(height)

  const { error } = await supabase.from('products').insert(payload)

  if (error) throw new Error(error.message)

  revalidatePath('/products')
}
