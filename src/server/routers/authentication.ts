import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'

import { loginSchema } from '../../schemas/login'
import { registerSchema } from '../../schemas/register'
import { prisma } from '../prisma'
import { t } from '../trpc'
import { generateUserToken } from '../utils/jwt'

export const authenticationRouter = t.router({
  login: t.procedure.input(loginSchema).mutation(async ({ input }) => {
    const { email, password } = input

    const userWithSameEmail = await prisma.user.findUnique({ where: { email }, include: { partner: true } })
    if (!userWithSameEmail) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid Credentails' })

    const isPasswordValid = bcrypt.compare(password, userWithSameEmail.password)
    if (!isPasswordValid) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid Credentials' })

    const token = generateUserToken(userWithSameEmail)

    return { token, user: userWithSameEmail }
  }),

  register: t.procedure.input(registerSchema).mutation(async ({ input }) => {
    const { email, name, password, pronoun } = input

    const userWithSameEmail = await prisma.user.findUnique({ where: { email } })
    if (userWithSameEmail) throw new TRPCError({ code: 'FORBIDDEN', message: 'This email is already registered' })

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        pronoun,
      },
      include: {
        partner: true,
      },
    })

    const token = generateUserToken(user)

    return { token, user }
  }),
})
