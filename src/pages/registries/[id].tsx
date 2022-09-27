import { DivisionType } from '@prisma/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { MainLayout } from '../../layouts/main'
import { PopulatedPurchaseRegistry, PopulatedTransferRegistry } from '../../server/routers/registries'
import { useAuthentication } from '../../stores/authentication'
import { WithLayout } from '../../types/next'
import { ParsedPronoun, parsePronoun } from '../../utils/pronouns'
import { trpc } from '../../utils/trpc'

type PurchaseDetailsProps = {
  registry: PopulatedPurchaseRegistry
}

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

function getPurchaseBalanceChange(registry: PopulatedPurchaseRegistry, partnerPronoun: ParsedPronoun) {
  if (registry.balance < 0) {
    return `${partnerPronoun.he} paid $${Math.abs(registry.balance)} to you.`
  }

  if (registry.balance > 0) {
    return `You paid $${Math.abs(registry.balance)} to ${partnerPronoun.him}.`
  }

  return 'There was no balance change'
}

const PurchaseDetails = ({ registry }: PurchaseDetailsProps) => {
  const label = registry.purchase.label || registry.purchase.category.name
  const user = useAuthentication((state) => state.user)

  return (
    <>
      <h1 className="text-2xl mb-2">{registry.purchase ? 'Purchase' : 'Transfer'}</h1>

      {label && <p className="text-lg mb-4">{label}</p>}
      <p>Payer: {registry.purchase.payer.name}</p>
      <p>Date: {registry.createdAt.toLocaleString()}</p>
      <p className="mb-4">{getPurchaseBalanceChange(registry, parsePronoun(user?.partner?.pronoun))}</p>
      <div className="w-full h-[1px] bg-white mb-4" />

      <h2 className="text-xl">Entries</h2>

      <div className="flex flex-col w-full divide-y divide-white">
        {registry.purchase.entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center w-full  justify-between  text-sm py-2 first:pt-0 last:pb-0 overflow-y-scroll"
          >
            {entry.label && <p className="text-sm">{entry.label}</p>}
            <p>
              ${entry.value} (
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
    </>
  )
}

type TransferDetailsProps = {
  registry: PopulatedTransferRegistry
}

const TransferDetails = ({ registry }: TransferDetailsProps) => {
  return (
    <>
      <h1 className="text-2xl mb-2">Transfer</h1>

      <p>From: {registry.transfer.from.name}</p>
      <p>To: {registry.transfer.to.name}</p>
      <p>Date: {registry.createdAt.toLocaleString()}</p>
    </>
  )
}

export const RegistryPage: WithLayout<NextPage> = () => {
  const router = useRouter()
  const id = router.query.id as string

  const { isLoading, data, isError, error } = trpc.registries.getRegistry.useQuery({ id }, { retry: 0 })

  return (
    <section className="flex flex-col w-full items-center  text-white font-bold">
      A
      {isLoading ? (
        'Loading...'
      ) : isError ? (
        'Error: ' + error.message
      ) : data.purchase ? (
        <PurchaseDetails registry={data as PopulatedPurchaseRegistry} />
      ) : (
        <TransferDetails registry={data as PopulatedTransferRegistry} />
      )}
    </section>
  )
}

RegistryPage.Layout = MainLayout

export default RegistryPage
