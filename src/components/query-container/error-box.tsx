type Props = {
  message: string
}

export const ErrorBox = ({ message }: Props) => {
  return (
    <div className="flex flex-col gap-3 w-full h-full items-center justify-center p-2">
      <p className="text-4xl">😢</p>
      <p className="font-bold">{message}</p>
    </div>
  )
}
