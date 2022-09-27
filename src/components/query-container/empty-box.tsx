type Props = {
  message: string
}

export const EmptyBox = ({ message }: Props) => {
  return (
    <div className="flex flex-col gap-3 w-full h-full items-center justify-center p-2">
      <p className="text-brand-100 font-bold">{message}</p>
    </div>
  )
}
