import { Prisma, Pronoun } from '@prisma/client'

export const safeUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  pronoun: true,

  partnerId: true,
  createdAt: true,

  partner: {
    select: {
      id: true,
      name: true,
      pronoun: true,
      partnerId: true,
    },
  },
})

export type SafeUser = {
  id: string
  name: string
  email: string
  pronoun: Pronoun

  partnerId: string | null
  createdAt: Date

  partner: {
    id: string
    name: string
    pronoun: Pronoun

    partnerId: string | null
  } | null
}
