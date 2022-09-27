import { User } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { prisma } from '../prisma'
import { t } from '../trpc'
import crypto from 'crypto'
import { inviteRedemptionSchema } from '../../schemas/inviteRedemption'
import { ensureAuthentication } from '../middlewares/authenticated'

const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000

export const invitesRouter = t.router({
  generateInvite: t.procedure
    .use(ensureAuthentication('You need to be authenticated to generate an invite'))
    .mutation(async ({ ctx }) => {
      const { session } = ctx

      let code = ''
      let codeExists = true

      const existingInvite = await prisma.invite.findFirst({
        where: {
          creatorId: session.user.id,
          expiredAt: null,
        },
      })

      if (existingInvite) {
        return existingInvite
      }

      do {
        code = crypto.randomBytes(3).toString('hex').toUpperCase()
        codeExists = !!(await prisma.invite.findFirst({ where: { code, expiredAt: null } }))
      } while (codeExists)

      const expiresAt = new Date(new Date().getTime() + ONE_WEEK_IN_MS)

      const invite = await prisma.invite.create({
        data: {
          code,
          creatorId: session.user.id,
          expiresAt,
        },
      })

      return invite
    }),

  redeemInvite: t.procedure
    .use(ensureAuthentication('You need to be authenticated to redeem an invite'))
    .input(inviteRedemptionSchema)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx

      const { code } = input

      const invite = await prisma.invite.findFirst({
        where: {
          code,
          expiredAt: null,
        },
      })

      if (!invite) {
        // eslint-disable-next-line quotes
        throw new TRPCError({ message: "This invite code doesn't exist", code: 'BAD_REQUEST' })
      }

      if (new Date() > invite.expiresAt) {
        throw new TRPCError({ message: 'This code was already expired', code: 'BAD_REQUEST' })
      }

      await prisma.invite.update({
        where: {
          id: invite.id,
        },
        data: {
          expiredAt: new Date(),
          receiverId: session?.user.id,
        },
      })

      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          partnerId: invite.creatorId,
        },
      })

      await prisma.user.update({
        where: {
          id: invite.creatorId,
        },
        data: {
          partnerId: session.user.id,
        },
      })

      return
    }),

  getInviteInfo: t.procedure.input(inviteRedemptionSchema).query(async ({ input }) => {
    const { code } = input

    const invite = await prisma.invite.findFirst({
      where: {
        code,
        expiredAt: null,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!invite) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'There is no invite with code ' + code })
    }

    return invite
  }),
})
