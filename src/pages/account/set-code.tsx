import { zodResolver } from '@hookform/resolvers/zod'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PrimaryButton } from '../../components/buttons/primary'
import { TextField } from '../../components/inputs/text-field'
import { MainLayout } from '../../layouts/main'
import { InviteRedemption, inviteRedemptionSchema } from '../../schemas/inviteRedemption'
import { useAuthentication } from '../../stores/authentication'
import { WithLayout } from '../../types/next'
import { trpc } from '../../utils/trpc'

const SetCodePage: WithLayout<NextPage> = () => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()
  const userId = useAuthentication((state) => state.user?.id)

  const schemaValidation = inviteRedemptionSchema.safeParse({ code })

  const validationError = useMemo(() => {
    if (!schemaValidation.success) {
      return schemaValidation.error.errors[0].message
    }

    return ''
  }, [code])

  const { isLoading } = trpc.invites.getInviteInfo.useQuery(
    { code },
    {
      onSuccess: (data) => {
        if (data.creatorId === userId) {
          setError('You cannot redeem your own code!')
          return
        }

        router.push(`/redeem-code?code=${code}`)
      },
      onError: (error) => {
        setError(error.message)
      },
      retry: false,
      enabled: !validationError,
    }
  )

  return (
    <>
      <section className="flex flex-col gap-4 text-white">
        <h1 className="text-2xl font-bold text-center">Redeem a Code</h1>

        <p className="text-lg text-center font-bold">Please enter the code you are about to redeem</p>

        <TextField
          label="Code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          error={(code.length > 0 && validationError) || error}
          className="text-xl text-center"
        />

        <PrimaryButton
          loading={!!code && !validationError && isLoading}
          type="submit"
          className="bg-white text-brand-100 font-bold py-3 rounded-lg mt-auto"
        >
          REDEEM
        </PrimaryButton>
      </section>
    </>
  )
}

SetCodePage.Layout = MainLayout

export default SetCodePage
