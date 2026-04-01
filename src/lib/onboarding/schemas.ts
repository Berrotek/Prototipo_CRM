import { z } from 'zod'

export const onboardingSchema = z.object({
  name: z.string().min(2, 'Enter an organization name'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(63, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
  legalName: z.string().optional().or(z.literal('')),
  taxId: z.string().optional().or(z.literal('')),
  billingEmail: z.string().email('Enter a valid billing email').optional().or(z.literal('')),
  currency: z.enum(['MXN', 'USD', 'EUR', 'COP', 'CLP']),
  timezone: z.enum(['America/Monterrey', 'America/Mexico_City', 'UTC', 'America/Chicago']),
  locale: z.enum(['es', 'en']),
  allowNegativeStock: z.boolean(),
  analyticsEnabled: z.boolean(),
})

export type OnboardingFormValues = z.infer<typeof onboardingSchema>
