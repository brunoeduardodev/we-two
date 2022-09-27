import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect, useState } from 'react'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import { useAuthentication } from '../stores/authentication'

export const MainLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter()
  const signedIn = useAuthentication((state) => state.signedIn)
  const hasPartner = useAuthentication((state) => !!state.user?.partnerId)

  const [clientSide, setClientSide] = useState(false)

  useEffect(() => {
    if (!signedIn) {
      router.push({
        pathname: '/login',
        query: router.query,
      })
      return
    }

    if (!hasPartner && router.query.code) {
      router.push({
        pathname: '/redeem-code',
        query: {
          code: router.query.code,
        },
      })
    }

    setClientSide(true)
  }, [signedIn, hasPartner, router.query.code])

  if (!signedIn || !clientSide) return <></>

  return (
    <div className="w-full h-full max-h-screen  flex flex-col md:max-w-lg px-6 md:mx-auto bg-brand-200">
      <Header variant="md" className="pt-4 mb-4" />

      <main className="w-full flex flex-col gap-8 pb-2 h-full overflow-y-auto flex-1">{children}</main>

      <Footer />
    </div>
  )
}
