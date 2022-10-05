import classNames from 'classnames'
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import { FiLoader } from 'react-icons/fi'

export type NativeButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export type ButtonProps = {
  loading?: boolean
} & NativeButtonProps

export const RootButton = ({ disabled, onClick, loading, className, children, ...props }: ButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={classNames(className, 'disabled:opacity-70 font-bold border-2 py-3 rounded-lg mt-auto')}
      type="button"
      {...props}
    >
      {loading ? <FiLoader className="text-2xl mx-auto animate-spin" /> : children}
    </button>
  )
}
