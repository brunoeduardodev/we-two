import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect } from 'react'
import { Header } from '../components/header'
import { useAuthentication } from '../stores/authentication'

export const UnauthenticatedLayout = ({ children }: PropsWithChildren) => {
  const user = useAuthentication((state) => state.user)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push({
        ...router,
        pathname: '/',
      })
    }
  }, [router, user])

  return (
    <>
      <Header variant="lg" className="mb-4 pt-12 px-6" />
      {children}
    </>
  )
}
