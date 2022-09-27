import classNames from 'classnames'
import { ReactNode } from 'react'
import { FiLoader } from 'react-icons/fi'
import { ButtonProps } from './types'

type Props = {
  loading?: boolean
  error?: string

  colorScheme?: 'brand' | 'white'
} & ButtonProps

export const PrimaryButton = ({
  children,
  error,
  disabled,
  loading,
  onClick,
  className,
  colorScheme = 'white',
}: Props) => {
  return (
    <div className="flex flex-col w-full gap-2">
      {error && <small className="text-center text-red-600 text-sm">{error}</small>}

      <button
        disabled={disabled || loading}
        onClick={onClick}
        className={classNames(
          'disabled:opacity-70 font-bold py-3 rounded-lg mt-auto',
          {
            'bg-white text-brand-100': colorScheme === 'white',
            'bg-brand-100 text-white': colorScheme === 'brand',
          },
          className
        )}
      >
        {loading ? <FiLoader className="text-2xl mx-auto animate-spin" /> : children}
      </button>
    </div>
  )
}
