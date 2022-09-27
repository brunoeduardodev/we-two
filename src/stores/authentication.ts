import create from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { SafeUser } from '../server/selects/user'

type Authentication = {
  token: string | null
  user: SafeUser | null

  signedIn: boolean

  authenticate: (data: { token: string; user: SafeUser }) => void
  setUser: (data: SafeUser) => void
}

export const useAuthentication = create(
  persist<Authentication>(
    (set, get) => ({
      token: null,
      user: null,
      signedIn: false,

      authenticate: ({ token, user }) => {
        set((state) => ({ ...state, user, token, signedIn: true }))
        Cookies.set('@wetwo/auth-token', token)
      },

      logout: () => {
        Cookies.remove('@wetwo/auth-token')
        set((state) => ({
          ...state,
          token: null,
          user: null,
          signedIn: false,
        }))
      },

      setUser: (user: SafeUser) => {
        set((state) => ({
          ...state,
          user,
        }))
      },
    }),
    { name: 'authentication' }
  )
)
