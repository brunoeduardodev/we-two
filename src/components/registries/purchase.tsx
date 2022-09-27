import { PopulatedPurchaseRegistry } from '../../server/routers/registries'
import { useAuthentication } from '../../stores/authentication'
import { parsePronoun } from '../../utils/pronouns'

type Props = {
  registry: PopulatedPurchaseRegistry
}

export const Purchase = ({ registry }: Props) => {
  const user = useAuthentication((state) => state.user)

  const agent = user!.id === registry.purchase.payerId ? 'You' : parsePronoun(user?.partner?.pronoun).He

  return (
    <div className="flex text-sm flex-col text-brand-100 font-bold ">
      <p>
        {agent} wasted ${Math.abs(registry.balance)} with {registry.purchase.label || registry.purchase.category.name}
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
