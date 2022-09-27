import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

import { User } from '@prisma/client'
import { getUserFromToken } from './utils/jwt'

type Session = {
  user: User & { partner: User | null }
}

interface CreateContextOptions {
  session: Session | null
}

export async function createContextInner(_opts: CreateContextOptions) {
  return {
    session: _opts.session,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>

export async function createContext({ req }: trpcNext.CreateNextContextOptions): Promise<Context> {
  const user = await getUserFromToken(req.headers.authorization)

  if (!user) return await createContextInner({ session: null })

  return await createContextInner({ session: { user } })
}
