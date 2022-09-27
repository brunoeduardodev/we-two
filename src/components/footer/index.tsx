import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiFileText, FiHome, FiUser } from 'react-icons/fi'
import { FooterLink } from './FooterLink'

export const Footer = () => {
  return (
    <div className="flex mt-auto w-full align-center justify-between px-4 text-white text-3xl">
      <FooterLink href="/" icon={<FiHome />} />
      <FooterLink href="/registries" icon={<FiFileText />} />
      <FooterLink href="/account" icon={<FiUser />} />
    </div>
  )
}
