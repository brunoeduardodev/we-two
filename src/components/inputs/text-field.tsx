import classNames from 'classnames'
import { forwardRef } from 'react'

type Props = {
  label?: string
  error?: string
  centered?: boolean

  className?: string
  labelClassName?: string
} & JSX.IntrinsicElements['input']

export const TextField = forwardRef<HTMLInputElement, Props>(
  ({ className, labelClassName, label, error, ...inputProps }, ref) => {
    return (
      <div className="flex w-full text-center flex-col gap-2">
        <label className={classNames('text-white font-bold', labelClassName)}>{label}</label>
        <input
          {...inputProps}
          ref={ref}
          className={classNames('bg-brand-300 text-brand-100 font-bold py-2 px-2 rounded-lg', className, {
            'border-red-500 outline-red-500 border-2 text-red-500 ': !!error,
          })}
        />
        {error && <small className="text-red-600 text-sm">{error}</small>}
      </div>
    )
  }
)

TextField.displayName = 'TextField'
