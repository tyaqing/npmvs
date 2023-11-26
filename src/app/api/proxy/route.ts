import {NextRequest, NextResponse} from "next/server";
import {kv} from "@vercel/kv";

export async function GET (request: NextRequest){
    const url = request.nextUrl.searchParams.get('url')
    if(!url) return NextResponse.error()
    const cache = await kv.get(url)
    if(cache) return NextResponse.json(cache)
    const resp = await fetch(url)
    const data = await resp.json()
    kv.set(url, data)
    return NextResponse.json(data)
}