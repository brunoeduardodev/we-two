import classNames from 'classnames'
import { FiLoader } from 'react-icons/fi'

type Props = {
  size: 'sm' | 'md'
  message?: string
}

export const LoadingBox = ({ size, message }: Props) => {
  return (
    <div className="flex flex-col gap-3 w-full h-full items-center justify-center p-2">
      <FiLoader
        className={classNames('text-brand-100 animate-spin', {
          'text-2xl': size === 'sm',
          'text-3xl': size === 'md',
        })}
      />
      {message && <p className="text-brand-100 font-bold">{message}</p>}
    </div>
  )
}
