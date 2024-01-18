import { Link } from '@chakra-ui/react'
import { ReactElement } from 'react'
import { FiExternalLink } from 'react-icons/fi'

export interface HotProps {
  list: {
    title: string
    link: string
  }[]
  title: string
  icon: ReactElement
  className?: string
}
export default function Hot({ list, title, icon, className }: HotProps) {
  return (
    <div
      className={
        'rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40 bg-white ' + className
      }
    >
      <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {icon}
        <span className="ml-3 text-zinc-900">{title}</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {list.map((item, index) => {
          return (
            <li key={index} className="text-sm font-medium text-zinc-700 dark:text-zinc-100">
              <Link
                isExternal={item.link.startsWith('http')}
                target={item.link.startsWith('http') ? '_blank' : '_self'}
                href={item.link}
                className={'inline-flex space-x-1 items-center'}
              >
                <span>{item.title}</span>
                {item.link.startsWith('http') && <FiExternalLink />}
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
