import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect } from 'react'
import { FiUser } from 'react-icons/fi'
import { MainLayout } from '../../layouts/main'
import { useAuthentication } from '../../stores/authentication'
import { WithLayout } from '../../types/next'
import { trpc } from '../../utils/trpc'

const AccountPage: WithLayout<NextPage> = () => {
  const user = useAuthentication((state) => state.user)
  const setUser = useAuthentication((state) => state.setUser)

  const { data: userData } = trpc.user.getSelf.useQuery()

  useEffect(() => {
    if (userData) {
      setUser(userData)
    }
  }, [userData, setUser])

  return (
    <>
      <section className="flex flex-col w-full items-center gap-3">
        <FiUser className="text-7xl p-4 border-white border-2 text-white rounded-full" />
        <p className="text-white font-bold">
          {user?.name} ({user?.pronoun}){' '}
          {user?.partner && (
            <>
              {'& '} {user.partner.name} ({user.partner.pronoun})
            </>
          )}
        </p>

        <p></p>
      </section>

      <section className="flex flex-col w-full items-center gap-2 text-white">
        {!user?.partner && (
          <>
            <Link href="/account/invite-partner">
              <a className="w-full text-center">Convidar Parceiro</a>
            </Link>

            <div className="h-[1px] w-full bg-white" />

            <Link href="/account/set-code">
              <a className="w-full text-center">Eu tenho um código</a>
            </Link>

            <div className="h-[1px] w-full bg-white" />
          </>
        )}

        <Link href="/account/update">
          <a className="w-full text-center">Update Profile</a>
        </Link>

        <div className="h-[1px] w-full bg-white" />

        <Link href="/login">
          <a className="w-full text-center">Sign Out</a>
        </Link>
      </section>
    </>
  )
}

AccountPage.Layout = MainLayout

export default AccountPage
