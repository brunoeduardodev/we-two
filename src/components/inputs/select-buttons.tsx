import classNames from 'classnames'
import { useEffect, useState } from 'react'

type Choice = {
  id: string
  label: string
}

type Props<T> = {
  initialValue?: string
  value?: string
  choices: T[]
  onChange: (choice: string) => void
}

export const SelectButtons = <T extends Choice>({ choices, initialValue, value, onChange }: Props<T>) => {
  const [selected, setSelected] = useState(initialValue || choices[0].id)

  useEffect(() => {
    if (value) setSelected(value)
  }, [value])

  useEffect(() => {
    onChange(selected)
  }, [selected])

  return (
    <div className="flex w-full justify-between align-middle gap-4">
      {choices.map((choice) => (
        <button
          key={choice.id}
          onClick={(e) => {
            e.preventDefault()
            setSelected(choice.id)
          }}
          className={classNames(
            {
              'bg-brand-100': selected === choice.id,
              'bg-brand-300': selected !== choice.id,
            },
            'w-full font-bold text-white px-2 py-4 min-h-[68px] text-center rounded-sm transition-colors'
          )}
        >
          {choice.label}
        </button>
      ))}
    </div>
  )
}
