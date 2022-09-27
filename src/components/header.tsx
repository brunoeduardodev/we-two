import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiArrowLeft } from 'react-icons/fi'

type Props = {
  variant?: 'md' | 'lg'
  className?: string
}

const rootLinks = ['/', '/register', '/login', '/account', '/registries']

export const Header = ({ variant = 'md', className }: Props) => {
  const router = useRouter()

  const showBackButton = !rootLinks.includes(router.pathname)
  const backLink = showBackButton ? '/' + router.pathname.split('/').at(-2) : ''

  return (
    <header
      className={classNames(
        'w-full flex flex-col font-logo text-white',
        {
          'items-center gap-4 text-[40px]': variant === 'lg',
          'gap-2 text-[32px]': variant === 'md',
        },
        className
      )}
    >
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Link href={backLink} passHref>
            <a>
              <FiArrowLeft className="color-white text-3xl cursor-pointer" />
            </a>
          </Link>
        )}
        <h1>We Two</h1>
      </div>
      <div className="w-full h-[2px] bg-white rounded-full" />
    </header>
  )
}
