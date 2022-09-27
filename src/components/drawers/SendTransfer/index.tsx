import { Drawer, DrawerBody, DrawerFooter, DrawerHeader } from '../../drawer'
import { SelectButtons } from '../../inputs/select-buttons'
import { TextField } from '../../inputs/text-field'

import { trpc } from '../../../utils/trpc'
import { Controller, useForm } from 'react-hook-form'
import { SendTransfer, sendTransferSchema } from '../../../schemas/sendTransfer'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const SendTransferDrawer = ({ isOpen, onClose }: Props) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<SendTransfer>({ resolver: zodResolver(sendTransferSchema) })

  const sendTransferMutation = trpc.registries.addTransfer.useMutation({
    onSuccess: onClose,
  })

  const onSubmit = (data: SendTransfer) => {
    sendTransferMutation.mutate(data)
  }

  return (
    <Drawer isOpen={isOpen}>
      <DrawerHeader>Send Transfer</DrawerHeader>

      <DrawerBody>
        <TextField
          {...register('value', {
            setValueAs: (value) => (typeof value === 'undefined' ? undefined : Number(value)),
          })}
          label="Value"
          type="number"
          className="w-full"
          labelClassName="text-brand-100"
          error={errors.value?.message}
        />

        <label className={'text-brand-100 font-bold'}>Who Is Sending?</label>

        <Controller
          name="from"
          control={control}
          render={({ field }) => (
            <SelectButtons
              onChange={(choice) => field.onChange(choice)}
              choices={[
                {
                  id: 'self',
                  label: 'You',
                },
                {
                  id: 'partner',
                  label: 'Him',
                },
              ]}
            />
          )}
        />
      </DrawerBody>

      <DrawerFooter
        actionLabel="Send"
        onAction={handleSubmit(onSubmit)}
        onCancel={onClose}
        cancelLabel="Cancel"
        loading={sendTransferMutation.isLoading}
      />
    </Drawer>
  )
}
