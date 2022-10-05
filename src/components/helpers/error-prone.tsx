import { PropsWithChildren } from 'react'

type Props = {
  error?: string
}

export const ErrorProne = ({ error, children }: PropsWithChildren<Props>) => {
  return (
    <div className="flex flex-col w-full gap-2">
      {children}
      {error && <small className="text-center text-red-600 text-sm">{error}</small>}
    </div>
  )
}
