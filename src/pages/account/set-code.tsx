import { zodResolver } from '@hookform/resolvers/zod'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TextField } from '../../components/inputs/text-field'
import { MainLayout } from '../../layouts/main'
import { InviteRedemption, inviteRedemptionSchema } from '../../schemas/inviteRedemption'
import { useAuthentication } from '../../stores/authentication'
import { WithLayout } from '../../types/next'
import { trpc } from '../../utils/trpc'

const SetCodePage: WithLayout<NextPage> = () => {
  const [code, setCode] = useState('')
  const router = useRouter()
  const userId = useAuthentication((state) => state.user?.id)

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<InviteRedemption>({
    resolver: zodResolver(inviteRedemptionSchema),
  })

  const { isLoading } = trpc.invites.getInviteInfo.useQuery(
    { code },
    {
      onSuccess: (data) => {
        if (data.creatorId === userId) {
          setError('code', { message: 'You cannot redeem your own code!' })
          return
        }

        router.push(`/redeem-code?code=${code}`)
      },
      onError: (error) => {
        setError('code', { message: error.message })
      },
      retry: false,
      enabled: !!code,
    }
  )

  const onSubmit = ({ code }: InviteRedemption) => {
    setCode(code)
  }

  return (
    <>
      <section className="flex flex-col gap-4 text-white">
        <h1 className="text-2xl font-bold text-center">Redeem a Code</h1>

        <p className="text-lg text-center font-bold">Please enter the code you are about to redeem</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextField {...register('code')} label="Code" error={errors.code?.message} className="text-xl text-center" />

          <button
            disabled={isLoading && !!code}
            role="submit"
            className="bg-white text-brand-100 font-bold py-3 rounded-lg mt-auto"
          >
            REDEEM
          </button>
        </form>
      </section>
    </>
  )
}

SetCodePage.Layout = MainLayout

export default SetCodePage
