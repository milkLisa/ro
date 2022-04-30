import { NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(request) {
  const shouldHandleLocale = 
  !PUBLIC_FILE.test(request.nextUrl.pathname) && 
  !request.nextUrl.pathname.includes("/api/") && 
  request.nextUrl.locale === "default"

  if (shouldHandleLocale) {
    const url = request.nextUrl.clone()
    url.pathname = `/zh-TW${request.nextUrl.pathname}`
    return NextResponse.redirect(url)
  }

  return undefined
}