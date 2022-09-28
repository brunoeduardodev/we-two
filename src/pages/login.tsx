import { zodResolver } from '@hookform/resolvers/zod'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { PrimaryButton } from '../components/buttons/primary'
import { SecondaryButton } from '../components/buttons/secondary'
import { Header } from '../components/header'
import { TextField } from '../components/inputs/text-field'
import { UnauthenticatedLayout } from '../layouts/unauthenticated'
import { loginSchema, LoginSchema } from '../schemas/login'
import { useAuthentication } from '../stores/authentication'
import { WithLayout } from '../types/next'
import { trpc } from '../utils/trpc'

const LoginPage: WithLayout<NextPage> = () => {
  const router = useRouter()
  const authenticate = useAuthentication((state) => state.authenticate)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = trpc.authentication.login.useMutation({
    onSuccess({ token, user }) {
      authenticate({ token, user })
      router.push({
        ...router,
        pathname: '/',
      })
    },

    onError({ message }) {
      console.error({ message })
    },
  })

  const onSubmit = async (data: LoginSchema) => {
    loginMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex-1 h-full flex flex-col gap-4 pb-12 px-6">
      <TextField {...register('email')} type="text" label="Email" error={errors.email?.message} />
      <TextField {...register('password')} type="password" label="Password" error={errors.password?.message} />

      {loginMutation.error && <small className="text-center text-red-600 text-sm">{loginMutation.error.message}</small>}

      <div className="flex flex-col mt-auto gap-4 w-full">
        <PrimaryButton loading={loginMutation.isLoading} type="submit">
          LOGIN
        </PrimaryButton>

        <SecondaryButton onClick={() => router.push({ ...router, pathname: '/register' })}>REGISTER</SecondaryButton>
      </div>
    </form>
  )
}

LoginPage.Layout = UnauthenticatedLayout

export default LoginPage
