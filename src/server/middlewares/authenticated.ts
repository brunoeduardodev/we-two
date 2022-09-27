import { MiddlewareFunction, TRPCError } from '@trpc/server'
import { Context } from '../context'
import { t } from '../trpc'

export const ensureAuthentication = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' })

  return next({ ctx: { ...ctx, session: ctx.session } })
})

export const ensurePartnered = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user?.partner?.id) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  return next({ ctx: { ...ctx, session: ctx.session } })
})
