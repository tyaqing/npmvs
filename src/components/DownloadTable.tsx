import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'

import { flagColors } from '../biz/const'

interface DownloadTableProps {
  infoList: {
    created_at: string
    links: string
    name: string
    open_issues: string
    stargazers_count: string
    updated_at: string
    version: string
    license: {
      name: string
    }
  }[]
}
export default function DownloadTable({ infoList }: DownloadTableProps) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {['Name', 'Links', 'Star', 'Issue', 'Version', 'License', 'Updated', 'Created'].map(
                  (label, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {infoList.map((pkg, index) => (
                <tr key={pkg.name}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    <div className={'flex items-center space-x-3'}>
                      <div
                        className={'w-4 aspect-square rounded-full'}
                        style={{
                          backgroundColor: flagColors[index % flagColors.length],
                        }}
                      />
                      <div>{pkg.name}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500 flex gap-x-2">
                    <Link target={'_blank'} href={pkg.links}>
                      <Image src={'/svg/github.svg'} alt={'github logo'} width={24} height={24} />
                    </Link>
                    <Link target={'_blank'} href={'https://www.npmjs.com/package/' + pkg.name}>
                      <Image src={'/svg/npm.svg'} alt={'npm logo'} width={24} height={24} />
                    </Link>
                  </td>
                  <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                    {pkg.stargazers_count || '-'}
                  </td>
                  <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                    {pkg.open_issues || '-'}
                  </td>
                  <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                    {pkg.version}
                  </td>
                  <td
                    title={pkg?.license?.name || '-'}
                    className="whitespace-nowrap py-4 px-3 text-sm text-gray-500 max-w-[100px] truncate"
                  >
                    {pkg?.license?.name || '-'}
                  </td>
                  <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                    {pkg.updated_at ? dayjs(pkg.updated_at).fromNow() : '-'}
                  </td>
                  <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                    {pkg.created_at ? dayjs(pkg.created_at).fromNow() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
