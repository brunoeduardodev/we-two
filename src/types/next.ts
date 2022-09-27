import { PropsWithChildren, ReactElement, ReactNode } from 'react'

export type WithLayout<T> = {
  Layout: ({ children }: PropsWithChildren) => JSX.Element
} & T

export function hasLayout<T>(component: T): component is WithLayout<T> {
  return (component as WithLayout<T>).Layout !== undefined
}
