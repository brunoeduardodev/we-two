import { zodResolver } from '@hookform/resolvers/zod'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { Header } from '../components/header'
import { TextField } from '../components/inputs/text-field'
import { loginSchema, LoginSchema } from '../schemas/login'
import { useAuthentication } from '../stores/authentication'
import { trpc } from '../utils/trpc'

const LoginPage: NextPage = () => {
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
      router.push('/')
    },

    onError({ message }) {
      console.error({ message })
    },
  })

  const onSubmit = async (data: LoginSchema) => {
    loginMutation.mutate(data)
  }

  return (
    <>
      <Header variant="lg" className="mb-[72px] pt-12 px-6" />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex-1 h-full flex flex-col gap-4 pb-12 px-6">
        <TextField {...register('email')} type="text" label="Email" error={errors.email?.message} />
        <TextField {...register('password')} type="password" label="Password" error={errors.password?.message} />

        {loginMutation.error && (
          <small className="text-center text-red-600 text-sm">{loginMutation.error.message}</small>
        )}

        <div className="flex flex-col mt-auto gap-4 w-full">
          <button
            disabled={loginMutation.isLoading}
            role="submit"
            className="bg-white text-center text-brand-100 font-bold py-3 rounded-lg"
          >
            FAZER LOGIN
          </button>

          <Link
            href={{
              pathname: '/register',
              query: router.query,
            }}
            passHref
          >
            <a className="bg-transparent border-white border-2  text-center text-white font-bold py-3 rounded-lg">
              CRIAR CONTA
            </a>
          </Link>
        </div>
      </form>
    </>
  )
}

export default LoginPage
