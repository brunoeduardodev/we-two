import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'
import { env } from '../env'
import { TRPCError } from '@trpc/server'
import { prisma } from '../prisma'

export type UserTokenData = {
  userId: string
}

export const generateUserToken = (user: User) => {
  const token = jwt.sign(
    {
      userId: user.id,
    },
    env.JWT_SECRET
  )

  return `Bearer ${token}`
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
