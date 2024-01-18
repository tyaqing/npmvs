import { Link } from '@chakra-ui/react'
import NextLink from 'next/link'

export default function Header() {
  return (
    <header className={'w-full flex justify-between'}>
      <Link as={NextLink} href={'/'}>
        <span className={'text-3xl font-bold text-indigo-500'}>npmVS</span>
      </Link> 
      <div className={'flex gap-x-6'}>
        <Link
          as={NextLink}
          href="/"
          className="text-base font-medium text-gray-500 hover:text-gray-900"
        >
          Blog
        </Link>
        <Link
          as={NextLink}
          href="/"
          className="text-base font-medium text-gray-500 hover:text-gray-900"
        >
          Help
        </Link>
      </div>
    </header>
  )
}
