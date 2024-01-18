'use client'
import classNames from 'classnames'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { HiPlus, HiX } from 'react-icons/hi'

interface PackageItemsProps {
  packageList?: string[]
  recommend?: boolean
}
export default function PackageItems({ packageList = [], recommend = false }: PackageItemsProps) {
  const router = useRouter()
  const params = useParams()
  const slug = params['slug'] as string
  const removePackage = (pName: string) => {
    const packageList = slug.split('-vs-')
    // 推荐组件就是增加
    if (recommend) {
      router.push('/' + [...packageList, pName].join('-vs-'))
      return
    }
    if (packageList.length === 1) router.push('/')
    const newPackageList = packageList.filter((i) => i !== pName)
    router.push('/' + newPackageList.join('-vs-'))
  }
  return (
    <>
      {packageList.map((pName) => (
        <span
          key={pName}
          className={`h-[38px] inline-flex rounded-full items-center 
          py-0.5 pl-2.5 pr-1 text-sm 
          font-medium bg-indigo-100 text-indigo-700
          ${classNames({
            'bg-indigo-100': !recommend,
            'bg-gray-200 text-gray-800': recommend,
          })}
          `}
        >
          <Link href={'/' + pName}>{pName}</Link>
          <button
            onClick={() => removePackage(pName)}
            type="button"
            className={`
            flex-shrink-0 ml-0.5 
            h-7 w-7
            rounded-full inline-flex items-center
            justify-center
            hover:text-indigo-500
            transition
            ${classNames({
              'text-indigo-400 hover:bg-red-200': !recommend,
              'text-gray-900 bg-gray-300 hover:bg-indigo-200': recommend,
            })}
            `}
          >
            {recommend ? <HiPlus /> : <HiX />}
          </button>
        </span>
      ))}
    </>
  )
}
