import * as z from 'zod'

export const updateSelfSchema = z.object({
  name: z.string().min(3).optional(),
  pronoun: z.enum(['he', 'she', 'they']).optional(),
  email: z.string().email().optional(),
})

export type UpdateSelf = z.infer<typeof updateSelfSchema>
