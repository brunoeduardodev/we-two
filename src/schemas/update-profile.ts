import * as z from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  pronoun: z.enum(['he', 'she', 'they']).optional(),
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
