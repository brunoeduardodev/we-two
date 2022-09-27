import { z } from 'zod'

export const getRegistriesSchema = z.object({
  skip: z.number().optional().default(0),
  take: z.number().optional().default(20),

  filters: z
    .object({
      payer: z.enum(['self', 'partner']).optional(),
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .default({}),

  orderBy: z.enum(['createdAt', 'payer', 'totalValue', 'totalBalance']).default('createdAt'),
  direction: z.enum(['asc', 'desc']).default('desc'),
})

export type GetRegistriesSchema = z.infer<typeof getRegistriesSchema>
