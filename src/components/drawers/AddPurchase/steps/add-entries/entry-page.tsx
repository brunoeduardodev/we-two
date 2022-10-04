import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiArrowLeft, FiArrowRight, FiTrash } from 'react-icons/fi'
import { useEntriesStore } from '.'
import { AddEntry, addEntrySchema } from '../../../../../schemas/addRegistry'
import { useAuthentication } from '../../../../../stores/authentication'
import { parsePronoun } from '../../../../../utils/pronouns'
import { IconButton } from '../../../../buttons/icon-button'
import { PrimaryButton } from '../../../../buttons/primary'
import { SelectButtons } from '../../../../inputs/select-buttons'
import { TextField } from '../../../../inputs/text-field'

type Props = {
  entry?: AddEntry

  onAddEntry: (data: AddEntry) => void
  onUpdateEntry: (data: AddEntry) => void
  onRemove: () => void

  onBack: () => void
  onNext: () => void
}

export const EntryPage = ({ entry, onAddEntry, onUpdateEntry, onRemove, onBack, onNext }: Props) => {
  const page = useEntriesStore((state) => state.page)
  const total = useEntriesStore((state) => state.entries.length)

  const user = useAuthentication((state) => state.user)

  const {
    register,
    setValue,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AddEntry>({
    resolver: zodResolver(addEntrySchema),
    mode: 'all',
  })

  useEffect(() => {
    if (!entry) {
      setValue('divisionType', 'half')
      setValue('label', '')

      // @ts-ignore
      setValue('value', undefined)

      return
    }

    setValue('divisionType', entry.divisionType)
    setValue('label', entry.label)
    setValue('value', entry.value)
  }, [page])

  const submitFunction = page === total ? onAddEntry : onUpdateEntry

  const onSubmit = () => {
    handleSubmit(submitFunction)()
    reset()
  }

  return (
    <div className="w-full h-full flex flex-col items-center gap-4">
      <TextField
        {...register('label')}
        error={errors.label?.message}
        label="Name"
        className="w-full"
        labelClassName="text-brand-100"
      />

      <TextField
        {...register('value', { setValueAs: (value) => (typeof value === 'undefined' ? undefined : Number(value)) })}
        error={errors.value?.message}
        label="Value"
        type="number"
        className="w-full"
        labelClassName="text-brand-100"
      />

      <label className={'text-brand-100 font-bold'}>What's the division?</label>

      <Controller
        name="divisionType"
        control={control}
        render={({ field }) => (
          <SelectButtons
            onChange={(choice) => field.onChange(choice)}
            value={field.value}
            choices={[
              {
                id: 'creator',
                label: 'You',
              },
              {
                id: 'half',
                label: 'Half',
              },
              {
                id: 'partner',
                label: parsePronoun(user?.partner?.pronoun).Him,
              },
            ]}
          />
        )}
      />

      <div className="flex w-full mt-2 gap-4">
        <IconButton disabled={page === 0} className="rounded-xl border-brand-100 border-2">
          <FiArrowLeft onClick={onBack} />
        </IconButton>

        <IconButton disabled={page >= total} className="rounded-xl border-brand-100 border-2">
          <FiArrowRight onClick={onNext} />
        </IconButton>

        <IconButton disabled={total === 0 || page === total} className="rounded-xl border-brand-100 border-2">
          <FiTrash onClick={onRemove} />
        </IconButton>

        <PrimaryButton className="border-brand-100 border-2" disabled={!isValid} colorScheme="brand" onClick={onSubmit}>
          {page === total ? 'Add' : 'Update'}
        </PrimaryButton>
      </div>
    </div>
  )
}
