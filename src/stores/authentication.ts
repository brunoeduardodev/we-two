import create from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { SafeUser } from '../server/selects/user'
import jwt from 'jsonwebtoken'

type Authentication = {
  token: string | null
  user: SafeUser | null

  signedIn: boolean

  tokenExpiration: string | null
  authenticate: (data: { token: string; user: SafeUser; expiresInSeconds: number }) => void
  setUser: (data: SafeUser) => void
  logout: () => void

  checkTokenExpiration: () => void
}

export const useAuthentication = create(
  persist<Authentication>(
    (set, get) => ({
      token: null,
      user: null,
      tokenExpiration: null,
      signedIn: false,

      authenticate: ({ token, user, expiresInSeconds }) => {
        const tokenExpiration = new Date(new Date().getTime() + expiresInSeconds * 1000).toString()

        set((state) => ({ ...state, user, token, tokenExpiration, signedIn: true }))
        Cookies.set('@wetwo/auth-token', token, { expires: new Date(tokenExpiration) })
      },

      logout: () => {
        Cookies.remove('@wetwo/auth-token')
        set((state) => ({
          ...state,
          token: null,
          user: null,
          signedIn: false,
          tokenExpiration: null,
        }))
      },

      setUser: (user: SafeUser) => {
        set((state) => ({
          ...state,
          user,
        }))
      },

      checkTokenExpiration: () => {
        set((state) => {
          if (!state.token || !state.tokenExpiration) return state
          const now = new Date()

          if (now > new Date(state.tokenExpiration)) {
            return { ...state, token: null, tokenExpiration: null, user: null, signedIn: false }
          }

          return state
        })
      },
    }),
    { name: 'authentication' }
  )
)
