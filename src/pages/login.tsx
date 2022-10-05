import { zodResolver } from '@hookform/resolvers/zod'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { PrimaryButton } from '../components/buttons/primary'
import { OutlineButton } from '../components/buttons/secondary'
import { ErrorProne } from '../components/helpers/error-prone'
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
    onSuccess({ token, user, expiresInSeconds }) {
      authenticate({ token, user, expiresInSeconds })
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

      <div className="flex flex-col mt-auto gap-4 w-full">
        <ErrorProne error={loginMutation.error?.message}>
          <PrimaryButton loading={loginMutation.isLoading} type="submit">
            LOGIN
          </PrimaryButton>
        </ErrorProne>

        <OutlineButton onClick={() => router.push({ ...router, pathname: '/register' })}>REGISTER</OutlineButton>
      </div>
    </form>
  )
}

LoginPage.Layout = UnauthenticatedLayout

export default LoginPage
