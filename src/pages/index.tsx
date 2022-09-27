import type { NextPage } from 'next'
import { FiNavigation, FiPlus } from 'react-icons/fi'
import { IconButton } from '../components/buttons/icon-button'
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader } from '../components/drawer'
import { AddRegistryDrawer } from '../components/drawers/AddPurchase'
import { SendTransferDrawer } from '../components/drawers/SendTransfer'
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

  const { data, isLoading, error } = trpc.registries.getRegistries.useQuery(
    { skip: 0, take: 5 },
    { refetchInterval: 5000 }
  )

  const { data: balance } = trpc.registries.getBalance.useQuery(undefined, { refetchInterval: 5000 })

  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      <section className="flex flex-col w-full overflow-hidden items-center gap-4 h-full">
        <h2 className="text-2xl text-white font-bold">Last Registries</h2>

        <div className="h-full overflow-hidden bg-white w-full p-4 rounded-lg overflow-y-auto divide-y divide-brand-200">
          {data?.map((registry) => (
            <Registry registry={registry} key={registry.id} />
          ))}
        </div>
      </section>

      <section className="flex flex-col w-full items-center gap-4 h-full">
        <h2 className="text-2xl text-white font-bold">Balance</h2>

        <div className="bg-white w-full text-center p-4 rounded-lg divide-y divide-brand-200 text-brand-100 font-bold">
          {typeof balance !== 'undefined' &&
            (balance === 0
              ? 'You are fine!'
              : balance < 0
              ? `You owe ${parsePronoun(user?.partner?.pronoun).him} $${balance * -1}`
              : `${parsePronoun(user?.partner?.pronoun).he} owes you $${balance}`)}
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
