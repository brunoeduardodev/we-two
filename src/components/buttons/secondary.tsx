import classNames from 'classnames'
import { ButtonProps, RootButton } from './root'

type Props = {
  colorScheme?: 'brand' | 'white'
} & ButtonProps

export const OutlineButton = ({ className, children, colorScheme = 'white', ...props }: Props) => {
  return (
    <RootButton
      className={classNames(
        {
          'text-white border-white': colorScheme === 'white',
          'bg-brand-100 text-brand-100': colorScheme === 'brand',
        },
        className
      )}
      {...props}
    >
      {children}
    </RootButton>
  )
}
