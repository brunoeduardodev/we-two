import * as z from 'zod'

export const inviteCodeSchema = z.string().length(6, 'The code must have 6 characters')

export const inviteRedemptionSchema = z.object({
  code: inviteCodeSchema,
})

export type InviteRedemption = z.infer<typeof inviteRedemptionSchema>
