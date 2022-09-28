import { DivisionType } from '@prisma/client'
import { useMemo } from 'react'
import { useAddPurchaseStore } from '..'
import { useAuthentication } from '../../../../stores/authentication'
import { parseMoney } from '../../../../utils/money'
import { parsePronoun } from '../../../../utils/pronouns'
import { DrawerBody, DrawerFooter, DrawerHeader } from '../../../drawer'

function getDivisionText({
  divisionType,
  partnerName,
  userName,
}: {
  divisionType: DivisionType
  userName: string
  partnerName: string
}) {
  if (divisionType === 'half') return 'Half'
  if (divisionType === 'creator') return `${userName} is paying`
  if (divisionType === 'partner') return `${partnerName} is paying`

  return ''
}

type Props = {
  onBack: () => void
  onConfirm: () => void

  loading: boolean
}

export const OverviewStep = ({ onBack, loading, onConfirm }: Props) => {
  const { purchaseData } = useAddPurchaseStore()
  const { user } = useAuthentication()

  const { label, payer, category, entries } = purchaseData

  const balanceChange = useMemo(() => {
    const difference = entries.reduce((diff, entry) => {
      if (entry.divisionType === 'creator' && payer === 'self') {
        return diff
      }

      if (entry.divisionType === 'creator' && payer === 'partner') {
        return diff + entry.value
      }

      if (entry.divisionType === 'partner' && payer === 'self') {
        return diff + entry.value
      }

      if (entry.divisionType === 'partner' && payer === 'partner') {
        return diff
      }

      return diff + entry.value / 2
    }, 0)

    if (difference === 0) return "There's no balance change"

    if (payer === 'self') return `${parsePronoun(user?.partner?.pronoun).he} owes you $${difference}`

    return `You owe ${parsePronoun(user?.partner?.pronoun).him} $${difference}`
  }, [entries, payer])

  return (
    <>
      <DrawerHeader>Purchase Overview</DrawerHeader>

      <DrawerBody>
        <div className="flex flex-col w-full items-center text-brand-100 font-bold">
          {label && <p className="text-2xl">{label}</p>}

          {category && <p className="text-xl mb-2">{category}</p>}

          <p className="text-xl mb-4">{payer === 'self' ? 'You are' : user?.partner?.name + ' is'} paying</p>

          <p className="mb-4">{balanceChange}</p>

          <div className="w-full h-[1px] bg-brand-100 mb-4"></div>

          {entries.map((entry, index) => (
            <div key={index} className="flex flex-col items-center w-full justify-between mb-2 overflow-y-scroll">
              {entry.label && <p className="text-lg">{entry.label}</p>}
              <p>
                {parseMoney(entry.value)} (
                {getDivisionText({
                  divisionType: entry.divisionType,
                  userName: user!.name,
                  partnerName: user!.partner!.name,
                })}
                )
              </p>
            </div>
          ))}
        </div>
      </DrawerBody>

      <DrawerFooter
        actionLabel="Complete"
        loading={loading}
        onAction={onConfirm}
        onCancel={onBack}
        cancelLabel="Back"
      />
    </>
  )
}
