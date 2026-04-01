import { z } from 'zod'

export const salesOrderLineSchema = z.object({
  product_id: z.string().uuid('Select a product'),
  description: z.string().optional().or(z.literal('')),
  quantity: z.coerce.number().positive('Quantity must be greater than 0'),
  unit_price: z.coerce.number().nonnegative('Unit price must be 0 or more'),
  tax_rate: z.coerce.number().min(0).max(1),
  discount_total: z.coerce.number().nonnegative(),
})

export const salesOrderFormSchema = z.object({
  customer_id: z.string().uuid('Select a customer'),
  fulfillment_location_id: z.string().uuid('Select a fulfillment location').optional().or(z.literal('')),
  currency: z.string().min(3),
  required_by: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  lines: z.array(salesOrderLineSchema).min(1, 'Add at least one line item'),
})

export type SalesOrderFormValues = z.infer<typeof salesOrderFormSchema>
export type SalesOrderLineValues = z.infer<typeof salesOrderLineSchema>
