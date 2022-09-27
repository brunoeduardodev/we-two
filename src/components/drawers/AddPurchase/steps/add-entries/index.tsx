import { Controller, useForm } from 'react-hook-form'
import { PurchaseInfo } from '../..'
import { DrawerBody, DrawerFooter, DrawerHeader } from '../../../../drawer'
import { SelectButtons } from '../../../../inputs/select-buttons'
import { TextField } from '../../../../inputs/text-field'
import create from 'zustand'
import { AddEntry } from '../../../../../schemas/addRegistry'
import { EntryPage } from './entry-page'

type Props = {
  onSetEntries: (entries: AddEntry[]) => void
  onBack: () => void
}

type EntriesStore = {
  page: number
  entries: AddEntry[]

  onAddEntry: (data: AddEntry) => void
  onUpdateEntry: (index: number, data: AddEntry) => void
  onRemoveEntry: (index: number) => void

  onBack: () => void
  onNext: () => void
}

export const useEntriesStore = create<EntriesStore>((set) => ({
  entries: [],
  page: 0,

  onAddEntry: (data) => {
    set((state) => ({
      ...state,
      entries: [...state.entries, data],
      page: state.page + 1,
    }))
  },

  onRemoveEntry: (index) => {
    set((state) => {
      const entries = state.entries.filter((_, i) => i !== index)
      const page = state.page >= entries.length ? state.page : state.page - 1

      return {
        ...state,
        entries,
        page,
      }
    })
  },

  onUpdateEntry: (targetIndex, data) => {
    set((state) => {
      const entries = state.entries.map((entry, index) => {
        if (index !== targetIndex) return entry

        return data
      })

      return {
        ...state,
        entries,
      }
    })
  },

  onBack: () => {
    set((state) => {
      const page = state.page > 0 ? state.page - 1 : state.page

      return { ...state, page }
    })
  },

  onNext: () => {
    set((state) => {
      const page = state.page < state.entries.length ? state.page + 1 : state.page
      return { ...state, page }
    })
  },
}))

export const AddEntriesStep = ({ onBack, onSetEntries }: Props) => {
  const { entries, page, onAddEntry, onRemoveEntry, onUpdateEntry, onBack: onBackEntries, onNext } = useEntriesStore()

  const total = entries.length

  return (
    <>
      <DrawerHeader>
        {total === 0 ? 'Add First Entry' : page < total ? `Entry ${page + 1}/${total}` : 'Add New Entry'}{' '}
      </DrawerHeader>

      <DrawerBody>
        <EntryPage
          entry={entries[page]}
          onAddEntry={onAddEntry}
          onRemove={() => onRemoveEntry(page)}
          onBack={onBackEntries}
          onNext={onNext}
          onUpdateEntry={(data) => onUpdateEntry(page, data)}
        />
      </DrawerBody>

      <DrawerFooter
        actionLabel="Complete"
        disabled={entries.length < 1}
        onAction={() => onSetEntries(entries)}
        onCancel={onBack}
        cancelLabel="Back"
      />
    </>
  )
}
