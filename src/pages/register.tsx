import { zodResolver } from '@hookform/resolvers/zod'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { PrimaryButton } from '../components/buttons/primary'
import { OutlineButton } from '../components/buttons/secondary'
import { ErrorProne } from '../components/helpers/error-prone'
import { SelectButtons } from '../components/inputs/select-buttons'
import { TextField } from '../components/inputs/text-field'
import { UnauthenticatedLayout } from '../layouts/unauthenticated'
import { registerSchema, RegisterSchema } from '../schemas/register'
import { useAuthentication } from '../stores/authentication'
import { WithLayout } from '../types/next'
import { trpc } from '../utils/trpc'

const RegisterPage: WithLayout<NextPage> = () => {
  const router = useRouter()
  const authenticate = useAuthentication((state) => state.authenticate)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const registerMutation = trpc.authentication.register.useMutation({
    onSuccess({ token, user, expiresInSeconds }) {
      authenticate({ token, user, expiresInSeconds })

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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex-1 h-full flex flex-col gap-4 pb-12 px-6">
      <TextField {...register('name')} type="text" label="Name" error={errors.name?.message} />
      <TextField {...register('email')} type="email" label="Email" error={errors.email?.message} />
      <TextField {...register('password')} type="password" label="Password" error={errors.password?.message} />

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
                label: 'He',
              },
              {
                id: 'she',
                label: 'She',
              },
              {
                id: 'they',
                label: 'They',
              },
            ]}
          />
        )}
      />

      <div className="flex flex-col mt-auto gap-4 w-full">
        <ErrorProne error={registerMutation.error?.message}>
          <PrimaryButton loading={registerMutation.isLoading} type="submit">
            REGISTER
          </PrimaryButton>
        </ErrorProne>

        <OutlineButton onClick={() => router.push({ ...router, pathname: '/login' })}>LOGIN</OutlineButton>
      </div>
    </form>
  )
}

RegisterPage.Layout = UnauthenticatedLayout

export default RegisterPage
