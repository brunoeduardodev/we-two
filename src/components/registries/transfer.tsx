import { PopulatedTransferRegistry } from '../../server/routers/registries'
import { useAuthentication } from '../../stores/authentication'
import { parseMoney } from '../../utils/money'
import { parsePronoun } from '../../utils/pronouns'

type Props = {
  registry: PopulatedTransferRegistry
}

export const Transfer = ({ registry }: Props) => {
  const user = useAuthentication((state) => state.user)

  const agent = user!.id === registry.transfer.fromId ? 'You' : parsePronoun(user?.partner?.pronoun).He

  return (
    <div className="flex text-sm flex-col text-brand-100 font-bold py-2 first:pt-0 last:pb-0">
      <p>
        {agent} sent {parseMoney(registry.balance)}
      </p>
      <small>
        {registry.createdAt.toLocaleString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}{' '}
        @{' '}
        {registry.createdAt.toLocaleString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </small>
    </div>
  )
}
