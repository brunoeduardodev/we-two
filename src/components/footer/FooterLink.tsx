import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

type Props = {
  href: string
  icon: ReactNode
}

export const FooterLink = ({ href, icon }: Props) => {
  const router = useRouter()

  const active = href === '/' ? href === router.pathname : router.pathname.split('/').includes(href.slice(1))

  return (
    <Link href={href} passHref>
      <a
        className={classNames('p-4', {
          'opacity-100': active,
          'opacity-60': !active,
        })}
      >
        {icon}
      </a>
    </Link>
  )
}
