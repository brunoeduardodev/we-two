import { t } from '../trpc'
import { authenticationRouter } from './authentication'
import { invitesRouter } from './invites'
import { registriesRouter } from './registries'
import { userRouter } from './user'

export const appRouter = t.router({
  authentication: authenticationRouter,
  invites: invitesRouter,
  user: userRouter,
  registries: registriesRouter,
})

export type AppRouter = typeof appRouter
