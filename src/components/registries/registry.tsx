import Link from 'next/link'
import { ReactNode } from 'react'
import {
  PopulatedPurchaseRegistry,
  PopulatedRegistryWithBalance,
  PopulatedTransferRegistry,
} from '../../server/routers/registries'
import { Purchase } from './purchase'
import { Transfer } from './transfer'

type Props = {
  registry: PopulatedRegistryWithBalance
}

export const Registry = ({ registry }: Props) => {
  let RegistryRender: ReactNode

  if (registry.purchase) {
    RegistryRender = <Purchase registry={registry as PopulatedPurchaseRegistry} />
  } else {
    RegistryRender = <Transfer registry={registry as PopulatedTransferRegistry} />
  }

  return (
    <Link href={`/registries/${registry.id}`} passHref>
      <a className="flex flex-col py-2 first:pt-0 last:pb-0">{RegistryRender}</a>
    </Link>
  )
}
