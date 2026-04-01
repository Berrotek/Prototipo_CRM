import { z } from 'zod'

export const purchaseOrderLineSchema = z.object({
  product_id: z.string().uuid('Select a product'),
  description: z.string().optional().or(z.literal('')),
  quantity: z.coerce.number().positive('Quantity must be greater than 0'),
  unit_cost: z.coerce.number().nonnegative('Unit cost must be 0 or more'),
  tax_rate: z.coerce.number().min(0).max(1),
  discount_total: z.coerce.number().nonnegative(),
})

export const purchaseOrderFormSchema = z.object({
  supplier_id: z.string().uuid('Select a supplier'),
  receiving_location_id: z.string().uuid('Select a receiving location').optional().or(z.literal('')),
  currency: z.string().min(3),
  expected_at: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  lines: z.array(purchaseOrderLineSchema).min(1, 'Add at least one line item'),
})

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>
export type PurchaseOrderLineValues = z.infer<typeof purchaseOrderLineSchema>