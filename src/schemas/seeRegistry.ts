import { z } from 'zod'

export const seeRegistry = z.object({
  id: z.string(),
})

export type SeeRegistry = z.infer<typeof seeRegistry>
