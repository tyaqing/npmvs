import Head from 'next/head'

import MyCombobox from '@/components/Combobox'
import DownloadLineChart from '@/components/DownloadLineChart'
import DownloadTable from '@/components/DownloadTable'
import PackageItems from '@/components/PackageItems'
import { parseDownloadData, parseInfoData } from '@/libs/base'

// interface PackagesProps {
//   packageList: string[]
//   recommendPackages: string[]
//   downloadList: []
//   infoList: {
//     created_at: string
//     links: string
//     name: string
//     open_issues: string
//     stargazers_count: string
//     updated_at: string
//     version: string
//     license: {
//       name: string
//     }
//   }[]
// }

export default async function Page({ params }: { params: { slug: string } }) {
  console.log('params', params)
  const { downloadList, infoList, packages } = await getData(params.slug.split('-vs-'))

  const title = params.slug
  return (
    <div className={'mx-auto flex flex-col gap-y-4 xl:gap-y-8 rounded-[8px] my-6'}>
      <Head>
        <title>{`npmVS | ${title}`}</title>
      </Head>
      <div className={'flex gap-x-3 items-center flex-wrap gap-y-2'}>
        <div className={'w-full xl:w-72'}>
          <MyCombobox />
        </div>
        <PackageItems packageList={packages} />
        <PackageItems recommend packageList={[]} />
      </div>
      <h1 className={'font-bold text-xl text-gray-600'}>
        {[].map((p, index) => (
          <span key={index}>
            <span>{p}</span>
            {index !== [].length - 1 ? <small className={'mx-1'}> vs </small> : ''}
          </span>
        ))}
      </h1>
      {/*<div className={'pt-16 flex justify-center'}>{JSON.stringify(props?.downloadData?.downloads)}</div>*/}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 space-y-8">
          {/*下载图表*/}
          <DownloadLineChart downloadList={downloadList} />
          {/*下载表格*/}
          {!!infoList.length && <DownloadTable infoList={infoList} />}
        </div>
      </div>
    </div>
  )
}

async function getData(packages: string[] = []) {
  console.log('packages', packages)
  const infoList = await parseInfoData(packages)
  // // 获取推荐数据
  return {
    downloadList: await parseDownloadData(packages),
    infoList,
    packages,
    recommendPackages: [],
  }
}
