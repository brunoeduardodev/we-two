import { NextPage } from 'next'
import { useEffect } from 'react'
import { FiShare } from 'react-icons/fi'
import { MainLayout } from '../../layouts/main'
import { WithLayout } from '../../types/next'
import { trpc } from '../../utils/trpc'
import { getBaseUrl } from '../../utils/url'

const InvitePartnerPage: WithLayout<NextPage> = () => {
  const {
    mutate: generateCode,
    isLoading,
    data,
  } = trpc.invites.generateInvite.useMutation({
    onSuccess(data, variables) {},
  })

  useEffect(() => {
    generateCode()
  }, [generateCode])

  const handleShare = () => {
    navigator.share({
      url: `${getBaseUrl()}/redeem-code?code=${data?.code}`,
      title: 'WeTwo Partner Code',
      text: `Hey, my invitation code to WeTwo is ${
        data?.code
      }!\nAdd my code there or just click on this link: ${getBaseUrl()}/redeem-code?code=${data?.code}`,
    })
  }

  return (
    <>
      <section className="flex flex-col w-full gap-4 text-white">
        <h1 className="font-bold text-center text-2xl">Your Partner Code:</h1>
        <h3 className="font-bold text-3xl tracking-widest uppercase text-center mb-3">
          {isLoading && 'Loading...'}
          {data?.code}
        </h3>

        <p className="text-xl font-bold text-center">Share it with your partner: </p>
        <button className="bg-transparent border-white self-center border-2 rounded-lg" onClick={handleShare}>
          <FiShare className="text-4xl p-2 text-white" />
        </button>
      </section>
    </>
  )
}

InvitePartnerPage.Layout = MainLayout

export default InvitePartnerPage
