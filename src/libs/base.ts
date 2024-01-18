import { kv } from '@vercel/kv'
import dayjs from 'dayjs'

/**
 * 【国内】
 * npm包请求数据源 https://registry.npmmirror.com/react/latest
 * 下载源数据太细，需要服务端重新处理
 * npm包下载数据源 https://registry.npmmirror.com/downloads/range/2022-05-17:2022-11-17/jquery
 * 【国际】
 * npm包请求数据源 https://registry.npmjs.com/react/latest
 * npm包下载数据源 https://registry.npmjs.com/downloads/range/last-month/jquery
 * github数据源 https://api.github.com/repos/
 *
 * 参考
 * https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
 * https://github.com/npm/registry/blob/master/docs/download-counts.md
 * https://stackoverflow.com/questions/34071621/query-npmjs-registry-via-api
 */

export type DataItemType = {
  day: string
  downloads: string
  package: string
}
// 输入package包 生成对应下载数据
export const parseDownloadData = async (packageList: string[], isCN = false) => {
  // 国内需要 这里的数据
  // https://registry.npmmirror.com/downloads/range/2021-10-17:2022-10-17/react
  const dataOrigin = isCN ? 'https://registry.npmmirror.com' : 'https://api.npmjs.org'
  // 开始时间
  const startWeek = dayjs().day(1).add(-24, 'week').format('YYYY-MM-DD')
  // 结束时间
  const endWeek = dayjs().day(0).format('YYYY-MM-DD')
  const downloadTasks = packageList.map(async (p) => {
    const url = `${dataOrigin}/downloads/range/${startWeek}:${endWeek}/${p}`
    const cacheKey = await kv.get(url)
    if (cacheKey) return cacheKey
    const res = await fetch(url)
    const npmInfo = await res.json()
    await kv.set(url, npmInfo)
    return npmInfo
  })
  const originDownloadList = []
  for (const response of await Promise.all(downloadTasks)) {
    originDownloadList.push(response)
  }
  // 累加
  let sum = 0
  const newList: DataItemType[] = []

  // 生成新的数据
  originDownloadList?.forEach((packageDownloadInfo) => {
    packageDownloadInfo.downloads?.forEach((item: DataItemType) => {
      let { day, downloads } = item
      if (dayjs(day).day() === 0) {
        downloads += sum
        const record = {
          day,
          downloads,
          package: packageDownloadInfo.package,
        }
        sum = 0
        newList.push(record)
      } else sum += +downloads
    })
  })
  return newList
}

// 输入package包 生成对应信息
export const parseInfoData = async (packageList: string[]) => {
  const p: any[] = []
  for (const packageName of packageList) {
    p.push(await getInfoLoop(packageName))
  }
  return p
}

async function getInfoLoop(val: string) {
  const npmInfo = await getNpmInfo(encodeURIComponent(val))
  const { version, name, repository, homepage, description } = npmInfo
  const repoMatch = repository?.url
    ? (repository.url as string).match(/([\w.-]+\/[\w.-]+).git/)
    : false
  let extra = {}
  let repo = ''
  if (repoMatch) {
    ;[, repo] = repoMatch
    const githubInfo = await getGithubInfo(repo)
    const { created_at, updated_at, stargazers_count, open_issues, homepage, license } = githubInfo
    extra = {
      created_at,
      updated_at,
      stargazers_count: thousand(stargazers_count),
      open_issues: thousand(open_issues),
      homepage,
      license,
    }
  }
  return {
    name,
    version,
    links: homepage || 'https://github.com/' + repo,
    description,
    ...extra,

    // created,
    // modified,
  }
}

async function getNpmInfo(val: string) {
  // get npm info
  const url = `https://registry.npmjs.com/${val}/latest`
  // hash url to get cache key
  const cacheKey = await kv.get(url)
  if (cacheKey) return cacheKey
  const res = await fetch(url)
  const npmInfo = await res.json()
  await kv.set(url, npmInfo)
  console.log(`https://registry.npmjs.com/${val}/latest`, npmInfo)
  return npmInfo
}

const getGithubInfo = async (val: string) => {
  // get github info
  const url = `https://api.github.com/repos/${val}`
  // hash url to get cache key
  const cacheKey = await kv.get(url)
  if (cacheKey) return cacheKey
  const res = await fetch(url)
  const githubInfo = await res.json()
  await kv.set(url, githubInfo)
  console.log('https://api.github.com/repos/' + val, githubInfo)
  return githubInfo
}

// 千分位转换
export const thousand = (v: string) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`)
