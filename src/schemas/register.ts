import * as z from 'zod'

export const registerSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  pronoun: z.enum(['he', 'she', 'they']),
})

export type RegisterSchema = z.infer<typeof registerSchema>
