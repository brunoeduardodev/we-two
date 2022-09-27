import { Controller, useForm } from 'react-hook-form'
import { PurchaseInfo } from '..'
import { useAuthentication } from '../../../../stores/authentication'
import { parsePronoun } from '../../../../utils/pronouns'
import { DrawerBody, DrawerFooter, DrawerHeader } from '../../../drawer'
import { SelectButtons } from '../../../inputs/select-buttons'
import { TextField } from '../../../inputs/text-field'

type Props = {
  onSetPurchaseInfo: (info: PurchaseInfo) => void
  onClose: () => void
}

export const SetPurchaseStep = ({ onClose, onSetPurchaseInfo }: Props) => {
  const { handleSubmit, register, control } = useForm<PurchaseInfo>()

  const user = useAuthentication((state) => state.user)

  const onSubmit = (data: PurchaseInfo) => {
    onSetPurchaseInfo(data)
  }

  return (
    <>
      <DrawerHeader>Add Purchase</DrawerHeader>

      <DrawerBody>
        <TextField {...register('label')} label="Name" className="w-full" labelClassName="text-brand-100" />
        <TextField
          {...register('category')}
          label="Category"
          type="label"
          className="w-full"
          labelClassName="text-brand-100"
        />

        <label className={'text-brand-100 font-bold'}>Who Sent?</label>

        <Controller
          name="payer"
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
                  label: parsePronoun(user?.partner?.pronoun).Him,
                },
              ]}
            />
          )}
        />
      </DrawerBody>

      <DrawerFooter actionLabel="Add Entries" onAction={handleSubmit(onSubmit)} onCancel={onClose} />
    </>
  )
}
