import { zodResolver } from '@hookform/resolvers/zod'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TextField } from '../components/inputs/text-field'
import { MainLayout } from '../layouts/main'
import { InviteRedemption, inviteRedemptionSchema } from '../schemas/inviteRedemption'
import { useAuthentication } from '../stores/authentication'
import { WithLayout } from '../types/next'
import { trpc } from '../utils/trpc'

const RedeemCodePage: WithLayout<NextPage> = () => {
  const router = useRouter()
  const userId = useAuthentication((state) => state.user?.id)
  const code = router.query.code as string

  const { isLoading, data, error } = trpc.invites.getInviteInfo.useQuery({ code }, { retry: false })

  const { mutate: redeem, error: redeemError } = trpc.invites.redeemInvite.useMutation({
    onSuccess: () => {
      router.push('/account')
    },
  })

  if (data?.creatorId === userId) {
    router.push('/')
    return <>You cannot redeem your own code</>
  }

  const handleRedeem = () => {
    redeem({ code })
  }

  return (
    <>
      <section className="flex flex-col gap-4 text-white">
        <h1 className="text-2xl font-bold text-center">Redeem a Code</h1>

        {!error && (
          <>
            <p className="text-lg text-center font-bold">You are about to redeem the following code:</p>

            <h3 className="font-bold text-3xl tracking-widest uppercase text-center mb-3">{data?.code}</h3>
          </>
        )}

        {!isLoading && !error && (
          <div className="flex flex-col gap-3 text-center">
            <p>
              Created by {data?.creator.name} at {data?.createdAt.toISOString()}
            </p>
          </div>
        )}

        {error?.message && <p className="text-red-500 my-8 text-center font-bold">{error.message}</p>}
        {redeemError?.message && <p className="text-red-500 my-2 text-center font-bold">{redeemError.message}</p>}

        {error ? (
          <Link href="/" passHref>
            <a className="bg-white text-center text-brand-100 font-bold py-3 rounded-lg mt-auto">GO BACK</a>
          </Link>
        ) : (
          <button
            disabled={isLoading}
            className="bg-white text-brand-100 font-bold py-3 rounded-lg mt-auto"
            onClick={handleRedeem}
          >
            REDEEM
          </button>
        )}
      </section>
    </>
  )
}

RedeemCodePage.Layout = MainLayout

export default RedeemCodePage
