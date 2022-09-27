import { MiddlewareFunction, TRPCError } from '@trpc/server'
import { Context } from '../context'
import { t } from '../trpc'

export const ensureAuthentication = (message?: string) =>
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED', message })

    return next({ ctx: { ...ctx, session: ctx.session } })
  })

export const ensurePartnered = (message?: string) =>
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user?.partner?.id) {
      throw new TRPCError({ code: 'FORBIDDEN', message })
    }

    return next({
      ctx: {
        ...ctx,
        session: {
          ...ctx.session,
          user: {
            ...ctx.session.user,
            partner: ctx.session.user.partner,
          },
        },
      },
    })
  })
