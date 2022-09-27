import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { hasLayout } from '../types/next'
import { PropsWithChildren } from 'react'
import { trpc } from '../utils/trpc'

function MyApp({ Component, pageProps }: AppProps) {
  let Layout = ({ children }: PropsWithChildren) => <>{children}</>

  if (hasLayout(Component)) {
    Layout = Component.Layout
  }

  return (
    <div className="bg-brand-200 md:bg-brand-100 md:max-w-lg md:mx-auto w-full flex flex-col h-full">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  )
}

export default trpc.withTRPC(MyApp)
