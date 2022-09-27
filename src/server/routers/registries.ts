import { Entry, Purchase, PurchaseCategory, Registry, Transfer, User } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { addRegistrySchema } from '../../schemas/addRegistry'
import { deleteRegistrySchema } from '../../schemas/deleteRegistry'
import { getRegistriesSchema } from '../../schemas/getRegistries'
import { seeRegistry } from '../../schemas/seeRegistry'
import { sendTransferSchema } from '../../schemas/sendTransfer'
import { ensureAuthentication, ensurePartnered } from '../middlewares/authenticated'
import { prisma } from '../prisma'
import { t } from '../trpc'

type PopulatedPurchase = Purchase & { entries: Entry[]; category: PurchaseCategory; payer: User }
export type PopulatedTransfer = Transfer & { from: User; to: User }

export type RegistryWithPurchase = Registry & { purchase: PopulatedPurchase }
type RegistryWithTransfer = Registry & { transfer: PopulatedTransfer }

export type PopulatedRegistry = Registry & { purchase: PopulatedPurchase | null } & {
  transfer: PopulatedTransfer | null
}

export type WithBalance<T> = T & { balance: number }

export type PopulatedTransferRegistry = WithBalance<RegistryWithTransfer>
export type PopulatedPurchaseRegistry = WithBalance<RegistryWithPurchase>
export type PopulatedRegistryWithBalance = WithBalance<PopulatedRegistry>

const calculatePurchaseBalance = (registry: RegistryWithPurchase, viewer: User) => {
  // const viewerType = registry.creatorId === viewer.id ? 'creator' : 'partner'

  const isPayer = registry.purchase.payerId === viewer.id
  const payer = registry.purchase.payerId === viewer.id ? 'self' : 'partner'

  const difference = registry.purchase.entries.reduce((total, entry) => {
    if (entry.divisionType === 'creator' && payer === 'self') {
      return total
    }

    if (entry.divisionType === 'creator' && payer === 'partner') {
      return total + entry.value
    }

    if (entry.divisionType === 'partner' && payer === 'self') {
      return total + entry.value
    }

    if (entry.divisionType === 'partner' && payer === 'partner') {
      return total
    }

    return total + entry.value / 2
  }, 0)

  const balance = isPayer ? difference : -difference

  return balance
}

const calculateTransferBalance = (registry: RegistryWithTransfer, viewer: User) => {
  const isPayer = registry.transfer.fromId === viewer.id

  const balance = isPayer ? registry.transfer.value : -registry.transfer.value

  return balance
}

const computeRegistryBalance = (registry: PopulatedRegistry, user: User) => {
  let balance = 0
  if (registry.purchase) {
    balance = calculatePurchaseBalance(registry as RegistryWithPurchase, user)
  }

  if (registry.transfer) {
    balance = calculateTransferBalance(registry as RegistryWithTransfer, user)
  }

  return { ...registry, balance }
}

export const registriesRouter = t.router({
  addPurchase: t.procedure
    .use(ensurePartnered('You need a partner to add a purchase'))
    .input(addRegistrySchema)
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx
      const { category, payer, entries, label } = input
      let payerId = session.user.id

      if (payer === 'partner') {
        payerId = session.user.partner!.id
      }

      const registry = await prisma.registry.create({
        data: {
          purchase: {
            create: {
              label,

              payer: {
                connect: { id: payerId },
              },
              entries: {
                createMany: {
                  data: entries,
                },
              },
              category: {
                connectOrCreate: {
                  where: {
                    name: category,
                  },
                  create: {
                    name: category,
                  },
                },
              },
            },
          },
          creator: {
            connect: { id: session.user.id },
          },
        },
      })

      return registry
    }),

  addTransfer: t.procedure
    .use(ensurePartnered('You need a partner to send a transfer'))
    .input(sendTransferSchema)
    .mutation(async ({ ctx, input }) => {
      const { from, value } = input
      const { user } = ctx.session

      let fromId = user.id
      let toId = user.partner.id

      if (from === 'partner') {
        fromId = user.partner!.id
        toId = user.id
      }

      const registry = await prisma.registry.create({
        data: {
          creatorId: user.id,
          transfer: {
            create: {
              value,
              fromId,
              toId,
            },
          },
        },
      })

      return registry
    }),

  getRegistries: t.procedure
    .use(ensurePartnered('You need a partner to have registries'))
    .input(getRegistriesSchema)
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session

      const { direction, orderBy, skip, take, filters } = input

      const registries = await prisma.registry.findMany({
        take,
        skip,
        orderBy: {
          [orderBy]: direction,
        },
        include: {
          purchase: {
            include: { category: true, entries: true, payer: true },
          },
          transfer: {
            include: {
              from: true,
              to: true,
            },
          },
        },
        where: {
          deletedAt: null,

          AND: [
            {
              OR: [
                {
                  creatorId: user.id,
                },
                {
                  creatorId: user.partner!.id,
                },
              ],
            },
            {
              OR: {
                purchase: {
                  payerId:
                    filters.payer === 'self' ? user.id : filters.payer === 'partner' ? user.partner!.id : undefined,
                },
                transfer: {
                  fromId:
                    filters.payer === 'self' ? user.id : filters.payer === 'partner' ? user.partner!.id : undefined,
                },
              },
            },
            {
              createdAt: {
                gte: filters.from,
                lte: filters.to,
              },
            },
          ],
        },
      })

      return registries.map((registry) => computeRegistryBalance(registry, user))
    }),

  getBalance: t.procedure.use(ensureAuthentication()).query(async ({ ctx }) => {
    const { user } = ctx.session

    if (!user.partner) return 0

    const allRegistries = await prisma.registry.findMany({
      where: {
        deletedAt: null,

        OR: [
          {
            creatorId: user.id,
          },
          {
            creatorId: user.partner!.id,
          },
        ],
      },
      include: {
        purchase: {
          include: { entries: true, category: true, payer: true },
        },
        transfer: {
          include: {
            from: true,
            to: true,
          },
        },
      },
    })

    const balance = allRegistries
      .map((registry) => computeRegistryBalance(registry, user))
      .reduce((total, registry) => {
        return total + registry.balance
      }, 0)

    return balance
  }),

  getRegistry: t.procedure
    .use(ensureAuthentication())
    .input(seeRegistry)
    .query(async ({ ctx, input }) => {
      const { id } = input

      const registry = await prisma.registry.findFirst({
        where: { id, deletedAt: null },
        include: {
          creator: true,
          purchase: {
            include: {
              category: true,
              entries: true,
              payer: true,
            },
          },
          transfer: {
            include: {
              from: true,
              to: true,
            },
          },
        },
      })

      if (!registry) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return computeRegistryBalance(registry, ctx.session.user)
    }),

  deleteRegistry: t.procedure
    .use(ensurePartnered())
    .input(deleteRegistrySchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input

      await prisma.registry.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
        },
      })
    }),
})
