import { zodResolver } from '@hookform/resolvers/zod'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Header } from '../components/header'
import { SelectButtons } from '../components/inputs/select-buttons'
import { TextField } from '../components/inputs/text-field'
import { inviteCodeSchema } from '../schemas/inviteRedemption'
import { registerSchema, RegisterSchema } from '../schemas/register'
import { useAuthentication } from '../stores/authentication'
import { trpc } from '../utils/trpc'

const RegisterPage: NextPage = () => {
  const router = useRouter()

  const authenticate = useAuthentication((state) => state.authenticate)

  const { code } = router.query

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const registerMutation = trpc.authentication.register.useMutation({
    onSuccess({ token, user }) {
      authenticate({ token, user })

      router.push({
        pathname: '/',
        query: router.query,
      })
    },
    onError({ message }) {
      console.error({ message })
    },
  })

  const onSubmit = async (data: RegisterSchema) => {
    registerMutation.mutate(data)
  }

  return (
    <>
      <Header variant="lg" className="mb-4 pt-12 px-6" />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex-1 h-full flex flex-col gap-4 pb-12 px-6">
        <TextField {...register('name')} type="text" label="Nome" error={errors.name?.message} />
        <TextField {...register('email')} type="email" label="Email" error={errors.email?.message} />
        <TextField {...register('password')} type="password" label="Senha" error={errors.password?.message} />

        <div className="w-full h-[2px] bg-white rounded-full" />

        <Controller
          name="pronoun"
          control={control}
          render={({ field }) => (
            <SelectButtons
              onChange={(choice) => field.onChange(choice)}
              choices={[
                {
                  id: 'he',
                  label: 'Ele',
                },
                {
                  id: 'she',
                  label: 'Ela',
                },
                {
                  id: 'they',
                  label: 'Elu',
                },
              ]}
            />
          )}
        />

        {registerMutation.error && (
          <small className="text-center text-red-600 text-sm">{registerMutation.error.message}</small>
        )}

        <div className="flex flex-col mt-auto gap-4 w-full">
          <button
            disabled={registerMutation.isLoading}
            role="submit"
            className="bg-white text-brand-100 font-bold py-3 rounded-lg mt-auto"
          >
            CRIAR CONTA
          </button>

          <Link href="/login" passHref>
            <a className="bg-transparent border-white border-2  text-center text-white font-bold py-3 rounded-lg">
              FAZER LOGIN
            </a>
          </Link>
        </div>
      </form>
    </>
  )
}

export default RegisterPage
