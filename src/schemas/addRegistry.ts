import * as z from 'zod'

export const addEntrySchema = z.object({
  label: z.string().optional(),

  value: z.number().positive(),
  divisionType: z.enum(['creator', 'partner', 'half']),
})

export const addRegistrySchema = z.object({
  label: z.string().optional(),
  category: z.string(),
  payer: z.enum(['self', 'partner']),

  entries: z.array(addEntrySchema),
})

export type AddRegistry = z.infer<typeof addRegistrySchema>
export type AddEntry = z.infer<typeof addEntrySchema>
