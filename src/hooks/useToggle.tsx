import { useState } from 'react'

type UseToggleProps = {
  defaultValue?: boolean
}

export const useToggle = (options?: UseToggleProps) => {
  const [open, setOpen] = useState(options?.defaultValue || false)

  return {
    isOpen: open,
    setOpen,
    onToggle: () => setOpen((state) => !state),
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
  }
}
