import { NextPage } from 'next'
import { useState } from 'react'
import { EmptyBox, ErrorBox, LoadingBox, QueryContainer } from '../../components/query-container'
import { Registry } from '../../components/registries/registry'
import { MainLayout } from '../../layouts/main'
import { WithLayout } from '../../types/next'
import { trpc } from '../../utils/trpc'

const RegistriesPage: WithLayout<NextPage> = () => {
  const [page, setPage] = useState(0)

  const { data, error, isLoading } = trpc.registries.getRegistries.useQuery(
    { skip: page * 50, take: (page + 1) * 50 },
    { retry: 0 }
  )

  return (
    <>
      <section className="h-full overflow-hidden bg-white w-full rounded-lg overflow-y-auto divide-y divide-brand-200">
        <div className="h-full text-brand-100 overflow-hidden bg-white w-full p-4 rounded-lg overflow-y-auto divide-y divide-brand-200">
          <QueryContainer
            isLoading={isLoading}
            error={error?.message}
            isEmpty={data?.length === 0}
            LoaderComponent={<LoadingBox size="md" message="Loading your registries..." />}
            ErrorComponent={<ErrorBox message={`Couldn't load your registries: ${error?.message}`} />}
            EmptyComponent={<EmptyBox message={`You don't have any registries yet :/ `} />}
          >
            {data?.map((registry) => (
              <Registry registry={registry} key={registry.id} />
            ))}
          </QueryContainer>
        </div>
      </section>
    </>
  )
}

RegistriesPage.Layout = MainLayout

export default RegistriesPage
