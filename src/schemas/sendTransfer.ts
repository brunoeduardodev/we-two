import { z } from 'zod'

export const sendTransferSchema = z.object({
  from: z.enum(['self', 'partner']),
  value: z.number().positive(),
})

export type SendTransfer = z.infer<typeof sendTransferSchema>
