import { Link } from '@chakra-ui/react'
import NextLink from 'next/link'
const { version } = require('../../package.json')

export default function Footer() {
  return (
    <footer
      className={
        'w-full text-sm text-center py-4 text-gray-400 flex gap-2 justify-center items-end'
      }
    >
      <Link as={NextLink} href={'https://abfree.com/'}>
        ABFree
      </Link>{' '}
      | <div>V{version}</div>
    </footer>
  )
}
