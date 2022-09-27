import { updateSelfSchema } from '../../schemas/user'
import { ensureAuthentication } from '../middlewares/authenticated'
import { prisma } from '../prisma'
import { safeUserSelect } from '../selects/user'
import { t } from '../trpc'

export const userRouter = t.router({
  getSelf: t.procedure.use(ensureAuthentication).query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      select: safeUserSelect,
      where: { id: ctx.session.user.id },
    })

    return user
  }),

  updateSelf: t.procedure
    .use(ensureAuthentication)
    .input(updateSelfSchema)
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx
      const { name, email, pronoun } = input

      await prisma.user.update({
        select: safeUserSelect,
        where: {
          id: session.user.id,
        },
        data: {
          name,
          email,
          pronoun,
        },
      })
    }),
})
