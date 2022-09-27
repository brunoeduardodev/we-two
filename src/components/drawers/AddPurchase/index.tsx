import { Drawer, DrawerBody, DrawerFooter, DrawerHeader } from '../../drawer'
import { SelectButtons } from '../../inputs/select-buttons'
import { TextField } from '../../inputs/text-field'
import create from 'zustand'
import { Entry } from '@prisma/client'
import { AddEntry, AddRegistry } from '../../../schemas/addRegistry'
import { useEffect } from 'react'
import { SetPurchaseStep } from './steps/set-purchase'
import { AddEntriesStep } from './steps/add-entries'
import { OverviewStep } from './steps/overview'
import { trpc } from '../../../utils/trpc'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export type PurchaseInfo = Omit<AddRegistry, 'entries'>

type AddPurchaseStore = {
  step: 'set-purchase' | 'add-entries' | 'finish'
  purchaseData: AddRegistry

  setPurchaseInfo: (info: PurchaseInfo) => void
  setEntries: (entries: AddEntry[]) => void

  goToPurchaseInfo: () => void
  goToEntries: () => void
  clear: () => void
}

export const useAddPurchaseStore = create<AddPurchaseStore>((set, get) => ({
  step: 'set-purchase',
  purchaseData: {
    label: '',
    payer: 'self',
    category: '',
    entries: [],
  },

  setPurchaseInfo: (info) => {
    set((state) => ({
      ...state,
      purchaseData: {
        ...state.purchaseData,
        ...info,
      },

      step: 'add-entries',
    }))
  },

  setEntries: (entries) => {
    set((state) => ({
      ...state,
      purchaseData: {
        ...state.purchaseData,
        entries,
      },
      step: 'finish',
    }))
  },

  goToPurchaseInfo: () => {
    set((state) => ({ ...state, step: 'set-purchase' }))
  },

  goToEntries: () => {
    set((state) => ({ ...state, step: 'add-entries' }))
  },

  clear: () => {
    set((state) => ({
      step: 'set-purchase',
      purchaseData: {
        label: '',
        payer: 'self',
        category: '',
        entries: [],
      },
    }))
  },
}))

export const AddRegistryDrawer = ({ isOpen, onClose }: Props) => {
  const clear = useAddPurchaseStore((state) => state.clear)
  const currentStep = useAddPurchaseStore((state) => state.step)
  const setPurchaseInfo = useAddPurchaseStore((state) => state.setPurchaseInfo)
  const setEntries = useAddPurchaseStore((state) => state.setEntries)
  const goToPurchaseInfo = useAddPurchaseStore((state) => state.goToPurchaseInfo)
  const goToEntries = useAddPurchaseStore((state) => state.goToEntries)

  const purchaseData = useAddPurchaseStore((state) => state.purchaseData)

  const addPurchaseMutation = trpc.registries.addPurchase.useMutation({
    onSuccess: () => {
      onClose()
    },
  })

  useEffect(() => {
    clear()
  }, [isOpen, clear])

  const onSubmit = () => {
    addPurchaseMutation.mutate(purchaseData)
  }

  return (
    <Drawer isOpen={isOpen}>
      {currentStep === 'set-purchase' && <SetPurchaseStep onSetPurchaseInfo={setPurchaseInfo} onClose={onClose} />}
      {currentStep === 'add-entries' && <AddEntriesStep onSetEntries={setEntries} onBack={goToPurchaseInfo} />}
      {currentStep === 'finish' && (
        <OverviewStep onBack={goToEntries} onConfirm={onSubmit} loading={addPurchaseMutation.isLoading} />
      )}
    </Drawer>
  )
}
