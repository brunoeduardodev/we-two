import { NextPage } from 'next'
import { useState } from 'react'
import { Registry } from '../../components/registries/registry'
import { MainLayout } from '../../layouts/main'
import { WithLayout } from '../../types/next'
import { trpc } from '../../utils/trpc'

const RegistriesPage: WithLayout<NextPage> = () => {
  const [page, setPage] = useState(0)

  const { data, isLoading, error } = trpc.registries.getRegistries.useQuery(
    { skip: page * 50, take: (page + 1) * 50 },
    { keepPreviousData: true }
  )

  return (
    <>
      <section className="h-full overflow-hidden bg-white w-full rounded-lg overflow-y-auto divide-y divide-brand-200">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="h-full overflow-hidden bg-white w-full p-4 rounded-lg overflow-y-auto divide-y divide-brand-200">
            {data?.map((registry) => (
              <Registry registry={registry} key={registry.id} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

RegistriesPage.Layout = MainLayout

export default RegistriesPage
