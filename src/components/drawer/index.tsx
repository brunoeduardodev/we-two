import classNames from 'classnames'
import { PropsWithChildren } from 'react'
import { PrimaryButton } from '../buttons/primary'

export const DrawerHeader = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-col w-full text-2xl text-brand-100 text-center font-bold mb-6">{children}</div>
}

type DrawerProps = {
  isOpen: boolean
}

export const DrawerBody = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-col w-full h-full pb-6 items-center gap-4">{children}</div>
}

type DrawerFooterProps = {
  onCancel: () => void
  onAction: () => void

  cancelLabel?: string
  actionLabel: string
  loading?: boolean
  disabled?: boolean
}

export const DrawerFooter = ({
  onAction,
  cancelLabel = 'Cancel',
  onCancel,
  loading,
  disabled,
  actionLabel,
}: DrawerFooterProps) => {
  return (
    <div className="mt-auto w-full flex justify-center gap-4">
      <PrimaryButton className="w-full border-2 border-brand-100" onClick={onCancel}>
        {cancelLabel}
      </PrimaryButton>

      <PrimaryButton
        colorScheme="brand"
        className="w-full border-2 border-brand-100"
        type="submit"
        loading={loading}
        disabled={disabled}
        onClick={onAction}
      >
        {actionLabel}
      </PrimaryButton>
    </div>
  )
}

export const Drawer = ({ isOpen, children }: PropsWithChildren<DrawerProps>) => {
  return (
    <div
      className={classNames(
        'flex flex-col z-10 left-0 w-full h-[calc(100%-24px)] fixed bg-white rounded-t-3xl transition-[top,opacity] p-6',
        {
          'top-[24px] opacity-100': isOpen,
          'top-[100%] opacity-0': !isOpen,
        }
      )}
    >
      {children}
    </div>
  )
}
