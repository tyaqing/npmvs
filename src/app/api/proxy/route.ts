import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.error()
  let kvAvailable = true

  try {
    const cache = await kv.get(url)
    if (cache) return NextResponse.json(cache)
  } catch (e) {
    kvAvailable = false
    console.error('kv error', e)
  }

  console.log('fetch', url)
  const resp = await fetch(url)
  const data = await resp.json()

  // console.log('data', data, kvAvailable)

  if (kvAvailable) {
    await kv.set(url, data)
  }

  return Response.json(data)
}
