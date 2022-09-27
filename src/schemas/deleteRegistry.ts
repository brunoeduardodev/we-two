import { z } from 'zod'

export const deleteRegistrySchema = z.object({
  id: z.string().uuid(),
})

export type DeleteRegistry = z.infer<typeof deleteRegistrySchema>
