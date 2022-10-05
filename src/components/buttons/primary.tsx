import classNames from 'classnames'
import { ButtonProps, RootButton } from './root'

type Props = {
  colorScheme?: 'brand' | 'white'
} & ButtonProps

export const PrimaryButton = ({ className, children, colorScheme = 'white', ...props }: Props) => {
  return (
    <RootButton
      className={classNames(
        {
          'bg-white text-brand-100 border-white': colorScheme === 'white',
          'bg-brand-100 text-white border-brand-100': colorScheme === 'brand',
        },
        className
      )}
      {...props}
    >
      {children}
    </RootButton>
  )
}
