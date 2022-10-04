import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'
import { env } from '../env'
import { TRPCError } from '@trpc/server'
import { prisma } from '../prisma'

export type UserTokenData = {
  userId: string
}

const THREE_DAYS_IN_SECONDS = 3 * 24 * 60 * 60

export const generateUserToken = (user: User) => {
  const token = jwt.sign(
    {
      userId: user.id,
    },
    env.JWT_SECRET,
    { expiresIn: `${THREE_DAYS_IN_SECONDS}s` }
  )

  return { token: `Bearer ${token}`, expiresInSeconds: THREE_DAYS_IN_SECONDS }
}

export const getUserFromToken = async (userToken?: string) => {
  if (!userToken) return null

  const [bearer, token] = userToken.split('Bearer ')

  if (!token) return null

  if (bearer !== '') {
    throw new TRPCError({ message: 'Invalid Token', code: 'BAD_REQUEST' })
  }

  const { userId } = jwt.verify(token, env.JWT_SECRET) as UserTokenData

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { partner: true } })

  return user
}
