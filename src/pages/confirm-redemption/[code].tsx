import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Header } from '../../components/header'
import { trpc } from '../../utils/trpc'

const ConfirmRedemptionPage = () => {
  const { query } = useRouter()
  const code = query.code as string

  const { data, isLoading, error } = trpc.invites.getInviteInfo.useQuery({ code })

  if (isLoading) {
    return 'Carregando...'
  }

  if (error) {
    return error.message
  }

  return (
    <>
      <Header variant="lg" className="mb-[48px] pt-12" />

      <div className="flex flex-col gap-4 w-full">
        <h3 className="text-2xl text-center">Confirm code Redemption</h3>
      </div>
    </>
  )
}

export default ConfirmRedemptionPage
