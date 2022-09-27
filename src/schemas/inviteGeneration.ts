import * as z from 'zod'

export const inviteGenerationSchema = z.object({
  receiverEmail: z.string().email().optional(),
})

export type InviteGenerationSchema = z.infer<typeof inviteGenerationSchema>
