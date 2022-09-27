import { ReactNode } from 'react'

export * from './empty-box'
export * from './error-box'
export * from './loading-box'

type Props = {
  LoaderComponent?: ReactNode
  ErrorComponent?: ReactNode
  EmptyComponent?: ReactNode

  isLoading?: boolean
  isEmpty?: boolean
  error?: string

  children?: ReactNode
}

export const QueryContainer = ({
  isLoading,
  LoaderComponent,
  ErrorComponent,
  isEmpty,
  EmptyComponent,
  error,
  children,
}: Props) => {
  if (error) return <>{ErrorComponent}</>
  if (isLoading) return <>{LoaderComponent}</>
  if (isEmpty) return <>{EmptyComponent}</>

  return <>{children}</>
}
