import classNames from 'classnames'
import { ButtonProps } from './root'

type Props = {} & ButtonProps

export const IconButton = ({ children, className, ...props }: Props) => {
  return (
    <button
      className={classNames('text-2xl rounded-full bg-white text-brand-100 p-3 disabled:opacity-50', className)}
      {...props}
    >
      {children}
    </button>
  )
}
