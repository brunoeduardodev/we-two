import type { NextPage } from 'next'
import { FiNavigation, FiPlus } from 'react-icons/fi'
import { IconButton } from '../components/buttons/icon-button'
import { AddRegistryDrawer } from '../components/drawers/AddPurchase'
import { SendTransferDrawer } from '../components/drawers/SendTransfer'
import { EmptyBox, ErrorBox, QueryContainer } from '../components/query-container'
import { LoadingBox } from '../components/query-container/loading-box'
import { Registry } from '../components/registries/registry'
import { useToggle } from '../hooks/useToggle'
import { MainLayout } from '../layouts/main'
import { useAuthentication } from '../stores/authentication'
import type { WithLayout } from '../types/next'
import { parsePronoun } from '../utils/pronouns'
import { trpc } from '../utils/trpc'

const Home: WithLayout<NextPage> = () => {
  const { isOpen: isAddRegistryOpen, onClose: onCloseAddRegistry, onOpen: onOpenAddRegistry } = useToggle()
  const { isOpen: isSendTransferOpen, onClose: onCloseSendTransfer, onOpen: onOpenSendTransfer } = useToggle()
  const user = useAuthentication((state) => state.user)

  const registriesQuery = trpc.registries.getRegistries.useQuery(
    { skip: 0, take: 5 },
    { refetchInterval: 10000, retry: 0 }
  )
  const balanceQuery = trpc.registries.getBalance.useQuery(undefined, { refetchInterval: 10000, retry: 0 })

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      <section className="flex flex-col w-full overflow-hidden items-center gap-4">
        <h2 className="text-2xl text-white font-bold">Last Registries</h2>

        <div className="flex flex-col overflow-hidden bg-white w-full p-4 rounded-lg overflow-y-auto divide-y divide-brand-200">
          <QueryContainer
            isLoading={registriesQuery.isLoading}
            error={registriesQuery.error?.message}
            isEmpty={!registriesQuery.data?.length}
            LoaderComponent={<LoadingBox size="md" message="Loading your registries..." />}
            ErrorComponent={
              <ErrorBox message={`Couldn't load your recent registries: ${registriesQuery.error?.message}`} />
            }
            EmptyComponent={<EmptyBox message={`You don't have any registries yet :/`} />}
          >
            <>
              {registriesQuery.data?.map((registry) => (
                <Registry registry={registry} key={registry.id} />
              ))}
            </>
          </QueryContainer>
        </div>
      </section>

      <section className="flex flex-col w-full items-center gap-4">
        <h2 className="text-2xl text-white font-bold">Balance</h2>

        <div className="bg-white w-full text-center p-4 rounded-lg divide-y divide-brand-200 text-brand-100 font-bold">
          <QueryContainer
            isLoading={balanceQuery.isLoading}
            error={balanceQuery.error?.message}
            LoaderComponent={<LoadingBox size="md" message="Loading your balance..." />}
            ErrorComponent={<ErrorBox message={`Couldn't load your balance: ${registriesQuery.error?.message}`} />}
          >
            <>
              {!balanceQuery.data
                ? 'You are fine'
                : balanceQuery.data < 0
                ? `You owe ${parsePronoun(user?.partner?.pronoun).him} $${balanceQuery.data * -1}`
                : `${parsePronoun(user?.partner?.pronoun).he} owes you $${balanceQuery.data}}`}
            </>
          </QueryContainer>
        </div>
      </section>

      <div className="flex flex-row gap-4 justify-center mt-auto w-full">
        <IconButton onClick={onOpenAddRegistry}>
          <FiPlus />
        </IconButton>

        <IconButton onClick={onOpenSendTransfer}>
          <FiNavigation />
        </IconButton>
      </div>

      <AddRegistryDrawer isOpen={isAddRegistryOpen} onClose={onCloseAddRegistry} />
      <SendTransferDrawer isOpen={isSendTransferOpen} onClose={onCloseSendTransfer} />
    </div>
  )
}

Home.Layout = MainLayout

export default Home
