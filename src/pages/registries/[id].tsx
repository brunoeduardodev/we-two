import { DivisionType } from '@prisma/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FiTrash } from 'react-icons/fi'
import { IconButton } from '../../components/buttons/icon-button'
import { Drawer, DrawerFooter, DrawerHeader } from '../../components/drawer'
import { EmptyBox, ErrorBox, LoadingBox, QueryContainer } from '../../components/query-container'
import { useToggle } from '../../hooks/useToggle'
import { MainLayout } from '../../layouts/main'
import {
  PopulatedPurchaseRegistry,
  PopulatedRegistry,
  PopulatedTransferRegistry,
} from '../../server/routers/registries'
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
            className="flex items-center w-full  justify-between  text-sm py-2 first:pt-0 last:pb-0 overflow-y-auto"
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
      <p>From: {registry.transfer.from.name}</p>
      <p>To: {registry.transfer.to.name}</p>
      <p>Date: {registry.createdAt.toLocaleString()}</p>
      <p>Value: {registry.transfer.value}</p>
    </>
  )
}

type Props = {
  registry: PopulatedRegistry
}

const RegistryHeader = ({ registry }: Props) => {
  const { onClose, isOpen, onOpen } = useToggle()
  const router = useRouter()

  const deleteRegistryMutation = trpc.registries.deleteRegistry.useMutation({
    onSuccess: () => {
      onClose()
      router.back()
    },
  })

  return (
    <div className="flex w-full relative flex-col items-center mb-4 ">
      <h1 className="text-2xl ">{registry?.purchase ? 'Purchase' : 'Transfer'}</h1>
      <IconButton onClick={onOpen} className="absolute right-0 text-lg p-2">
        <FiTrash className="text-red-500" />
      </IconButton>

      <Drawer isOpen={isOpen}>
        <DrawerHeader>Delete Registry?</DrawerHeader>
        <DrawerFooter
          actionLabel="Delete"
          loading={deleteRegistryMutation.isLoading}
          onAction={() => deleteRegistryMutation.mutate({ id: registry.id })}
          onCancel={onClose}
        />
      </Drawer>
    </div>
  )
}

export const RegistryPage: WithLayout<NextPage> = () => {
  const router = useRouter()
  const id = router.query.id as string

  const { isLoading, data, error } = trpc.registries.getRegistry.useQuery({ id }, { retry: 0 })

  return (
    <section className="flex flex-col w-full items-center  text-white font-bold">
      <QueryContainer
        isLoading={isLoading}
        error={error?.message}
        isEmpty={!data}
        EmptyComponent={<EmptyBox message="Couldn't found your registry" />}
        LoaderComponent={<LoadingBox size="md" message="Loading your registries..." />}
        ErrorComponent={<ErrorBox message={`Couldn't load your recent registries: ${error?.message}`} />}
      >
        <>
          <RegistryHeader registry={data!} />

          {data?.purchase ? (
            <PurchaseDetails registry={data as PopulatedPurchaseRegistry} />
          ) : (
            <TransferDetails registry={data as PopulatedTransferRegistry} />
          )}
        </>
      </QueryContainer>
    </section>
  )
}

RegistryPage.Layout = MainLayout

export default RegistryPage
