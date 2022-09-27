import { zodResolver } from '@hookform/resolvers/zod'
import { NextPage } from 'next'
import { Controller, useForm } from 'react-hook-form'
import { PrimaryButton } from '../../components/buttons/primary'
import { SelectButtons } from '../../components/inputs/select-buttons'
import { TextField } from '../../components/inputs/text-field'
import { MainLayout } from '../../layouts/main'
import { UpdateSelf, updateSelfSchema } from '../../schemas/user'
import { useAuthentication } from '../../stores/authentication'
import { WithLayout } from '../../types/next'
import { trpc } from '../../utils/trpc'

const UpdateProfilePage: WithLayout<NextPage> = () => {
  const updateMutation = trpc.user.updateSelf.useMutation()
  const currentUser = useAuthentication((state) => state.user)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateSelf>({
    resolver: zodResolver(updateSelfSchema),
  })

  const onSubmit = ({ email, name, pronoun }: UpdateSelf) => {
    updateMutation.mutate({ email, name, pronoun })
  }

  if (!currentUser) return null

  return (
    <>
      <form className="flex flex-col w-full flex-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register('name')}
          defaultValue={currentUser.name}
          type="text"
          label="Nome"
          error={errors.name?.message}
        />
        <TextField
          {...register('email')}
          defaultValue={currentUser.email}
          type="email"
          label="Email"
          error={errors.email?.message}
        />

        <div className="w-full h-[2px] bg-white rounded-full" />

        <Controller
          name="pronoun"
          control={control}
          render={({ field }) => (
            <SelectButtons
              initialValue={currentUser.pronoun}
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

        <PrimaryButton type="submit" loading={updateMutation.isLoading} error={updateMutation.error?.message}>
          UPDATE
        </PrimaryButton>
      </form>
    </>
  )
}

UpdateProfilePage.Layout = MainLayout

export default UpdateProfilePage
